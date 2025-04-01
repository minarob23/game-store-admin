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
    pc: "bg-gradient-to-r from-blue-600 to-blue-400",
    
    // PlayStation family
    ps: "bg-gradient-to-r from-emerald-600 to-emerald-400",
    ps2: "bg-gradient-to-r from-emerald-700 to-emerald-500",
    ps3: "bg-gradient-to-r from-emerald-800 to-emerald-600",
    ps4: "bg-gradient-to-r from-emerald-900 to-emerald-700",
    ps5: "bg-gradient-to-r from-teal-600 to-teal-400",
    psv: "bg-gradient-to-r from-teal-700 to-teal-500",
    psp: "bg-gradient-to-r from-teal-800 to-teal-600",
    vita: "bg-gradient-to-r from-teal-900 to-teal-700",
    
    // Xbox family
    xbox: "bg-gradient-to-r from-orange-600 to-orange-400",
    x360: "bg-gradient-to-r from-orange-700 to-orange-500",
    xone: "bg-gradient-to-r from-orange-800 to-orange-600",
    xsx: "bg-gradient-to-r from-orange-900 to-orange-700",
    
    // Nintendo family
    switch: "bg-gradient-to-r from-sky-600 to-sky-400",
    wii: "bg-gradient-to-r from-sky-700 to-sky-500",
    wiiu: "bg-gradient-to-r from-sky-800 to-sky-600",
    n64: "bg-gradient-to-r from-indigo-600 to-indigo-400",
    gc: "bg-gradient-to-r from-indigo-700 to-indigo-500",
    snes: "bg-gradient-to-r from-indigo-800 to-indigo-600",
    nes: "bg-gradient-to-r from-indigo-900 to-indigo-700",
    gb: "bg-gradient-to-r from-violet-600 to-violet-400",
    gba: "bg-gradient-to-r from-violet-700 to-violet-500",
    ds: "bg-gradient-to-r from-violet-800 to-violet-600",
    "3ds": "bg-gradient-to-r from-violet-900 to-violet-700",
    
    // Other platforms
    sega: "bg-gradient-to-r from-rose-600 to-rose-400",
    mobile: "bg-gradient-to-r from-rose-700 to-rose-500",
    other: "bg-gradient-to-r from-slate-600 to-slate-400",
  };

  // Format platform names for display
  const platformNameMap: Record<string, string> = {
    // PC
    pc: "PC",
    
    // PlayStation family
    ps: "PlayStation",
    ps2: "PlayStation 2",
    ps3: "PlayStation 3",
    ps4: "PlayStation 4",
    ps5: "PlayStation 5",
    vita: "PS Vita",
    psv: "PS Vita",
    psp: "PSP",
    
    // Xbox family
    xbox: "Xbox",
    x360: "Xbox 360",
    xone: "Xbox One",
    xsx: "Xbox Series X",
    
    // Nintendo family
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
    
    // Other platforms
    sega: "Sega",
    mobile: "Mobile",
    other: "Other",
  };

  // Generate platform data from the incoming platforms object
  const platformData = Object.entries(platforms)
    .filter(([_, percentage]) => percentage > 0) // Only show platforms with data
    .sort(([_, a], [__, b]) => b - a) // Sort by percentage (descending)
    .slice(0, 10) // Show top 10 platforms
    .map(([platform, percentage]) => ({
      name: platformNameMap[platform] || platform,
      percentage,
      color: platformColorMap[platform] || "bg-gradient-to-r from-gray-600 to-gray-400", // Default color
    }));

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg font-semibold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2 text-primary">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
          Platform Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {isLoading ? (
            <>
              {[1, 2, 3, 4, 5].map((item) => (
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
                    <span className="text-sm font-medium">{platform.name}</span>
                    <span className="text-sm text-muted-foreground font-medium">{platform.percentage}%</span>
                  </div>
                  <Progress className="h-2.5 rounded-full" value={platform.percentage} indicatorClassName={platform.color} />
                </div>
              ))}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
