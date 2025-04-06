
import React from "react";
import MatriculasLayout from "@/components/layout/MatriculasLayout";
import { Card } from "@/components/ui/card";

const MatriculasAlunos: React.FC = () => {
  return (
    <MatriculasLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Gestão de Alunos</h1>
        <Card className="p-6">
          <p className="text-muted-foreground">
            Este módulo está em desenvolvimento. Em breve você poderá gerenciar todos os alunos matriculados.
          </p>
        </Card>
      </div>
    </MatriculasLayout>
  );
};

export default MatriculasAlunos;
