import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Cell, 
  Legend, 
  Line, 
  LineChart, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import GenreDistribution from "@/components/analytics/GenreDistribution";

export default function Analytics() {
  const { toast } = useToast();
  const [chartView, setChartView] = useState("overview");
  
  // Fetch dashboard data
  const { data, isLoading } = useQuery<{
    stats: {
      totalGames: number;
      newReleases: number;
      lowStock: number;
      outOfStock: number;
      revenue: string;
    },
    platforms: Record<string, number>,
    genres: Record<string, number>,
    recentGames: any[]
  }>({
    queryKey: ['/api/dashboard/stats'],
  });
  
  // Transform platform data for pie chart
  const platformData = data?.platforms ? [
    { name: "PC", value: data.platforms.pc },
    { name: "PlayStation 5", value: data.platforms.ps5 },
    { name: "Xbox Series X", value: data.platforms.xsx },
    { name: "Nintendo Switch", value: data.platforms.switch }
  ] : [];
  
  // Create inventory data for bar chart
  const inventoryData = [
    { name: "Total Games", value: data?.stats?.totalGames || 0 },
    { name: "Low Stock", value: data?.stats?.lowStock || 0 },
    { name: "Out of Stock", value: data?.stats?.outOfStock || 0 }
  ];
  
  // Create monthly revenue simulation for line chart
  const revenueData = [
    { month: "Jan", revenue: 5300 },
    { month: "Feb", revenue: 4800 },
    { month: "Mar", revenue: 6100 },
    { month: "Apr", revenue: 5500 },
    { month: "May", revenue: 7200 },
    { month: "Jun", revenue: 6800 },
    { month: "Jul", revenue: 7500 },
    { month: "Aug", revenue: 8200 },
    { month: "Sep", revenue: 7800 },
    { month: "Oct", revenue: 8500 },
    { month: "Nov", revenue: 9200 },
    { month: "Dec", revenue: 10500 }
  ];
  
  // Colors for charts - Different color schemes for each chart type
  const PLATFORM_COLORS = ["#845EC2", "#D65DB1", "#FF6F91", "#FF9671", "#FFC75F", "#F9F871"]; // New colorful theme for platforms
  const INVENTORY_COLORS = {
    light: "#2196F3", // Blue for light theme
    dark: "#64B5F6"   // Lighter blue for dark theme
  };
  const REVENUE_COLORS = {
    light: "#4CAF50", // Green for light theme
    dark: "#81C784"   // Lighter green for dark theme
  };
  
  // Get the current theme to adjust chart colors for theme changes
  const [isDarkTheme, setIsDarkTheme] = useState(document.documentElement.classList.contains('dark'));
  
  // Update isDarkTheme when the theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkTheme(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
      </div>
      
      <Tabs value={chartView} onValueChange={setChartView}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="platforms">Platform Distribution</TabsTrigger>
          <TabsTrigger value="genres">Genre Distribution</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Status</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Trend</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Platform Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
                <CardDescription>Games by platform</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Skeleton className="h-64 w-64 rounded-full" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={platformData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {platformData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[index % PLATFORM_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} games`, "Count"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
            
            {/* Inventory Status Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
                <CardDescription>Stock levels</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {isLoading ? (
                  <div className="flex flex-col space-y-3 h-full justify-center">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-4/5" />
                    <Skeleton className="h-12 w-3/5" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={inventoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill={isDarkTheme ? INVENTORY_COLORS.dark : INVENTORY_COLORS.light} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Revenue Trend Chart */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke={isDarkTheme ? REVENUE_COLORS.dark : REVENUE_COLORS.light} 
                      strokeWidth={2} 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Platform Distribution Tab */}
        <TabsContent value="platforms" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Distribution</CardTitle>
              <CardDescription>Game distribution across different platforms</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Skeleton className="h-80 w-80 rounded-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[index % PLATFORM_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} games`, "Count"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Genre Distribution Tab */}
        <TabsContent value="genres" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-1">
              <GenreDistribution 
                genres={data?.genres || {}} 
                isLoading={isLoading} 
              />
            </div>
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Genre Popularity</CardTitle>
                  <CardDescription>Game distribution across different genres</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Skeleton className="h-80 w-80 rounded-full" />
                    </div>
                  ) : (
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
                            .map(([_, __], index) => (
                              <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[index % PLATFORM_COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Inventory Status Tab */}
        <TabsContent value="inventory" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
              <CardDescription>Current stock levels across inventory</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              {isLoading ? (
                <div className="flex flex-col space-y-3 h-full justify-center">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-4/5" />
                  <Skeleton className="h-20 w-3/5" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={inventoryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill={isDarkTheme ? INVENTORY_COLORS.dark : INVENTORY_COLORS.light} name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Revenue Trend Tab */}
        <TabsContent value="revenue" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue for the current year</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Skeleton className="h-80 w-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke={isDarkTheme ? REVENUE_COLORS.dark : REVENUE_COLORS.light} 
                      strokeWidth={3} 
                      activeDot={{ r: 8 }} 
                      name="Monthly Revenue"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          
          {/* Current Revenue Card */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 bg-primary/10">
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
                <CardDescription>Current total revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">
                  {isLoading ? (
                    <Skeleton className="h-10 w-32" />
                  ) : (
                    formatCurrency(parseFloat(data?.stats?.revenue || "0"))
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Revenue by category</CardDescription>
              </CardHeader>
              <CardContent className="h-60">
                {isLoading ? (
                  <div className="flex flex-col space-y-3 h-full justify-center">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-4/5" />
                    <Skeleton className="h-12 w-3/5" />
                  </div>
                ) : (
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
                      <Bar dataKey="value" fill={isDarkTheme ? REVENUE_COLORS.dark : REVENUE_COLORS.light} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}