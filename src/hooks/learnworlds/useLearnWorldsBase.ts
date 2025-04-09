
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getAuthorizationHeader } from '@/hooks/auth/adminBypass';
import { 
  LEARNWORLDS_PUBLIC_TOKEN, 
  LEARNWORLDS_SCHOOL_ID 
} from './utils/apiConstants';
import { 
  getPublicAuthorizationHeader, 
  getRequestHeaders 
} from './utils/apiHeaders';
import { 
  buildRequestOptions, 
  parseResponse 
} from './utils/requestManager';
import { 
  handleLearnWorldsApiError 
} from './utils/apiErrorHandler';

/**
 * Hook base para interagir com a API do LearnWorlds
 * Fornece funcionalidades compartilhadas para outros hooks especializados
 */
const useLearnWorldsBase = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [offlineMode, setOfflineMode] = useState<boolean>(false);
  const { getAccessToken } = useAuth();

  /**
   * Função auxiliar para fazer requisições para as funções edge
   */
  const makeRequest = async (endpoint: string, method = 'GET', body?: any, usePublicToken = false): Promise<any> => {
    try {
      setLoading(true);
      setError(null);

      // Determinar qual token usar com base no parâmetro usePublicToken
      const authHeader = usePublicToken 
        ? getPublicAuthorizationHeader(LEARNWORLDS_PUBLIC_TOKEN) 
        : getAuthorizationHeader();
      
      // Log para diagnóstico
      console.log(`Fazendo requisição para endpoint: ${endpoint}`);
      console.log(`Usando token: ${usePublicToken ? 'público' : 'administrativo'}`);
      console.log(`Auth Header: ${authHeader.substring(0, 15)}...`); // Debug - mostra apenas parte do token
      
      // Obter headers adequados para a requisição com o ID da escola
      const headers = getRequestHeaders(usePublicToken, LEARNWORLDS_PUBLIC_TOKEN, LEARNWORLDS_SCHOOL_ID);
      
      // Log para diagnóstico dos cabeçalhos
      console.log("Headers para requisição:", JSON.stringify(headers, null, 2));

      // Construir as opções da requisição
      const options = buildRequestOptions(method, headers, body);

      // URL base específica para o projeto Supabase
      const baseUrl = 'https://bioarzkfmcobctblzztm.supabase.co/functions/v1';
      const url = `${baseUrl}/${endpoint}`;
      console.log(`Fazendo requisição ${method} para ${url}`);
      
      try {
        // Tentativa inicial com timeout para evitar solicitações pendentes
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos de timeout
        
        options.signal = controller.signal;
        
        const response = await fetch(url, options);
        clearTimeout(timeoutId);
        
        console.log(`Resposta HTTP status: ${response.status}`);
        
        if (!response.ok) {
          let errorText = "";
          try {
            errorText = await response.text();
            console.error(`Erro na resposta: Status ${response.status}, Corpo:`, errorText);
          } catch (textError) {
            console.error('Erro ao ler corpo da resposta:', textError);
            errorText = 'Não foi possível ler o corpo da resposta';
          }
          
          // Tentar analisar se é JSON
          let errorDetails = errorText;
          try {
            if (errorText && (errorText.startsWith('{') || errorText.startsWith('['))) {
              const errorJson = JSON.parse(errorText);
              errorDetails = JSON.stringify(errorJson, null, 2);
              
              // Se a resposta de erro contiver logs, os apresentamos para depuração
              if (errorJson.results && errorJson.results.logs) {
                console.log("Logs da função edge:", errorJson.results.logs);
              }
            }
          } catch (parseError) {
            console.error('Erro ao analisar resposta como JSON:', parseError);
          }
          
          throw new Error(`Erro ${response.status}: ${errorDetails}`);
        }

        // Processar a resposta
        const data = await parseResponse(response);
        setOfflineMode(false);
        
        // Log para debug
        console.log("Resposta final formatada:", JSON.stringify(data).substring(0, 200) + "...");
        
        return data;
      } catch (fetchError: any) {
        console.error(`Erro na requisição: ${fetchError.message}`);
        
        if (fetchError.name === 'AbortError') {
          console.error('Requisição cancelada por timeout (15s)');
          throw new Error('A requisição expirou por tempo. Verifique sua conexão de internet ou a disponibilidade do servidor.');
        }
        
        if (fetchError.message === 'Failed to fetch') {
          console.error('Erro de conexão: Failed to fetch. Possíveis causas: CORS, rede, função edge indisponível');
          throw new Error(`Erro de conexão: Não foi possível acessar a função edge. Verifique se a função está ativa e configurada corretamente.`);
        }
        throw fetchError;
      }
    } catch (err: any) {
      const errorMessage = handleLearnWorldsApiError(err, endpoint);
      setOfflineMode(true);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Variante do makeRequest que sempre utiliza o token público
   * Porém, devido a problemas de autorização, vamos usar o token de administrador
   */
  const makePublicRequest = async (endpoint: string, method = 'GET', body?: any): Promise<any> => {
    console.log(`Fazendo requisição "pública" (usando token administrativo) para: ${endpoint}`);
    // Mudamos para usar token administrativo, mesmo para requisições públicas
    return makeRequest(endpoint, method, body, false);
  };

  return {
    loading,
    error,
    offlineMode,
    setOfflineMode,
    makeRequest,
    makePublicRequest,
    LEARNWORLDS_PUBLIC_TOKEN,
    LEARNWORLDS_SCHOOL_ID
  };
};

export default useLearnWorldsBase;
