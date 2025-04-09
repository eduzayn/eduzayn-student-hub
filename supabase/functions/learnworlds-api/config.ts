
// Configurações e constantes para a função edge LearnWorlds API

// Cabeçalhos CORS padrão - EXPANDIDOS para aceitar mais origens e cabeçalhos
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info, School-Id, X-API-Version, X-Use-OAuth, Lw-Client",
  "Access-Control-Allow-Credentials": "true",
  "Content-Type": "application/json"
};

// Token de bypass para admin (mantido para compatibilidade)
export const ADMIN_BYPASS_JWT = Deno.env.get("ADMIN_BYPASS_TOKEN") || "byZ4yn-#v0lt-2025!SEC";

// Credenciais e configurações do LearnWorlds
export const LEARNWORLDS_API_KEY = Deno.env.get("LEARNWORLDS_API_KEY") || "8BtSujQd7oBzSgJIWAeNtjYrmfeWHCZSBIXTGRpR";

// School ID da escola no LearnWorlds
export const LEARNWORLDS_SCHOOL_ID = Deno.env.get("LEARNWORLDS_SCHOOL_ID") || "grupozayneducacional";

// URL base da API conforme documentação - CORRIGIDA
export const LEARNWORLDS_API_BASE_URL = Deno.env.get("LEARNWORLDS_API_URL") || "https://grupozayneducacional.com.br/admin/api";

// Credenciais OAuth (Client ID e Client Secret)
export const LEARNWORLDS_CLIENT_ID = Deno.env.get("LEARNWORLDS_CLIENT_ID") || "66abb5fdf8655b4b800c7278";
export const LEARNWORLDS_CLIENT_SECRET = Deno.env.get("LEARNWORLDS_CLIENT_SECRET") || "835mPsiAJ6jqdQJNdnBeyfggOd7VAAOavPFxluR86D48xXOAPp";

// Log de inicialização
console.log("Inicializando função edge learnworlds-api");
console.log("Token de administrador:", ADMIN_BYPASS_JWT ? (ADMIN_BYPASS_JWT.substring(0, 4) + "...") : "Não configurado ✗");
console.log("API Key LearnWorlds:", LEARNWORLDS_API_KEY ? "Configurado ✓" : "Não configurado ✗");
console.log("Client ID LearnWorlds:", LEARNWORLDS_CLIENT_ID ? "Configurado ✓" : "Não configurado ✗");
console.log("Client Secret LearnWorlds:", LEARNWORLDS_CLIENT_SECRET ? "Configurado ✓" : "Não configurado ✗");
console.log("School ID LearnWorlds:", LEARNWORLDS_SCHOOL_ID ? "Configurado ✓" : "Não configurado ✗");
console.log("URL base da API LearnWorlds:", LEARNWORLDS_API_BASE_URL);
