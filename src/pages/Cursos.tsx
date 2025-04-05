
import React from "react";
import MainLayout from "@/components/layout/MainLayout";

const Cursos = () => {
  return (
    <MainLayout>
      <div className="eduzayn-container py-12">
        <h1 className="text-3xl font-bold mb-6">Nossos Cursos</h1>
        <p className="text-gray-600 mb-8">
          Página de listagem de cursos em construção. Aqui serão exibidos todos os cursos disponíveis,
          com filtros por categoria, preço e duração.
        </p>
      </div>
    </MainLayout>
  );
};

export default Cursos;
