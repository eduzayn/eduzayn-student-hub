
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HardHat } from "lucide-react";

interface ModuloEmConstrucaoProps {
  modulo: string;
}

const ModuloEmConstrucao: React.FC<ModuloEmConstrucaoProps> = ({ modulo }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
      <HardHat className="h-24 w-24 text-yellow-500 mb-6" />
      <h1 className="text-3xl font-bold mb-2">Módulo em Desenvolvimento</h1>
      <p className="text-muted-foreground text-lg mb-6">
        O módulo <span className="font-medium">{modulo}</span> está atualmente em construção e ficará disponível em breve.
      </p>
      <div className="space-x-4">
        <Button 
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Voltar
        </Button>
        <Button 
          onClick={() => navigate("/admin")}
        >
          Ir para o Portal Administrativo
        </Button>
      </div>
    </div>
  );
};

export default ModuloEmConstrucao;
