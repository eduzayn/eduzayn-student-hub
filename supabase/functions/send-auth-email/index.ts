
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

// Configuração dos cabeçalhos CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

// Configuração do cliente SMTP
const smtp = new SMTPClient({
  connection: {
    hostname: "brasil.svrdedicado.org",
    port: 587,
    tls: false,
    auth: {
      username: "contato@eduzayn.com.br",
      password: "123@mudar",
    },
  },
});

serve(async (req) => {
  // Lidar com solicitações OPTIONS (preflight CORS)
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Verificar autenticação
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Sem token de autenticação" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Extrair o token do cabeçalho Authorization
    const token = authHeader.replace("Bearer ", "");

    // Criar um cliente Supabase para verificar o token
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verificar se o token é válido
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      console.error("Erro de autenticação:", authError);
      return new Response(
        JSON.stringify({ error: "Token de autenticação inválido" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Obter os parâmetros da requisição
    const { to, subject, html } = await req.json();

    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: "Parâmetros obrigatórios ausentes" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Enviar o e-mail
    await smtp.send({
      from: "Portal EduZayn <contato@eduzayn.com.br>",
      to: to,
      subject: subject,
      html: html,
    });

    console.log(`E-mail enviado para ${to}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `E-mail enviado para ${to}` 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // Lidar com erros gerais
    console.error("Erro ao processar solicitação:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao processar a solicitação", details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } finally {
    // Fechar a conexão SMTP após uso
    try {
      await smtp.close();
    } catch (err) {
      console.error("Erro ao fechar conexão SMTP:", err);
    }
  }
});
