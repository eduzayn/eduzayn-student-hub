
import React from "react";
import SincronizacaoAlunos from "@/components/admin/matriculas/SincronizacaoAlunos";
import MatriculasLayout from "@/components/layout/MatriculasLayout";

const SincronizacaoLearnWorldsPage: React.FC = () => {
  return (
    <MatriculasLayout>
      <SincronizacaoAlunos />
    </MatriculasLayout>
  );
};

export default SincronizacaoLearnWorldsPage;
