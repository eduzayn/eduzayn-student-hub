
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Cabeçalhos CORS atualizados para incluir apikey nos headers permitidos
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info, Lw-Client, X-School-Id",
  "Content-Type": "application/json"
};

// Token de bypass para admins - usando nome padronizado
const ADMIN_BYPASS_JWT = Deno.env.get("ADMIN_BYPASS_TOKEN") || "byZ4yn-#v0lt-2025!SEC";
// Obtendo a chave API LearnWorlds do ambiente
const LEARNWORLDS_API_KEY = Deno.env.get("LEARNWORLDS_API_KEY") || "";
// Token público para operações do cliente
const LEARNWORLDS_PUBLIC_TOKEN = Deno.env.get("LEARNWORLDS_PUBLIC_TOKEN") || "8BtSujQd7oBzSgJIWAeNtjYrmfeWHCZSBIXTGRpR";
// School ID do LearnWorlds
const LEARNWORLDS_SCHOOL_ID = Deno.env.get("LEARNWORLDS_SCHOOL_ID") || "grupozayneducacional";
// URL base da API do LearnWorlds
const LEARNWORLDS_API_BASE_URL = Deno.env.get("LEARNWORLDS_API_URL") || "https://api.learnworlds.com";

console.log("Inicializando função edge learnworlds-api");
console.log("Token de administrador:", ADMIN_BYPASS_JWT ? "Configurado ✓" : "Não configurado ✗");
console.log("API Key LearnWorlds:", LEARNWORLDS_API_KEY ? "Configurado ✓" : "Não configurado ✗");
console.log("Token público LearnWorlds:", LEARNWORLDS_PUBLIC_TOKEN ? "Configurado ✓" : "Não configurado ✗");
console.log("School ID LearnWorlds:", LEARNWORLDS_SCHOOL_ID ? "Configurado ✓" : "Não configurado ✗");
console.log("URL base da API LearnWorlds:", LEARNWORLDS_API_BASE_URL);

// Chamada real para a API LearnWorlds
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
        'Lw-Client': LEARNWORLDS_SCHOOL_ID  // Adicionando o cabeçalho Lw-Client exigido pela API
      }
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
    }

    // Adicionando um timeout para a requisição
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
      
      // Verifica se a resposta tem conteúdo
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const responseData = await response.json();
        return responseData;
      } else {
        const textResponse = await response.text();
        console.log(`Resposta não-JSON: ${textResponse.substring(0, 100)}...`);
        return { text: textResponse };
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

serve(async (req) => {
  const { method } = req;

  // Logging para depuração
  console.log(`Requisição recebida: ${method} ${new URL(req.url).pathname}`);

  // Pré-flight CORS - MELHORADO
  if (method === "OPTIONS") {
    console.log("Respondendo requisição OPTIONS com CORS headers");
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  // Verificação de token JWT
  const authHeader = req.headers.get("Authorization");
  console.log("Auth header recebido:", authHeader ? "Sim" : "Não");
  console.log("Auth header:", authHeader?.substring(0, 15) + "...");
  
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

  // Extrair o token do cabeçalho - agora padronizado para formato Bearer
  let token = "";
  if (authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  } else {
    token = authHeader.trim();
  }
  
  // Log detalhado dos tokens para diagnóstico
  console.log("Token recebido (primeiros 10 chars):", token.substring(0, 10) + "...");
  console.log("Token público para comparação (primeiros 10 chars):", LEARNWORLDS_PUBLIC_TOKEN.substring(0, 10) + "...");
  console.log("Token admin para comparação (primeiros 10 chars):", ADMIN_BYPASS_JWT.substring(0, 10) + "...");
  
  // Verificação do token - aceitamos tanto o token de administrador quanto o token público
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
      // --- GET /courses
      // Permitir tanto para admin quanto para token público
      if (path === "courses") {
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "50");
        const searchTerm = url.searchParams.get("q") || "";
        const access = url.searchParams.get("access") || "";
        const categories = url.searchParams.get("categories") || "";

        // Montar parâmetros para API LearnWorlds
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
          
          // Se tivermos pesquisa e dados reais, filtramos no servidor
          if (searchTerm && result && Array.isArray(result.data)) {
            result.data = result.data.filter((course: any) => 
              course.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
              course.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            // Ajustar contagem de meta se houver
            if (result.meta) {
              result.meta.totalItems = result.data.length;
            }
          }
        } catch (error) {
          console.error("Erro na chamada para API LearnWorlds:", error);
          result = null;
        }
        
        // Se não conseguimos dados reais, usamos simulados
        if (!result) {
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

          result = {
            data: filteredCourses,
            meta: {
              page,
              totalItems: filteredCourses.length,
              totalPages: 1,
              itemsPerPage: limit
            }
          };
          
          console.log("Retornando dados simulados para cursos:", result);
        }

        return new Response(JSON.stringify(result), {
          headers: corsHeaders,
          status: 200
        });
      }

      // --- GET /courses/:id
      // Permitir tanto para admin quanto para token público
      if (path.startsWith("courses/")) {
        const courseId = path.split("courses/")[1];
        
        let result;
        
        try {
          result = await callLearnWorldsApi(`/courses/${courseId}`);
          console.log(`Resposta da API LearnWorlds (detalhes do curso ${courseId}):`, result);
        } catch (error) {
          console.error(`Erro na chamada para API LearnWorlds (curso ${courseId}):`, error);
          result = null;
        }
        
        // Se não conseguimos dados reais, usamos simulados
        if (!result) {
          result = {
            id: courseId,
            title: `Curso ${courseId}`,
            description: `Descrição detalhada do curso ${courseId}`,
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
          
          console.log("Retornando dados simulados para detalhes do curso:", result);
        }

        return new Response(JSON.stringify(result), {
          headers: corsHeaders,
          status: 200
        });
      }
      
      // --- GET /users (somente admin)
      if (path === "users" && isAdminToken) {
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "20");
        const searchTerm = url.searchParams.get("q") || "";

        let result;
        
        try {
          result = await callLearnWorldsApi(`/users?page=${page}&limit=${limit}`);
          console.log("Resposta da API LearnWorlds (usuários):", result);
          
          // Se tivermos pesquisa e dados reais, filtramos no servidor
          if (searchTerm && result && Array.isArray(result.data)) {
            result.data = result.data.filter((user: any) => 
              user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
              user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            // Ajustar contagem de meta se houver
            if (result.meta) {
              result.meta.totalItems = result.data.length;
            }
          }
        } catch (error) {
          console.error("Erro na chamada para API LearnWorlds (usuários):", error);
          result = null;
        }
        
        // Se não conseguimos dados reais, usamos simulados
        if (!result) {
          const mockUsers = [
            { id: "user-1", firstName: "Ana", lastName: "Silva", email: "ana@exemplo.com", customField1: "123.456.789-01", phoneNumber: "(11) 91234-5678" },
            { id: "user-2", firstName: "Carlos", lastName: "Santos", email: "carlos@exemplo.com", customField1: "987.654.321-09", phoneNumber: "(11) 98765-4321" },
            { id: "user-3", firstName: "Patricia", lastName: "Oliveira", email: "patricia@exemplo.com", customField1: "456.789.123-45", phoneNumber: "(11) 97654-3210" }
          ];

          const filteredUsers = searchTerm
            ? mockUsers.filter(u =>
                u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.customField1.includes(searchTerm)
              )
            : mockUsers;

          result = {
            data: filteredUsers,
            meta: {
              page,
              totalItems: filteredUsers.length,
              totalPages: 1,
              itemsPerPage: limit
            }
          };
          
          console.log("Retornando dados simulados para usuários:", result);
        }

        return new Response(JSON.stringify(result), {
          headers: corsHeaders,
          status: 200
        });
      }
      
      // --- ROTAS ESPECÍFICAS QUE EXIGEM TOKEN DE ADMIN
      if (!isAdminToken && (path === "users" || path.startsWith("admin/"))) {
        return new Response(JSON.stringify({
          code: 403,
          message: "Esta operação requer token de administrador"
        }), {
          headers: corsHeaders,
          status: 403
        });
      }

      // Endpoint não encontrado
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
    // Para operações POST, exigir token de administrador para operações sensíveis
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
      
      // Implementação específica para criação de usuários
      if (path === "users") {
        console.log("Processando criação de usuário na API LearnWorlds");
        
        try {
          // Preparar os dados para a API LearnWorlds
          const userData = {
            firstName: body.firstName || "",
            lastName: body.lastName || "",
            email: body.email,
            phoneNumber: body.phoneNumber || "",
            customField1: body.cpf || "" // CPF como campo customizado
          };
          
          console.log("Dados de usuário para LearnWorlds:", userData);
          
          // Chamar a API do LearnWorlds
          const result = await callLearnWorldsApi("/users", "POST", userData);
          
          console.log("Resposta da criação de usuário:", result);
          
          // Se temos uma resposta válida
          if (result) {
            return new Response(JSON.stringify(result), {
              headers: corsHeaders,
              status: 200
            });
          } else {
            // Caso a API não retorne dados (possível erro no LearnWorlds)
            console.warn("API do LearnWorlds não retornou dados para criação de usuário");
            
            // Retornamos um objeto simulado com ID para permitir continuar o fluxo
            return new Response(JSON.stringify({
              id: `local-${Date.now()}`,
              email: body.email,
              firstName: body.firstName,
              lastName: body.lastName,
              simulatedResponse: true
            }), {
              headers: corsHeaders,
              status: 200
            });
          }
        } catch (learnWorldsError) {
          console.error("Erro ao chamar API LearnWorlds para criar usuário:", learnWorldsError);
          
          // Alternativa de resposta em caso de erro
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
      
      // Tentativa de chamar API real para outros endpoints
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
      
      // Resposta simulada para POST
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
