
// Implementação de autenticação OAuth para LearnWorlds API
import { LEARNWORLDS_API_BASE_URL, LEARNWORLDS_CLIENT_ID, LEARNWORLDS_CLIENT_SECRET, LEARNWORLDS_SCHOOL_ID } from './config.ts';

// Cache para o token OAuth
let oauthToken: string | null = null;
let oauthTokenExpiry = 0;

/**
 * Obtém um token OAuth para endpoints que precisam desse método de autenticação
 * seguindo a especificação da API LearnWorlds para concessão de credenciais do cliente
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
    
    // Seguindo o formato exato do exemplo da documentação
    const requestBody = {
      client_id: LEARNWORLDS_CLIENT_ID,
      client_secret: LEARNWORLDS_CLIENT_SECRET,
      grant_type: "client_credentials"
    };
    
    // Construir a URL correta do endpoint de token OAuth conforme documentação
    const tokenUrl = `${LEARNWORLDS_API_BASE_URL}/oauth2/access_token`;
    
    console.log(`Solicitando token OAuth em: ${tokenUrl}`);
    
    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lw-Client": LEARNWORLDS_SCHOOL_ID // Adicionar o cabeçalho Lw-Client que é obrigatório
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(10000)
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error(`Erro ao obter token OAuth: ${tokenResponse.status}`, errorText);
      throw new Error(`Falha ao obter token OAuth: ${tokenResponse.status} - ${errorText}`);
    }
    
    const tokenData = await tokenResponse.json();
    console.log("Resposta do token OAuth:", JSON.stringify(tokenData));
    
    // Na resposta do exemplo, o acesso está em tokenData.tokenData.access_token
    const accessToken = tokenData.tokenData?.access_token || tokenData.access_token;
    
    if (!accessToken) {
      console.error("Resposta de token OAuth inválida:", tokenData);
      throw new Error("Resposta de token OAuth não contém access_token");
    }
    
    console.log("Token OAuth obtido com sucesso");
    oauthToken = accessToken;
    
    // Calcular a expiração com base no expires_in (em segundos)
    // No exemplo de resposta, estava em tokenData.tokenData.expira_em
    const expiresIn = tokenData.tokenData?.expira_em || tokenData.expires_in || 8000;
    oauthTokenExpiry = Date.now() + (expiresIn * 1000);
    
    return oauthToken;
  } catch (error) {
    console.error("Erro ao obter token OAuth:", error);
    throw new Error(`Falha ao obter access_token: ${error.message}`);
  }
}
