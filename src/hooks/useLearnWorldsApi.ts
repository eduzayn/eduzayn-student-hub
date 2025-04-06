
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Hook para facilitar chamadas à API LearnWorlds através da edge function
 * @see https://www.learnworlds.dev/ para documentação completa
 */
export const useLearnWorldsApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Função para fazer chamadas à API LearnWorlds
   * @param endpoint Endpoint específico da API LearnWorlds
   * @param method Método HTTP
   * @param body Corpo da requisição (opcional)
   * @param params Parâmetros de query string (opcional)
   */
  const callLearnWorldsApi = async <T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any,
    params?: Record<string, string>
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);

      // Obter token de autenticação do usuário atual
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        throw new Error('Usuário não autenticado');
      }

      // Construir URL com parâmetros de query se fornecidos
      let url = `/functions/v1/learnworlds-api/${endpoint}`;
      if (params && Object.keys(params).length > 0) {
        const queryString = new URLSearchParams(params).toString();
        url = `${url}?${queryString}`;
      }

      // Preparar as opções para a requisição
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      // Adicionar corpo da requisição se for método POST, PUT ou PATCH
      if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
        options.body = JSON.stringify(body);
      }

      // Fazer a chamada para a edge function
      const response = await fetch(url, options);
      
      // Tratar diferentes códigos de status conforme a documentação da LearnWorlds
      if (!response.ok) {
        const errorData = await response.json();
        
        // Mostrar mensagem de erro amigável baseada nos códigos de erro da LearnWorlds
        let errorMessage = errorData.error || 'Erro ao chamar API LearnWorlds';
        
        if (response.status === 401) {
          errorMessage = 'Não autorizado - verifique as credenciais da API';
          toast.error('Sessão expirada ou inválida', { description: 'Por favor, faça login novamente' });
        } else if (response.status === 403) {
          errorMessage = 'Sem permissão para acessar este recurso';
        } else if (response.status === 404) {
          errorMessage = 'Recurso não encontrado na LearnWorlds';
        } else if (response.status === 429) {
          errorMessage = 'Muitas requisições - aguarde um momento e tente novamente';
          toast.warning('Muitas requisições', { description: 'Aguarde um momento antes de tentar novamente' });
        } else if (response.status >= 500) {
          errorMessage = 'Erro no servidor da LearnWorlds - tente novamente mais tarde';
          toast.error('Serviço temporariamente indisponível', { description: 'Tente novamente mais tarde' });
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data as T;
    } catch (err: any) {
      console.error('Erro ao chamar API LearnWorlds:', err);
      setError(err.message || 'Erro desconhecido ao chamar API LearnWorlds');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Busca informações de um curso específico
   * @param courseId ID do curso na LearnWorlds
   */
  const getCourseDetails = async (courseId: string) => {
    return callLearnWorldsApi<any>(`courses/${courseId}`);
  };

  /**
   * Busca lista de cursos disponíveis
   * @param page Número da página, começando por 1
   * @param limit Limite de itens por página (máx: 100)
   */
  const getAllCourses = async (page: number = 1, limit: number = 20) => {
    return callLearnWorldsApi<any>('courses', 'GET', undefined, {
      page: page.toString(),
      limit: limit.toString()
    });
  };

  /**
   * Busca informações de progresso de um aluno em um curso
   * @param userId ID do usuário/email na LearnWorlds
   * @param courseId ID do curso na LearnWorlds
   */
  const getUserCourseProgress = async (userId: string, courseId: string) => {
    return callLearnWorldsApi<any>(`users/${userId}/courses/${courseId}/progress`);
  };

  /**
   * Marca uma aula como concluída para um usuário
   * @param userId ID do usuário/email na LearnWorlds
   * @param courseId ID do curso na LearnWorlds
   * @param contentId ID da aula/conteúdo na LearnWorlds
   */
  const markContentAsCompleted = async (userId: string, courseId: string, contentId: string) => {
    return callLearnWorldsApi<any>(`users/${userId}/courses/${courseId}/contents/${contentId}/complete`, 'POST');
  };

  return {
    callLearnWorldsApi,
    getCourseDetails,
    getAllCourses,
    getUserCourseProgress,
    markContentAsCompleted,
    loading,
    error
  };
};

export default useLearnWorldsApi;
