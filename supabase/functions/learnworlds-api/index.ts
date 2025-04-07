
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

// Configuração dos cabeçalhos CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

serve(async (req) => {
  console.log("🚀 Função learnworlds-api chamada");
  console.log(`📝 Método: ${req.method}, URL: ${req.url}`);
  
  // Lidar com solicitações OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    console.log("✅ Respondendo solicitação OPTIONS com CORS headers");
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Verificar autenticação
    const authHeader = req.headers.get('Authorization');
    console.log(`🔑 Header Authorization presente: ${!!authHeader}`);
    
    if (!authHeader) {
      console.log("❌ Sem token de autenticação");
      return new Response(
        JSON.stringify({ error: 'Sem token de autenticação' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Extrair o token do cabeçalho Authorization
    const token = authHeader.replace('Bearer ', '');

    // Bypass para o token admin-bypass
    const isAdminBypass = token === 'admin-bypass-token' || token === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpb2FyemtmbWNvYmN0Ymx6enRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4OTYwMTksImV4cCI6MjA1OTQ3MjAxOX0.VJTJA5hKhVWFA4x-pM7jXetJsCz8-aMuJDOoVAlPeQc';
    console.log(`🔐 Usando token admin-bypass: ${isAdminBypass}`);
    
    // Se não for admin bypass, verificar autenticação com Supabase
    if (!isAdminBypass) {
      // Criar um cliente Supabase para verificar o token
      const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
      const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') as string;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Verificar se o token é válido
      console.log("🔍 Verificando token com Supabase");
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      
      if (authError || !user) {
        console.error('❌ Erro de autenticação:', authError);
        return new Response(
          JSON.stringify({ error: 'Token de autenticação inválido' }),
          {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      console.log(`✅ Token autenticado para usuário: ${user.email}`);
    }

    // Obter os parâmetros da solicitação
    const url = new URL(req.url);
    console.log(`🌐 URL completa: ${url.toString()}`);
    
    // Extrair o path após learnworlds-api/
    const pathSegments = url.pathname.split('/');
    const learnworldsApiIndex = pathSegments.findIndex(segment => segment === 'learnworlds-api');
    const path = pathSegments.slice(learnworldsApiIndex + 1).join('/');
    
    console.log(`🔍 Path extraído: "${path}"`);

    // Tratar requisição de status
    if (path === 'status' || path === '/status') {
      console.log("🔄 Redirecionando para endpoint de status");
      
      try {
        // Importar e executar o código do módulo status diretamente
        const { default: statusModule } = await import('./status.ts');
        console.log("✅ Módulo de status importado com sucesso");
        
        // Criar uma nova requisição para o módulo de status
        return await statusModule(req);
        
      } catch (statusError) {
        console.error("❌ Erro ao executar módulo de status:", statusError);
        
        return new Response(
          JSON.stringify({ 
            status: "offline",
            error: "Erro ao processar verificação de status", 
            details: statusError instanceof Error ? statusError.message : "Erro desconhecido"
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    if (!path) {
      console.log("❌ Endpoint não especificado");
      return new Response(
        JSON.stringify({ error: 'Endpoint não especificado' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Obter chaves da API e configurações da LearnWorlds
    const apiKey = Deno.env.get('LEARNWORLDS_API_KEY') || 'YEmshZGseUfFldAcQA65P9WHaY5MzdTM4Vk87uWg';
    const schoolId = Deno.env.get('LEARNWORLDS_SCHOOL_ID') || 'grupozayneducacional';
    const apiBaseUrl = Deno.env.get('LEARNWORLDS_API_URL') || 'https://api.learnworlds.com';
    // Adicionando o client_id que faltava (essencial para a API LearnWorlds)
    const clientId = Deno.env.get('LEARNWORLDS_CLIENT_ID') || 'zayn-lms-client';
    
    console.log(`📚 Usando API LearnWorlds com escola: ${schoolId}`);
    console.log(`🔑 Usando token da API: ${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 5)}`);
    console.log(`🌐 URL base da API: ${apiBaseUrl}`);
    console.log(`👤 Client ID: ${clientId}`);

    if (!apiKey || !schoolId || !clientId) {
      console.error('❌ Configurações da API LearnWorlds ausentes');
      return new Response(
        JSON.stringify({ error: 'Configurações da API ausentes' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Configurar a solicitação para a API LearnWorlds
    const apiUrl = `${apiBaseUrl}/api/v2/schools/${schoolId}/${path}`;
    console.log(`🔄 Chamando API LearnWorlds: ${req.method} ${apiUrl}`);
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };

    // Preparar o corpo da solicitação para métodos POST, PUT, PATCH
    let body: any;
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      body = await req.json();
      console.log(`📦 Corpo da requisição: ${JSON.stringify(body)}`);
      
      // Adicionar client_id ao corpo para todas as requisições de modificação
      body.client_id = clientId;
      
      // Log especial para criação de usuário ou matrícula
      if (path === 'users' && req.method === 'POST') {
        console.log('✨ Criando novo usuário no LearnWorlds:', {
          email: body.email,
          firstName: body.firstName,
          lastName: body.lastName,
          client_id: body.client_id
        });
      } else if (path === 'enrollments' && req.method === 'POST') {
        console.log('✨ Criando nova matrícula no LearnWorlds:', {
          userId: body.userId,
          courseId: body.courseId,
          client_id: body.client_id
        });
      }
    }

    // Adicionar parâmetros de consulta da URL original e adicionar client_id
    const queryParams = new URLSearchParams(url.search);
    queryParams.set('client_id', clientId); // Adiciona client_id aos parâmetros de consulta
    const fullApiUrl = `${apiUrl}?${queryParams.toString()}`;
    console.log(`🌐 URL completa para API LearnWorlds: ${fullApiUrl}`);

    try {
      // Fazer a solicitação à API LearnWorlds
      const response = await fetch(fullApiUrl, {
        method: req.method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      console.log(`📊 Status da resposta: ${response.status}`);
      
      // Verificar o tipo de conteúdo para determinar como processar a resposta
      const contentType = response.headers.get('content-type') || '';
      console.log(`📄 Tipo de conteúdo da resposta: ${contentType}`);
      
      let responseData;

      try {
        // Primeiro tentamos obter o corpo como texto para evitar erros de parsing direto
        const responseText = await response.text();
        console.log(`📄 Resposta recebida (primeiros 200 caracteres): ${responseText.substring(0, 200)}...`);
        
        try {
          // Tentamos parsear como JSON
          responseData = JSON.parse(responseText);
          console.log("✅ Resposta JSON válida recebida");
        } catch (jsonError) {
          console.error("❌ Erro ao parsear resposta como JSON:", jsonError);
          
          // Se não é JSON mas o status é OK, empacotamos o texto em um objeto JSON
          if (response.ok) {
            console.log("Resposta não-JSON com status OK, encapsulando em objeto JSON");
            responseData = {
              success: true,
              responseText: responseText.substring(0, 500),
              contentType: contentType
            };
          } else {
            // Se não é JSON e não está OK, tratamos como erro
            return new Response(
              JSON.stringify({
                error: 'Erro na API LearnWorlds',
                details: 'Resposta não-JSON recebida',
                statusCode: response.status,
                contentType: contentType,
                responsePreview: responseText.substring(0, 500)
              }),
              {
                status: response.status,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              }
            );
          }
        }
      } catch (textError) {
        console.error("❌ Erro ao obter texto da resposta:", textError);
        responseData = {
          error: "Erro ao processar resposta da API",
          statusCode: response.status,
          details: textError instanceof Error ? textError.message : "Erro desconhecido"
        };
      }

      // Registrar sucesso ou erro
      if (!response.ok) {
        console.error(`❌ Erro na API LearnWorlds: ${response.status} - ${JSON.stringify(responseData)}`);
        return new Response(
          JSON.stringify({
            status: response.status,
            error: responseData.error || 'Erro na API LearnWorlds',
            details: responseData
          }),
          {
            status: response.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      console.log(`✅ Resposta bem-sucedida da LearnWorlds: ${response.status}`);

      // Retornar os dados para o cliente
      return new Response(
        JSON.stringify(responseData),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (fetchError) {
      console.error('❌ Erro na requisição fetch para LearnWorlds:', fetchError);
      
      return new Response(
        JSON.stringify({ 
          error: 'Erro ao chamar API LearnWorlds', 
          details: fetchError instanceof Error ? fetchError.message : "Erro desconhecido"
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    // Lidar com erros gerais
    console.error('❌ Erro ao processar solicitação:', error);
    return new Response(
      JSON.stringify({ error: 'Erro ao processar a solicitação', details: error instanceof Error ? error.message : "Erro desconhecido" }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
