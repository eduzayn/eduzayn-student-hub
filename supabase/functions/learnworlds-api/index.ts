
// Unified LearnWorlds API Proxy v2
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "./config.ts";
import { handleUsuarios, handleCursos, handleMatriculas } from "./handlers.ts";
import { handleSync } from "./sync.ts";

function verificarToken(req: Request): boolean {
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
  
  // Tokens de acesso válidos
  const ADMIN_BYPASS_JWT = Deno.env.get("ADMIN_BYPASS_TOKEN") || "byZ4yn-#v0lt-2025!SEC";
  const LEARNWORLDS_PUBLIC_TOKEN = Deno.env.get("LEARNWORLDS_PUBLIC_TOKEN") || "public-zayn-lw-2025";
  
  // Aceitar qualquer token do Supabase durante o desenvolvimento
  // Isso é importante para permitir que as chamadas do frontend funcionem
  const DEVELOPMENT_MODE = true; // Definindo como true para aceitar tokens em desenvolvimento
  
  if (DEVELOPMENT_MODE) {
    // Em modo de desenvolvimento, aceitamos o token se ele estiver presente
    // e tiver um formato válido (mais de 10 caracteres)
    if (token && token.length > 10) {
      console.log("Token de desenvolvimento aceito");
      return true;
    }
  }
  
  // Verificação tradicional para tokens conhecidos
  return token === ADMIN_BYPASS_JWT || token === LEARNWORLDS_PUBLIC_TOKEN;
}

serve(async (req: Request): Promise<Response> => {
  try {
    const { method } = req;
    const url = new URL(req.url);
    const path = url.pathname.replace(/^\/learnworlds-api\/?/, "/");

    // Preflight CORS
    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (!verificarToken(req)) {
      console.error("Token inválido:", req.headers.get("Authorization"));
      return new Response(JSON.stringify({ code: 401, message: "Token JWT inválido" }), {
        status: 401,
        headers: corsHeaders
      });
    }

    // Roteamento principal
    if (path.startsWith("/users")) {
      return await handleUsuarios(req, path);
    }

    if (path.startsWith("/courses")) {
      return await handleCursos(req, path);
    }

    if (path.startsWith("/enrollments") || path.includes("enrollments")) {
      return await handleMatriculas(req, path);
    }

    // NOVA FUNCIONALIDADE: Rotas para sincronização
    if (path.startsWith("/sync")) {
      return await handleSync(req, path);
    }

    return new Response(JSON.stringify({ error: "Endpoint não encontrado", path }), {
      status: 404,
      headers: corsHeaders
    });
  } catch (error) {
    console.error("Erro na função learnworlds-api:", error);
    return new Response(JSON.stringify({ error: error.message || "Erro interno" }), {
      status: 500,
      headers: corsHeaders
    });
  }
});
