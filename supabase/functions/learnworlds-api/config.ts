
// ============================================================================
// 📦 Configurações e constantes globais para a função Edge da API LearnWorlds
// ============================================================================

// 🔐 Cabeçalhos CORS (ampliados para compatibilidade com sistemas externos)
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, apikey, x-client-info, School-Id, X-API-Version, X-Use-OAuth, Lw-Client",
  "Access-Control-Allow-Credentials": "true",
  "Content-Type": "application/json"
};

// ============================================================================
// 🔐 Tokens e credenciais
// ============================================================================

// Token de bypass administrativo para chamadas internas (ex: testes locais)
export const ADMIN_BYPASS_JWT =
  Deno.env.get("ADMIN_BYPASS_TOKEN") || "byZ4yn-#v0lt-2025!SEC";

// Token público para chamadas GET
export const LEARNWORLDS_PUBLIC_TOKEN = 
  Deno.env.get("LEARNWORLDS_PUBLIC_TOKEN") || "public-zayn-lw-2025";

// Token de acesso estático (deprecated - usar OAuth2 quando possível)
export const LEARNWORLDS_API_KEY =
  Deno.env.get("LEARNWORLDS_API_KEY") || "8BtSujQd7oBzSgJIWAeNtjYrmfeWHCZSBIXTGRpR";

// Credenciais OAuth2 (obrigatórias para uso real da API)
export const LEARNWORLDS_CLIENT_ID =
  Deno.env.get("LEARNWORLDS_CLIENT_ID") || "66abb5fdf8655b4b800c7278";

export const LEARNWORLDS_CLIENT_SECRET =
  Deno.env.get("LEARNWORLDS_CLIENT_SECRET") || "835mPsiAJ6jqdQJNdnBeyfggOd7VAAOavPFxluR86D48xXOAPp";

// ID da escola LearnWorlds (normalmente parte da URL da escola)
export const LEARNWORLDS_SCHOOL_ID =
  Deno.env.get("LEARNWORLDS_SCHOOL_ID") || "grupozayneducacional";

// URL base da API v2 da LearnWorlds
export const LEARNWORLDS_API_BASE_URL =
  Deno.env.get("LEARNWORLDS_API_URL") || "https://api.learnworlds.com";

// ============================================================================
// 🧪 Log de diagnóstico (inicialização)
// ============================================================================
console.log("🔧 Inicializando função Edge [learnworlds-api]...");
console.log("🔑 Token de administrador:", ADMIN_BYPASS_JWT ? "✔️ Configurado" : "❌ Não configurado");
console.log("🔑 Token público:", LEARNWORLDS_PUBLIC_TOKEN ? "✔️ Configurado" : "❌ Não configurado");
console.log("🔑 API Key:", LEARNWORLDS_API_KEY ? "✔️ Configurada" : "❌ Não configurada");
console.log("🧾 OAuth Client ID:", LEARNWORLDS_CLIENT_ID ? "✔️" : "❌");
console.log("🔐 OAuth Client Secret:", LEARNWORLDS_CLIENT_SECRET ? "✔️" : "❌");
console.log("🏫 School ID:", LEARNWORLDS_SCHOOL_ID || "❌ Não definido");
console.log("🌐 API Base URL:", LEARNWORLDS_API_BASE_URL || "❌ Não definido");
