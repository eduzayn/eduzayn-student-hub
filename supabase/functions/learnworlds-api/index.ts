
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Cabeçalhos CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json"
};

// Obter o token do ambiente (configurado como secret no Supabase)
// Se não existir, usa o valor hardcoded como fallback
const adminToken = Deno.env.get("ADMIN_BYPASS_TOKEN");
const fallbackToken = "byZ4yn-#v0lt-2025!SEC";
const ADMIN_BYPASS_TOKEN = adminToken || fallbackToken;

console.log("Inicializando função edge learnworlds-api");
console.log("Token do ambiente configurado:", adminToken ? "Sim (✓)" : "Não (usando fallback)");

serve(async (req) => {
  const { method } = req;

  // Logging para depuração
  console.log(`Requisição recebida: ${method} ${new URL(req.url).pathname}`);

  // Pré-flight CORS
  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  // Verificação de token JWT
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

  // Extrair o token do cabeçalho
  let token = "";
  if (authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  } else {
    token = authHeader.trim();
  }
  
  // Log detalhado dos tokens para diagnóstico
  console.log("Token recebido (primeiros 5 chars):", token.substring(0, 5) + "...");
  console.log("Comprimento do token recebido:", token.length);
  console.log("Token esperado (primeiros 5 chars):", ADMIN_BYPASS_TOKEN.substring(0, 5) + "...");
  console.log("Comprimento do token esperado:", ADMIN_BYPASS_TOKEN.length);
  
  // Verificação flexível: comparar tanto com o token do ambiente quanto com o fallback
  const tokenMatches = 
    token === ADMIN_BYPASS_TOKEN || 
    token === adminToken || 
    token === fallbackToken;
  
  if (!tokenMatches) {
    console.log("Token inválido - nenhuma correspondência encontrada");
    return new Response(JSON.stringify({
      code: 401,
      message: "Invalid JWT",
      debug: {
        tokenLength: token.length,
        expectedLength: ADMIN_BYPASS_TOKEN.length,
        tokenStart: token.substring(0, 5) + "...",
        expectedStart: ADMIN_BYPASS_TOKEN.substring(0, 5) + "..."
      }
    }), {
      headers: corsHeaders,
      status: 401
    });
  }

  console.log("Autenticação bem-sucedida com token de bypass");

  const url = new URL(req.url);
  const path = url.pathname.split("/learnworlds-api/")[1];

  if (method === "GET") {
    if (!path || path === "") {
      return new Response(JSON.stringify({
        message: "LearnWorlds API online",
        timestamp: new Date().toISOString()
      }), {
        headers: corsHeaders,
        status: 200
      });
    }

    // --- GET /users
    if (path === "users") {
      const page = parseInt(url.searchParams.get("page") || "1");
      const limit = parseInt(url.searchParams.get("limit") || "20");
      const searchTerm = url.searchParams.get("q") || "";

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

      return new Response(JSON.stringify({
        data: filteredUsers,
        total: filteredUsers.length,
        page,
        pages: 1
      }), {
        headers: corsHeaders,
        status: 200
      });
    }

    // --- GET /courses
    if (path === "courses") {
      const page = parseInt(url.searchParams.get("page") || "1");
      const limit = parseInt(url.searchParams.get("limit") || "20");
      const searchTerm = url.searchParams.get("q") || "";

      const mockCourses = [
        { id: "course-1", title: "Desenvolvimento Web Frontend", description: "Aprenda HTML, CSS e JS", price: 1200.00, duration: "60 horas", image: "https://via.placeholder.com/300x200" },
        { id: "course-2", title: "Python para Ciência de Dados", description: "Fundamentos de Python e análise", price: 1500.00, duration: "80 horas", image: "https://via.placeholder.com/300x200" },
        { id: "course-3", title: "Marketing Digital Avançado", description: "Estratégias modernas de marketing", price: 1800.00, duration: "90 horas", image: "https://via.placeholder.com/300x200" },
        { id: "course-4", title: "Design UX/UI", description: "Princípios de design e experiência", price: 1400.00, duration: "70 horas", image: "https://via.placeholder.com/300x200" }
      ];

      const filteredCourses = searchTerm
        ? mockCourses.filter(c =>
            c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.description.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : mockCourses;

      return new Response(JSON.stringify({
        data: filteredCourses,
        total: filteredCourses.length,
        page,
        pages: 1
      }), {
        headers: corsHeaders,
        status: 200
      });
    }

    // --- GET /courses/:id
    if (path.startsWith("courses/")) {
      const courseId = path.split("courses/")[1];

      const mockCourseDetails = {
        id: courseId,
        title: `Curso ${courseId}`,
        description: `Descrição detalhada do curso ${courseId}`,
        price: 1500.00,
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

      return new Response(JSON.stringify(mockCourseDetails), {
        headers: corsHeaders,
        status: 200
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
  }

  if (method === "POST") {
    try {
      const body = await req.json();
      return new Response(JSON.stringify({
        message: "POST recebido com sucesso!",
        data: body
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
