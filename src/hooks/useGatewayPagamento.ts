
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

// URL base correta para funções do Supabase
const SUPABASE_FUNCTION_BASE_URL = "https://bioarzkfmcobctblzztm.supabase.co/functions/v1";

interface AsaasBilling {
  customer: {
    name: string;
    email: string;
    cpfCnpj: string;
  };
  dueDate: string;
  value: number;
  description?: string;
  externalReference?: string;
}

interface LytexBilling {
  customer: {
    name: string;
    email: string;
    cpfCnpj: string;
    mobilePhone?: string;
  };
  payment: {
    value: number;
    dueDate: string;
    description?: string;
    externalReference?: string;
  };
}

const useGatewayPagamento = () => {
  const { getAccessToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const processarPagamento = async (gateway: string, params: any) => {
    setIsLoading(true);
    
    try {
      // Determinar qual gateway usar
      if (gateway.startsWith('asaas')) {
        return await processarPagamentoAsaas(gateway, params);
      } else if (gateway.startsWith('lytex')) {
        return await processarPagamentoLytex(gateway, params);
      } else {
        throw new Error(`Gateway de pagamento não suportado: ${gateway}`);
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      return { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" };
    } finally {
      setIsLoading(false);
    }
  };
  
  const processarPagamentoAsaas = async (gateway: string, params: any) => {
    const { matricula_id, customerData, dueDate, value, description } = params;
    
    const billingData: AsaasBilling = {
      customer: {
        name: customerData.nome,
        email: customerData.email,
        cpfCnpj: customerData.cpf,
      },
      dueDate: dueDate,
      value: value,
      description: description || "Pagamento de matrícula",
      externalReference: matricula_id
    };
    
    // Determinar tipo de pagamento
    let paymentType = "BOLETO";
    if (gateway === "asaas_credit_card") {
      paymentType = "CREDIT_CARD";
    } else if (gateway === "asaas_pix") {
      paymentType = "PIX";
    }
    
    const token = await getAccessToken();
    
    if (!token) {
      throw new Error("Usuário não autenticado");
    }
    
    const response = await fetch(`${SUPABASE_FUNCTION_BASE_URL}/asaas-payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        operation: "create-payment",
        payload: {
          ...billingData,
          paymentType
        }
      })
    });
    
    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ao processar pagamento: ${response.status}`);
      } catch (e) {
        throw new Error(`Erro ao processar pagamento: ${response.status}`);
      }
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || "Falha ao processar pagamento");
    }
    
    return {
      success: true,
      paymentId: data.payment?.id,
      invoiceUrl: data.payment?.invoiceUrl,
    };
  };
  
  const processarPagamentoLytex = async (gateway: string, params: any) => {
    const { matricula_id, customerData, dueDate, value, description } = params;
    
    const billingData: LytexBilling = {
      customer: {
        name: customerData.nome,
        email: customerData.email,
        cpfCnpj: customerData.cpf,
        mobilePhone: customerData.telefone
      },
      payment: {
        value: value,
        dueDate: dueDate,
        description: description || "Pagamento de matrícula",
        externalReference: matricula_id
      }
    };
    
    // Determinar operação baseada no gateway
    let paymentMethod = "BOLETO";
    if (gateway === "lytex_credit_card") {
      paymentMethod = "CREDIT_CARD";
    } else if (gateway === "lytex_pix") {
      paymentMethod = "PIX";
    }
    
    const token = await getAccessToken();
    
    if (!token) {
      throw new Error("Usuário não autenticado");
    }
    
    // Correto uso da URL base para a função Lytex
    const response = await fetch(`${SUPABASE_FUNCTION_BASE_URL}/lytex-integration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        operation: "create-customer-and-payment",
        payload: {
          ...billingData,
          paymentMethod
        }
      })
    });
    
    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ao processar pagamento: ${response.status}`);
      } catch (e) {
        throw new Error(`Erro ao processar pagamento: ${response.status}`);
      }
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || "Falha ao processar pagamento");
    }
    
    return {
      success: true,
      paymentId: data.payment?.id,
      invoiceUrl: data.payment?.invoiceUrl,
      customerId: data.customer?.id
    };
  };
  
  return { processarPagamento, isLoading };
};

export default useGatewayPagamento;
