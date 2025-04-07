
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  const { method } = req;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // ou substitua por seu domínio exato
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

  if (method === "GET") {
    return new Response(JSON.stringify({
      message: "LearnWorlds API online",
      timestamp: new Date().toISOString()
    }), {
      headers: corsHeaders,
      status: 200
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
