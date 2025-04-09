
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

interface ApiOptions {
  endpoint: string;
  method?: string;
  body?: any;
  useOAuth?: boolean;
  baseUrl?: string;
  headers?: Record<string, string>;
  showErrors?: boolean;
}

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
   * Faz uma requisição para a API do LearnWorlds
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
      // Remover duplicação de 'learnworlds-api' no caminho
      const normalizedEndpoint = endpoint.startsWith('/learnworlds-api') 
        ? endpoint
        : endpoint.startsWith('/') 
          ? `/learnworlds-api${endpoint}`
          : `/learnworlds-api/${endpoint}`;
          
      console.log(`Realizando requisição: ${method} ${normalizedEndpoint}`);
      
      // Obter token de autenticação
      const authToken = await getAuthToken();
      if (!authToken) {
        console.error('Token de autenticação não disponível');
        throw new Error('Você precisa estar autenticado para realizar esta ação');
      }

      // Configurar cabeçalhos
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      };
      
      if (useOAuth) {
        headers['X-Use-OAuth'] = 'true';
      }

      // Construir opções da requisição
      const options: RequestInit = {
        method,
        headers,
        credentials: 'include'
      };

      if (body && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(body);
      }

      // Fazer a requisição
      console.log(`Enviando requisição para ${normalizedEndpoint}`, { 
        method, 
        headers: { ...headers, Authorization: 'Bearer xxxxx' },
        body: options.body
      });
      
      const response = await fetch(normalizedEndpoint, options);
      console.log(`Resposta HTTP status: ${response.status}`);
      
      const responseText = await response.text();
      
      // Verificar se a resposta é JSON válido
      let data;
      try {
        // Se a resposta está vazia, retornar objeto vazio
        if (!responseText || responseText.trim() === '') {
          console.warn('Resposta vazia recebida');
          return {};
        }
        
        // Se a resposta contém HTML ao invés de JSON
        if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
          console.error('Resposta HTML detectada:', responseText.substring(0, 200));
          setOfflineMode(true);
          throw new Error('API retornou conteúdo não-JSON (HTML). Ativando modo offline.');
        }
        
        data = JSON.parse(responseText);
        console.log(`Dados da resposta:`, data);
      } catch (e) {
        console.error(`Resposta não é JSON válido:`, responseText.substring(0, 200));
        
        // Verificar se é HTML e ativar modo offline
        if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
          setOfflineMode(true);
          throw new Error('API retornou HTML. Ativando modo offline.');
        }
        
        throw new Error(`Resposta inválida do servidor: ${responseText.substring(0, 100)}`);
      }
      
      // Verificar por erros na resposta
      if (!response.ok) {
        console.error(`Erro na resposta:`, `Status ${response.status}, Corpo:`, data);
        
        // Se a resposta tem um erro específico
        if (data && data.error) {
          throw new Error(`Erro ${response.status}: ${JSON.stringify(data)}`);
        } else {
          throw new Error(`Erro ${response.status}: ${responseText.substring(0, 100)}`);
        }
      }
      
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
      
      setError(error.message || 'Erro ao comunicar com a API do LearnWorlds');
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
      // Remover duplicação de 'learnworlds-api' no caminho
      const normalizedEndpoint = endpoint.startsWith('/learnworlds-api') 
        ? endpoint
        : endpoint.startsWith('/') 
          ? `/learnworlds-api${endpoint}`
          : `/learnworlds-api/${endpoint}`;
          
      console.log(`Realizando requisição pública: ${method} ${normalizedEndpoint}`);
      
      // Configurar cabeçalhos
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Construir opções da requisição
      const options: RequestInit = {
        method,
        headers,
        credentials: 'include'
      };

      if (body && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(body);
      }

      // Fazer a requisição
      console.log(`Enviando requisição pública para ${normalizedEndpoint}`);
      
      const response = await fetch(normalizedEndpoint, options);
      console.log(`Resposta HTTP status: ${response.status}`);
      
      const responseText = await response.text();
      
      // Verificar se a resposta é JSON válido
      let data;
      try {
        // Se a resposta está vazia, retornar objeto vazio
        if (!responseText || responseText.trim() === '') {
          console.warn('Resposta vazia recebida');
          return {};
        }
        
        // Se a resposta contém HTML ao invés de JSON
        if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
          console.error('Resposta HTML detectada:', responseText.substring(0, 200));
          setOfflineMode(true);
          throw new Error('API retornou conteúdo não-JSON (HTML). Ativando modo offline.');
        }
        
        data = JSON.parse(responseText);
      } catch (e) {
        console.error(`Resposta não é JSON válido:`, responseText.substring(0, 200));
        
        // Verificar se é HTML e ativar modo offline
        if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
          setOfflineMode(true);
          throw new Error('API retornou HTML. Ativando modo offline.');
        }
        
        throw new Error(`Resposta inválida do servidor: ${responseText.substring(0, 100)}`);
      }
      
      // Verificar por erros na resposta
      if (!response.ok) {
        console.error(`Erro na resposta:`, data);
        
        if (data && data.error) {
          throw new Error(`Erro ${response.status}: ${JSON.stringify(data)}`);
        } else {
          throw new Error(`Erro ${response.status}: ${responseText.substring(0, 100)}`);
        }
      }
      
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
      
      setError(error.message || 'Erro ao comunicar com a API do LearnWorlds');
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
