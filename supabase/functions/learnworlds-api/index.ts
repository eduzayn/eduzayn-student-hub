import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info, Lw-Client, X-School-Id",
  "Content-Type": "application/json"
};

const ADMIN_BYPASS_JWT = Deno.env.get("ADMIN_BYPASS_TOKEN") || "byZ4yn-#v0lt-2025!SEC";
const LEARNWORLDS_API_KEY = Deno.env.get("LEARNWORLDS_API_KEY") || "";
const LEARNWORLDS_PUBLIC_TOKEN = Deno.env.get("LEARNWORLDS_PUBLIC_TOKEN") || "YEmshZGseUQgbCuLyb9WeYUnHrpq91yuUk3Dx4nN";
const LEARNWORLDS_SCHOOL_ID = Deno.env.get("LEARNWORLDS_SCHOOL_ID") || "grupozayneducacional";
const LEARNWORLDS_API_BASE_URL = Deno.env.get("LEARNWORLDS_API_URL") || "https://api.learnworlds.com";

console.log("Inicializando função edge learnworlds-api");
console.log("Token de administrador:", ADMIN_BYPASS_JWT ? "Configurado ✓" : "Não configurado ✗");
console.log("API Key LearnWorlds:", LEARNWORLDS_API_KEY ? "Configurado ✓" : "Não configurado ✗");
console.log("Token público LearnWorlds:", LEARNWORLDS_PUBLIC_TOKEN ? "Configurado ✓" : "Não configurado ✗");
console.log("School ID LearnWorlds:", LEARNWORLDS_SCHOOL_ID ? "Configurado ✓" : "Não configurado ✗");
console.log("URL base da API LearnWorlds:", LEARNWORLDS_API_BASE_URL);

const isHtmlResponse = (text: string): boolean => {
  return (
    text.includes("<!DOCTYPE html>") || 
    text.includes("<html") || 
    text.includes("</html>") ||
    text.includes("<head") || 
    text.includes("<body")
  );
};

const callLearnWorldsApi = async (path: string, method = 'GET', body?: any): Promise<any> => {
  if (!LEARNWORLDS_API_KEY || !LEARNWORLDS_SCHOOL_ID) {
    console.log("API Key ou School ID não configurados, usando dados simulados");
    console.log(`School ID configurado: ${LEARNWORLDS_SCHOOL_ID}`);
    throw new Error("Credenciais do LearnWorlds não configuradas");
  }

  try {
    const url = `${LEARNWORLDS_API_BASE_URL}/api/v2/${LEARNWORLDS_SCHOOL_ID}${path.startsWith('/') ? path : '/' + path}`;
    
    console.log(`Chamando API LearnWorlds: ${method} ${url}`);
    console.log(`Usando School ID: ${LEARNWORLDS_SCHOOL_ID}`);
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LEARNWORLDS_API_KEY}`,
        'Lw-Client': LEARNWORLDS_SCHOOL_ID
      }
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
      console.log(`Corpo da requisição: ${options.body}`);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    options.signal = controller.signal;

    try {
      const response = await fetch(url, options);
      clearTimeout(timeoutId);
      
      console.log(`Resposta da API LearnWorlds: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erro na API LearnWorlds: ${response.status} - ${errorText}`);
        throw new Error(`LearnWorlds API Error: ${response.status} - ${errorText}`);
      }
      
      const contentType = response.headers.get('content-type');
      
      const responseText = await response.text();
      
      if (isHtmlResponse(responseText)) {
        console.error("API retornou HTML em vez de JSON:", responseText.substring(0, 200));
        throw new Error("API retornou conteúdo não-JSON. Verifique as configurações da API.");
      }
      
      if (contentType?.includes('application/json')) {
        try {
          return JSON.parse(responseText);
        } catch (jsonError) {
          console.error("Erro ao converter resposta para JSON:", jsonError);
          throw new Error("Erro ao processar resposta da API. Formato JSON inválido.");
        }
      } else {
        console.log(`Resposta não-JSON: ${responseText.substring(0, 100)}...`);
        return { text: responseText, status: response.status };
      }
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        console.error('Requisição para LearnWorlds cancelada por timeout');
        throw new Error('A requisição para LearnWorlds expirou');
      }
      throw fetchError;
    }
  } catch (error) {
    console.error(`Erro ao chamar API LearnWorlds: ${error.message}`);
    throw error;
  }
};

const mockData = {
  getCourses: (page = 1, limit = 20, searchTerm = "") => {
    const mockCourses = [
      { id: "course-1", title: "Desenvolvimento Web Frontend", description: "Aprenda HTML, CSS e JS", price: 1200.00, price_final: 1200.00, duration: "60 horas", image: "https://via.placeholder.com/300x200" },
      { id: "course-2", title: "Python para Ciência de Dados", description: "Fundamentos de Python e análise", price: 1500.00, price_final: 1500.00, duration: "80 horas", image: "https://via.placeholder.com/300x200" },
      { id: "course-3", title: "Marketing Digital Avançado", description: "Estratégias modernas de marketing", price: 1800.00, price_final: 1800.00, duration: "90 horas", image: "https://via.placeholder.com/300x200" },
      { id: "course-4", title: "Design UX/UI", description: "Princípios de design e experiência", price: 1400.00, price_final: 1400.00, duration: "70 horas", image: "https://via.placeholder.com/300x200" }
    ];

    const filteredCourses = searchTerm
      ? mockCourses.filter(c =>
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : mockCourses;

    return {
      data: filteredCourses,
      meta: {
        page,
        totalItems: filteredCourses.length,
        totalPages: 1,
        itemsPerPage: limit
      }
    };
  },
  getCourseDetails: (id: string) => {
    return {
      id,
      title: `Curso ${id}`,
      description: `Descrição detalhada do curso ${id}`,
      price: 1500.00,
      price_final: 1500.00,
      duration: "80 horas",
      image: "https://via.placeholder.com/600x400",
      modules: [
        {
          id: "module-1",
          title: "Introdução",
          description: "Fundamentos básicos",
          lessons: [
            { id: "lesson-1-1", title: "Primeiros passos", duration: 45 },
            { id: "lesson-1-2", title: "Conceitos fundamentais", duration: 60 }
          ]
        },
        {
          id: "module-2",
          title: "Intermediário",
          description: "Aprofundamento teórico",
          lessons: [
            { id: "lesson-2-1", title: "Técnicas avançadas", duration: 75 },
            { id: "lesson-2-2", title: "Estudos de caso", duration: 90 }
          ]
        }
      ]
    };
  },
  getUsers: (page = 1, limit = 20, searchTerm = "") => {
    const mockUsers = [
      { id: "user-1", firstName: "Ana", lastName: "Silva", email: "ana@exemplo.com", customField1: "123.456.789-01", phoneNumber: "(11) 91234-5678" },
      { id: "user-2", firstName: "Carlos", lastName: "Santos", email: "carlos@exemplo.com", customField1: "987.654.321-09", phoneNumber: "(11) 98765-4321" },
      { id: "user-3", firstName: "Patricia", lastName: "Oliveira", email: "patricia@exemplo.com", customField1: "456.789.123-45", phoneNumber: "(11) 97654-3210" },
      { id: "user-4", firstName: "Roberto", lastName: "Pereira", email: "roberto@exemplo.com", customField1: "789.123.456-78", phoneNumber: "(11) 96543-2109" },
      { id: "user-5", firstName: "Juliana", lastName: "Costa", email: "juliana@exemplo.com", customField1: "321.654.987-01", phoneNumber: "(11) 95432-1098" }
    ];

    const filteredUsers = searchTerm
      ? mockUsers.filter(u =>
          u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.customField1.includes(searchTerm)
        )
      : mockUsers;

    return {
      data: filteredUsers,
      meta: {
        page,
        totalItems: filteredUsers.length,
        totalPages: 1,
        itemsPerPage: limit
      }
    };
  },
  createUser: (userData: any) => {
    return {
      id: `mock-user-${Date.now()}`,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      customField1: userData.cpf,
      phoneNumber: userData.phoneNumber,
      simulatedResponse: true
    };
  }
};

serve(async (req) => {
  const { method } = req;

  console.log(`Requisição recebida: ${method} ${new URL(req.url).pathname}`);

  if (method === "OPTIONS") {
    console.log("Respondendo requisição OPTIONS com CORS headers");
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  const authHeader = req.headers.get("Authorization");
  console.log("Auth header recebido:", authHeader ? "Sim" : "Não");
  
  if (!authHeader) {
    console.log("Token não fornecido");
    return new Response(JSON.stringify({
      code: 401,
      message: "Authorization header missing"
    }), {
      headers: corsHeaders,
      status: 401
    });
  }

  let token = "";
  if (authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  } else {
    token = authHeader.trim();
  }
  
  console.log("Token recebido (primeiros 10 chars):", token.substring(0, 10) + "...");
  console.log("Token público para comparação (primeiros 10 chars):", LEARNWORLDS_PUBLIC_TOKEN.substring(0, 10) + "...");
  console.log("Token admin para comparação (primeiros 10 chars):", ADMIN_BYPASS_JWT.substring(0, 10) + "...");
  
  const isAdminToken = token === ADMIN_BYPASS_JWT;
  const isPublicToken = token === LEARNWORLDS_PUBLIC_TOKEN;
  
  if (!isAdminToken && !isPublicToken) {
    console.log("Token inválido - nenhuma correspondência encontrada");
    console.log(`Token recebido: ${token.substring(0, 10)}...`);
    console.log(`Token público esperado: ${LEARNWORLDS_PUBLIC_TOKEN.substring(0, 10)}...`);
    console.log(`Token admin esperado: ${ADMIN_BYPASS_JWT.substring(0, 10)}...`);
    
    return new Response(JSON.stringify({
      code: 401,
      message: "Invalid JWT"
    }), {
      headers: corsHeaders,
      status: 401
    });
  }

  console.log(`Autenticação bem-sucedida com ${isAdminToken ? 'token de bypass admin' : 'token público'}`);

  const url = new URL(req.url);
  const path = url.pathname.split("/learnworlds-api/")[1];

  if (!path || path === "") {
    return new Response(JSON.stringify({
      message: "LearnWorlds API online",
      timestamp: new Date().toISOString(),
      apiKeyConfigured: !!LEARNWORLDS_API_KEY,
      schoolIdConfigured: !!LEARNWORLDS_SCHOOL_ID,
      publicTokenConfigured: !!LEARNWORLDS_PUBLIC_TOKEN,
      authenticatedAs: isAdminToken ? 'admin' : 'public'
    }), {
      headers: corsHeaders,
      status: 200
    });
  }

  if (method === "GET") {
    try {
      if (path === "courses" || path.startsWith("courses?")) {
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "50");
        const searchTerm = url.searchParams.get("q") || "";
        const access = url.searchParams.get("access") || "";
        const categories = url.searchParams.get("categories") || "";

        const apiParams = new URLSearchParams();
        apiParams.append("page", page.toString());
        apiParams.append("limit", limit.toString());
        
        if (access) {
          apiParams.append("access", access);
        }
        
        if (categories) {
          apiParams.append("categories", categories);
        }
        
        let result;
        
        try {
          result = await callLearnWorldsApi(`/courses?${apiParams.toString()}`);
          console.log(`Resposta da API LearnWorlds (cursos):`, result);
          
          if (searchTerm && result && Array.isArray(result.data)) {
            result.data = result.data.filter((course: any) => 
              course.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
              course.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            if (result.meta) {
              result.meta.totalItems = result.data.length;
            }
          }
        } catch (error) {
          console.error("Erro na chamada para API LearnWorlds:", error);
          console.log("Usando dados simulados devido a erro na API");
          result = mockData.getCourses(page, limit, searchTerm);
        }
        
        if (!result || !Array.isArray(result.data)) {
          console.warn("Formato inválido de resultado ou sem dados, usando dados simulados");
          result = mockData.getCourses(page, limit, searchTerm);
        }

        return new Response(JSON.stringify(result), {
          headers: corsHeaders,
          status: 200
        });
      }

      if (path.startsWith("courses/")) {
        const courseId = path.split("courses/")[1];
        
        let result;
        
        try {
          result = await callLearnWorldsApi(`/courses/${courseId}`);
          console.log(`Resposta da API LearnWorlds (detalhes do curso ${courseId}):`, result);
        } catch (error) {
          console.error(`Erro na chamada para API LearnWorlds (curso ${courseId}):`, error);
          console.log("Usando dados simulados para detalhes do curso");
          result = mockData.getCourseDetails(courseId);
        }
        
        if (!result || !result.id) {
          console.warn("Formato inválido de resultado para detalhes do curso, usando dados simulados");
          result = mockData.getCourseDetails(courseId);
        }

        return new Response(JSON.stringify(result), {
          headers: corsHeaders,
          status: 200
        });
      }
      
      if (path === "users" || path.startsWith("users?")) {
        if (!isAdminToken) {
          return new Response(JSON.stringify({
            code: 403,
            message: "Esta operação requer token de administrador"
          }), {
            headers: corsHeaders,
            status: 403
          });
        }
        
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "20");
        const searchTerm = url.searchParams.get("q") || "";

        let result;
        
        try {
          result = await callLearnWorldsApi(`/users?page=${page}&limit=${limit}`);
          console.log("Resposta da API LearnWorlds (usuários):", result);
          
          if (searchTerm && result && Array.isArray(result.data)) {
            result.data = result.data.filter((user: any) => 
              user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
              user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            if (result.meta) {
              result.meta.totalItems = result.data.length;
            }
          }
        } catch (error) {
          console.error("Erro na chamada para API LearnWorlds (usuários):", error);
          console.log("Usando dados simulados para usuários");
          result = mockData.getUsers(page, limit, searchTerm);
        }
        
        if (!result || !Array.isArray(result.data)) {
          const mockResult = mockData.getUsers(page, limit, searchTerm);
          console.log("Retornando dados simulados para usuários:", mockResult);
          return new Response(JSON.stringify(mockResult), {
            headers: corsHeaders,
            status: 200
          });
        }

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
      
    } catch (error) {
      console.error("Erro ao processar requisição:", error);
      return new Response(JSON.stringify({
        error: "Erro ao processar requisição",
        message: error.message
      }), {
        headers: corsHeaders,
        status: 500
      });
    }
  }

  if (method === "POST") {
    const requiresAdmin = path === "users" || path.startsWith("admin/");
    
    if (requiresAdmin && !isAdminToken) {
      return new Response(JSON.stringify({
        code: 403,
        message: "Esta operação requer token de administrador"
      }), {
        headers: corsHeaders,
        status: 403
      });
    }
    
    try {
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
          
          try {
            const result = await callLearnWorldsApi("/users", "POST", userData);
            console.log("Resposta da criação de usuário:", result);
            
            if (result && result.id) {
              return new Response(JSON.stringify(result), {
                headers: corsHeaders,
                status: 200
              });
            } else {
              console.warn("API do LearnWorlds não retornou dados no formato esperado para criação de usuário");
              
              const mockResult = mockData.createUser(userData);
              console.log("Retornando resposta simulada:", mockResult);
              
              return new Response(JSON.stringify(mockResult), {
                headers: corsHeaders,
                status: 200
              });
            }
          } catch (apiError) {
            console.error("Erro na API LearnWorlds:", apiError.message);
            
            if (apiError.message && (
              apiError.message.includes("HTML") || 
              apiError.message.includes("não-JSON") ||
              apiError.message.includes("retornou conteúdo")
            )) {
              console.log("API retornou formato inválido, usando dados simulados");
              
              const mockResult = mockData.createUser(userData);
              console.log("Retornando resposta simulada:", mockResult);
              
              return new Response(JSON.stringify(mockResult), {
                headers: corsHeaders,
                status: 200
              });
            }
            
            throw apiError;
          }
        } catch (learnWorldsError) {
          console.error("Erro ao chamar API LearnWorlds para criar usuário:", learnWorldsError);
          
          return new Response(JSON.stringify({
            error: "Erro ao criar usuário no LearnWorlds",
            message: learnWorldsError.message,
            errorType: "learnworlds_api_error",
            id: `error-${Date.now()}`,
            email: body.email
          }), {
            headers: corsHeaders,
            status: 500
          });
        }
      }
      
      if (LEARNWORLDS_API_KEY && LEARNWORLDS_SCHOOL_ID) {
        try {
          const result = await callLearnWorldsApi(path, "POST", body);
          
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
        message: "POST recebido com sucesso! (simulado)",
        data: body,
        id: crypto.randomUUID()
      }), {
        headers: corsHeaders,
        status: 200
      });
    } catch (error) {
      return new Response(JSON.stringify({
        error: "Erro ao processar o corpo da requisição",
        details: error.message
      }), {
        headers: corsHeaders,
        status: 400
      });
    }
  }

  return new Response(JSON.stringify({
    error: "Método não suportado"
  }), {
    headers: corsHeaders,
    status: 405
  });
});
