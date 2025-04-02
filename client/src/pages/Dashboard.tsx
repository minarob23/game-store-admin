import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis
} from "recharts";

// Colors for charts
const PLATFORM_COLORS = ["#845EC2", "#D65DB1", "#FF6F91", "#FF9671", "#FFC75F", "#F9F871"];
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentGames from "@/components/dashboard/RecentGames";
import QuickActions from "@/components/dashboard/QuickActions";
import GenreDistribution from "@/components/analytics/GenreDistribution";
import { formatCurrency, getStockStatus } from "@/lib/utils";
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

  const [previewOpen, setPreviewOpen] = useState(false);

  // Handle generate report
  const handleGenerateReport = async () => {
    if (!data?.recentGames) {
      toast({
        variant: "destructive",
        title: "Report generation failed",
        description: "No games data available",
      });
      return;
    }

    setPreviewOpen(true);
  };

  const handleGeneratePDF = async () => {
    try {
      // Generate PDF content -  This needs to be implemented.  Placeholder for now.
      const dashboardPDF = await generatePDF('preview-dashboard', 'dashboard-report.pdf');
      const analyticsPDF = await generatePDF('preview-analytics', 'analytics-report.pdf');
      const inventoryReport = generateInventoryReport(data.recentGames);

      toast({
        title: "Report Generated",
        description: "Your report has been generated and is ready to download",
        duration: 5000,
      });

      setPreviewOpen(false);
    } catch (error) {
      console.error('Error generating reports:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate reports",
      });
    }
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

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Preview</DialogTitle>
            <DialogDescription>Preview the report before save it</DialogDescription>
          </DialogHeader>

          <div id="preview-content" className="space-y-8">
            {/* Dashboard Preview */}
            <div id="preview-dashboard" className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Dashboard Report</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard 
                  title="Total Games" 
                  value={data?.stats?.totalGames || 0} 
                  icon="games" 
                  isLoading={isLoading} 
                />
                <StatsCard 
                  title="New Releases" 
                  value={data?.stats?.newReleases || 0} 
                  icon="releases" 
                  change={`in the last 30 days`}
                  isLoading={isLoading} 
                />
                <StatsCard 
                  title="Low Stock" 
                  value={data?.stats?.lowStock || 0} 
                  icon="stock" 
                  change="Requires attention"
                  isLoading={isLoading} 
                />
                <StatsCard 
                  title="Revenue" 
                  value={data?.stats?.revenue ? parseFloat(data.stats.revenue) : 0} 
                  icon="revenue" 
                  isLoading={isLoading} 
                />
              </div>
            </div>

            {/* Analytics Preview */}
            <div id="preview-analytics" className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Analytics Report</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Platform Distribution */}
                <Card>
                  <CardHeader className="pb-8 border-b">
                    <CardTitle>Platform Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={Object.entries(data?.platforms || {}).map(([name, value]) => ({ name, value }))}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {Object.entries(data?.platforms || {}).map((_, index) => (
                            <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[index % PLATFORM_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} games`, "Count"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Genre Distribution */}
                <Card>
                  <CardHeader className="pb-8 border-b">
                    <CardTitle>Genre Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={Object.entries(data?.genres || {})
                            .filter(([_, value]) => value > 0)
                            .slice(0, 6)
                            .map(([name, value]) => ({ name, value }))}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {Object.entries(data?.genres || {})
                            .filter(([_, value]) => value > 0)
                            .slice(0, 6)
                            .map((_, index) => (
                              <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[index % PLATFORM_COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} games`, "Count"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Inventory Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Status</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: "Total Games", value: data?.stats?.totalGames || 0 },
                        { name: "Low Stock", value: data?.stats?.lowStock || 0 },
                        { name: "Out of Stock", value: data?.stats?.outOfStock || 0 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#2196F3" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Revenue Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trend</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { month: "Jan", revenue: 5300 },
                        { month: "Feb", revenue: 4800 },
                        { month: "Mar", revenue: 6100 },
                        { month: "Apr", revenue: 5500 },
                        { month: "May", revenue: 7200 },
                        { month: "Jun", revenue: 6800 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                        <Line type="monotone" dataKey="revenue" stroke="#4CAF50" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Revenue Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: "PC", value: 3800 },
                        { name: "PlayStation 5", value: 4200 },
                        { name: "Xbox Series X", value: 2900 },
                        { name: "Nintendo Switch", value: 3400 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `$${value}`} />
                        <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                        <Bar dataKey="value">
                          {[
                            { fill: "#FF6B6B" },
                            { fill: "#4ECDC4" },
                            { fill: "#45B7D1" },
                            { fill: "#96CEB4" }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Inventory Preview */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Inventory Report</h3>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Game Inventory</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Game Title</TableHead>
                          <TableHead>Platform</TableHead>
                          <TableHead>Genre</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data?.recentGames.map((game) => {
                          const { label, className } = getStockStatus(game.stock);
                          const platforms = game.platforms as Record<string, boolean>;
                          const platformList = Object.keys(platforms)
                            .filter((key) => platforms[key])
                            .map((key) => key.toUpperCase())
                            .join(", ");

                          return (
                            <TableRow key={game.id}>
                              <TableCell>{game.title}</TableCell>
                              <TableCell>{platformList}</TableCell>
                              <TableCell>{game.genre}</TableCell>
                              <TableCell>{formatCurrency(game.price)}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs ${className}`}>
                                  {label}
                                </span>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Cancel
            </Button>
            <Button onClick={async () => {
              try {
                await generatePDF('preview-content', 'game-store-report.pdf');
                toast({
                  title: "Success",
                  description: "Report saved successfully"
                });
                setPreviewOpen(false);
              } catch (error) {
                console.error('PDF generation error:', error);
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: "Failed to save report"
                });
              }
            }}>
              Save Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}