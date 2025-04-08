
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { getAdminBypassToken, getAuthorizationHeader } from '@/hooks/auth/adminBypass';

// Constante para o token público do LearnWorlds
const LEARNWORLDS_PUBLIC_TOKEN = "8BtSujQd7oBzSgJIWAeNtjYrmfeWHCZSBIXTGRpR";

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
   * Obtém o cabeçalho de autorização para requisições públicas (não administrativas)
   */
  const getPublicAuthorizationHeader = (): string => {
    return `Bearer ${LEARNWORLDS_PUBLIC_TOKEN}`;
  };

  /**
   * Função auxiliar para fazer requisições para as funções edge
   * @param endpoint Endpoint da API
   * @param method Método HTTP (GET, POST, etc.)
   * @param body Corpo da requisição (opcional)
   * @param usePublicToken Se verdadeiro, usa o token público em vez do token de administrador
   */
  const makeRequest = async (endpoint: string, method = 'GET', body?: any, usePublicToken = false): Promise<any> => {
    try {
      setLoading(true);
      setError(null);

      // Determinar qual token usar com base no parâmetro usePublicToken
      // Como desabilitamos a verificação JWT, estamos simplificando essa parte
      // Ainda enviamos o token para compatibilidade com o código existente
      const authHeader = usePublicToken ? getPublicAuthorizationHeader() : getAuthorizationHeader();
      
      // Log para diagnóstico
      console.log(`Fazendo requisição para endpoint: ${endpoint}`);
      console.log(`Usando token: ${usePublicToken ? 'público' : 'administrativo'}`);
      console.log(`A verificação JWT está desativada, mas ainda enviamos o token por compatibilidade`);
      
      if (!usePublicToken) {
        console.log(`Token administrativo formatado como: Bearer ${getAdminBypassToken().substring(0, 5)}...`);
      } else {
        console.log(`Token público formatado como: Bearer ${LEARNWORLDS_PUBLIC_TOKEN.substring(0, 5)}...`);
      }

      const headers: HeadersInit = {
        'Authorization': authHeader,
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
      console.log(`Resposta HTTP status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erro na resposta: Status ${response.status}, Corpo:`, errorText);
        
        // Tentar analisar se é JSON
        let errorDetails = errorText;
        try {
          if (errorText.startsWith('{') || errorText.startsWith('[')) {
            const errorJson = JSON.parse(errorText);
            errorDetails = JSON.stringify(errorJson, null, 2);
          }
        } catch (parseError) {
          console.error('Erro ao analisar resposta como JSON:', parseError);
          // Se não for JSON, usar o texto como está
        }
        
        throw new Error(`Erro ${response.status}: ${errorDetails}`);
      }

      // Verificar o tipo de conteúdo para melhor tratamento
      const contentType = response.headers.get('content-type') || '';
      console.log(`Tipo de conteúdo da resposta: ${contentType}`);
      
      if (contentType.includes('application/json')) {
        const data = await response.json();
        setOfflineMode(false);
        return data;
      } else {
        // Se não for JSON, podemos ter um problema
        const textResponse = await response.text();
        console.warn('Resposta não-JSON recebida:', textResponse.substring(0, 200) + '...');
        
        if (textResponse.includes('<!DOCTYPE html>') || textResponse.includes('<html>')) {
          throw new Error('Resposta HTML recebida ao invés de JSON. Possível erro na URL da API.');
        }
        
        setOfflineMode(false);
        // Tentar retornar algo útil
        return { message: 'Resposta não-JSON recebida', text: textResponse.substring(0, 1000) };
      }
    } catch (err: any) {
      console.error(`Erro na API LearnWorlds (${endpoint}):`, err);
      setOfflineMode(true);
      setError(err.message || 'Erro ao comunicar com a API');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Variante do makeRequest que sempre utiliza o token público
   */
  const makePublicRequest = async (endpoint: string, method = 'GET', body?: any): Promise<any> => {
    return makeRequest(endpoint, method, body, true);
  };

  return {
    loading,
    error,
    offlineMode,
    makeRequest,
    makePublicRequest,
    LEARNWORLDS_PUBLIC_TOKEN
  };
};

export default useLearnWorldsBase;
