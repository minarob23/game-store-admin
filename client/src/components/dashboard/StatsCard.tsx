import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { BarChart3, Package, ShoppingCart, TrendingUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: "games" | "releases" | "stock" | "revenue";
  change?: string;
  isLoading?: boolean;
}

export default function StatsCard({ title, value, icon, change, isLoading = false }: StatsCardProps) {
  // Determine icon component based on type
  const getIcon = () => {
    switch (icon) {
      case "games":
        return <Package className="text-primary" />;
      case "releases":
        return <ShoppingCart className="text-secondary" />;
      case "stock":
        return <TrendingUp className="text-amber-500" />;
      case "revenue":
        return <BarChart3 className="text-green-500" />;
      default:
        return <Package className="text-primary" />;
    }
  };

  const getBackgroundColor = () => {
    switch (icon) {
      case "games":
        return "bg-primary/20";
      case "releases":
        return "bg-secondary/20";
      case "stock":
        return "bg-amber-500/20";
      case "revenue":
        return "bg-green-500/20";
      default:
        return "bg-primary/20";
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getBackgroundColor()} animate-pulse`}></div>
            </div>
            <div className="h-8 bg-muted rounded w-16"></div>
            <div className="h-3 bg-muted rounded w-32"></div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{title}</p>
                <h3 className="text-3xl font-poppins font-bold mt-1">
                  {typeof value === 'number' && icon === 'revenue' 
                    ? formatCurrency(value) 
                    : value}
                </h3>
              </div>
              <div className={`w-12 h-12 rounded-full ${getBackgroundColor()} flex items-center justify-center`}>
                {getIcon()}
              </div>
            </div>
            {change && (
              <div className="mt-4">
                <span className="text-xs text-green-500 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>{change}</span>
                </span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
