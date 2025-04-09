
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders, ADMIN_BYPASS_JWT } from './config.ts';
import { 
  handleCoursesRequest, 
  handleCourseDetailsRequest, 
  handleUsersRequest, 
  handleCreateUserRequest,
  handleAdminRequest
} from './handlers.ts';
import './status.ts';  // Importa o arquivo de status apenas para disponibilizar a função

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.split("/learnworlds-api/")[1];
  const method = req.method;

  // Verificação do token de autenticação
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
  
  console.log(`Token recebido: ${token ? token.substring(0, 10) + "..." : "nenhum"}`);
  console.log(`Token esperado: ${ADMIN_BYPASS_JWT ? ADMIN_BYPASS_JWT.substring(0, 10) + "..." : "nenhum"}`);
  
  if (!ADMIN_BYPASS_JWT || token !== ADMIN_BYPASS_JWT) {
    console.log("Token inválido - nenhuma correspondência encontrada");
    
    return new Response(JSON.stringify({
      code: 401,
      message: "Token JWT inválido"
    }), {
      headers: corsHeaders,
      status: 401
    });
  }

  console.log(`Autenticação bem-sucedida com token de bypass admin`);

  try {
    // Rotas GET
    if (method === "GET") {
      // Rota para cursos
      if (path === "courses" || path.startsWith("courses?")) {
        return await handleCoursesRequest(url);
      }
      
      // Rota para detalhes de curso específico
      if (path.startsWith("courses/")) {
        return await handleCourseDetailsRequest(path);
      }
      
      // Rota para usuários
      if (path === "users" || path.startsWith("users?")) {
        return await handleUsersRequest(url);
      }
      
      // Rota não implementada
      return new Response(JSON.stringify({
        message: "Endpoint não implementado",
        path
      }), {
        headers: corsHeaders,
        status: 404
      });
    } 
    
    // Rotas POST
    else if (method === "POST") {
      const body = await req.json();
      
      console.log(`Recebido POST para ${path} com corpo:`, JSON.stringify(body).substring(0, 200) + "...");
      
      // Rota para criar usuários
      if (path === "users") {
        return await handleCreateUserRequest(body);
      }
      
      // Outros endpoints POST (como sincronização)
      if (path.startsWith("admin/")) {
        return await handleAdminRequest(path, body);
      }
      
      // POST endpoint não reconhecido
      return new Response(JSON.stringify({
        message: "POST endpoint não reconhecido",
        path
      }), {
        headers: corsHeaders,
        status: 404
      });
    }

    // Método não suportado
    return new Response(JSON.stringify({
      error: "Método não suportado"
    }), {
      headers: corsHeaders,
      status: 405
    });
  } catch (error) {
    console.error("Erro na execução:", error);
    return new Response(JSON.stringify({
      error: error.message || "Erro interno"
    }), {
      headers: corsHeaders,
      status: 500
    });
  }
});
