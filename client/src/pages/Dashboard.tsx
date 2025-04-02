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
    if (!data?.recentGames) {
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "No games data available",
      });
      return;
    }

    const csvContent = generateInventoryCSV(data.recentGames);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Export complete",
      description: "Your inventory has been exported",
    });
  };

  // Handle generate report
  const handleGenerateReport = () => {
    if (!data?.recentGames) {
      toast({
        variant: "destructive",
        title: "Report generation failed",
        description: "No games data available",
      });
      return;
    }

    const report = generateInventoryReport(data.recentGames);
    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Report generated",
      description: "Your report has been generated",
    });
  };

  return (
    <div id="dashboard-content" className="space-y-8">
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