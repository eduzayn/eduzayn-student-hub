
// 📦 LearnWorlds API Configurações Globais (config.ts)
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info, School-Id, X-API-Version, X-Use-OAuth, Lw-Client",
  "Access-Control-Allow-Credentials": "true",
  "Content-Type": "application/json"
};

// 🔐 Tokens de autenticação
export const ADMIN_BYPASS_JWT = Deno.env.get("ADMIN_BYPASS_TOKEN") || "byZ4yn-#v0lt-2025!SEC";
export const LEARNWORLDS_PUBLIC_TOKEN = Deno.env.get("LEARNWORLDS_PUBLIC_TOKEN") || "public-zayn-lw-2025";
export const LEARNWORLDS_API_KEY = Deno.env.get("LEARNWORLDS_API_KEY") || "8BtSujQd7oBzSgJIWAeNtjYrmfeWHCZSBIXTGRpR";

// 🧾 OAuth2 Credentials
export const LEARNWORLDS_CLIENT_ID = Deno.env.get("LEARNWORLDS_CLIENT_ID") || "66abb5fdf8655b4b800c7278";
export const LEARNWORLDS_CLIENT_SECRET = Deno.env.get("LEARNWORLDS_CLIENT_SECRET") || "835mPsiAJ6jqdQJNdnBeyfggOd7VAAOavPFxluR86D48xXOAPp";

// 🏫 Identificador da Escola no LearnWorlds
export const LEARNWORLDS_SCHOOL_ID = Deno.env.get("LEARNWORLDS_SCHOOL_ID") || "grupozayneducacional";

// 🌐 URLs da API do LearnWorlds
export const LEARNWORLDS_API_BASE_URL = Deno.env.get("LEARNWORLDS_API_URL") || "https://api.learnworlds.com";
export const LEARNWORLDS_SCHOOL_API_URL = Deno.env.get("LEARNWORLDS_SCHOOL_API_URL") || "https://grupozayneducacional.com.br/admin/api";

// 📆 Regras de controle de matrícula
export const PRAZO_BLOQUEIO_DIAS = 30; // dias para bloqueio por inadimplência
export const PRAZO_CANCELAMENTO_DIAS = 90; // dias para cancelamento automático
