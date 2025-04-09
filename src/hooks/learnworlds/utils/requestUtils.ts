
/**
 * Utilitários para requisições à API do LearnWorlds via função edge
 */
import { LEARNWORLDS_API_ENDPOINT, DEFAULT_HEADERS } from './apiConstants';
import { isHtmlResponse } from './errorUtils';

/**
 * Normaliza um endpoint para garantir que não tenha duplicações
 */
export const normalizeEndpoint = (endpoint: string): string => {
  // Remover possível duplicação de "learnworlds-api"
  let normalizedEndpoint = endpoint;
  if (endpoint.includes('learnworlds-api')) {
    const parts = endpoint.split('learnworlds-api');
    if (parts.length > 1) {
      normalizedEndpoint = parts[parts.length - 1] || '';
    }
  }
  
  // Garantir que não comece com barra
  if (normalizedEndpoint.startsWith('/')) {
    normalizedEndpoint = normalizedEndpoint.substring(1);
  }
  
  return normalizedEndpoint;
};

/**
 * Constrói opções de requisição com cabeçalhos apropriados
 */
export const buildRequestOptions = (
  method: string, 
  body?: any, 
  useOAuth = false
): RequestInit => {
  const headers = {
    ...DEFAULT_HEADERS
  };
  
  // Não adicionar Authorization aqui - será adicionado posteriormente
  
  const options: RequestInit = {
    method,
    headers,
    signal: AbortSignal.timeout(15000) // timeout de 15 segundos
  };
  
  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }
  
  return options;
};

/**
 * Analisa a resposta da API e verifica por erros
 */
export const parseResponse = async (response: Response, url: string): Promise<any> => {
  const text = await response.text();
  
  // Verificar se recebemos um HTML em vez de JSON
  if (isHtmlResponse(text)) {
    console.error('Resposta HTML detectada: ', text.substring(0, 200));
    console.error('URL da requisição:', url);
    throw new Error('API retornou conteúdo não-JSON (HTML). Ativando modo offline.');
  }
  
  try {
    return text ? JSON.parse(text) : {};
  } catch (error) {
    console.error('Erro ao analisar resposta JSON:', error);
    throw new Error('Resposta não é um JSON válido');
  }
};

/**
 * Faz uma requisição para a função edge
 */
export const makeApiRequest = async (
  endpoint: string, 
  options: RequestInit, 
  authToken?: string
): Promise<any> => {
  // Normalizar endpoint
  const normalizedEndpoint = normalizeEndpoint(endpoint);
  
  // Construir URL completa
  const url = `${LEARNWORLDS_API_ENDPOINT}/${normalizedEndpoint}`;
  console.log(`Fazendo requisição para: ${url}`);
  
  // Adicionar token de autorização se fornecido
  if (authToken) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${authToken}`
    };
  }
  
  try {
    const response = await fetch(url, options);
    console.log(`Resposta HTTP status: ${response.status}`);
    
    // Se a resposta não for OK, lançar erro
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro na API: ${response.status}`, errorText);
      throw new Error(`API retornou erro: ${response.status} - ${errorText.substring(0, 100)}`);
    }
    
    // Analisar resposta
    const data = await parseResponse(response, url);
    return data;
  } catch (error) {
    if (error.message.includes('HTML')) {
      console.error('Erro de resposta HTML:', url);
    }
    throw error;
  }
};
