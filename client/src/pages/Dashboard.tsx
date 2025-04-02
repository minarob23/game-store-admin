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
import { generateInventoryCSV, generateInventoryReport } from "@/lib/reports"; // Added import

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [gameModalOpen, setGameModalOpen] = useState(false);

  // Fetch dashboard data
  const { data, isLoading } = useQuery<{
    stats: {
      totalGames: number;
      newReleases: number;
      lowStock: number;
      outOfStock: number;
      revenue: string;
    },
    platforms: {
      pc: number;
      ps5: number;
      xsx: number;
      switch: number;
    },
    recentGames: Game[]
  }>({
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
    generateInventoryCSV(); // Updated to call the function
  };

  // Handle generate report
  const handleGenerateReport = () => {
    toast({
      title: "Report generation",
      description: "Your report is being generated",
    });
    generateInventoryReport(); // Updated to call the function
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Games" 
          value={isLoading ? "..." : data?.stats?.totalGames || 0} 
          icon="games" 
          isLoading={isLoading} 
        />
        <StatsCard 
          title="New Releases" 
          value={isLoading ? "..." : data?.stats?.newReleases || 0} 
          icon="releases" 
          change={isLoading ? "" : `in the last 30 days`}
          isLoading={isLoading} 
        />
        <StatsCard 
          title="Low Stock" 
          value={isLoading ? "..." : data?.stats?.lowStock || 0} 
          icon="stock" 
          change={isLoading ? "" : "Requires attention"}
          isLoading={isLoading} 
        />
        <StatsCard 
          title="Revenue" 
          value={isLoading ? "..." : data?.stats?.revenue ? parseFloat(data.stats.revenue) : 0} 
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
            platforms={isLoading ? {} : data?.platforms || {}} 
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