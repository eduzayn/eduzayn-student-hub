
import React from "react";
import { Badge } from "@/components/ui/badge";

export const AtendentesOffline: React.FC = () => {
  return (
    <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
      Offline
    </Badge>
  );
};
