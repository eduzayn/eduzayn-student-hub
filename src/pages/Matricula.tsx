
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Matricula: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-6">Página de Matrícula</h1>
        <p className="text-gray-600 mb-8 max-w-lg">
          Esta é uma página de redirecionamento. Você será redirecionado para a página correta de matrícula.
        </p>
        
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
          
          <Button 
            className="flex items-center gap-2"
            onClick={() => navigate("/admin/matriculas/nova")}
          >
            Ir para Nova Matrícula
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Matricula;
