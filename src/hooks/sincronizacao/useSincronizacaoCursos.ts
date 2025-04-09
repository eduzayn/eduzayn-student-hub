
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { SincronizacaoResult } from '@/hooks/learnworlds/types/cursoTypes';
import { useAuth } from '@/hooks/use-auth';

/**
 * Hook para sincronizar cursos do LearnWorlds
 */
export const useSincronizacaoCursos = () => {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<SincronizacaoResult | null>(null);
  const { getAuthToken } = useAuth();

  /**
   * Sincroniza cursos do LearnWorlds com o banco de dados
   * Atualizado para usar a rota centralizada no learnworlds-api
   */
  const sincronizarCursos = async (sincronizarTodos: boolean = false): Promise<SincronizacaoResult> => {
    setLoading(true);
    
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error("Você precisa estar autenticado para realizar esta ação");
      }
      
      // Usar a rota de sincronização dentro de learnworlds-api
      const { data, error } = await supabase.functions.invoke('learnworlds-api', {
        body: {
          path: '/sync',
          query: { 
            type: 'courses',
            syncAll: sincronizarTodos 
          }
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (error) {
        throw new Error(error.message || "Erro ao sincronizar cursos");
      }

      const resultado: SincronizacaoResult = {
        success: true,
        message: 'Sincronização concluída com sucesso',
        imported: data.imported || 0,
        updated: data.updated || 0,
        failed: data.failed || 0,
        total: data.total || 0,
        logs: data.logs || [],
        syncedItems: (data.imported || 0) + (data.updated || 0)
      };

      setResultado(resultado);
      
      toast.success(`Sincronização concluída: ${resultado.syncedItems} cursos processados`);
      return resultado;
    } catch (error: any) {
      console.error("Erro ao sincronizar cursos:", error);
      
      const falha: SincronizacaoResult = {
        success: false,
        message: error.message || 'Erro desconhecido',
        imported: 0,
        updated: 0,
        failed: 0,
        total: 0,
        logs: [error.message || 'Erro desconhecido']
      };
      
      setResultado(falha);
      toast.error(`Falha na sincronização: ${falha.message}`);
      return falha;
    } finally {
      setLoading(false);
    }
  };

  return {
    sincronizarCursos,
    loading,
    resultado
  };
};

export default useSincronizacaoCursos;
