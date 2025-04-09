
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MatriculasPageHeaderProps {
  irParaNovaMatricula: () => void;
}

const MatriculasPageHeader: React.FC<MatriculasPageHeaderProps> = ({ 
  irParaNovaMatricula 
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold">Módulo de Matrículas</h1>
        <p className="text-muted-foreground">
          Gerenciamento de matrículas, alunos e cursos
        </p>
      </div>
      
      <div className="mt-4 md:mt-0 flex gap-2">
        <Button onClick={irParaNovaMatricula}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Matrícula
        </Button>
      </div>
    </div>
  );
};

export default MatriculasPageHeader;
