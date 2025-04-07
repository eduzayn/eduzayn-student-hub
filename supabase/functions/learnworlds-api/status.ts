
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Configuração dos cabeçalhos CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Exportar a função handler diretamente para que ela possa ser chamada pelo index.ts
export default async function statusHandler(req: Request) {
  console.log("🚀 Função learnworlds-api/status chamada");
  console.log(`📝 Método: ${req.method}, URL: ${req.url}`);
  
  // Lidar com solicitações OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    console.log("✅ Respondendo solicitação OPTIONS com CORS headers");
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  
  // Verificar autenticação
  const authHeader = req.headers.get('Authorization');
  console.log(`🔑 Header Authorization presente: ${!!authHeader}`);
  
  if (!authHeader) {
    console.log("❌ Sem token de autenticação");
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

  try {
    // Obter dados de configuração da API LearnWorlds
    const apiKey = Deno.env.get('LEARNWORLDS_API_KEY') || 'YEmshZGseUfFldAcQA65P9WHaY5MzdTM4Vk87uWg';
    const schoolId = Deno.env.get('LEARNWORLDS_SCHOOL_ID') || 'grupozayneducacional';
    const apiBaseUrl = Deno.env.get('LEARNWORLDS_API_URL') || 'https://api.learnworlds.com';
    const clientId = Deno.env.get('LEARNWORLDS_CLIENT_ID') || 'zayn-lms-client';
    
    console.log(`📚 Usando escola: ${schoolId}`);
    console.log(`🔗 API Base URL: ${apiBaseUrl}`);
    console.log(`👤 Client ID: ${clientId}`);
    
    // Verificar se as configurações estão presentes
    if (!apiKey) {
      console.log("❌ Token da API não encontrado");
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
      console.log("❌ ID da escola não encontrado");
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
    
    if (!clientId) {
      console.log("❌ Client ID não encontrado");
      return new Response(
        JSON.stringify({ 
          status: "offline",
          error: "Client ID não encontrado", 
          details: "ID do cliente LearnWorlds não configurado" 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Verificar a conexão tentando fazer uma chamada real à API LearnWorlds
    // Montar a URL da API LearnWorlds com o client_id necessário
    const testUrl = `${apiBaseUrl}/api/v2/schools/${schoolId}/users?limit=1&client_id=${clientId}`;
    console.log(`🔍 Testando conexão com URL: ${testUrl}`);
    
    // Fazer uma chamada de teste para a API LearnWorlds
    try {
      console.log(`🔄 Enviando requisição de teste para LearnWorlds com Bearer token`);
      const testResponse = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });

      console.log(`📊 Status da resposta: ${testResponse.status}`);
      const contentType = testResponse.headers.get('content-type') || '';
      console.log(`📄 Tipo de conteúdo da resposta: ${contentType}`);
      
      // Verificar código de status
      if (!testResponse.ok) {
        console.log(`❌ Resposta de erro da API LearnWorlds: ${testResponse.status}`);
        
        try {
          // Tentar obter o corpo da resposta como texto
          const responseText = await testResponse.text();
          console.log(`📄 Corpo da resposta de erro: ${responseText.substring(0, 200)}...`);
          
          try {
            // Tentar parsear como JSON
            const errorData = JSON.parse(responseText);
            
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
          } catch (jsonParseError) {
            // Se não for JSON, retornar o texto bruto
            return new Response(
              JSON.stringify({ 
                status: "offline",
                error: "Falha na autenticação com a API LearnWorlds",
                errorCode: testResponse.status,
                responseText: responseText.substring(0, 500)
              }),
              {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              }
            );
          }
        } catch (textError) {
          console.error("Erro ao obter texto da resposta:", textError);
          
          return new Response(
            JSON.stringify({ 
              status: "offline",
              error: "Falha na autenticação com a API LearnWorlds",
              errorCode: testResponse.status,
              errorDetails: "Erro ao processar resposta"
            }),
            {
              status: 200,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
      }
      
      // Tentar obter o corpo da resposta como texto
      const responseText = await testResponse.text();
      console.log(`📄 Corpo da resposta bem-sucedida: ${responseText.substring(0, 200)}...`);
      
      // Tentar parsear como JSON
      try {
        const jsonData = JSON.parse(responseText);
        console.log("✅ Resposta JSON válida recebida");
        
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
      } catch (jsonParseError) {
        console.error("Erro ao parsear resposta como JSON:", jsonParseError);
        
        // Mesmo com erro de parsing, consideramos online se o status foi bem-sucedido
        return new Response(
          JSON.stringify({ 
            status: "online",
            message: "API do LearnWorlds conectada com sucesso, mas a resposta não é JSON",
            timestamp: new Date().toISOString(),
            tokenInfo: {
              isConfigured: true,
              source: Deno.env.get('LEARNWORLDS_API_KEY') ? "environment" : "hardcoded",
            },
            responsePreview: responseText.substring(0, 500)
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
}

// Também exportamos um handler serve() para quando o arquivo é chamado diretamente
// Isso é útil para quando status.ts é chamado como um endpoint independente
serve(statusHandler);
