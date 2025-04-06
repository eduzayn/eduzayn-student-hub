
import React from "react";
import MatriculasLayout from "@/components/layout/MatriculasLayout";
import MatriculasList from "@/components/admin/matriculas/MatriculasList";

const MatriculasLista: React.FC = () => {
  return (
    <MatriculasLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Lista de Matrículas</h1>
        <MatriculasList />
      </div>
    </MatriculasLayout>
  );
};

export default MatriculasLista;
