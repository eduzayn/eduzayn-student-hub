
// Implementação de autenticação OAuth para LearnWorlds API
import { LEARNWORLDS_API_BASE_URL, LEARNWORLDS_CLIENT_ID, LEARNWORLDS_CLIENT_SECRET, LEARNWORLDS_SCHOOL_ID } from './config.ts';

// Cache para o token OAuth
let oauthToken: string | null = null;
let oauthTokenExpiry = 0;
const TOKEN_REFRESH_MARGIN = 300000; // 5 minutos em milissegundos

/**
 * Obtém um token OAuth para endpoints que precisam desse método de autenticação
 * seguindo a especificação da API LearnWorlds para concessão de credenciais do cliente
 */
export async function getOAuthToken(): Promise<string> {
  try {
    // Verificar se já temos um token válido em cache
    const now = Date.now();
    if (oauthToken && now < oauthTokenExpiry - TOKEN_REFRESH_MARGIN) { 
      console.log("Usando token OAuth em cache (expira em", new Date(oauthTokenExpiry).toISOString(), ")");
      return oauthToken;
    }
    
    console.log("Obtendo novo token OAuth...");
    
    // Verificação das credenciais OAuth
    if (!LEARNWORLDS_CLIENT_ID) {
      console.error("LEARNWORLDS_CLIENT_ID não configurado nas variáveis de ambiente");
      throw new Error("Falha ao obter access_token: LEARNWORLDS_CLIENT_ID não configurado");
    }
    
    if (!LEARNWORLDS_CLIENT_SECRET) {
      console.error("LEARNWORLDS_CLIENT_SECRET não configurado nas variáveis de ambiente");
      throw new Error("Falha ao obter access_token: LEARNWORLDS_CLIENT_SECRET não configurado");
    }
    
    // Log das credenciais (parcial, por segurança)
    console.log(`CLIENT_ID configurado: ${LEARNWORLDS_CLIENT_ID ? "Sim (primeiros 4 caracteres: " + LEARNWORLDS_CLIENT_ID.substring(0, 4) + "...)" : "Não"}`);
    console.log(`CLIENT_SECRET configurado: ${LEARNWORLDS_CLIENT_SECRET ? "Sim (tamanho: " + LEARNWORLDS_CLIENT_SECRET.length + ")" : "Não"}`);
    
    // Preparar o corpo da requisição conforme documentação
    const requestBody = {
      client_id: LEARNWORLDS_CLIENT_ID,
      client_secret: LEARNWORLDS_CLIENT_SECRET,
      grant_type: "client_credentials"
    };
    
    // Construir a URL correta do endpoint de token OAuth
    // Usar URL da documentação: https://grupozayneducacional.com.br/admin/api/oauth2/access_token
    const tokenUrl = `${LEARNWORLDS_API_BASE_URL}/oauth2/access_token`;
    
    console.log(`Solicitando token OAuth em: ${tokenUrl}`);
    
    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lw-Client": LEARNWORLDS_SCHOOL_ID
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(15000)
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error(`Erro ao obter token OAuth: ${tokenResponse.status}`, errorText);
      
      // Tentar determinar se é um problema de URL
      if (errorText.includes("<html") || errorText.includes("<!DOCTYPE")) {
        console.error("Recebeu HTML em vez de JSON. URL pode estar incorreta.");
        
        // Tentar URL alternativa como fallback
        console.log("Tentando URL de fallback para OAuth...");
        const fallbackUrl = `https://grupozayneducacional.com.br/admin/api/oauth2/access_token`;
        
        const fallbackResponse = await fetch(fallbackUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Lw-Client": LEARNWORLDS_SCHOOL_ID
          },
          body: JSON.stringify(requestBody),
          signal: AbortSignal.timeout(15000)
        });
        
        if (!fallbackResponse.ok) {
          const fallbackError = await fallbackResponse.text();
          console.error(`Fallback também falhou: ${fallbackResponse.status}`, fallbackError);
          throw new Error(`Falha ao obter token OAuth: ${tokenResponse.status} - ${errorText}`);
        }
        
        const fallbackData = await fallbackResponse.json();
        const fallbackToken = fallbackData.access_token || fallbackData.tokenData?.access_token;
        
        if (!fallbackToken) {
          console.error("Resposta de fallback inválida:", fallbackData);
          throw new Error("Resposta de token OAuth do fallback não contém access_token");
        }
        
        console.log("Token OAuth obtido com sucesso via fallback URL");
        oauthToken = fallbackToken;
        
        // Calcular a expiração
        const expiresIn = fallbackData.expires_in || fallbackData.tokenData?.expira_em || 3600;
        oauthTokenExpiry = Date.now() + (expiresIn * 1000);
        
        return oauthToken;
      }
      
      throw new Error(`Falha ao obter token OAuth: ${tokenResponse.status} - ${errorText}`);
    }
    
    const tokenData = await tokenResponse.json();
    console.log("Resposta do token OAuth:", JSON.stringify({
      ...tokenData,
      access_token: tokenData.access_token ? `${tokenData.access_token.substring(0, 10)}...` : undefined,
      tokenData: tokenData.tokenData ? {
        ...tokenData.tokenData,
        access_token: tokenData.tokenData.access_token ? `${tokenData.tokenData.access_token.substring(0, 10)}...` : undefined
      } : undefined
    }));
    
    // Na resposta do exemplo, o acesso está em tokenData.tokenData.access_token
    // Tentaremos os dois formatos conforme a documentação
    const accessToken = tokenData.access_token || tokenData.tokenData?.access_token;
    
    if (!accessToken) {
      console.error("Resposta de token OAuth inválida:", tokenData);
      throw new Error("Resposta de token OAuth não contém access_token");
    }
    
    console.log("Token OAuth obtido com sucesso");
    oauthToken = accessToken;
    
    // Calcular a expiração com base no expires_in (em segundos)
    const expiresIn = tokenData.expires_in || tokenData.tokenData?.expira_em || 3600;
    oauthTokenExpiry = Date.now() + (expiresIn * 1000);
    console.log(`Token OAuth válido até: ${new Date(oauthTokenExpiry).toISOString()} (${expiresIn} segundos)`);
    
    return oauthToken;
  } catch (error) {
    console.error("Erro ao obter token OAuth:", error);
    throw new Error(`Falha ao obter access_token: ${error.message}`);
  }
}

/**
 * Limpa o cache de token OAuth forçando uma nova requisição na próxima vez
 */
export function invalidateOAuthToken(): void {
  console.log("Invalidando token OAuth no cache");
  oauthToken = null;
  oauthTokenExpiry = 0;
}
