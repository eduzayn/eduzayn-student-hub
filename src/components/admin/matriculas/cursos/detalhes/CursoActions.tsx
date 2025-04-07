
import React from "react";
import { 
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Users } from "lucide-react";

interface CursoActionsProps {
  cursoId: string;
  onRefresh: () => void;
}

const CursoActions: React.FC<CursoActionsProps> = ({ cursoId, onRefresh }) => {
  return (
    <CardFooter className="flex justify-between">
      <Button variant="outline" onClick={onRefresh}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Atualizar
      </Button>
      <Button asChild>
        <a 
          href={`/admin/matriculas/nova?cursoId=${cursoId}`} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Users className="h-4 w-4 mr-2" />
          Nova Matrícula
        </a>
      </Button>
    </CardFooter>
  );
};

export default CursoActions;
