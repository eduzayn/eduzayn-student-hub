
import React from "react";
import MatriculasLayout from "@/components/layout/MatriculasLayout";
import SincronizacaoLearnWorlds from "@/components/admin/matriculas/SincronizacaoLearnWorlds";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SincronizacaoAlunos from "@/components/admin/matriculas/SincronizacaoAlunos";
import SincronizacaoCursos from "@/components/admin/matriculas/SincronizacaoCursos";

const SincronizacaoAlunosPage: React.FC = () => {
  return (
    <MatriculasLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Sincronização com LearnWorlds</h1>
        
        <Tabs defaultValue="alunos" className="space-y-6">
          <TabsList className="mb-4">
            <TabsTrigger value="alunos">Alunos</TabsTrigger>
            <TabsTrigger value="cursos">Cursos</TabsTrigger>
            <TabsTrigger value="geral">Configurações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="alunos">
            <SincronizacaoAlunos />
          </TabsContent>
          
          <TabsContent value="cursos">
            <SincronizacaoCursos />
          </TabsContent>
          
          <TabsContent value="geral">
            <SincronizacaoLearnWorlds />
          </TabsContent>
        </Tabs>
      </div>
    </MatriculasLayout>
  );
};

export default SincronizacaoAlunosPage;
