
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import MatriculasLayout from "@/components/layout/MatriculasLayout";
import SincronizacaoAlunosHeader from "@/components/admin/matriculas/sincronizacao/SincronizacaoAlunosHeader";
import SincronizacaoAlertas from "@/components/admin/matriculas/sincronizacao/SincronizacaoAlertas";
import SincronizacaoBotoes from "@/components/admin/matriculas/sincronizacao/SincronizacaoBotoes";
import useLearnWorldsApi from "@/hooks/useLearnWorldsApi";

const SincronizacaoLearnWorlds: React.FC = () => {
  const { loading, error, offlineMode } = useLearnWorldsApi();
  const [localError, setLocalError] = useState<string | null>(null);
  
  return (
    <MatriculasLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Sincronização LearnWorlds</h1>
        
        <SincronizacaoAlertas 
          error={error}
          detalhesErro={localError}
          offlineMode={offlineMode}
        />
        
        <Tabs defaultValue="alunos" className="space-y-4">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-2 gap-2">
            <TabsTrigger value="alunos">Sincronizar Alunos</TabsTrigger>
            <TabsTrigger value="cursos">Sincronizar Cursos</TabsTrigger>
          </TabsList>
          
          <Card className="mt-4 p-6">
            <TabsContent value="alunos" className="space-y-4">
              <SincronizacaoAlunosHeader title="Sincronização de Alunos" />
              <SincronizacaoBotoes 
                loading={loading} 
                onSincronizar={() => {}}
              />
            </TabsContent>
            
            <TabsContent value="cursos" className="space-y-4">
              <SincronizacaoAlunosHeader title="Sincronização de Cursos" />
              <p className="text-muted-foreground">Sincronize os cursos do LearnWorlds para o sistema interno.</p>
              <SincronizacaoBotoes 
                loading={loading}
                onSincronizar={() => {}}
              />
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </MatriculasLayout>
  );
};

export default SincronizacaoLearnWorlds;
