
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

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

  try {
    // Verificar autenticação
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
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
    const isAdminBypass = token === 'admin-bypass-token';
    
    // Se não for admin bypass, verificar autenticação com Supabase
    if (!isAdminBypass) {
      // Criar um cliente Supabase para verificar o token
      const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
      const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') as string;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Verificar se o token é válido
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user) {
        console.error('Erro de autenticação:', authError);
        return new Response(
          JSON.stringify({ error: 'Token de autenticação inválido' }),
          {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Obter os parâmetros da solicitação
    const url = new URL(req.url);
    const path = url.pathname.split('/learnworlds-api/')[1];

    if (!path) {
      return new Response(
        JSON.stringify({ error: 'Endpoint não especificado' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Obter chaves da API e configurações da LearnWorlds
    const apiKey = Deno.env.get('LEARNWORLDS_API_KEY');
    const schoolId = Deno.env.get('LEARNWORLDS_SCHOOL_ID');
    const apiBaseUrl = Deno.env.get('LEARNWORLDS_API_URL') || 'https://api.learnworlds.com';

    if (!apiKey || !schoolId) {
      console.error('Configurações da API LearnWorlds ausentes');
      return new Response(
        JSON.stringify({ error: 'Configurações da API ausentes' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Configurar a solicitação para a API LearnWorlds
    const apiUrl = `${apiBaseUrl}/${schoolId}/${path}`;
    
    console.log(`Fazendo solicitação para LearnWorlds: ${req.method} ${apiUrl}`);
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };

    // Preparar o corpo da solicitação para métodos POST, PUT, PATCH
    let body;
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      body = await req.json();
      
      // Log especial para criação de usuário ou matrícula
      if (path === 'users' && req.method === 'POST') {
        console.log('Criando novo usuário no LearnWorlds:', {
          email: body.email,
          firstName: body.firstName,
          lastName: body.lastName,
        });
      } else if (path === 'enrollments' && req.method === 'POST') {
        console.log('Criando nova matrícula no LearnWorlds:', {
          userId: body.userId,
          courseId: body.courseId,
        });
      }
    }

    // Adicionar parâmetros de consulta da URL original
    const queryParams = url.search;
    const fullApiUrl = queryParams ? `${apiUrl}${queryParams}` : apiUrl;

    // Fazer a solicitação à API LearnWorlds
    const response = await fetch(fullApiUrl, {
      method: req.method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    // Verificar o tipo de conteúdo para determinar como processar a resposta
    const contentType = response.headers.get('content-type') || '';
    let responseData;

    if (contentType.includes('application/json')) {
      // Se for JSON, analisamos como JSON
      responseData = await response.json();
    } else {
      // Se não for JSON, tratamos como texto e informamos o tipo de conteúdo
      const responseText = await response.text();
      responseData = {
        text: responseText.substring(0, 500), // Limitamos para não sobrecarregar os logs
        contentType: contentType,
        statusCode: response.status,
        message: 'Resposta não-JSON recebida da API'
      };
      
      console.error(`Resposta não-JSON recebida: ${contentType}, status: ${response.status}`);
      
      // Se não estiver OK, tratamos como erro
      if (!response.ok) {
        return new Response(
          JSON.stringify({
            error: 'Erro na API LearnWorlds',
            details: 'Resposta não-JSON recebida',
            statusCode: response.status,
            contentType: contentType
          }),
          {
            status: response.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Registrar sucesso ou erro
    if (!response.ok) {
      console.error(`Erro na API LearnWorlds: ${response.status} - ${JSON.stringify(responseData)}`);
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

    console.log(`Resposta bem-sucedida da LearnWorlds: ${response.status}`);

    // Retornar os dados para o cliente
    return new Response(
      JSON.stringify(responseData),
      {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    // Lidar com erros gerais
    console.error('Erro ao processar solicitação:', error);
    return new Response(
      JSON.stringify({ error: 'Erro ao processar a solicitação', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
