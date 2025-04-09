
import { useState } from 'react';
import { toast } from 'sonner';
import { SincronizacaoResult } from '@/hooks/learnworlds/types/cursoTypes';
import { syncCourses } from '@/services/learnworlds-api';

interface UseSincronizacaoCursosReturn {
  loading: boolean;
  resultado: SincronizacaoResult | null;
  logs: string[];
  sincronizarCursos: () => Promise<SincronizacaoResult | null>;
}

export default function useSincronizacaoCursos(): UseSincronizacaoCursosReturn {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<SincronizacaoResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const sincronizarCursos = async (): Promise<SincronizacaoResult | null> => {
    setLoading(true);
    setLogs([]);
    
    try {
      // Adicionando log para iniciar a sincronização
      setLogs(prev => [...prev, `Iniciando sincronização de cursos...`]);
      
      // Chamando a API para sincronizar os cursos
      const result = await syncCourses();
      
      setResultado(result || { 
        success: false, 
        message: 'Erro ao sincronizar cursos - resposta vazia' 
      });
      
      if (result && result.success) {
        // Formatando os resultados
        const mensagens = [
          `Sincronização concluída com sucesso!`,
          `Total processado: ${result.total || 0} cursos`,
          `Importados: ${result.imported || 0} cursos`,
          `Atualizados: ${result.updated || 0} cursos`,
          `Falhas: ${result.failed || 0} cursos`
        ];
        
        // Adicionando logs específicos se disponíveis
        if (result.logs && result.logs.length > 0) {
          mensagens.push(`--- Logs detalhados ---`);
          mensagens.push(...result.logs);
        }
        
        setLogs(mensagens);
        
        toast.success("Sincronização concluída", {
          description: `${result.imported || 0} cursos importados, ${result.updated || 0} atualizados`
        });
      } else {
        const erro = result?.message || 'Erro desconhecido na sincronização';
        setLogs(prev => [...prev, `Erro na sincronização: ${erro}`]);
        
        toast.error("Falha na sincronização", {
          description: erro
        });
      }
      
      return result;
    } catch (error: any) {
      const mensagemErro = error?.message || 'Erro desconhecido durante a sincronização';
      setLogs(prev => [...prev, `Erro: ${mensagemErro}`]);
      
      setResultado({
        success: false,
        message: mensagemErro
      });
      
      toast.error("Erro ao sincronizar cursos", {
        description: mensagemErro
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    resultado,
    logs,
    sincronizarCursos
  };
}
