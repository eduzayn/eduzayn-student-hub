
// Funções para chamar a API do LearnWorlds
import { LEARNWORLDS_API_KEY, LEARNWORLDS_SCHOOL_ID, LEARNWORLDS_API_BASE_URL } from './config.ts';
import { getOAuthToken } from './oauth.ts';

/**
 * Verifica se a resposta é HTML em vez de JSON
 */
function isHtmlResponse(text: string): boolean {
  return (
    text.includes("<!DOCTYPE html>") || 
    text.includes("<html") || 
    text.includes("</html>") ||
    text.includes("<head") || 
    text.includes("<body")
  );
}

/**
 * Chama a API do LearnWorlds com o token apropriado
 */
export async function callLearnWorldsApi(path: string, method = 'GET', body?: any, useOAuth = false): Promise<any> {
  try {
    if (!LEARNWORLDS_SCHOOL_ID) {
      throw new Error("LEARNWORLDS_SCHOOL_ID não configurado");
    }
    
    // Remover qualquer barra inicial para não criar URLs malformadas
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
      
    // Construir a URL completa usando a base de API v2
    const url = `${LEARNWORLDS_API_BASE_URL}/${cleanPath}`;
    console.log(`Chamando API LearnWorlds: ${method} ${url} (useOAuth: ${useOAuth})`);
    
    let authToken;
    
    // Determinar qual token usar com base no parâmetro useOAuth
    if (useOAuth) {
      // Para endpoints que exigem OAuth (como users)
      authToken = await getOAuthToken();
      console.log("Usando token OAuth para autenticação");
    } else {
      // Para outros endpoints (como cursos)
      if (!LEARNWORLDS_API_KEY) {
        throw new Error("LEARNWORLDS_API_KEY não configurado");
      }
      authToken = LEARNWORLDS_API_KEY;
      console.log("Usando token de acesso API Key para autenticação");
    }
    
    // Configurar os headers com School ID
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      'School-Id': LEARNWORLDS_SCHOOL_ID
    };
    
    const options: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(10000)
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
      console.log(`Corpo da requisição: ${options.body}`);
    }

    console.log(`Enviando requisição para: ${url} com cabeçalhos:`, JSON.stringify({
      ...headers,
      Authorization: `Bearer ${authToken.substring(0, 5)}...`
    }));
    
    const response = await fetch(url, options);
    console.log(`Resposta da API LearnWorlds: ${response.status}`);
    
    const text = await response.text();
    
    if (!response.ok || isHtmlResponse(text)) {
      console.error(`Erro na API LearnWorlds: ${response.status} - ${text.substring(0, 200)}`);
      throw new Error(`Erro LearnWorlds: ${response.status} - ${text.substring(0, 200)}`);
    }
    
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error("Erro ao converter resposta para JSON:", parseError);
      throw new Error("Resposta da API LearnWorlds não é um JSON válido.");
    }
  } catch (error) {
    console.error(`Erro ao chamar API LearnWorlds: ${error.message}`);
    throw error;
  }
}
