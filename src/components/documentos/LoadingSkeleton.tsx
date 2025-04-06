
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
};

export default LoadingSkeleton;
