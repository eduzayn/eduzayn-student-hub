
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info, Lw-Client, X-School-Id",
  "Content-Type": "application/json"
};

// Credenciais e configurações
const ADMIN_BYPASS_JWT = Deno.env.get("ADMIN_BYPASS_TOKEN");
const LEARNWORLDS_API_KEY = Deno.env.get("LEARNWORLDS_API_KEY");
const LEARNWORLDS_SCHOOL_ID = Deno.env.get("LEARNWORLDS_SCHOOL_ID");
const LEARNWORLDS_API_BASE_URL = Deno.env.get("LEARNWORLDS_API_URL") || "https://api.learnworlds.com";
const LEARNWORLDS_CLIENT_ID = Deno.env.get("LEARNWORLDS_CLIENT_ID");
const LEARNWORLDS_CLIENT_SECRET = Deno.env.get("LEARNWORLDS_CLIENT_SECRET");

console.log("Inicializando função edge learnworlds-api");
console.log("Token de administrador:", ADMIN_BYPASS_JWT ? "Configurado ✓" : "Não configurado ✗");
console.log("API Key LearnWorlds:", LEARNWORLDS_API_KEY ? "Configurado ✓" : "Não configurado ✗");
console.log("Client ID LearnWorlds:", LEARNWORLDS_CLIENT_ID ? "Configurado ✓" : "Não configurado ✗");
console.log("Client Secret LearnWorlds:", LEARNWORLDS_CLIENT_SECRET ? "Configurado ✓" : "Não configurado ✗");
console.log("School ID LearnWorlds:", LEARNWORLDS_SCHOOL_ID ? "Configurado ✓" : "Não configurado ✗");
console.log("URL base da API LearnWorlds:", LEARNWORLDS_API_BASE_URL);

// Cache para o token OAuth
let oauthToken = null;
let oauthTokenExpiry = 0;

function isHtmlResponse(text: string): boolean {
  return (
    text.includes("<!DOCTYPE html>") || 
    text.includes("<html") || 
    text.includes("</html>") ||
    text.includes("<head") || 
    text.includes("<body")
  );
}

/**
 * Obtém um token OAuth para endpoints que precisam desse método de autenticação
 */
async function getOAuthToken(): Promise<string> {
  try {
    // Verificar se já temos um token válido em cache
    const now = Date.now();
    if (oauthToken && now < oauthTokenExpiry - 60000) { // 1 minuto de margem de segurança
      console.log("Usando token OAuth em cache");
      return oauthToken;
    }
    
    console.log("Obtendo novo token OAuth...");
    
    if (!LEARNWORLDS_CLIENT_ID || !LEARNWORLDS_CLIENT_SECRET) {
      throw new Error("LEARNWORLDS_CLIENT_ID ou LEARNWORLDS_CLIENT_SECRET não configurados");
    }
    
    // Montar o corpo da requisição no formato URL-encoded
    const body = new URLSearchParams();
    body.append("grant_type", "client_credentials");
    body.append("client_id", LEARNWORLDS_CLIENT_ID);
    body.append("client_secret", LEARNWORLDS_CLIENT_SECRET);
    
    // Fazer a requisição para o endpoint de token
    const baseApiUrl = LEARNWORLDS_API_BASE_URL || "https://api.learnworlds.com";
    const tokenUrl = `${baseApiUrl.split('/admin/api')[0]}/admin/api/oauth/token`;
    console.log(`Solicitando token em: ${tokenUrl}`);
    
    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: body.toString(),
      signal: AbortSignal.timeout(10000)
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error(`Erro ao obter token OAuth: ${tokenResponse.status}`, errorText);
      throw new Error(`Falha ao obter token OAuth: ${tokenResponse.status} - ${errorText}`);
    }
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      console.error("Resposta de token OAuth inválida:", tokenData);
      throw new Error("Resposta de token OAuth não contém access_token");
    }
    
    console.log("Token OAuth obtido com sucesso");
    oauthToken = tokenData.access_token;
    oauthTokenExpiry = Date.now() + ((tokenData.expires_in || 3600) * 1000);
    
    return oauthToken;
  } catch (error) {
    console.error("Erro ao obter token OAuth:", error);
    throw new Error(`Falha ao obter access_token: ${error.message}`);
  }
}

/**
 * Chama a API do LearnWorlds com o token apropriado
 */
async function callLearnWorldsApi(path: string, method = 'GET', body?: any, useOAuth = false): Promise<any> {
  try {
    if (!LEARNWORLDS_SCHOOL_ID) {
      throw new Error("LEARNWORLDS_SCHOOL_ID não configurado");
    }

    const baseUrl = LEARNWORLDS_API_BASE_URL || "https://api.learnworlds.com";
    const url = `${baseUrl}${path.startsWith('/') ? path : '/' + path}`;
    console.log(`Chamando API LearnWorlds: ${method} ${url} (useOAuth: ${useOAuth})`);
    
    let authToken;
    
    // Determinar qual token usar com base no parâmetro useOAuth
    if (useOAuth) {
      authToken = await getOAuthToken();
      console.log("Usando token OAuth para autenticação");
    } else {
      if (!LEARNWORLDS_API_KEY) {
        throw new Error("LEARNWORLDS_API_KEY não configurado");
      }
      authToken = LEARNWORLDS_API_KEY;
      console.log("Usando token de acesso API Key para autenticação");
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      'Lw-Client': LEARNWORLDS_SCHOOL_ID
    };
    
    const options: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(10000)
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
      console.log(`Corpo da requisição: ${options.body}`);
    }

    const response = await fetch(url, options);
    console.log(`Resposta da API LearnWorlds: ${response.status}`);
    
    const text = await response.text();
    
    if (!response.ok || isHtmlResponse(text)) {
      console.error(`Erro na API LearnWorlds: ${response.status} - ${text.substring(0, 200)}`);
      throw new Error(`Erro LearnWorlds: ${response.status} - ${text.substring(0, 200)}`);
    }
    
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error("Erro ao converter resposta para JSON:", parseError);
      throw new Error("Resposta da API LearnWorlds não é um JSON válido.");
    }
  } catch (error) {
    console.error(`Erro ao chamar API LearnWorlds: ${error.message}`);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.split("/learnworlds-api/")[1];
  const method = req.method;

  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
  
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
    if (method === "GET") {
      if (path === "courses" || path.startsWith("courses?")) {
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "50");
        
        // Para cursos, usamos o token de acesso API Key
        const result = await callLearnWorldsApi(`/v2/${LEARNWORLDS_SCHOOL_ID}/courses?page=${page}&limit=${limit}`, 'GET', null, false);
        return new Response(JSON.stringify(result), {
          headers: corsHeaders,
          status: 200
        });
      }

      if (path.startsWith("courses/")) {
        const courseId = path.split("courses/")[1];
        
        // Para detalhes do curso, usamos o token de acesso API Key
        const result = await callLearnWorldsApi(`/v2/${LEARNWORLDS_SCHOOL_ID}/courses/${courseId}`, 'GET', null, false);
        return new Response(JSON.stringify(result), {
          headers: corsHeaders,
          status: 200
        });
      }
      
      if (path === "users" || path.startsWith("users?")) {
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "20");
        const searchTerm = url.searchParams.get("q") || "";
        
        // Para usuários, precisamos usar OAuth (true como último parâmetro)
        const result = await callLearnWorldsApi(`/v2/${LEARNWORLDS_SCHOOL_ID}/users?page=${page}&limit=${limit}${searchTerm ? `&q=${encodeURIComponent(searchTerm)}` : ''}`, 'GET', null, true);
        
        return new Response(JSON.stringify(result), {
          headers: corsHeaders,
          status: 200
        });
      }
      
      return new Response(JSON.stringify({
        message: "Endpoint não implementado",
        path
      }), {
        headers: corsHeaders,
        status: 404
      });
      
    } else if (method === "POST") {
      const body = await req.json();
      
      console.log(`Recebido POST para ${path} com corpo:`, JSON.stringify(body).substring(0, 200) + "...");
      
      if (path === "users") {
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
          
          // Para criar usuários, precisamos usar OAuth (true como último parâmetro)
          const result = await callLearnWorldsApi(`/v2/${LEARNWORLDS_SCHOOL_ID}/users`, "POST", userData, true);
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
      
      // Outros endpoints POST (como sincronização)
      if (path.startsWith("admin/")) {
        try {
          // Para endpoints administrativos, usar OAuth
          const result = await callLearnWorldsApi(`/v2/${LEARNWORLDS_SCHOOL_ID}${path.substring("admin".length)}`, "POST", body, true);
          
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
      
      return new Response(JSON.stringify({
        message: "POST endpoint não reconhecido",
        path
      }), {
        headers: corsHeaders,
        status: 404
      });
    }

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
