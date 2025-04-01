import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface PlatformDistributionProps {
  platforms: {
    pc: number;
    ps5: number;
    xsx: number;
    switch: number;
  };
  isLoading?: boolean;
}

export default function PlatformDistribution({ 
  platforms, 
  isLoading = false 
}: PlatformDistributionProps) {
  // Define eye-catching, vibrant platform-themed colors
  const platformData = [
    { name: "PC", percentage: platforms.pc, color: "bg-gradient-to-r from-purple-700 to-violet-500" },
    { name: "PlayStation 5", percentage: platforms.ps5, color: "bg-gradient-to-r from-blue-600 to-cyan-400" },
    { name: "Xbox Series X", percentage: platforms.xsx, color: "bg-gradient-to-r from-green-600 to-lime-400" },
    { name: "Nintendo Switch", percentage: platforms.switch, color: "bg-gradient-to-r from-red-600 to-pink-400" },
  ];

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
