
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
    const courseId = pathParts.length > 1 ? pathParts[1] : null;
    
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
    
    const isUserWithCourse = pathParts.length >= 3 && pathParts[1] === "courses";
    const isSingleUser = pathParts.length >= 2 && !isUserWithCourse;
    const userId = isSingleUser || isUserWithCourse ? pathParts[1] : null;
    
    console.log("isUserWithCourse:", isUserWithCourse, "isSingleUser:", isSingleUser, "userId:", userId);
    
    // Construir o caminho da API baseado na requisição (adaptado para API v2)
    let apiPath = "users";
    
    if (isUserWithCourse) {
      // Caso: /users/{userId}/courses/{courseId?}
      apiPath = `users/${userId}/enrollments`;
      if (pathParts.length >= 4) {
        apiPath += `?course_id=${pathParts[3]}`; // Filtrar por course_id na API v2
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
      
      // Adicionar parâmetros para e-mail específico se fornecido
      if (params.has("email")) {
        const email = params.get("email");
        apiPath += `&email=${email}`;
      }
    }
    
    // Processar corpo da requisição para métodos não-GET
    let body = null;
    if (req.method === "POST" || req.method === "PUT") {
      body = await req.json().catch(() => null);
    }
    
    console.log(`Chamando API LearnWorlds: ${apiPath} (método: ${req.method})`);
    
    // Usuários sempre exigem OAuth na API v2
    const useOAuth = true;
    const result = await callLearnWorldsApi(apiPath, req.method, body, useOAuth);
    
    // Retornar resposta com cabeçalhos CORS adequados
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

/**
 * Gerencia requisições de matrículas
 */
export async function handleMatriculas(req: Request, path: string): Promise<Response> {
  try {
    console.log(`Processando requisição de matrículas: ${req.method} ${path}`);
    
    // Determinar tipo de operação baseado no path e método
    const pathParts = path.split("/").filter((p) => p);
    
    // Para endpoints de matrículas, sempre usamos OAuth
    const useOAuth = true;
    
    // Caso: matrícula de usuário em curso (POST /enrollments)
    if (req.method === "POST") {
      const body = await req.json().catch(() => null);
      if (!body) {
        throw new Error("Corpo da requisição inválido");
      }
      
      // Endpoint para matrícula de usuário em curso
      const apiPath = "enrollments";
      
      console.log(`Chamando API LearnWorlds para matrícula: ${apiPath}`);
      console.log("Dados da matrícula:", JSON.stringify(body));
      
      const result = await callLearnWorldsApi(apiPath, "POST", body, useOAuth);
      
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    // Caso: verificar matrícula de usuário em curso
    else if (req.method === "GET" && pathParts.includes("enrollments")) {
      const url = new URL(req.url);
      const userId = url.searchParams.get("user_id");
      const courseId = url.searchParams.get("course_id");
      
      if (!userId || !courseId) {
        throw new Error("Parâmetros user_id e course_id são obrigatórios");
      }
      
      // Endpoint para verificar matrícula
      const apiPath = `users/${userId}/enrollments?course_id=${courseId}`;
      
      console.log(`Chamando API LearnWorlds para verificar matrícula: ${apiPath}`);
      
      const result = await callLearnWorldsApi(apiPath, "GET", null, useOAuth);
      
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // Endpoint não reconhecido
    return new Response(JSON.stringify({ error: "Endpoint de matrícula não suportado" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error(`Erro ao processar requisição de matrícula: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}
