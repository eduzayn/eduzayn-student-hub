
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { getAdminBypassToken, getAuthorizationHeader } from '@/hooks/auth/adminBypass';

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
  const makeRequest = async (endpoint: string, method = 'GET', body?: any): Promise<any> => {
    try {
      setLoading(true);
      setError(null);

      // Usar o token JWT de bypass diretamente para chamadas das funções edge
      // Agora usando a função centralizada para obter o token de autorização
      const authHeader = getAuthorizationHeader();
      
      // Log para diagnóstico
      console.log(`Fazendo requisição para endpoint: ${endpoint}`);
      console.log(`Token de autenticação (formato): Bearer ${getAdminBypassToken().substring(0, 5)}...`);

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

  return {
    loading,
    error,
    offlineMode,
    makeRequest
  };
};

export default useLearnWorldsBase;
