
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import MatriculasLayout from "@/components/layout/MatriculasLayout";
import NovaMatriculaForm from "@/components/admin/matriculas/NovaMatriculaForm";
import { Separator } from "@/components/ui/separator";

const NovaMatricula: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const voltar = () => {
    navigate("/admin/matriculas");
  };
  
  return (
    <MatriculasLayout>
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Nova Matrícula</h1>
            <p className="text-muted-foreground mt-1">
              Cadastre uma nova matrícula no sistema
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="mt-4 md:mt-0"
            onClick={voltar}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        
        <Separator className="my-6" />
        
        <div className="bg-white rounded-lg border p-6">
          <NovaMatriculaForm />
        </div>
      </div>
    </MatriculasLayout>
  );
};

export default NovaMatricula;
