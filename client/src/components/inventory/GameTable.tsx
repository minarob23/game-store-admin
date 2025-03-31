import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Game } from "@shared/schema";
import { formatDate, formatCurrency, getStockStatus } from "@/lib/utils";
import { Edit, Trash2, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface GameTableProps {
  games: Game[];
  isLoading: boolean;
  onEdit: (game: Game) => void;
  onDelete: (game: Game) => void;
  currentPage: number;
  totalPages: number;
  totalGames: number;
  onPageChange: (page: number) => void;
  onSort: (column: string) => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
}

export default function GameTable({
  games,
  isLoading,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  totalGames,
  onPageChange,
  onSort,
  sortColumn,
  sortDirection = 'asc'
}: GameTableProps) {
  // Generate pagination numbers
  const getPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      // Always show first and last page
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) items.push(i);
        items.push(-1); // Ellipsis
        items.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        items.push(1);
        items.push(-1); // Ellipsis
        for (let i = totalPages - 3; i <= totalPages; i++) items.push(i);
      } else {
        items.push(1);
        items.push(-1); // Ellipsis
        for (let i = currentPage - 1; i <= currentPage + 1; i++) items.push(i);
        items.push(-1); // Ellipsis
        items.push(totalPages);
      }
    }
    
    return items;
  };
  
  // Helper for sort indicator
  const getSortIndicator = (column: string) => {
    if (sortColumn !== column) return <ArrowUpDown className="ml-1 h-4 w-4" />;
    return sortDirection === 'asc' ? 
      <ArrowUpDown className="ml-1 h-4 w-4 text-primary" /> : 
      <ArrowUpDown className="ml-1 h-4 w-4 text-primary rotate-180" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Game Inventory</CardTitle>
        <CardDescription>Manage your game catalog</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => onSort('title')}>
                  <div className="flex items-center">
                    Game Title
                    {getSortIndicator('title')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => onSort('releaseDate')}>
                  <div className="flex items-center">
                    Release Date
                    {getSortIndicator('releaseDate')}
                  </div>
                </TableHead>
                <TableHead>Platforms</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead className="cursor-pointer" onClick={() => onSort('price')}>
                  <div className="flex items-center">
                    Price
                    {getSortIndicator('price')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => onSort('stock')}>
                  <div className="flex items-center">
                    Stock
                    {getSortIndicator('stock')}
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(10).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-14 w-10 rounded" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-36" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-16" /></TableCell>
                  </TableRow>
                ))
              ) : (
                games.map((game) => {
                  const { label, className } = getStockStatus(game.stock);
                  const platforms = game.platforms as Record<string, boolean>;
                  const platformList = Object.keys(platforms)
                    .filter((key) => platforms[key])
                    .map((key) => key.toUpperCase())
                    .join(", ");

                  return (
                    <TableRow key={game.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-10 h-14 rounded bg-muted mr-3 flex-shrink-0 flex items-center justify-center text-muted-foreground">
                            {game.title.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{game.title}</div>
                            <div className="text-xs text-muted-foreground">{game.developer}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(game.releaseDate)}</TableCell>
                      <TableCell>{platformList}</TableCell>
                      <TableCell>{game.genre}</TableCell>
                      <TableCell>{formatCurrency(game.price)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${className}`}>
                          {label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => onEdit(game)} className="text-primary hover:text-secondary hover:bg-primary/10">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => onDelete(game)} className="text-red-500 hover:text-red-700 hover:bg-red-500/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t p-4">
        <div className="text-sm text-muted-foreground">
          Showing {games.length > 0 ? (currentPage - 1) * 10 + 1 : 0}-
          {Math.min(currentPage * 10, totalGames)} of {totalGames} items
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {getPaginationItems().map((page, i) => (
            page === -1 ? (
              <Button
                key={`ellipsis-${i}`}
                variant="outline"
                size="icon"
                disabled
              >
                ...
              </Button>
            ) : (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(page)}
                disabled={isLoading}
                className={currentPage === page ? "bg-primary" : ""}
              >
                {page}
              </Button>
            )
          ))}
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
