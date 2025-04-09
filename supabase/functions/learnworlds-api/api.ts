
// 🌐 API LearnWorlds - Wrapper de Requisições com OAuth2 (api.ts)
import { 
  LEARNWORLDS_API_BASE_URL, 
  LEARNWORLDS_API_KEY, 
  LEARNWORLDS_SCHOOL_ID, 
  corsHeaders 
} from "./config.ts";
import { getAccessToken } from "./oauth.ts";

// Verifica se resposta da API é HTML (erro comum em credenciais malformadas)
function isHtml(content: string): boolean {
  return content.includes("<html") || content.includes("<!DOCTYPE html>");
}

// Função principal de requisições para a API do LearnWorlds
export async function callLearnWorldsApi(
  path: string,
  method: string = "GET",
  body: any = null,
  usarOAuth: boolean = false
): Promise<any> {
  // Construir URL com base no novo formato da API v2
  const url = `${LEARNWORLDS_API_BASE_URL}/api/v2/${path.startsWith("/") ? path.substring(1) : path}`;
  console.log(`🌍 Requisição LearnWorlds → ${method} ${url}`);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Lw-Client": LEARNWORLDS_SCHOOL_ID
  };

  if (usarOAuth) {
    try {
      const token = await getAccessToken();
      headers["Authorization"] = `Bearer ${token}`;
      console.log("✅ Token OAuth adicionado aos cabeçalhos");
    } catch (e) {
      console.error("❌ Falha ao obter token OAuth:", e.message);
      throw new Error("Falha ao obter token OAuth");
    }
  } else {
    headers["Authorization"] = `Bearer ${LEARNWORLDS_API_KEY}`;
    console.log("✅ Token API Key adicionado aos cabeçalhos");
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body && method !== "GET") {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get("content-type") || "";
    const text = await res.text();

    if (!res.ok) {
      console.error(`❌ Erro na resposta da API: ${res.status}`, text.substring(0, 200));
      throw new Error(`Erro LearnWorlds API: ${res.status} ${text}`);
    }

    if (isHtml(text)) {
      console.error("⚠️ Resposta inesperada em HTML:", text.slice(0, 300));
      throw new Error("API retornou HTML. Verifique suas credenciais ou rota.");
    }

    try {
      return JSON.parse(text);
    } catch (err) {
      console.error("⚠️ Erro ao parsear JSON:", err);
      throw new Error("Resposta não é um JSON válido");
    }
  } catch (e) {
    console.error("❌ Erro geral na chamada à API LearnWorlds:", e.message);
    throw e;
  }
}
