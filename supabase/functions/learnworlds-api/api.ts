
// Funções para chamar a API do LearnWorlds
import { LEARNWORLDS_API_KEY, LEARNWORLDS_SCHOOL_ID, LEARNWORLDS_API_BASE_URL } from './config.ts';
import { getOAuthToken, invalidateOAuthToken } from './oauth.ts';

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
export async function callLearnWorldsApi(path: string, method = 'GET', body?: any, useOAuth = false, retry = true): Promise<any> {
  try {
    if (!LEARNWORLDS_SCHOOL_ID) {
      throw new Error("LEARNWORLDS_SCHOOL_ID não configurado");
    }
    
    // Remover qualquer barra inicial para não criar URLs malformadas
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    // Determinar versão da API: endpoints de usuários usam v2, o resto usa admin/api
    let baseApiUrl = LEARNWORLDS_API_BASE_URL;
    if (cleanPath.startsWith('users') || cleanPath.includes('/users')) {
      baseApiUrl = `${LEARNWORLDS_API_BASE_URL}/v2`;
      console.log("Usando endpoint v2 para usuários:", baseApiUrl);
    } else {
      baseApiUrl = `${LEARNWORLDS_API_BASE_URL}/admin/api`;
      console.log("Usando endpoint admin/api para outras chamadas:", baseApiUrl);
    }
    
    // Construir a URL completa com base no formato da API
    let url = baseApiUrl;
    
    // Verificar se o caminho já inclui / no início
    if (!url.endsWith('/') && !cleanPath.startsWith('/')) {
      url += '/';
    }
    url += cleanPath;
    
    console.log(`Chamando API LearnWorlds: ${method} ${url} (useOAuth: ${useOAuth})`);
    
    let authToken;
    
    // Determinar qual token usar com base no parâmetro useOAuth
    if (useOAuth) {
      // Para endpoints que exigem OAuth (como users)
      try {
        authToken = await getOAuthToken();
        console.log("Usando token OAuth para autenticação");
      } catch (oauthError) {
        console.error("Falha ao obter token OAuth:", oauthError);
        
        // Se não conseguir obter o token OAuth, tentar usar API Key como fallback
        if (LEARNWORLDS_API_KEY) {
          console.log("Usando API Key como fallback após falha de OAuth");
          authToken = LEARNWORLDS_API_KEY;
        } else {
          throw new Error("Não foi possível obter token OAuth e API Key não está disponível");
        }
      }
    } else {
      // Para outros endpoints (como cursos)
      if (!LEARNWORLDS_API_KEY) {
        // Se a API Key não estiver disponível, tentar usar OAuth como fallback
        try {
          console.log("API Key não configurada, tentando OAuth como fallback");
          authToken = await getOAuthToken();
        } catch (fallbackError) {
          throw new Error("LEARNWORLDS_API_KEY não configurado e fallback OAuth falhou");
        }
      } else {
        authToken = LEARNWORLDS_API_KEY;
        console.log("Usando token de acesso API Key para autenticação");
      }
    }
    
    // Configurar os headers com School ID (Lw-Client é obrigatório!)
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      'Lw-Client': LEARNWORLDS_SCHOOL_ID // Cabeçalho obrigatório conforme documentação
    };
    
    const options: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(15000) // Aumentado para 15 segundos
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
    
    // Verificar se é um erro de autenticação e tentar novamente com novo token OAuth
    if (response.status === 401 && useOAuth && retry) {
      console.log("Erro de autenticação 401. Invalidando token OAuth e tentando novamente...");
      invalidateOAuthToken();
      return callLearnWorldsApi(path, method, body, useOAuth, false); // Tentar apenas uma vez
    }
    
    if (!response.ok || isHtmlResponse(text)) {
      console.error(`Erro na API LearnWorlds: ${response.status} - ${text.substring(0, 200)}`);
      
      // Se recebeu HTML e é uma chamada OAuth, pode ser problema de token
      if (isHtmlResponse(text) && useOAuth && retry) {
        console.log("Recebeu HTML em resposta à chamada OAuth. Invalidando token e tentando novamente...");
        invalidateOAuthToken();
        return callLearnWorldsApi(path, method, body, useOAuth, false); // Tentar apenas uma vez
      }
      
      throw new Error(`Erro LearnWorlds: ${response.status} - ${text.substring(0, 200)}`);
    }
    
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error("Erro ao converter resposta para JSON:", parseError);
      
      // Se não conseguir converter para JSON, pode ser um problema com o token
      if (useOAuth && retry) {
        console.log("Falha ao parse JSON com token OAuth. Invalidando token e tentando novamente...");
        invalidateOAuthToken();
        return callLearnWorldsApi(path, method, body, useOAuth, false); // Tentar apenas uma vez
      }
      
      throw new Error("Resposta da API LearnWorlds não é um JSON válido.");
    }
  } catch (error) {
    console.error(`Erro ao chamar API LearnWorlds: ${error.message}`);
    throw error;
  }
}
