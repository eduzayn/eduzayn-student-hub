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
  // Se o endpoint já contém uma URL completa, retorne-o como está
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  
  // URL completa da função edge do Supabase para Lovable
  const baseUrl = window.location.origin;
  
  // Remover barras duplicadas e limpar o endpoint
  let cleanEndpoint = endpoint.replace(/\/+/g, '/');
  
  // Remover 'api/' do caminho se estiver presente
  cleanEndpoint = cleanEndpoint.replace(/^\/api\//, '/');
  
  // Se o endpoint já começa com /learnworlds-api, certifique-se de que está no formato correto
  if (cleanEndpoint.startsWith('/learnworlds-api')) {
    return `${baseUrl}${cleanEndpoint}`;
  }
  
  // Caso contrário, adicione o prefixo /learnworlds-api
  const finalEndpoint = cleanEndpoint.startsWith('/') 
    ? `/learnworlds-api${cleanEndpoint}`
    : `/learnworlds-api/${cleanEndpoint}`;
  
  return `${baseUrl}${finalEndpoint}`;
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
    'School-Id': LEARNWORLDS_SCHOOL_ID,
    'X-API-Version': '2.0'
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
 * Verifica se a URL está sendo direcionada corretamente
 */
export const checkApiUrl = (url: string): boolean => {
  // Verificar se estamos usando a URL correta para a API LearnWorlds via função edge
  return url.includes('/learnworlds-api/');
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
    // Log para diagnóstico com URL da requisição
    console.error('Resposta HTML detectada:', responseText.substring(0, 200));
    console.error('URL da requisição:', response.url);
    
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
  try {
    console.log(`Fazendo requisição para: ${url}`);
    
    const response = await fetch(url, options);
    return await parseResponse(response);
  } catch (error: any) {
    if (error.message.includes('HTML')) {
      console.error(`Erro de resposta HTML: ${url}`);
    }
    
    throw error;
  }
};

/**
 * Adapta os dados para compatibilidade com a antiga estrutura da API
 */
export const adaptApiResponseToLegacyFormat = (data: any, endpoint: string): any => {
  // Se não temos dados, não há o que adaptar
  if (!data) return data;
  
  // Log para diagnóstico
  console.log('Adaptando resposta da APIv2 para formato legado:', endpoint);
  
  // Adaptar dados de usuários
  if (endpoint.includes('/users')) {
    // Verificar se estamos lidando com um array ou objeto único
    if (Array.isArray(data)) {
      // Criar objeto de metadados padrão
      const metaData = data && typeof data === 'object' && 'meta' in data ? 
        (data as any).meta : {
          page: 1,
          total_pages: 1,
          total: data.length,
          per_page: 20
        };

      return {
        data: data.map(user => ({
          id: user.id,
          email: user.email,
          firstName: user.first_name || user.firstName,
          lastName: user.last_name || user.lastName,
          // Outros campos necessários
        })),
        meta: {
          currentPage: metaData.page || 1,
          totalPages: metaData.total_pages || 1,
          totalItems: metaData.total || data.length,
          itemsPerPage: metaData.per_page || 20
        }
      };
    }
  }
  
  // Adaptar dados de cursos
  if (endpoint.includes('/courses')) {
    // Verificar se estamos lidando com um array ou objeto único
    if (Array.isArray(data)) {
      // Criar objeto de metadados padrão
      const metaData = data && typeof data === 'object' && 'meta' in data ? 
        (data as any).meta : {
          page: 1,
          total_pages: 1,
          total: data.length,
          per_page: 20
        };

      return {
        data: data.map(course => ({
          id: course.id,
          title: course.title,
          description: course.description,
          shortDescription: course.short_description,
          image: course.image_url,
          price: course.price,
          // Outros campos necessários
        })),
        meta: {
          currentPage: metaData.page || 1,
          totalPages: metaData.total_pages || 1,
          totalItems: metaData.total || data.length,
          itemsPerPage: metaData.per_page || 20
        }
      };
    }
  }
  
  // Se não precisar de adaptação, retornar dados originais
  return data;
};

/**
 * Verifica se a resposta da API é válida
 */
export const isValidApiResponse = (data: any): boolean => {
  return data && typeof data === 'object' && !data.error;
};
