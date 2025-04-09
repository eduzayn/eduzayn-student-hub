
/**
 * Funções utilitárias para manipulação de requisições
 */

import { getAuthorizationHeader } from '@/hooks/auth/adminBypass';
import { LEARNWORLDS_SCHOOL_ID } from './apiConstants';
import { isHtmlResponse } from './errorUtils';

/**
 * Normaliza um endpoint para evitar duplicação de caminhos
 */
export const normalizeEndpoint = (endpoint: string): string => {
  // Remover barras duplicadas
  const cleanEndpoint = endpoint.replace(/\/+/g, '/');
  
  // Remover duplicação de 'api/learnworlds-api' ou 'learnworlds-api'
  const normalizedEndpoint = cleanEndpoint
    .replace(/\/api\/learnworlds-api\/learnworlds-api/g, '/api/learnworlds-api')
    .replace(/\/learnworlds-api\/learnworlds-api/g, '/learnworlds-api');
  
  // Se não começar com /api/learnworlds-api ou /learnworlds-api, adicionar prefixo
  if (!normalizedEndpoint.startsWith('/api/learnworlds-api') && 
      !normalizedEndpoint.startsWith('/learnworlds-api')) {
    return normalizedEndpoint.startsWith('/') 
      ? `/learnworlds-api${normalizedEndpoint}`
      : `/learnworlds-api/${normalizedEndpoint}`;
  }
  
  return normalizedEndpoint;
};

/**
 * Constrói opções para requisição fetch
 */
export const buildRequestOptions = (
  method: string, 
  body?: any, 
  useOAuth = false
): RequestInit => {
  // Configurar cabeçalhos
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': getAuthorizationHeader(),
    'Lw-Client': LEARNWORLDS_SCHOOL_ID
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
  
  return options;
};

/**
 * Analisa a resposta de uma requisição fetch
 */
export const parseResponse = async (response: Response): Promise<any> => {
  console.log(`Resposta HTTP status: ${response.status}`);
  
  const responseText = await response.text();
  
  // Verificar se a resposta é vazia
  if (!responseText || responseText.trim() === '') {
    console.warn('Resposta vazia recebida');
    return {};
  }
  
  // Verificar se a resposta é HTML
  if (isHtmlResponse(responseText)) {
    console.error('Resposta HTML detectada:', responseText.substring(0, 200));
    throw new Error('API retornou conteúdo não-JSON (HTML). Ativando modo offline.');
  }
  
  // Tentar analisar a resposta como JSON
  try {
    const data = JSON.parse(responseText);
    console.log(`Dados da resposta:`, data);
    return data;
  } catch (e) {
    console.error(`Resposta não é JSON válido:`, responseText.substring(0, 200));
    throw new Error(`Resposta inválida do servidor: ${responseText.substring(0, 100)}`);
  }
};

/**
 * Faz uma requisição para a API do LearnWorlds
 */
export const makeApiRequest = async (
  url: string, 
  options: RequestInit
): Promise<any> => {
  const response = await fetch(url, options);
  const data = await parseResponse(response);
  
  // Verificar por erros na resposta
  if (!response.ok) {
    console.error(`Erro na resposta:`, `Status ${response.status}, Corpo:`, data);
    
    // Se a resposta tem um erro específico
    if (data && data.error) {
      throw new Error(`Erro ${response.status}: ${JSON.stringify(data)}`);
    } else {
      throw new Error(`Erro ${response.status}: ${JSON.stringify(data).substring(0, 100)}`);
    }
  }
  
  return data;
};
