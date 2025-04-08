
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SincronizacaoCursosHeaderProps {
  titulo?: string;
}

const SincronizacaoCursosHeader: React.FC<SincronizacaoCursosHeaderProps> = ({ titulo = "Sincronização de Cursos" }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">{titulo}</h1>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={() => navigate("/admin/matriculas/sincronizacao")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
    </div>
  );
};

export default SincronizacaoCursosHeader;
