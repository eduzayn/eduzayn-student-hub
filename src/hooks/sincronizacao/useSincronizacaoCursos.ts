
import { useState } from 'react';
import { toast } from 'sonner';
import useLearnWorldsApi from '@/hooks/useLearnWorldsApi';
import { SincronizacaoResult } from '@/hooks/learnworlds/types/cursoTypes';

interface SincronizacaoResultado {
  success: boolean;
  message: string;
  imported?: number;
  updated?: number;
  failed?: number;
  total?: number;
  logs?: string[];
}

export default function useSincronizacaoCursos() {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<SincronizacaoResultado | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const { sincronizarCursos, offlineMode } = useLearnWorldsApi();
  
  const iniciarSincronizacao = async (): Promise<SincronizacaoResult> => {
    setLoading(true);
    setLogs([]);
    
    try {
      // Chamando sem argumentos (o padrão é false)
      const result = await sincronizarCursos();
      
      // Atualizar estado com resultado da sincronização
      setResultado({
        success: result.success,
        message: result.message,
        imported: result.imported,
        updated: result.updated,
        failed: result.failed,
        total: result.total
      });
      
      // Atualizar logs
      if (result.logs && result.logs.length > 0) {
        setLogs(result.logs);
      }
      
      return result;
    } catch (error: any) {
      const mensagemErro = error.message || 'Erro ao sincronizar cursos';
      toast.error(mensagemErro);
      
      setResultado({
        success: false,
        message: mensagemErro
      });
      
      setLogs([`Erro: ${mensagemErro}`]);
      
      // Retornar um resultado de erro
      return {
        success: false,
        message: mensagemErro
      };
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    resultado,
    logs,
    sincronizarCursos: iniciarSincronizacao
  };
}
