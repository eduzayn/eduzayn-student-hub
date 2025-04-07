
import React from "react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ModulosHeaderProps {
  modulosCount: number;
  aulasCount: number;
  onRefresh: () => void;
}

const ModulosHeader: React.FC<ModulosHeaderProps> = ({ 
  modulosCount, 
  aulasCount, 
  onRefresh 
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <CardTitle>Módulos do Curso</CardTitle>
        <CardDescription>
          Total: {modulosCount} módulos, {aulasCount} aulas
        </CardDescription>
      </div>
      <Button variant="outline" size="sm" onClick={onRefresh}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Atualizar
      </Button>
    </div>
  );
};

export default ModulosHeader;
