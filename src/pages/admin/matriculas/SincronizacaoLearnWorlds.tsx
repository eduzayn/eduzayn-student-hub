
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import MatriculasLayout from "@/components/layout/MatriculasLayout";
import SincronizacaoAlunosHeader from "@/components/admin/matriculas/sincronizacao/SincronizacaoAlunosHeader";
import SincronizacaoAlertas from "@/components/admin/matriculas/sincronizacao/SincronizacaoAlertas";
import SincronizacaoBotoes from "@/components/admin/matriculas/sincronizacao/SincronizacaoBotoes";

const SincronizacaoLearnWorlds: React.FC = () => {
  return (
    <MatriculasLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Sincronização LearnWorlds</h1>
        
        <SincronizacaoAlertas />
        
        <Tabs defaultValue="alunos" className="space-y-4">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-2 gap-2">
            <TabsTrigger value="alunos">Sincronizar Alunos</TabsTrigger>
            <TabsTrigger value="cursos">Sincronizar Cursos</TabsTrigger>
          </TabsList>
          
          <Card className="mt-4 p-6">
            <TabsContent value="alunos" className="space-y-4">
              <SincronizacaoAlunosHeader />
              <SincronizacaoBotoes tipo="alunos" />
            </TabsContent>
            
            <TabsContent value="cursos" className="space-y-4">
              <h3 className="text-lg font-medium">Sincronização de Cursos</h3>
              <p className="text-muted-foreground">Sincronize os cursos do LearnWorlds para o sistema interno.</p>
              <SincronizacaoBotoes tipo="cursos" />
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </MatriculasLayout>
  );
};

export default SincronizacaoLearnWorlds;
