
// Implementação de autenticação OAuth para LearnWorlds API
import { LEARNWORLDS_API_BASE_URL, LEARNWORLDS_CLIENT_ID, LEARNWORLDS_CLIENT_SECRET } from './config.ts';

// Cache para o token OAuth
let oauthToken: string | null = null;
let oauthTokenExpiry = 0;

/**
 * Obtém um token OAuth para endpoints que precisam desse método de autenticação
 */
export async function getOAuthToken(): Promise<string> {
  try {
    // Verificar se já temos um token válido em cache
    const now = Date.now();
    if (oauthToken && now < oauthTokenExpiry - 60000) { // 1 minuto de margem de segurança
      console.log("Usando token OAuth em cache");
      return oauthToken;
    }
    
    console.log("Obtendo novo token OAuth...");
    
    if (!LEARNWORLDS_CLIENT_ID || !LEARNWORLDS_CLIENT_SECRET) {
      throw new Error("LEARNWORLDS_CLIENT_ID ou LEARNWORLDS_CLIENT_SECRET não configurados");
    }
    
    // Montar o corpo da requisição no formato URL-encoded
    const body = new URLSearchParams();
    body.append("grant_type", "client_credentials");
    body.append("client_id", LEARNWORLDS_CLIENT_ID);
    body.append("client_secret", LEARNWORLDS_CLIENT_SECRET);
    
    // Fazer a requisição para o endpoint de token
    const baseApiUrl = LEARNWORLDS_API_BASE_URL || "https://api.learnworlds.com";
    const tokenUrl = `${baseApiUrl.split('/admin/api')[0]}/admin/api/oauth/token`;
    console.log(`Solicitando token em: ${tokenUrl}`);
    
    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: body.toString(),
      signal: AbortSignal.timeout(10000)
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error(`Erro ao obter token OAuth: ${tokenResponse.status}`, errorText);
      throw new Error(`Falha ao obter token OAuth: ${tokenResponse.status} - ${errorText}`);
    }
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      console.error("Resposta de token OAuth inválida:", tokenData);
      throw new Error("Resposta de token OAuth não contém access_token");
    }
    
    console.log("Token OAuth obtido com sucesso");
    oauthToken = tokenData.access_token;
    oauthTokenExpiry = Date.now() + ((tokenData.expires_in || 3600) * 1000);
    
    return oauthToken;
  } catch (error) {
    console.error("Erro ao obter token OAuth:", error);
    throw new Error(`Falha ao obter access_token: ${error.message}`);
  }
}
