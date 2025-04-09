
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
  let normalizedEndpoint = cleanEndpoint
    .replace(/\/api\/learnworlds-api\/learnworlds-api/g, '/api/learnworlds-api')
    .replace(/\/learnworlds-api\/learnworlds-api/g, '/learnworlds-api');
  
  // Remover duplicação de api/api
  normalizedEndpoint = normalizedEndpoint
    .replace(/\/api\/api\//g, '/api/');
    
  // Garantir que não estamos enviando para URL errada
  if (normalizedEndpoint.includes('/api/learnworlds-api/users') || 
      normalizedEndpoint.includes('/api/learnworlds-api/courses')) {
    console.log('URL detectada como incorreta, normalizando:', normalizedEndpoint);
    // Remover /api do caminho para invocar a API edge function diretamente
    normalizedEndpoint = normalizedEndpoint.replace('/api/learnworlds-api', '/learnworlds-api');
  }
  
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
    'School-Id': LEARNWORLDS_SCHOOL_ID, // Alterado de Lw-Client para School-Id
    'X-API-Version': '2.0' // Adicionado para compatibilidade com API v2
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
  // Verificar se estamos usando a URL correta para a API LearnWorlds
  const isEdgeFunction = url.includes('/learnworlds-api/') && 
                        !url.includes('/api/learnworlds-api/');
  
  // Log para diagnóstico
  console.log(`Verificando URL API: ${url}, isEdgeFunction: ${isEdgeFunction}`);
  
  return isEdgeFunction;
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
    
    // Verificar se estamos tentando acessar a API através da URL incorreta
    if (response.url.includes('/api/learnworlds-api/')) {
      throw new Error('API retornou HTML. A URL está incorreta, deveria ser /learnworlds-api/ diretamente.');
    }
    
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
      // Criar objeto de metadados padrão se não existir
      const metaData = typeof data === 'object' && data.meta ? data.meta : {
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
      // Criar objeto de metadados padrão se não existir
      const metaData = typeof data === 'object' && data.meta ? data.meta : {
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
 * Faz uma requisição para a API do LearnWorlds
 */
export const makeApiRequest = async (
  url: string, 
  options: RequestInit
): Promise<any> => {
  // Verificar se estamos usando a URL correta
  const isValidUrl = checkApiUrl(url);
  
  if (!isValidUrl) {
    console.warn(`URL possivelmente incorreta: ${url}. Deveria ser /learnworlds-api/ em vez de /api/learnworlds-api/.`);
  }
  
  try {
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
    
    // Adaptar resposta para compatibilidade com código existente
    const adaptedData = adaptApiResponseToLegacyFormat(data, url);
    
    return adaptedData;
  } catch (error: any) {
    if (error.message.includes('HTML')) {
      // Se o erro está relacionado a resposta HTML, vamos sugerir checagem da URL
      console.error(`Erro possível de URL incorreta: ${url}`);
      
      // Tentar corrigir a URL e fazer nova tentativa
      if (url.includes('/api/learnworlds-api/')) {
        const correctedUrl = url.replace('/api/learnworlds-api/', '/learnworlds-api/');
        console.log(`Tentando novamente com URL corrigida: ${correctedUrl}`);
        
        // Fazer nova tentativa com URL corrigida
        // Esta é uma solução temporária - idealmente devemos corrigir todas as chamadas
        try {
          const response = await fetch(correctedUrl, options);
          return await parseResponse(response);
        } catch (retryError) {
          console.error('Falha na segunda tentativa:', retryError);
          throw error; // Lançar o erro original se a segunda tentativa falhar
        }
      }
    }
    
    throw error;
  }
};

/**
 * Verifica se a resposta da API é válida
 */
export const isValidApiResponse = (data: any): boolean => {
  return data && typeof data === 'object' && !data.error;
};
