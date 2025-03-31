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
  const platformData = [
    { name: "PC", percentage: platforms.pc, color: "bg-primary" },
    { name: "PlayStation 5", percentage: platforms.ps5, color: "bg-secondary" },
    { name: "Xbox Series X", percentage: platforms.xsx, color: "bg-accent" },
    { name: "Nintendo Switch", percentage: platforms.switch, color: "bg-green-500" },
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
