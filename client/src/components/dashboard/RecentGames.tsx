import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Game } from "@shared/schema";
import { Link } from "wouter";
import { formatDate, formatCurrency, getStockStatus } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentGamesProps {
  games: Game[];
  isLoading?: boolean;
}

export default function RecentGames({ games, isLoading = false }: RecentGamesProps) {
  // Render loading skeletons
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Game Updates</CardTitle>
          <CardDescription>Latest updates to your game inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Game Title</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-10 w-10 rounded" />
                        <Skeleton className="h-4 w-36" />
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Game Updates</CardTitle>
        <CardDescription>Latest updates to your game inventory</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Game Title</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.map((game) => {
                const { label, className } = getStockStatus(game.stock);
                const platforms = game.platforms as Record<string, boolean>;
                const platformList = Object.keys(platforms)
                  .filter((key) => platforms[key])
                  .map((key) => key.toUpperCase())
                  .join(", ");

                return (
                  <TableRow key={game.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-muted-foreground">
                          {game.title.charAt(0)}
                        </div>
                        <div className="font-medium">{game.title}</div>
                      </div>
                    </TableCell>
                    <TableCell>{platformList}</TableCell>
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
        </div>
        <div className="mt-4 border-t border-border pt-4">
          <Link href="/inventory">
            <Button variant="link" className="p-0 text-primary hover:text-secondary">
              View all inventory
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
