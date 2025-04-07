
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Definir cabeçalhos CORS para permitir chamadas da aplicação
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json"
};

// Token fixo para autenticação bypass admin (deve corresponder ao valor no frontend)
const ADMIN_BYPASS_TOKEN = "eduzayn-bypass-token-2025";

serve(async (req) => {
  const { method } = req;

  // Tratamento da requisição de pré-flight CORS
  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  // Verificação de autenticação
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.replace('Bearer ', '') || '';
  
  // Verificar se o token é igual ao token de bypass
  if (token !== ADMIN_BYPASS_TOKEN) {
    console.log("Token inválido recebido:", token);
    return new Response(JSON.stringify({
      code: 401,
      message: "Invalid JWT"
    }), {
      headers: corsHeaders,
      status: 401
    });
  }

  // Se chegar aqui, a autenticação foi bem-sucedida
  console.log("Autenticação bem-sucedida com token de bypass");

  if (method === "GET") {
    // Endpoint simples de verificação de status
    const url = new URL(req.url);
    const path = url.pathname.split("/learnworlds-api/")[1];
    
    if (!path || path === "") {
      return new Response(JSON.stringify({
        message: "LearnWorlds API online",
        timestamp: new Date().toISOString()
      }), {
        headers: corsHeaders,
        status: 200
      });
    }
    
    // Simulação do endpoint de usuários
    if (path === "users") {
      // Obter parâmetros de query
      const page = parseInt(url.searchParams.get("page") || "1");
      const limit = parseInt(url.searchParams.get("limit") || "20");
      const searchTerm = url.searchParams.get("q") || "";
      
      // Dados mockados para simulação
      const mockUsers = [
        { 
          id: "user-1", 
          firstName: "Ana", 
          lastName: "Silva", 
          email: "ana@exemplo.com", 
          customField1: "123.456.789-01", 
          phoneNumber: "(11) 91234-5678" 
        },
        { 
          id: "user-2", 
          firstName: "Carlos", 
          lastName: "Santos", 
          email: "carlos@exemplo.com", 
          customField1: "987.654.321-09", 
          phoneNumber: "(11) 98765-4321" 
        },
        { 
          id: "user-3", 
          firstName: "Patricia", 
          lastName: "Oliveira", 
          email: "patricia@exemplo.com", 
          customField1: "456.789.123-45", 
          phoneNumber: "(11) 97654-3210" 
        }
      ];
      
      // Filtrar se houver termo de busca
      const filteredUsers = searchTerm ? 
        mockUsers.filter(u => 
          u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
          u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || 
          u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
          u.customField1.includes(searchTerm)
        ) : mockUsers;
      
      return new Response(JSON.stringify({
        data: filteredUsers,
        total: filteredUsers.length,
        page: page,
        pages: 1
      }), {
        headers: corsHeaders,
        status: 200
      });
    }
    
    // Simulação do endpoint de cursos
    if (path === "courses") {
      // Obter parâmetros de query
      const page = parseInt(url.searchParams.get("page") || "1");
      const limit = parseInt(url.searchParams.get("limit") || "20");
      const searchTerm = url.searchParams.get("q") || "";
      
      // Dados mockados para simulação
      const mockCourses = [
        { 
          id: "course-1", 
          title: "Desenvolvimento Web Frontend", 
          description: "Aprenda HTML, CSS e JavaScript para criar sites modernos", 
          price: 1200.00,
          duration: "60 horas",
          image: "https://via.placeholder.com/300x200"
        },
        { 
          id: "course-2", 
          title: "Python para Ciência de Dados", 
          description: "Fundamentos de Python e bibliotecas para análise de dados", 
          price: 1500.00,
          duration: "80 horas",
          image: "https://via.placeholder.com/300x200"
        },
        { 
          id: "course-3", 
          title: "Marketing Digital Avançado", 
          description: "Estratégias avançadas de marketing para o ambiente digital", 
          price: 1800.00,
          duration: "90 horas",
          image: "https://via.placeholder.com/300x200"
        },
        { 
          id: "course-4", 
          title: "Design UX/UI", 
          description: "Princípios de design de experiência e interface do usuário", 
          price: 1400.00,
          duration: "70 horas",
          image: "https://via.placeholder.com/300x200"
        }
      ];
      
      // Filtrar se houver termo de busca
      const filteredCourses = searchTerm ? 
        mockCourses.filter(c => 
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          c.description.toLowerCase().includes(searchTerm.toLowerCase())
        ) : mockCourses;
      
      return new Response(JSON.stringify({
        data: filteredCourses,
        total: filteredCourses.length,
        page: page,
        pages: 1
      }), {
        headers: corsHeaders,
        status: 200
      });
    }
    
    // Endpoint para detalhes de um curso específico
    if (path.startsWith("courses/")) {
      const courseId = path.split("courses/")[1];
      
      // Dados mockados
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
            title: "Nível intermediário",
            description: "Aprofundando conhecimentos",
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
    
    return new Response(JSON.stringify({
      message: "Endpoint não implementado",
      path: path
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
