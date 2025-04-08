
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CursosLoadingSkeletonProps {
  count?: number;
}

const CursosLoadingSkeleton: React.FC<CursosLoadingSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-60" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CursosLoadingSkeleton;
