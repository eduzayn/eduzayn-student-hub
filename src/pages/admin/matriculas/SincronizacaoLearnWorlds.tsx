
import React from "react";
import MatriculasLayout from "@/components/layout/MatriculasLayout";
import SincronizacaoLearnWorlds from "@/components/admin/matriculas/SincronizacaoLearnWorlds";

const SincronizacaoLearnWorldsPage: React.FC = () => {
  return (
    <MatriculasLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Teste da API LearnWorlds</h1>
        <SincronizacaoLearnWorlds />
      </div>
    </MatriculasLayout>
  );
};

export default SincronizacaoLearnWorldsPage;
