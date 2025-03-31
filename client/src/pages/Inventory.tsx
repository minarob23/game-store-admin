import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import GameTable from "@/components/inventory/GameTable";
import GameModal from "@/components/inventory/GameModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Game } from "@shared/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { platformOptions } from "@/lib/utils";

export default function Inventory() {
  // State for game modal
  const [gameModalOpen, setGameModalOpen] = useState(false);
  const [currentGame, setCurrentGame] = useState<Game | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null);
  
  // State for filtering and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [platform, setPlatform] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("title");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const { toast } = useToast();
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, platform]);
  
  // Fetch games with filters
  const { data, isLoading } = useQuery({
    queryKey: ['/api/games', { search: searchQuery, platform }],
  });
  
  // Sort and paginate games
  const sortAndPaginateGames = () => {
    if (!data) return { paginatedGames: [], totalPages: 0, totalGames: 0 };
    
    // Sort games
    const sortedGames = [...data].sort((a, b) => {
      // Handle different column types
      if (sortColumn === 'title' || sortColumn === 'genre' || sortColumn === 'developer' || sortColumn === 'publisher') {
        return sortDirection === 'asc' 
          ? a[sortColumn].localeCompare(b[sortColumn]) 
          : b[sortColumn].localeCompare(a[sortColumn]);
      }
      
      if (sortColumn === 'releaseDate') {
        const dateA = new Date(a.releaseDate).getTime();
        const dateB = new Date(b.releaseDate).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      // For numeric values (price, stock)
      return sortDirection === 'asc' 
        ? a[sortColumn] - b[sortColumn]
        : b[sortColumn] - a[sortColumn];
    });
    
    // Paginate
    const itemsPerPage = 10;
    const totalPages = Math.ceil(sortedGames.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedGames = sortedGames.slice(start, start + itemsPerPage);
    
    return { paginatedGames, totalPages, totalGames: sortedGames.length };
  };
  
  const { paginatedGames, totalPages, totalGames } = sortAndPaginateGames();
  
  // Handle sort column change
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  
  // Handle add/edit game
  const handleOpenGameModal = (game?: Game) => {
    setCurrentGame(game);
    setGameModalOpen(true);
  };
  
  // Handle save game
  const handleSaveGame = async (gameData: any) => {
    try {
      if (currentGame) {
        // Update existing game
        await apiRequest("PUT", `/api/games/${currentGame.id}`, gameData);
        toast({
          title: "Success",
          description: "Game updated successfully",
        });
      } else {
        // Create new game
        await apiRequest("POST", "/api/games", gameData);
        toast({
          title: "Success",
          description: "Game added successfully",
        });
      }
      
      setGameModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/games'] });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save game",
      });
    }
  };
  
  // Handle delete game
  const handleDeleteGame = (game: Game) => {
    setGameToDelete(game);
    setIsDeleting(true);
  };
  
  // Confirm delete game
  const confirmDeleteGame = async () => {
    if (!gameToDelete) return;
    
    try {
      await apiRequest("DELETE", `/api/games/${gameToDelete.id}`);
      toast({
        title: "Success",
        description: "Game deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/games'] });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete game",
      });
    } finally {
      setIsDeleting(false);
      setGameToDelete(null);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-poppins font-semibold">Game Inventory</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search games..." 
              className="pl-9 w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="sm:w-40">
              <SelectValue placeholder="All Platforms" />
            </SelectTrigger>
            <SelectContent>
              {platformOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            className="bg-primary hover:bg-secondary"
            onClick={() => handleOpenGameModal()}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Game
          </Button>
        </div>
      </div>
      
      {/* Games Table */}
      <GameTable 
        games={paginatedGames || []}
        isLoading={isLoading}
        onEdit={handleOpenGameModal}
        onDelete={handleDeleteGame}
        currentPage={currentPage}
        totalPages={totalPages}
        totalGames={totalGames}
        onPageChange={setCurrentPage}
        onSort={handleSort}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
      />
      
      {/* Game Modal */}
      <GameModal
        open={gameModalOpen}
        onOpenChange={setGameModalOpen}
        onSave={handleSaveGame}
        game={currentGame}
        title={currentGame ? "Edit Game" : "Add New Game"}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <span className="font-semibold">{gameToDelete?.title}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteGame}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
