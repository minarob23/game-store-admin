import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface GenreDistributionProps {
  genres: Record<string, number>;
  isLoading?: boolean;
}

export default function GenreDistribution({ 
  genres, 
  isLoading = false 
}: GenreDistributionProps) {
  // Define genre data with vibrant, eye-catching colors
  const genreColorMap: Record<string, string> = {
    Action: "bg-gradient-to-r from-pink-600 to-pink-400",
    Adventure: "bg-gradient-to-r from-purple-600 to-purple-400",
    Sports: "bg-gradient-to-r from-amber-600 to-amber-400",
    Racing: "bg-gradient-to-r from-amber-700 to-amber-500",
    RPG: "bg-gradient-to-r from-indigo-600 to-indigo-400",
    Puzzle: "bg-gradient-to-r from-teal-600 to-teal-400",
    Strategy: "bg-gradient-to-r from-cyan-600 to-cyan-400",
    Shooter: "bg-gradient-to-r from-fuchsia-600 to-fuchsia-400",
    Simulation: "bg-gradient-to-r from-green-600 to-green-400",
    Fighting: "bg-gradient-to-r from-orange-600 to-orange-400",
    "Platformer": "bg-gradient-to-r from-blue-600 to-blue-400",
    "Educational": "bg-gradient-to-r from-emerald-600 to-emerald-400",
    "Casual": "bg-gradient-to-r from-rose-600 to-rose-400",
    "Music/Rhythm": "bg-gradient-to-r from-violet-600 to-violet-400",
    "Role-Playing": "bg-gradient-to-r from-indigo-700 to-indigo-500",
    "Misc": "bg-gradient-to-r from-gray-600 to-gray-400",
  };

  // Generate genre data from the incoming genres object
  const genreData = Object.entries(genres)
    .filter(([_, percentage]) => percentage > 0) // Only show genres with data
    .sort(([_, a], [__, b]) => b - a) // Sort by percentage (descending)
    .slice(0, 10) // Show top 10 genres
    .map(([genre, percentage]) => ({
      name: genre,
      percentage,
      color: genreColorMap[genre] || "bg-gradient-to-r from-gray-600 to-gray-400", // Default color
    }));

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg font-semibold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2 text-primary">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
            <path d="M12 9v4"></path>
            <path d="M12 17h.01"></path>
          </svg>
          Genre Distribution
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
              {genreData.map((genre) => (
                <div key={genre.name} className="space-y-1.5">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{genre.name}</span>
                    <span className="text-sm text-muted-foreground font-medium">{genre.percentage}%</span>
                  </div>
                  <Progress className="h-2.5 rounded-full" value={genre.percentage} indicatorClassName={genre.color} />
                </div>
              ))}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}