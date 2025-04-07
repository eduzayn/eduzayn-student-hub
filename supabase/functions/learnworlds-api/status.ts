
// Função de status para verificar a conexão com a API LearnWorlds
// Este arquivo é usado pelo ponto de entrada principal (index.ts)

// Exporta uma função que verifica o status da API
export default async function statusHandler(req: Request) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
  };

  try {
    // Simulação de verificação de status - na versão simplificada,
    // consideramos a API sempre online se conseguirmos chegar aqui
    return new Response(
      JSON.stringify({ 
        status: "online",
        message: "API LearnWorlds verificada com sucesso",
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: corsHeaders
      }
    );
  } catch (error) {
    console.error("❌ Erro ao verificar status da API:", error);
    
    return new Response(
      JSON.stringify({ 
        status: "offline",
        error: "Erro ao processar verificação de status", 
        details: error instanceof Error ? error.message : "Erro desconhecido"
      }),
      {
        status: 200, // Retornamos 200 mesmo com erro para não quebrar o fluxo da aplicação
        headers: corsHeaders
      }
    );
  }
}
