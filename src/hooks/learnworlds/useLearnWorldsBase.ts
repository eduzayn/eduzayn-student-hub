
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook base para interagir com a API do LearnWorlds
 * Fornece funcionalidades compartilhadas para outros hooks especializados
 */
const useLearnWorldsBase = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [offlineMode, setOfflineMode] = useState<boolean>(false);

  /**
   * Obtém o token JWT do usuário atual ou usa o token bypass para admin
   */
  const getToken = async (): Promise<string | null> => {
    // Primeiro tenta obter a sessão do usuário atual
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.access_token) {
      return session.access_token;
    }

    // Se não tiver sessão, usa o token bypass de admin
    // Note: Isso seria substituído por uma abordagem mais segura em produção
    return 'byZ4yn-#v0lt-2025!SEC'; // Token de bypass para testes
  };

  /**
   * Função auxiliar para fazer requisições para as funções edge
   */
  const makeRequest = async (endpoint: string, method = 'GET', body?: any): Promise<any> => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      
      if (!token) {
        throw new Error('Não foi possível autenticar. Faça login novamente.');
      }

      const headers: HeadersInit = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const options: RequestInit = {
        method,
        headers,
      };

      if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(body);
      }

      // URL base específica para o projeto Supabase
      const baseUrl = 'https://bioarzkfmcobctblzztm.supabase.co/functions/v1';
      const url = `${baseUrl}/${endpoint}`;
      console.log(`Fazendo requisição ${method} para ${url}`);
      
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setOfflineMode(false);
      return data;
    } catch (err: any) {
      console.error(`Erro na API LearnWorlds (${endpoint}):`, err);
      setOfflineMode(true);
      setError(err.message || 'Erro ao comunicar com a API');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    offlineMode,
    makeRequest
  };
};

export default useLearnWorldsBase;
