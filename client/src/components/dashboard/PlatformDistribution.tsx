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
    pc: "bg-[#845EC2]",
    
    // PlayStation family
    ps: "bg-[#D65DB1]",
    ps2: "bg-[#D65DB1]/90",
    ps3: "bg-[#D65DB1]/80",
    ps4: "bg-[#D65DB1]/70",
    ps5: "bg-[#FF6F91]",
    psv: "bg-[#FF6F91]/90",
    psp: "bg-[#FF6F91]/80",
    vita: "bg-[#FF6F91]/70",
    
    // Xbox family
    xbox: "bg-[#FF9671]",
    x360: "bg-[#FF9671]/90",
    xone: "bg-[#FF9671]/80",
    xsx: "bg-[#FF9671]/70",
    
    // Nintendo family
    switch: "bg-[#FFC75F]",
    wii: "bg-[#FFC75F]/90",
    wiiu: "bg-[#FFC75F]/80",
    n64: "bg-[#F9F871]",
    gc: "bg-[#F9F871]/90",
    snes: "bg-[#F9F871]/80",
    nes: "bg-[#F9F871]/70",
    gb: "bg-[#845EC2]/90",
    gba: "bg-[#845EC2]/80",
    ds: "bg-[#845EC2]/70",
    "3ds": "bg-[#845EC2]/60",
    
    // Other platforms
    sega: "bg-[#D65DB1]/60",
    mobile: "bg-[#FF6F91]/60",
    other: "bg-[#FF9671]/60",
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
