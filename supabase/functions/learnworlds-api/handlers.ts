
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
    const isSingleCourse = pathParts.length >= 1;
    const courseId = isSingleCourse && pathParts.length > 0 ? pathParts[0] : null;
    
    console.log("Path parts:", pathParts, "isSingleCourse:", isSingleCourse, "courseId:", courseId);
    
    let apiPath = "/admin/api/v2/courses";
    if (courseId) {
      apiPath += `/${courseId}`;
    } else {
      // Adicionar parâmetros de consulta para listagem
      const page = params.get("page") || "1";
      const limit = params.get("limit") || "20";
      apiPath += `?page=${page}&limit=${limit}`;
      
      // Adicionar outros parâmetros de consulta se presentes
      if (params.has("q")) {
        apiPath += `&q=${params.get("q")}`;
      }
      
      if (params.has("categories")) {
        apiPath += `&categories=${params.get("categories")}`;
      }
    }
    
    console.log(`Chamando API LearnWorlds: ${apiPath}`);
    
    // Realizar a chamada à API do LearnWorlds
    // Não usamos OAuth para endpoints de cursos
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
    
    // Construir o caminho da API com base na requisição
    let apiPath = "/admin/api/v2/users";
    
    if (isUserWithCourse) {
      // Caso: /users/{userId}/courses/{courseId?}
      apiPath = `/admin/api/v2/users/${userId}/courses`;
      if (pathParts.length >= 3) {
        apiPath += `/${pathParts[2]}`; // courseId
      }
    } else if (isSingleUser) {
      // Caso: /users/{userId}
      apiPath += `/${userId}`;
    } else {
      // Caso: /users (listar todos)
      const page = params.get("page") || "1";
      const limit = params.get("limit") || "20";
      apiPath += `?page=${page}&limit=${limit}`;
      
      // Adicionar outros parâmetros se presentes
      if (params.has("q")) {
        apiPath += `&q=${params.get("q")}`;
      }
    }
    
    // Processar corpo da requisição para métodos não-GET
    let body = null;
    if (req.method === "POST" || req.method === "PUT") {
      body = await req.json().catch(() => null);
    }
    
    console.log(`Chamando API LearnWorlds: ${apiPath} (método: ${req.method})`);
    
    // Usuários exigem OAuth
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
