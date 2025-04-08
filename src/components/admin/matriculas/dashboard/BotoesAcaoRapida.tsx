
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const BotoesAcaoRapida: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-wrap gap-4">
      <Button 
        className="flex-1" 
        onClick={() => navigate("/admin/matriculas/nova")}
      >
        Nova Matrícula
      </Button>
      <Button 
        variant="outline" 
        className="flex-1"
        onClick={() => navigate("/admin/matriculas/relatorios")}
      >
        Gerar Relatórios
      </Button>
      <Button 
        variant="secondary" 
        className="flex-1"
        onClick={() => navigate("/admin/matriculas/configuracoes")}
      >
        Configurações
      </Button>
    </div>
  );
};

export default BotoesAcaoRapida;
