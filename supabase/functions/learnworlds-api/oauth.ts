
// 🔐 oauth.ts - Gerenciador de Token OAuth2 da LearnWorlds
import {
  LEARNWORLDS_CLIENT_ID,
  LEARNWORLDS_CLIENT_SECRET,
  LEARNWORLDS_SCHOOL_ID,
  corsHeaders
} from "./config.ts";

let cachedToken: string | null = null;
let tokenExpiration: number | null = null;

/**
 * Obtém um access_token OAuth2 válido da LearnWorlds
 */
export async function getAccessToken(): Promise<string> {
  const now = Date.now();
  
  // Verificar se já temos um token válido em cache
  if (cachedToken && tokenExpiration && now < tokenExpiration) {
    console.log("Usando token OAuth em cache com validade até:", new Date(tokenExpiration).toISOString());
    return cachedToken;
  }

  console.log(`Solicitando novo token OAuth para escola ${LEARNWORLDS_SCHOOL_ID}...`);
  
  try {
    // URL correta para a API V2 do LearnWorlds
    const tokenUrl = `https://${LEARNWORLDS_SCHOOL_ID}.learnworlds.com/api/v2/oauth2/token`;

    // Corpo da requisição no formato correto para API V2
    const formData = new URLSearchParams({
      client_id: LEARNWORLDS_CLIENT_ID,
      client_secret: LEARNWORLDS_CLIENT_SECRET,
      grant_type: "client_credentials"
    });

    // Fazendo a requisição com os cabeçalhos corretos
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
        "Lw-Client": LEARNWORLDS_SCHOOL_ID
      },
      body: formData.toString()
    });

    const data = await response.json();
    console.log("Resposta da API OAuth:", JSON.stringify(data).slice(0, 100) + "...");

    // Verificar se a resposta contém o token
    if (!response.ok || !data.access_token) {
      console.error("Erro na resposta OAuth:", data);
      throw new Error(`Erro ao obter token OAuth2: ${data.error || data.message || JSON.stringify(data)}`);
    }

    // Armazenar o token em cache (90% da validade)
    cachedToken = data.access_token;
    tokenExpiration = now + (data.expires_in * 1000 * 0.9);
    
    console.log(`Token OAuth obtido com sucesso. Expira em: ${data.expires_in}s`);
    return cachedToken;
  } catch (error) {
    console.error("❌ Erro na solicitação de token OAuth2:", error);
    
    // Tentar usar o token estático de backup se disponível
    const backupToken = Deno.env.get("LEARNWORLDS_OAUTH_TOKEN");
    if (backupToken) {
      console.log("⚠️ Usando token OAuth estático de backup");
      cachedToken = backupToken;
      tokenExpiration = now + (3600 * 1000); // Assumir 1 hora de validade
      return backupToken;
    }
    
    throw new Error("Falha ao obter access_token");
  }
}

// Exportar com nome compatível para ambas as APIs
export const getOAuthToken = getAccessToken;
