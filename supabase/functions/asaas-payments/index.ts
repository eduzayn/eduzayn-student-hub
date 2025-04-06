
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Função para lidar com solicitação CORS preflight
function handleCors(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }
  return null;
}

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Obter a chave da API do Asaas dos secrets
    // Usando Client Secret em vez de API Key, conforme mostrado na imagem
    const ASAAS_CLIENT_SECRET = Deno.env.get("ASAAS_CLIENT_SECRET");
    // URL base da API do Asaas (sandbox para testes)
    const ASAAS_BASE_URL = "https://sandbox.asaas.com/api/v3";

    if (!ASAAS_CLIENT_SECRET) {
      throw new Error("Client Secret do Asaas não configurado");
    }

    const { operation, payload } = await req.json();

    let responseData;

    // Realizar operação com base no tipo solicitado
    switch (operation) {
      case "create-customer":
        // Criar um cliente no Asaas
        responseData = await createCustomer(ASAAS_BASE_URL, ASAAS_CLIENT_SECRET, payload);
        break;

      case "create-payment":
        // Criar um pagamento no Asaas
        responseData = await createPayment(ASAAS_BASE_URL, ASAAS_CLIENT_SECRET, payload);
        break;
        
      case "create-customer-and-payment":
        // Criar cliente e pagamento em uma operação
        responseData = await createCustomerAndPayment(ASAAS_BASE_URL, ASAAS_CLIENT_SECRET, payload);
        break;

      case "check-payment":
        // Verificar status de um pagamento
        responseData = await checkPayment(ASAAS_BASE_URL, ASAAS_CLIENT_SECRET, payload.id);
        break;

      default:
        throw new Error("Operação desconhecida");
    }

    // Retornar os dados
    return new Response(
      JSON.stringify({ success: true, ...responseData }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  } catch (error) {
    console.error(`Erro na função Asaas Payments:`, error.message);
    
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      }
    );
  }
});

// Função para criar um cliente no Asaas
async function createCustomer(baseUrl: string, clientSecret: string, customerData: any) {
  const response = await fetch(`${baseUrl}/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "access_token": clientSecret // Usando Client Secret em vez de API Key
    },
    body: JSON.stringify(customerData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Erro ao criar cliente: ${errorData.errors?.[0]?.description || response.statusText}`);
  }

  const customer = await response.json();
  return { customer };
}

// Função para criar um pagamento no Asaas
async function createPayment(baseUrl: string, clientSecret: string, paymentData: any) {
  const response = await fetch(`${baseUrl}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "access_token": clientSecret // Usando Client Secret em vez de API Key
    },
    body: JSON.stringify(paymentData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Erro ao criar pagamento: ${errorData.errors?.[0]?.description || response.statusText}`);
  }

  const payment = await response.json();
  return { payment };
}

// Função para criar cliente e pagamento em uma operação
async function createCustomerAndPayment(baseUrl: string, clientSecret: string, data: any) {
  // Primeiro, criar ou buscar o cliente
  let customer;
  
  // Verificar se o cliente já existe pelo CPF/CNPJ
  const searchResponse = await fetch(
    `${baseUrl}/customers?cpfCnpj=${encodeURIComponent(data.customer.cpfCnpj)}`, 
    {
      headers: {
        "access_token": clientSecret // Usando Client Secret em vez de API Key
      }
    }
  );
  
  const searchResult = await searchResponse.json();
  
  if (searchResult.data && searchResult.data.length > 0) {
    // Cliente já existe
    customer = searchResult.data[0];
    console.log("Cliente existente encontrado:", customer.id);
  } else {
    // Criar novo cliente
    const customerResult = await createCustomer(baseUrl, clientSecret, data.customer);
    customer = customerResult.customer;
    console.log("Novo cliente criado:", customer.id);
  }
  
  // Em seguida, criar o pagamento usando o ID do cliente
  const paymentData = {
    ...data.payment,
    customer: customer.id
  };
  
  const paymentResult = await createPayment(baseUrl, clientSecret, paymentData);
  
  return {
    customer,
    payment: paymentResult.payment
  };
}

// Função para verificar o status de um pagamento
async function checkPayment(baseUrl: string, clientSecret: string, paymentId: string) {
  const response = await fetch(`${baseUrl}/payments/${paymentId}`, {
    headers: {
      "Content-Type": "application/json",
      "access_token": clientSecret // Usando Client Secret em vez de API Key
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Erro ao verificar pagamento: ${errorData.errors?.[0]?.description || response.statusText}`);
  }

  const payment = await response.json();
  return { payment };
}
