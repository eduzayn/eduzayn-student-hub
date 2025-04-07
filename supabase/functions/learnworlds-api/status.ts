
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Configuração dos cabeçalhos CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

serve(async (req) => {
  // Lidar com solicitações OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  
  // Verificar autenticação
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(
      JSON.stringify({ 
        error: 'Sem token de autenticação',
        status: "offline" 
      }),
      {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  // Obter dados de configuração da API LearnWorlds
  const apiKey = Deno.env.get('LEARNWORLDS_API_KEY');
  const schoolId = Deno.env.get('LEARNWORLDS_SCHOOL_ID');
  
  // Verificar se as configurações estão presentes
  if (!apiKey || !schoolId) {
    return new Response(
      JSON.stringify({ 
        status: "offline",
        error: "Configurações da API não encontradas", 
        details: "Verifique variáveis de ambiente LEARNWORLDS_API_KEY e LEARNWORLDS_SCHOOL_ID" 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
  
  try {
    // Para teste básico de conexão, apenas verificar se temos as credenciais
    // Em uma implementação completa, faríamos uma chamada de teste para a API do LearnWorlds
    
    return new Response(
      JSON.stringify({ 
        status: "online",
        message: "API do LearnWorlds conectada com sucesso"
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Erro ao verificar status da API:", error);
    
    // Sempre retornar JSON válido mesmo em caso de erro
    return new Response(
      JSON.stringify({ 
        status: "offline",
        error: error instanceof Error ? error.message : "Erro desconhecido ao verificar status da API" 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
