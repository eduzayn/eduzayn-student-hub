
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

    // Obter os parâmetros da requisição
    const { email, nome, linkPagamento, nomeCurso } = await req.json();

    if (!email || !linkPagamento) {
      return new Response(
        JSON.stringify({ error: 'Parâmetros obrigatórios ausentes' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Aqui você pode implementar o envio real do e-mail
    // Para demonstração, apenas simulamos o envio
    
    // Exemplo de como seria com um serviço de e-mail como SendGrid ou Resend:
    // const emailData = {
    //   from: 'matriculas@seudominio.com',
    //   to: email,
    //   subject: `Matrícula - ${nomeCurso}`,
    //   html: `
    //     <h1>Olá, ${nome}!</h1>
    //     <p>Sua matrícula para o curso <strong>${nomeCurso}</strong> foi realizada com sucesso.</p>
    //     <p>Para efetuar o pagamento, clique no link abaixo:</p>
    //     <p><a href="${linkPagamento}" target="_blank">Pagar agora</a></p>
    //     <p>Após a confirmação do pagamento, você receberá as instruções para acessar o curso.</p>
    //     <p>Atenciosamente,<br>Equipe EduZayn</p>
    //   `
    // };

    // Em um cenário real, você enviaria o e-mail aqui
    console.log(`Simulando envio de e-mail para ${email} com link de pagamento: ${linkPagamento}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `E-mail enviado para ${email}` 
      }),
      {
        status: 200,
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
