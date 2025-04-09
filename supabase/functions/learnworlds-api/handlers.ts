
// Manipuladores de rota para os diferentes endpoints da API
import { callLearnWorldsApi } from './api.ts';
import { LEARNWORLDS_SCHOOL_ID, corsHeaders } from './config.ts';

/**
 * Manipula requisições para o endpoint de cursos
 */
export async function handleCoursesRequest(url: URL): Promise<Response> {
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "50");
  
  // Para cursos, usamos o token de acesso API Key
  const result = await callLearnWorldsApi(
    `/v2/${LEARNWORLDS_SCHOOL_ID}/courses?page=${page}&limit=${limit}`, 
    'GET', null, false
  );
  
  return new Response(JSON.stringify(result), {
    headers: corsHeaders,
    status: 200
  });
}

/**
 * Manipula requisições para detalhes de um curso específico
 */
export async function handleCourseDetailsRequest(path: string): Promise<Response> {
  const courseId = path.split("courses/")[1];
  
  // Para detalhes do curso, usamos o token de acesso API Key
  const result = await callLearnWorldsApi(
    `/v2/${LEARNWORLDS_SCHOOL_ID}/courses/${courseId}`,
    'GET', null, false
  );
  
  return new Response(JSON.stringify(result), {
    headers: corsHeaders,
    status: 200
  });
}

/**
 * Manipula requisições para o endpoint de usuários
 */
export async function handleUsersRequest(url: URL): Promise<Response> {
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const searchTerm = url.searchParams.get("q") || "";
  
  // Para usuários, precisamos usar OAuth
  const result = await callLearnWorldsApi(
    `/v2/${LEARNWORLDS_SCHOOL_ID}/users?page=${page}&limit=${limit}${searchTerm ? `&q=${encodeURIComponent(searchTerm)}` : ''}`,
    'GET', null, true
  );
  
  return new Response(JSON.stringify(result), {
    headers: corsHeaders,
    status: 200
  });
}

/**
 * Manipula requisições para criar novos usuários
 */
export async function handleCreateUserRequest(body: any): Promise<Response> {
  console.log("Processando criação de usuário na API LearnWorlds");
  
  try {
    const userData = {
      firstName: body.firstName || "",
      lastName: body.lastName || "",
      email: body.email,
      ...(body.phoneNumber && { phoneNumber: body.phoneNumber }),
      ...(body.cpf && { customField1: body.cpf })
    };
    
    console.log("Dados de usuário para LearnWorlds:", userData);
    
    // Para criar usuários, precisamos usar OAuth
    const result = await callLearnWorldsApi(
      `/v2/${LEARNWORLDS_SCHOOL_ID}/users`, 
      "POST", userData, true
    );
    
    console.log("Resposta da criação de usuário:", result);
    
    return new Response(JSON.stringify(result), {
      headers: corsHeaders,
      status: 200
    });
  } catch (learnWorldsError) {
    console.error("Erro ao chamar API LearnWorlds para criar usuário:", learnWorldsError);
    
    return new Response(JSON.stringify({
      error: "Erro ao criar usuário no LearnWorlds",
      message: learnWorldsError.message,
      errorType: "learnworlds_api_error"
    }), {
      headers: corsHeaders,
      status: 500
    });
  }
}

/**
 * Manipula endpoints administrativos do LearnWorlds
 */
export async function handleAdminRequest(path: string, body: any): Promise<Response> {
  try {
    // Para endpoints administrativos, usar OAuth
    const result = await callLearnWorldsApi(
      `/v2/${LEARNWORLDS_SCHOOL_ID}${path.substring("admin".length)}`,
      "POST", body, true
    );
    
    return new Response(JSON.stringify(result), {
      headers: corsHeaders,
      status: 200
    });
  } catch (apiError) {
    console.error("Erro na chamada para API LearnWorlds:", apiError);
    
    return new Response(JSON.stringify({
      error: "Erro na API do LearnWorlds",
      message: apiError.message,
      source: "LearnWorlds API"
    }), {
      headers: corsHeaders,
      status: 500
    });
  }
}
