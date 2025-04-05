
import React from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";

const DetalheCurso = () => {
  const { id } = useParams();
  
  return (
    <MainLayout>
      <div className="eduzayn-container py-12">
        <h1 className="text-3xl font-bold mb-6">Detalhes do Curso</h1>
        <p className="text-gray-600 mb-4">
          Página de detalhes do curso ID: {id}
        </p>
        <p className="text-gray-600">
          Aqui serão exibidas informações completas do curso, como descrição,
          programa, professores, avaliações e opções de matrícula.
        </p>
      </div>
    </MainLayout>
  );
};

export default DetalheCurso;
