
import React from "react";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CursosHeaderProps {
  onRefresh: () => void;
}

const CursosHeader: React.FC<CursosHeaderProps> = ({ onRefresh }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <CardTitle>Lista de Cursos</CardTitle>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Atualizar
        </Button>
        <Button 
          variant="default" 
          size="sm"
          onClick={() => {
            navigate("/admin/matriculas/sincronizacao/cursos");
          }}
        >
          <BookOpen className="h-4 w-4 mr-2" /> Sincronizar Cursos
        </Button>
      </div>
    </div>
  );
};

export default CursosHeader;
