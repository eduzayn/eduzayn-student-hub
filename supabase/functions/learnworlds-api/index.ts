
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

serve(async (req) => {
  const { method } = req;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
  };

  // Tratamento da requisição de pré-flight CORS
  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  // Verificação de autenticação básica (apenas para demonstração)
  // Na implementação real, você verificaria um token JWT
  const authHeader = req.headers.get("Authorization");
  
  // Permitir acesso sem autenticação para simplificar o teste
  // Em produção você deveria validar o JWT antes de prosseguir
  if (!authHeader && method !== "GET") {
    return new Response(JSON.stringify({
      error: "Não autorizado",
      message: "Token de autenticação não fornecido"
    }), {
      headers: corsHeaders,
      status: 401
    });
  }

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
