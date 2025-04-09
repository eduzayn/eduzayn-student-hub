
// Configurações e constantes para a função edge LearnWorlds API

// Cabeçalhos CORS padrão
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info, School-Id, X-API-Version, X-Use-OAuth",
  "Content-Type": "application/json"
};

// Credenciais e configurações
export const ADMIN_BYPASS_JWT = Deno.env.get("ADMIN_BYPASS_TOKEN") || "byZ4yn-#v0lt-2025!SEC"; // Token de bypass para admin
export const LEARNWORLDS_API_KEY = Deno.env.get("LEARNWORLDS_API_KEY") || "YEmshZGseUQgbCuLyb9WeYUnHrpq91yuUk3Dx4nN";
export const LEARNWORLDS_SCHOOL_ID = Deno.env.get("LEARNWORLDS_SCHOOL_ID") || "grupozayneducacional";
export const LEARNWORLDS_API_BASE_URL = Deno.env.get("LEARNWORLDS_API_URL") || "https://api.learnworlds.com/v2";
export const LEARNWORLDS_CLIENT_ID = Deno.env.get("LEARNWORLDS_CLIENT_ID");
export const LEARNWORLDS_CLIENT_SECRET = Deno.env.get("LEARNWORLDS_CLIENT_SECRET");

// Log de inicialização
console.log("Inicializando função edge learnworlds-api");
console.log("Token de administrador:", ADMIN_BYPASS_JWT ? (ADMIN_BYPASS_JWT.substring(0, 4) + "...") : "Não configurado ✗");
console.log("API Key LearnWorlds:", LEARNWORLDS_API_KEY ? "Configurado ✓" : "Não configurado ✗");
console.log("Client ID LearnWorlds:", LEARNWORLDS_CLIENT_ID ? "Configurado ✓" : "Não configurado ✗");
console.log("Client Secret LearnWorlds:", LEARNWORLDS_CLIENT_SECRET ? "Configurado ✓" : "Não configurado ✗");
console.log("School ID LearnWorlds:", LEARNWORLDS_SCHOOL_ID ? "Configurado ✓" : "Não configurado ✗");
console.log("URL base da API LearnWorlds:", LEARNWORLDS_API_BASE_URL);
