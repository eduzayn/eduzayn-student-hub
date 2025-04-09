
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useLearnWorldsApi from "@/hooks/useLearnWorldsApi";
import SincronizacaoAlunosHeader from "./SincronizacaoAlunosHeader";
import SincronizacaoAlertas from "./SincronizacaoAlertas";
import SincronizacaoBotoes from "./SincronizacaoBotoes";
import SincronizacaoResultado from "./SincronizacaoResultado";
import SincronizacaoLogs from "./SincronizacaoLogs";

const SincronizacaoAlunos: React.FC = () => {
  // Hooks
  const { sincronizarAlunos, loading, error, offlineMode } = useLearnWorldsApi();
  
  // Estados
  const [resultado, setResultado] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  
  const handleSincronizar = async (todos: boolean = false) => {
    try {
      setLocalError(null);
      const result = await sincronizarAlunos(todos);
      if (result) {
        setResultado(result);
        setLogs(result.logs || []);
      }
    } catch (error: any) {
      console.error("Erro ao sincronizar:", error);
      setLocalError(error?.message || "Erro desconhecido na sincronização");
    }
  };
  
  return (
    <div className="container mx-auto p-6">
      <SincronizacaoAlunosHeader title="Sincronização de Alunos" />
      <SincronizacaoAlertas 
        error={error} 
        detalhesErro={localError} 
        offlineMode={offlineMode}
      />

      <Tabs defaultValue="sincronizacao">
        <TabsList>
          <TabsTrigger value="sincronizacao">Sincronização</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="sincronizacao">
          <SincronizacaoBotoes 
            loading={loading} 
            onSincronizar={handleSincronizar} 
          />
          <SincronizacaoResultado resultado={resultado} />
        </TabsContent>

        <TabsContent value="logs">
          <SincronizacaoLogs logs={logs} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SincronizacaoAlunos;
