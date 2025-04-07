
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
  // Conforme documentação LearnWorlds, este token é um Bearer token usado no header Authorization
  const apiKey = Deno.env.get('LEARNWORLDS_API_KEY') || 'YEmshZGseUfFldAcQA65P9WHaY5MzdTM4Vk87uWg';
  const schoolId = Deno.env.get('LEARNWORLDS_SCHOOL_ID');
  
  // Verificar se as configurações estão presentes
  if (!apiKey) {
    return new Response(
      JSON.stringify({ 
        status: "offline",
        error: "Token da API não encontrado", 
        details: "Token de autenticação da API LearnWorlds não configurado" 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
  
  if (!schoolId) {
    return new Response(
      JSON.stringify({ 
        status: "offline",
        error: "ID da escola não encontrado", 
        details: "ID da escola LearnWorlds não configurado" 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
  
  try {
    // Verificar a conexão tentando fazer uma chamada real à API LearnWorlds
    // De acordo com a documentação, precisamos fazer uma chamada para verificar se o token é válido
    
    // Montar a URL da API LearnWorlds
    const apiBaseUrl = Deno.env.get('LEARNWORLDS_API_URL') || 'https://api.learnworlds.com';
    const testUrl = `${apiBaseUrl}/${schoolId}/users?limit=1`;
    
    // Fazer uma chamada de teste para a API LearnWorlds
    const testResponse = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!testResponse.ok) {
      // Se a resposta não for bem-sucedida, verificar o status e retornar erro apropriado
      const errorData = await testResponse.json().catch(() => ({}));
      
      console.error('Erro ao testar API LearnWorlds:', testResponse.status, errorData);
      
      return new Response(
        JSON.stringify({ 
          status: "offline",
          error: "Falha na autenticação com a API LearnWorlds",
          errorCode: testResponse.status,
          details: errorData
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Se chegou até aqui, a conexão foi bem-sucedida
    return new Response(
      JSON.stringify({ 
        status: "online",
        message: "API do LearnWorlds conectada com sucesso",
        timestamp: new Date().toISOString(),
        tokenInfo: {
          isConfigured: true,
          source: Deno.env.get('LEARNWORLDS_API_KEY') ? "environment" : "hardcoded",
        }
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
