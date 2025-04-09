
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
      
      if (result && result.success) {
        // Converter o resultado para o formato esperado
        const sincResult: SincronizacaoResultado = {
          imported: result.imported || 0,
          updated: result.updated || 0,
          failed: result.failed || 0,
          total: result.total || 0,
          logs: result.logs || []
        };
        
        setResultado(sincResult);
        setLogs(sincResult.logs);
        
        const apiErrorLog = sincResult.logs?.find(log => 
          log.includes("API") && 
          log.includes("Erro")
        );
        
        const accessDeniedLog = sincResult.logs?.find(log =>
          log.includes("access_denied") || log.includes("401") || log.includes("403")
        );
        
        if (apiErrorLog) {
          setDetalhesErro("Erro da API LearnWorlds: Verifique se o token de acesso está configurado corretamente.");
          toast.error("Erro da API LearnWorlds", {
            description: "Falha na autenticação. Verifique o token de acesso."
          });
        } else if (accessDeniedLog) {
          setDetalhesErro("Erro de autorização na API LearnWorlds. Verifique se o token de acesso tem permissões suficientes.");
          toast.error("Erro de autorização", {
            description: "O token de acesso não tem permissões suficientes"
          });
        }
        
        if (sincResult.imported > 0 || sincResult.updated > 0) {
          toast.success(
            "Sincronização concluída com sucesso!", 
            { description: `${sincResult.imported} novos cursos e ${sincResult.updated} atualizados.` }
          );
        } else if (sincResult.failed > 0) {
          toast.error(
            "Problemas na sincronização", 
            { description: `${sincResult.failed} cursos não puderam ser sincronizados.` }
          );
        } else if (sincResult.total === 0) {
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
      
      // Tratar os erros mais comuns de forma clara
      let mensagemDetalhada = "";
      
      if (error.message && error.message.includes("API")) {
        mensagemDetalhada = "Erro de autenticação da API LearnWorlds: Falha na autenticação. Verifique o token de acesso.";
      } else if (error.message && error.message.includes("HTML")) {
        mensagemDetalhada = "A API do LearnWorlds retornou HTML em vez de JSON. Verifique se a URL da API está correta. Isso geralmente acontece quando a URL da API está incorreta.";
      } else if (error.message && error.message.includes("status 401") || error.message.includes("status 403")) {
        mensagemDetalhada = "Erro de autorização: a API rejeitou o token de autenticação. Verifique se o token de acesso tem permissões suficientes e está correto.";
      } else if (error.message && error.message.includes("Failed to fetch")) {
        mensagemDetalhada = "Erro de conexão com a função edge. Verifique se a função está ativa e se não há problemas de rede ou CORS.";
      } else {
        mensagemDetalhada = error.message || "Erro desconhecido durante a sincronização";
      }
      
      setDetalhesErro(mensagemDetalhada);
      toast.error("Erro na sincronização", { description: mensagemDetalhada });
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
