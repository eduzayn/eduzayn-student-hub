
/**
 * Gerenciador de requisições para a API LearnWorlds
 */
export const buildRequestOptions = (method: string, headers: HeadersInit, body?: any): RequestInit => {
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

  return options;
};

export const parseResponse = async (response: Response): Promise<any> => {
  // Verificar o tipo de conteúdo para melhor tratamento
  const contentType = response.headers.get('content-type') || '';
  
  if (contentType.includes('application/json')) {
    try {
      const responseText = await response.text();
      if (!responseText || !responseText.trim()) {
        console.warn('Resposta vazia recebida');
        return null;
      }
      return JSON.parse(responseText);
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
      throw new Error('Resposta HTML recebida ao invés de JSON. Ativando modo offline.');
    }
    
    return { 
      message: 'Resposta não-JSON recebida', 
      text: textResponse.substring(0, 1000),
      success: response.ok 
    };
  }
};
