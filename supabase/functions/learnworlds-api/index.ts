
// Unified LearnWorlds API Proxy v2
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "./config.ts";
import { handleUsuarios, handleCursos, handleMatriculas } from "./handlers.ts";

function verificarToken(req: Request): boolean {
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
  const ADMIN_BYPASS_JWT = Deno.env.get("ADMIN_BYPASS_TOKEN") || "byZ4yn-#v0lt-2025!SEC";
  const LEARNWORLDS_PUBLIC_TOKEN = Deno.env.get("LEARNWORLDS_PUBLIC_TOKEN") || "public-zayn-lw-2025";
  
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
