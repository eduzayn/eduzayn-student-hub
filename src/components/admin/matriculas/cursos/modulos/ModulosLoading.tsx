
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ModulosLoading: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-[250px] mb-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ModulosLoading;
