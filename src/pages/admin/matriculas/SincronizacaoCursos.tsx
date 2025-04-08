
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Componentes refatorados
import SincronizacaoCursosHeader from "@/components/admin/matriculas/sincronizacao/SincronizacaoCursosHeader";
import SincronizacaoCursosBotoes from "@/components/admin/matriculas/sincronizacao/cursos/SincronizacaoCursosBotoes";
import SincronizacaoCursosResultado from "@/components/admin/matriculas/sincronizacao/cursos/SincronizacaoCursosResultado";
import SincronizacaoCursosErrores from "@/components/admin/matriculas/sincronizacao/cursos/SincronizacaoCursosErrores";
import SincronizacaoLogs from "@/components/admin/matriculas/sincronizacao/SincronizacaoLogs";
import SincronizacaoAlertas from "@/components/admin/matriculas/sincronizacao/SincronizacaoAlertas";
import LearnWorldsStatusDetails from "@/components/admin/matriculas/LearnWorldsStatusDetails";

// Hook personalizado para gerenciar a lógica de sincronização
import { useSincronizacaoCursos } from "@/hooks/sincronizacao/useSincronizacaoCursos";

const SincronizacaoCursos: React.FC = () => {
  const { 
    loading, 
    error, 
    offlineMode, 
    resultado, 
    logs, 
    detalhesErro, 
    sincronizando, 
    schoolId, 
    handleSincronizar 
  } = useSincronizacaoCursos();
  
  return (
    <div className="container mx-auto p-6">
      <SincronizacaoCursosHeader />

      <LearnWorldsStatusDetails 
        schoolId={schoolId}
        offlineMode={offlineMode}
        error={error}
      />

      <SincronizacaoAlertas 
        error={error}
        detalhesErro={detalhesErro}
        offlineMode={offlineMode}
      />
      
      <SincronizacaoCursosErrores 
        detalhesErro={detalhesErro} 
        logs={logs} 
      />

      <Tabs defaultValue="sincronizacao">
        <TabsList>
          <TabsTrigger value="sincronizacao">Sincronização</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="sincronizacao">
          <SincronizacaoCursosBotoes 
            loading={loading} 
            sincronizando={sincronizando} 
            onSincronizar={handleSincronizar} 
          />

          <SincronizacaoCursosResultado 
            resultado={resultado} 
            offlineMode={offlineMode}
          />
        </TabsContent>

        <TabsContent value="logs">
          <SincronizacaoLogs logs={logs} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SincronizacaoCursos;
