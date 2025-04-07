
import React from "react";
import MatriculasLayout from "@/components/layout/MatriculasLayout";
import MatriculasContratos from "@/components/admin/matriculas/MatriculasContratos";

const MatriculasContratosPage: React.FC = () => {
  return (
    <MatriculasLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Contratos</h1>
        <MatriculasContratos />
      </div>
    </MatriculasLayout>
  );
};

export default MatriculasContratosPage;
