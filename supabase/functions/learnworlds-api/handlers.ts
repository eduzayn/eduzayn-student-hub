
import { corsHeaders } from "./config.ts";
import { callLearnWorldsApi } from "./api.ts";

/**
 * Gerencia requisições relacionadas a cursos
 */
export async function handleCursos(req: Request, path: string): Promise<Response> {
  try {
    console.log(`Processando requisição de cursos: ${req.method} ${path}`);
    const url = new URL(req.url);
    const params = url.searchParams;
    
    // Determinar curso específico se um ID for fornecido
    const pathParts = path.split("/").filter((p) => p);
    const courseId = pathParts.length > 0 ? pathParts[0] : null;
    
    console.log("Path parts:", pathParts, "courseId:", courseId);
    
    // Adaptar para a estrutura de API v2
    let apiPath = "courses";
    if (courseId) {
      apiPath += `/${courseId}`;
    } else {
      // Adaptar parâmetros de consulta para API v2
      const page = params.get("page") || "1";
      const perPage = params.get("limit") || params.get("per_page") || "20";
      apiPath += `?page=${page}&per_page=${perPage}`;
      
      // Adicionar outros parâmetros de consulta se presentes
      if (params.has("q") || params.has("search")) {
        const searchTerm = params.get("q") || params.get("search");
        apiPath += `&search=${searchTerm}`;
      }
      
      if (params.has("categories") || params.has("category")) {
        const category = params.get("categories") || params.get("category");
        apiPath += `&category=${category}`;
      }
    }
    
    console.log(`Chamando API LearnWorlds: ${apiPath}`);
    
    // Realizar a chamada à API do LearnWorlds
    const result = await callLearnWorldsApi(apiPath, "GET", null, false);
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error(`Erro ao processar requisição de cursos: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}

/**
 * Gerencia requisições relacionadas a usuários
 */
export async function handleUsuarios(req: Request, path: string): Promise<Response> {
  try {
    console.log(`Processando requisição de usuários: ${req.method} ${path}`);
    const url = new URL(req.url);
    const params = url.searchParams;

    // Determinar usuário específico se um ID for fornecido
    const pathParts = path.split("/").filter((p) => p);
    console.log("Path parts para usuários:", pathParts);
    
    const isUserWithCourse = pathParts.length >= 2 && pathParts[1] === "courses";
    const isSingleUser = pathParts.length >= 1 && !isUserWithCourse;
    const userId = isSingleUser || isUserWithCourse ? pathParts[0] : null;
    
    console.log("isUserWithCourse:", isUserWithCourse, "isSingleUser:", isSingleUser, "userId:", userId);
    
    // Construir o caminho da API baseado na requisição (adaptado para API v2)
    let apiPath = "users";
    
    if (isUserWithCourse) {
      // Caso: /users/{userId}/courses/{courseId?}
      apiPath = `users/${userId}/enrollments`;
      if (pathParts.length >= 3) {
        apiPath += `?course_id=${pathParts[2]}`; // Filtrar por course_id na API v2
      }
    } else if (isSingleUser) {
      // Caso: /users/{userId}
      apiPath += `/${userId}`;
    } else {
      // Caso: /users (listar todos) - API v2 usa per_page em vez de limit
      const page = params.get("page") || "1";
      const perPage = params.get("limit") || params.get("per_page") || "20";
      apiPath += `?page=${page}&per_page=${perPage}`;
      
      // Adicionar outros parâmetros se presentes
      if (params.has("q") || params.has("search")) {
        const searchTerm = params.get("q") || params.get("search");
        apiPath += `&search=${searchTerm}`;
      }
    }
    
    // Processar corpo da requisição para métodos não-GET
    let body = null;
    if (req.method === "POST" || req.method === "PUT") {
      body = await req.json().catch(() => null);
    }
    
    console.log(`Chamando API LearnWorlds: ${apiPath} (método: ${req.method})`);
    
    // Usuários geralmente exigem OAuth na API v2
    const useOAuth = true;
    const result = await callLearnWorldsApi(apiPath, req.method, body, useOAuth);
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error(`Erro ao processar requisição de usuários: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
