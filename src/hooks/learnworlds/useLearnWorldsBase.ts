
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { getAdminBypassToken, getAuthorizationHeader } from '@/hooks/auth/adminBypass';

// Constantes para tokens do LearnWorlds
const LEARNWORLDS_PUBLIC_TOKEN = "8BtSujQd7oBzSgJIWAeNtjYrmfeWHCZSBIXTGRpR";
const LEARNWORLDS_SCHOOL_ID = "grupozayneducacional";

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
      const authHeader = usePublicToken ? getPublicAuthorizationHeader() : getAuthorizationHeader();
      
      // Log para diagnóstico
      console.log(`Fazendo requisição para endpoint: ${endpoint}`);
      console.log(`Usando token: ${usePublicToken ? 'público' : 'administrativo'}`);
      console.log(`Auth Header: ${authHeader.substring(0, 15)}...`); // Debug - mostra apenas parte do token
      
      const headers: HeadersInit = {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      };
      
      // Log para diagnóstico dos cabeçalhos
      console.log("Headers para requisição:", JSON.stringify(headers, null, 2));

      const options: RequestInit = {
        method,
        headers,
        // Adicionando configurações para evitar problemas de CORS e cache em produção
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
      };

      if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(body);
      }

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

        // Verificar o tipo de conteúdo para melhor tratamento
        const contentType = response.headers.get('content-type') || '';
        
        if (contentType.includes('application/json')) {
          try {
            const responseText = await response.text();
            if (!responseText || !responseText.trim()) {
              console.warn('Resposta vazia recebida');
              setOfflineMode(false);
              return null;
            }
            const data = JSON.parse(responseText);
            setOfflineMode(false);
            return data;
          } catch (parseError) {
            console.error('Erro ao analisar resposta JSON:', parseError);
            const responseText = await response.text();
            throw new Error(`Erro ao analisar JSON: ${parseError.message}. Resposta: ${responseText.substring(0, 100)}...`);
          }
        } else {
          const textResponse = await response.text();
          console.warn('Resposta não-JSON recebida:', textResponse.substring(0, 200) + '...');
          
          if (textResponse.includes('<!DOCTYPE html>') || textResponse.includes('<html>')) {
            console.error('Resposta HTML detectada em vez de JSON', textResponse.substring(0, 500));
            // Ativamos o modo offline em vez de lançar erro, para usar dados simulados
            setOfflineMode(true);
            throw new Error('Resposta HTML recebida ao invés de JSON. Ativando modo offline.');
          }
          
          setOfflineMode(false);
          return { 
            message: 'Resposta não-JSON recebida', 
            text: textResponse.substring(0, 1000),
            success: response.ok 
          };
        }
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
      console.error(`Erro na API LearnWorlds (${endpoint}):`, err);
      setOfflineMode(true);
      
      let errorMessage = err.message || 'Erro ao comunicar com a API';
      if (errorMessage.includes('Failed to fetch')) {
        errorMessage = 'Falha de conexão com a API. Verifique se a função edge está ativa e se não há bloqueios de rede ou CORS.';
      } else if (errorMessage.includes('client_id')) {
        errorMessage = 'Erro de configuração do LearnWorlds: client_id ausente ou incorreto. Verifique o valor de LEARNWORLDS_SCHOOL_ID.';
      } else if (errorMessage.includes('401') || errorMessage.includes('403')) {
        errorMessage = 'Erro de autenticação na API LearnWorlds. Verifique se o token API tem permissões suficientes.';
      } else if (errorMessage.includes('No API key found')) {
        errorMessage = 'Chave de API do Supabase não encontrada na requisição. Verifique a configuração do cliente Supabase.';
      } else if (errorMessage.includes('HTML recebida')) {
        errorMessage = 'A API retornou HTML em vez de JSON. Ativando modo offline para usar dados simulados.';
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Variante do makeRequest que sempre utiliza o token público
   */
  const makePublicRequest = async (endpoint: string, method = 'GET', body?: any): Promise<any> => {
    console.log(`Fazendo requisição pública para: ${endpoint}`);
    return makeRequest(endpoint, method, body, true);
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
