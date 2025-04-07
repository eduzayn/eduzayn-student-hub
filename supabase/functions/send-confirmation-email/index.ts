
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    // Obter os parâmetros da requisição
    const { email, confirmationUrl } = await req.json();

    if (!email || !confirmationUrl) {
      return new Response(
        JSON.stringify({ error: "Email e URL de confirmação são obrigatórios" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Construir o template de email
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #4f46e5;">EduZayn</h1>
        </div>
        <div style="background-color: #f9fafb; border-radius: 10px; padding: 20px; border: 1px solid #e5e7eb;">
          <h2 style="color: #1f2937; margin-top: 0;">Confirme seu endereço de e-mail</h2>
          <p style="color: #4b5563; line-height: 1.5;">
            Obrigado por se cadastrar na EduZayn! Para completar seu registro, por favor confirme seu endereço de e-mail clicando no botão abaixo:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Confirmar meu e-mail
            </a>
          </div>
          <p style="color: #4b5563; line-height: 1.5;">
            Se você não criou uma conta, pode ignorar este e-mail com segurança.
          </p>
          <p style="color: #4b5563; line-height: 1.5;">
            Se o botão acima não funcionar, copie e cole o link a seguir em seu navegador:
          </p>
          <p style="background-color: #e5e7eb; padding: 10px; border-radius: 4px; word-break: break-all;">
            ${confirmationUrl}
          </p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px;">
          <p>© 2025 EduZayn. Todos os direitos reservados.</p>
        </div>
      </div>
    `;

    // Enviar o e-mail
    await smtp.send({
      from: "Portal EduZayn <contato@eduzayn.com.br>",
      to: email,
      subject: "Confirme seu e-mail - EduZayn",
      html: html,
    });

    console.log(`E-mail de confirmação enviado para ${email}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `E-mail de confirmação enviado para ${email}` 
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
