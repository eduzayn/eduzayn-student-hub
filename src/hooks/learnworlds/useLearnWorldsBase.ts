
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { normalizeEndpoint, buildRequestOptions, parseResponse, makeApiRequest } from './utils/requestUtils';
import { handleApiError, isHtmlResponse } from './utils/errorUtils';

/**
 * Hook base para realizar chamadas à API do LearnWorlds
 * Fornece funcionalidades compartilhadas para outros hooks
 */
const useLearnWorldsBase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offlineMode, setOfflineMode] = useState(false);
  const { getAuthToken } = useAuth();

  /**
   * Faz uma requisição para a API do LearnWorlds com autenticação
   */
  const makeRequest = async (
    endpoint: string, 
    method = 'GET', 
    body?: any, 
    useOAuth = false,
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Normalizar endpoint para evitar duplicação
      const normalizedEndpoint = normalizeEndpoint(endpoint);
      console.log(`Realizando requisição: ${method} ${normalizedEndpoint}`);
      
      // Obter token de autenticação
      const authToken = await getAuthToken();
      if (!authToken) {
        console.error('Token de autenticação não disponível');
        throw new Error('Você precisa estar autenticado para realizar esta ação');
      }

      // Preparar opções de requisição
      const options = buildRequestOptions(method, body, useOAuth);
      console.log(`Enviando requisição para ${normalizedEndpoint}`, { 
        method, 
        headers: { ...options.headers, Authorization: 'Bearer xxxxx' },
        body: options.body
      });
      
      // Fazer a requisição
      const data = await makeApiRequest(normalizedEndpoint, options);
      return data;
    } catch (error: any) {
      console.error(`Erro na API LearnWorlds (${endpoint}):`, error);
      
      // Verificar se é um erro de rede - ativar modo offline
      if (error.message.includes('Failed to fetch') || 
          error.message.includes('NetworkError') || 
          error.message.includes('HTML')) {
        setOfflineMode(true);
        toast.error('Modo offline ativado: sem conexão com o servidor');
        setError('Sem conexão com o servidor - operando em modo offline');
        return null;
      }
      
      setError(handleApiError(error, endpoint, false));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Faz uma requisição pública (sem autenticação) para a API do LearnWorlds
   */
  const makePublicRequest = async (
    endpoint: string,
    method = 'GET',
    body?: any,
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Normalizar endpoint para evitar duplicação
      const normalizedEndpoint = normalizeEndpoint(endpoint);
      console.log(`Realizando requisição pública: ${method} ${normalizedEndpoint}`);
      
      // Preparar opções de requisição sem autorização
      const options = buildRequestOptions(method, body, false);
      delete options.headers['Authorization']; // Remover cabeçalho de autorização
      
      console.log(`Enviando requisição pública para ${normalizedEndpoint}`);
      
      // Fazer a requisição
      const data = await makeApiRequest(normalizedEndpoint, options);
      return data;
    } catch (error: any) {
      console.error(`Erro na API LearnWorlds (${endpoint}):`, error);
      
      if (error.message.includes('Failed to fetch') || 
          error.message.includes('NetworkError') ||
          error.message.includes('HTML')) {
        setOfflineMode(true);
        toast.error('Modo offline ativado: sem conexão com o servidor');
        setError('Sem conexão com o servidor - operando em modo offline');
        return null;
      }
      
      setError(handleApiError(error, endpoint, false));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { 
    makeRequest, 
    makePublicRequest, 
    loading, 
    error, 
    offlineMode, 
    setOfflineMode 
  };
};

export default useLearnWorldsBase;
