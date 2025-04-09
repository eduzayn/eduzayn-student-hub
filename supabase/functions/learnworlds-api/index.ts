
// Função de borda para interagir com a API do LearnWorlds
import { corsHeaders } from "./config.ts";
import { handleCursos, handleUsuarios } from "./handlers.ts";
import { ADMIN_BYPASS_JWT } from "./config.ts";

// Responde às requisições OPTIONS para CORS
const handleOptions = () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};

// Verifica o token de autenticação
const verificarToken = (req: Request): boolean => {
  // Extrair o token do cabeçalho Authorization
  const authHeader = req.headers.get("Authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    console.log("Token não fornecido ou formato inválido");
    return false;
  }

  const token = authHeader.substring(7); // Remover "Bearer "
  console.log("Token recebido:", token.substring(0, 4) + "...");
  console.log("Token esperado:", ADMIN_BYPASS_JWT.substring(0, 4) + "...");
  
  // Verificar se o token corresponde ao token bypass do administrador
  if (token === ADMIN_BYPASS_JWT) {
    console.log("Token de administrador válido");
    return true;
  }

  console.log("Token inválido");
  return false;
};

// Configura o manipulador Deno para a função de borda
Deno.serve(async (req) => {
  try {
    // Responder a solicitações OPTIONS para CORS
    if (req.method === "OPTIONS") {
      return handleOptions();
    }

    // Extrair componentes da URL
    const url = new URL(req.url);
    
    // Corrigir o problema de duplicação de path normalizando o path
    let path = url.pathname;
    
    // Remover duplicação de "/learnworlds-api"
    if (path.startsWith("/learnworlds-api/learnworlds-api")) {
      path = path.replace("/learnworlds-api/learnworlds-api", "/learnworlds-api");
    }
    
    // Remover o prefixo "/learnworlds-api" para processamento
    path = path.replace("/learnworlds-api", "");
    
    console.log(`Recebendo requisição: ${req.method} ${path}`);

    // Verificar autenticação
    if (!verificarToken(req)) {
      return new Response(JSON.stringify({ code: 401, message: "Token JWT inválido" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Processar requisição com base no path normalizado
    if (path.startsWith("/users")) {
      return await handleUsuarios(req, path);
    } 
    else if (path.startsWith("/courses")) {
      return await handleCursos(req, path);
    }
    else {
      return new Response(JSON.stringify({ error: "Endpoint não encontrado" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    console.error(`Erro na função edge: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
