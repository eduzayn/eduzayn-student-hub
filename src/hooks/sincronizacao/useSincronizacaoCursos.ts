
import { useState, useEffect } from "react";
import useLearnWorldsApi from "@/hooks/useLearnWorldsApi";
import { toast } from "sonner";

interface SincronizacaoResultado {
  imported: number;
  updated: number;
  failed: number;
  total: number;
  logs: string[];
}

export const useSincronizacaoCursos = () => {
  const { sincronizarCursos, loading, error, offlineMode } = useLearnWorldsApi();
  const [resultado, setResultado] = useState<SincronizacaoResultado | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [detalhesErro, setDetalhesErro] = useState<string | null>(null);
  const [sincronizando, setSincronizando] = useState<boolean>(false);
  const [schoolId, setSchoolId] = useState<string>("grupozayneducacional");
  
  useEffect(() => {
    setSchoolId("grupozayneducacional");
  }, []);
  
  const handleSincronizar = async (todos: boolean = false) => {
    try {
      setSincronizando(true);
      setDetalhesErro(null);
      
      toast.info(
        todos ? "Iniciando sincronização completa..." : "Iniciando sincronização incremental...", 
        { description: "Este processo pode demorar alguns instantes." }
      );
      
      console.log(`Chamando API para sincronização de cursos (todos=${todos})`);
      
      const result = await sincronizarCursos(todos);
      console.log("Resposta da sincronização:", result);
      
      if (result) {
        setResultado(result);
        setLogs(result.logs || []);
        
        const apiErrorLog = result.logs?.find(log => 
          log.includes("API") && 
          log.includes("Erro")
        );
        
        const accessDeniedLog = result.logs?.find(log =>
          log.includes("access_denied") || log.includes("401") || log.includes("403")
        );
        
        if (apiErrorLog) {
          setDetalhesErro("Erro da API LearnWorlds: Verifique se a API Key está configurada corretamente.");
          toast.error("Erro da API LearnWorlds", {
            description: "Falha na autenticação. Verifique a API key."
          });
        } else if (accessDeniedLog) {
          setDetalhesErro("Erro de autorização na API LearnWorlds. Verifique se o token da API tem permissões suficientes.");
          toast.error("Erro de autorização", {
            description: "O token da API não tem permissões suficientes"
          });
        }
        
        if (result.imported > 0 || result.updated > 0) {
          toast.success(
            "Sincronização concluída com sucesso!", 
            { description: `${result.imported} novos cursos e ${result.updated} atualizados.` }
          );
        } else if (result.failed > 0) {
          toast.error(
            "Problemas na sincronização", 
            { description: `${result.failed} cursos não puderam ser sincronizados.` }
          );
        } else if (result.total === 0) {
          toast.info("Nenhum curso encontrado para sincronização.");
        } else {
          toast.info("Nenhuma alteração foi necessária.");
        }
      } else {
        setDetalhesErro("Não foi possível obter resultados da sincronização");
        toast.error("Falha na sincronização", { 
          description: "Não foi possível obter resultados da sincronização" 
        });
      }
    } catch (error: any) {
      console.error("Erro ao sincronizar:", error);
      
      if (error.message && error.message.includes("API")) {
        setDetalhesErro("Erro de autenticação da API LearnWorlds: Falha na autenticação. Verifique a API key.");
        toast.error("Erro de autenticação da API", { 
          description: "Falha na autenticação. Verifique a API key."
        });
      } else if (error.message && error.message.includes("client_id")) {
        setDetalhesErro("Erro na API do LearnWorlds: ID do cliente ausente ou incorreto. Verifique as configurações da API.");
        toast.error("Erro de configuração da API", { 
          description: "ID do cliente LearnWorlds ausente ou incorreto nas configurações."
        });
      } else if (error.message && error.message.includes("Failed to fetch")) {
        setDetalhesErro("Erro de conexão com a função edge. Verifique se a função está ativa e se não há problemas de rede ou CORS.");
        toast.error("Erro de conexão", {
          description: "Não foi possível conectar à função edge do Supabase."
        });
      } else {
        setDetalhesErro(error.message || "Erro desconhecido durante a sincronização");
        toast.error("Erro na sincronização", { description: error.message });
      }
    } finally {
      setSincronizando(false);
    }
  };

  return {
    loading,
    error,
    offlineMode,
    resultado,
    logs,
    detalhesErro,
    sincronizando,
    schoolId,
    handleSincronizar
  };
};
