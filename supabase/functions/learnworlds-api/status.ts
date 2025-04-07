
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
  const schoolId = Deno.env.get('LEARNWORLDS_SCHOOL_ID') || 'grupozayneducacional';
  
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
    const testUrl = `${apiBaseUrl}/api/v2/schools/${schoolId}/users?limit=1`;
    console.log('Testando conexão com URL:', testUrl);
    
    // Fazer uma chamada de teste para a API LearnWorlds
    try {
      const testResponse = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });

      // Verificar se a resposta é válida antes de tentar processar como JSON
      const contentType = testResponse.headers.get('content-type') || '';
      
      if (contentType.includes('application/json')) {
        // Se for JSON, processar normalmente
        const jsonData = await testResponse.json();
        
        if (!testResponse.ok) {
          console.error('Erro na API LearnWorlds:', testResponse.status, jsonData);
          
          return new Response(
            JSON.stringify({ 
              status: "offline",
              error: "Falha na autenticação com a API LearnWorlds",
              errorCode: testResponse.status,
              details: jsonData
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
            },
            data: jsonData
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } else {
        // Se não for JSON, tratar o erro adequadamente
        const textResponse = await testResponse.text();
        console.error('Resposta não-JSON:', contentType, textResponse.substring(0, 200));
        
        return new Response(
          JSON.stringify({ 
            status: "offline",
            error: "Resposta inválida da API LearnWorlds",
            contentType: contentType,
            statusCode: testResponse.status,
            previewResponse: textResponse.substring(0, 100)
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    } catch (fetchError) {
      console.error('Erro na requisição fetch:', fetchError);
      
      return new Response(
        JSON.stringify({ 
          status: "offline",
          error: "Erro ao conectar com a API LearnWorlds",
          details: fetchError instanceof Error ? fetchError.message : "Erro desconhecido"
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
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
