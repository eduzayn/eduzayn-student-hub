
// Função de borda para interagir com a API do LearnWorlds
import { corsHeaders } from "./config.ts";
import { handleCursos, handleUsuarios, handleMatriculas } from "./handlers.ts";
import { ADMIN_BYPASS_JWT, LEARNWORLDS_API_BASE_URL } from "./config.ts";

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
    // Tratar requisições preflight OPTIONS primeiro, antes de qualquer outra lógica
    if (req.method === "OPTIONS") {
      console.log("Recebendo requisição OPTIONS - respondendo com cabeçalhos CORS");
      return handleOptions();
    }

    // Log do caminho da solicitação para diagnóstico
    const url = new URL(req.url);
    console.log(`Recebendo solicitação: ${req.method} ${url.pathname} ${url.search}`);
    console.log(`Usando URL base da API LearnWorlds: ${LEARNWORLDS_API_BASE_URL}`);
    
    // Extrair componentes da URL
    let path = url.pathname;
    
    // Log do path original para diagnóstico
    console.log("Path original:", path);
    
    // Remover duplicação de "/learnworlds-api" e variações
    if (path.includes("learnworlds-api")) {
      path = path.replace(/.*\/learnworlds-api\/?/, "/");
      if (!path.startsWith("/")) {
        path = "/" + path;
      }
    }
    
    // Log do path normalizado
    console.log("Path normalizado:", path);
    console.log("Parâmetros de consulta:", url.search);
    
    console.log(`Processando requisição: ${req.method} ${path}${url.search}`);

    // Verificar autenticação
    if (!verificarToken(req)) {
      return new Response(JSON.stringify({ code: 401, message: "Token JWT inválido" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Processar requisição com base no path normalizado
    if (path.startsWith("/users")) {
      // Adicionar parâmetros de consulta ao path passado para o manipulador
      return await handleUsuarios(req, `${path}${url.search}`);
    } 
    else if (path.startsWith("/courses")) {
      // Adicionar parâmetros de consulta ao path passado para o manipulador
      return await handleCursos(req, `${path}${url.search}`);
    }
    else if (path.startsWith("/enrollments") || path.includes("/enrollments")) {
      // Manipular requisições de matrícula
      return await handleMatriculas(req, `${path}${url.search}`);
    }
    else {
      return new Response(JSON.stringify({ error: "Endpoint não encontrado", path: path }), {
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
