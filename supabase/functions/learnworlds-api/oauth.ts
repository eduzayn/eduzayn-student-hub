
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
  if (cachedToken && tokenExpiration && now < tokenExpiration) {
    return cachedToken;
  }

  const tokenUrl = `https://${LEARNWORLDS_SCHOOL_ID}.learnworlds.com/admin/api/oauth2/access_token`;

  const body = {
    client_id: LEARNWORLDS_CLIENT_ID,
    client_secret: LEARNWORLDS_CLIENT_SECRET,
    grant_type: "client_credentials"
  };

  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lw-Client": LEARNWORLDS_SCHOOL_ID
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok || !data.access_token) {
      throw new Error(`Erro ao obter token OAuth2: ${data.error || JSON.stringify(data)}`);
    }

    // Armazenar em cache por segurança (90% da validade informada)
    cachedToken = data.access_token;
    tokenExpiration = now + (data.expires_in * 1000 * 0.9);

    return cachedToken;
  } catch (error) {
    console.error("Erro na solicitação de token OAuth2:", error);
    throw new Error("Falha ao obter access_token");
  }
}
