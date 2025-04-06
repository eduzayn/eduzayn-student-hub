
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook para facilitar chamadas à API LearnWorlds através da edge function
 */
export const useLearnWorldsApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Função para fazer chamadas à API LearnWorlds
   * @param endpoint Endpoint específico da API LearnWorlds
   * @param method Método HTTP
   * @param body Corpo da requisição (opcional)
   */
  const callLearnWorldsApi = async <T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
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

      // Preparar as opções para a requisição
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      // Adicionar corpo da requisição se for método POST ou PUT
      if (['POST', 'PUT'].includes(method) && body) {
        options.body = JSON.stringify(body);
      }

      // Fazer a chamada para a edge function
      const response = await fetch(`/functions/v1/learnworlds-api/${endpoint}`, options);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao chamar API LearnWorlds');
      }

      const data = await response.json();
      return data as T;
    } catch (err) {
      console.error('Erro ao chamar API LearnWorlds:', err);
      setError(err.message || 'Erro desconhecido ao chamar API LearnWorlds');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    callLearnWorldsApi,
    loading,
    error
  };
};

export default useLearnWorldsApi;
