import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface PlatformDistributionProps {
  platforms: Record<string, number>;
  isLoading?: boolean;
}

export default function PlatformDistribution({ 
  platforms, 
  isLoading = false 
}: PlatformDistributionProps) {
  // Define common platform data with eye-catching, vibrant themed colors
  const platformColorMap: Record<string, string> = {
    // PC
    pc: "bg-gradient-to-r from-purple-700 to-violet-500",
    
    // PlayStation family
    ps: "bg-gradient-to-r from-blue-800 to-blue-500",
    ps2: "bg-gradient-to-r from-blue-700 to-blue-400",
    ps3: "bg-gradient-to-r from-blue-600 to-blue-300",
    ps4: "bg-gradient-to-r from-blue-500 to-cyan-400",
    ps5: "bg-gradient-to-r from-blue-600 to-cyan-400",
    psv: "bg-gradient-to-r from-blue-600 to-cyan-300",
    psp: "bg-gradient-to-r from-blue-700 to-cyan-500",
    
    // Xbox family
    xb: "bg-gradient-to-r from-green-800 to-green-500",
    x360: "bg-gradient-to-r from-green-700 to-green-400",
    xone: "bg-gradient-to-r from-green-600 to-green-300",
    xsx: "bg-gradient-to-r from-green-600 to-lime-400",
    
    // Nintendo family
    switch: "bg-gradient-to-r from-red-600 to-pink-400",
    wii: "bg-gradient-to-r from-red-700 to-red-400",
    wiiu: "bg-gradient-to-r from-red-800 to-red-500",
    n64: "bg-gradient-to-r from-amber-500 to-yellow-300",
    gc: "bg-gradient-to-r from-purple-600 to-indigo-400",
    snes: "bg-gradient-to-r from-slate-700 to-slate-500",
    nes: "bg-gradient-to-r from-red-800 to-red-600",
    gb: "bg-gradient-to-r from-green-900 to-green-700",
    gba: "bg-gradient-to-r from-purple-900 to-purple-700",
    ds: "bg-gradient-to-r from-slate-500 to-slate-400",
    "3ds": "bg-gradient-to-r from-red-500 to-red-300",
  };

  // Format platform names for display
  const platformNameMap: Record<string, string> = {
    pc: "PC",
    ps: "PlayStation",
    ps2: "PlayStation 2",
    ps3: "PlayStation 3",
    ps4: "PlayStation 4",
    ps5: "PlayStation 5",
    psv: "PS Vita",
    psp: "PSP",
    xb: "Xbox",
    x360: "Xbox 360",
    xone: "Xbox One",
    xsx: "Xbox Series X",
    switch: "Nintendo Switch",
    wii: "Nintendo Wii",
    wiiu: "Wii U",
    n64: "Nintendo 64",
    gc: "GameCube",
    snes: "Super Nintendo",
    nes: "NES",
    gb: "Game Boy",
    gba: "Game Boy Advance",
    ds: "Nintendo DS",
    "3ds": "Nintendo 3DS",
  };

  // Generate platform data from the incoming platforms object
  const platformData = Object.entries(platforms)
    .filter(([_, percentage]) => percentage > 0) // Only show platforms with data
    .sort(([_, a], [__, b]) => b - a) // Sort by percentage (descending)
    .slice(0, 8) // Show top 8 platforms
    .map(([platform, percentage]) => ({
      name: platformNameMap[platform] || platform,
      percentage,
      color: platformColorMap[platform] || "bg-gradient-to-r from-gray-600 to-gray-400", // Default color
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <>
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="space-y-1.5">
                  <div className="flex justify-between mb-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </>
          ) : (
            <>
              {platformData.map((platform) => (
                <div key={platform.name} className="space-y-1.5">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">{platform.name}</span>
                    <span className="text-sm text-muted-foreground">{platform.percentage}%</span>
                  </div>
                  <Progress className="h-2" value={platform.percentage} indicatorClassName={platform.color} />
                </div>
              ))}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
