
import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import useLearnWorldsApi from "@/hooks/useLearnWorldsApi";
import SincronizacaoAlertas from "./SincronizacaoAlertas";
import SincronizacaoBotoes from "./SincronizacaoBotoes";
import SincronizacaoResultado from "./SincronizacaoResultado";
import SincronizacaoLogs from "./SincronizacaoLogs";

interface SincronizacaoAlunosProps {
  // Props if needed
}

const SincronizacaoAlunos: React.FC<SincronizacaoAlunosProps> = () => {
  // Hooks
  const { isAdminBypass } = useAuth();
  const { sincronizarAlunos, loading, error, offlineMode } = useLearnWorldsApi();
  
  // Estados
  const [resultado, setResultado] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [detalhesErro, setDetalhesErro] = useState<string | null>(null);
  
  const handleSincronizar = async (todos: boolean = false) => {
    try {
      console.log(`Iniciando sincronização de alunos. Todos: ${todos}`);
      setDetalhesErro(null);
      
      const result = await sincronizarAlunos(todos);
      console.log("Resultado da sincronização:", result);
      
      if (result) {
        setResultado(result);
        setLogs(result.logs || []);
      }
    } catch (error: any) {
      console.error("Erro ao sincronizar:", error);
      
      // Capturar mais detalhes sobre o erro
      let mensagemErro = "Erro ao sincronizar alunos com LearnWorlds";
      if (error instanceof Error) {
        mensagemErro = error.message;
        console.error("Stack trace:", error.stack);
        setDetalhesErro(mensagemErro);
      } else if (typeof error === 'object' && error !== null) {
        try {
          mensagemErro = JSON.stringify(error);
          setDetalhesErro(mensagemErro);
        } catch {
          setDetalhesErro("Erro desconhecido durante a sincronização");
        }
      }
    }
  };

  return (
    <div className="p-4">
      <SincronizacaoAlertas 
        error={error} 
        detalhesErro={detalhesErro} 
        offlineMode={offlineMode}
      />
      
      <SincronizacaoBotoes 
        loading={loading} 
        onSincronizar={handleSincronizar}
      />

      <SincronizacaoResultado resultado={resultado} />
      <SincronizacaoLogs logs={logs} />
    </div>
  );
};

export default SincronizacaoAlunos;
