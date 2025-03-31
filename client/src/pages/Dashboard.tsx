import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentGames from "@/components/dashboard/RecentGames";
import QuickActions from "@/components/dashboard/QuickActions";
import PlatformDistribution from "@/components/dashboard/PlatformDistribution";
import GameModal from "@/components/inventory/GameModal";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Game } from "@shared/schema";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [gameModalOpen, setGameModalOpen] = useState(false);

  // Fetch dashboard data
  const { data, isLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  // Handle adding a new game
  const handleAddGame = async (gameData: any) => {
    try {
      await apiRequest("POST", "/api/games", gameData);
      toast({
        title: "Success",
        description: "Game added successfully",
      });
      setGameModalOpen(false);
      
      // Refresh dashboard data
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add game",
      });
    }
  };

  // Handle export inventory
  const handleExportInventory = () => {
    toast({
      title: "Export started",
      description: "Your inventory is being exported",
    });
    // In a real app, this would trigger an actual export
  };

  // Handle generate report
  const handleGenerateReport = () => {
    toast({
      title: "Report generation",
      description: "Your report is being generated",
    });
    // In a real app, this would generate a report
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Games" 
          value={isLoading ? "..." : data?.stats.totalGames} 
          icon="games" 
          isLoading={isLoading} 
        />
        <StatsCard 
          title="New Releases" 
          value={isLoading ? "..." : data?.stats.newReleases} 
          icon="releases" 
          change={isLoading ? "" : `in the last 30 days`}
          isLoading={isLoading} 
        />
        <StatsCard 
          title="Low Stock" 
          value={isLoading ? "..." : data?.stats.lowStock} 
          icon="stock" 
          change={isLoading ? "" : "Requires attention"}
          isLoading={isLoading} 
        />
        <StatsCard 
          title="Revenue" 
          value={isLoading ? "..." : parseFloat(data?.stats.revenue)} 
          icon="revenue" 
          isLoading={isLoading} 
        />
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Games Table */}
        <div className="lg:col-span-2">
          <RecentGames 
            games={isLoading ? [] : data?.recentGames || []} 
            isLoading={isLoading} 
          />
        </div>
        
        {/* Quick Actions and Platform Distribution */}
        <div className="space-y-6">
          <QuickActions 
            onAddGame={() => setGameModalOpen(true)}
            onExportInventory={handleExportInventory}
            onGenerateReport={handleGenerateReport}
          />
          
          <PlatformDistribution 
            platforms={isLoading ? { pc: 0, ps5: 0, xsx: 0, switch: 0 } : data?.platforms} 
            isLoading={isLoading} 
          />
        </div>
      </div>
      
      {/* Game Modal */}
      <GameModal
        open={gameModalOpen}
        onOpenChange={setGameModalOpen}
        onSave={handleAddGame}
        title="Add New Game"
      />
    </div>
  );
}
