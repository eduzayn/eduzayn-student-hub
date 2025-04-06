
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface GatewayPaymentParams {
  matricula_id: string;
  valor: number;
  data_vencimento: string;
  forma_pagamento: string;
  customerData: {
    name: string;
    email: string;
    cpfCnpj: string;
  };
  description?: string;
}

// Interface para os tipos de gateway de pagamento disponíveis
export type GatewayType = 'asaas' | 'lytex';

export const useGatewayPagamento = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Processa um pagamento usando o gateway Asaas
   */
  const processarPagamentoAsaas = async (params: GatewayPaymentParams) => {
    setLoading(true);
    setError(null);
    
    try {
      // Chamar a edge function para processar o pagamento
      const response = await supabase.functions.invoke('asaas-payments', {
        body: {
          operation: "create-customer-and-payment",
          payload: {
            customer: params.customerData,
            payment: {
              customer: "id_sera_substituido", // Será substituído pela função
              billingType: params.forma_pagamento,
              value: params.valor,
              dueDate: params.data_vencimento,
              description: params.description || `Matrícula - Pagamento`
            }
          }
        }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Erro ao processar pagamento no Asaas');
      }

      // Registrar o pagamento no banco de dados
      const { data: pagamentoData, error: pagamentoError } = await supabase
        .from('pagamentos_matricula')
        .insert([
          {
            matricula_id: params.matricula_id,
            tipo: 'matricula',
            forma_pagamento: params.forma_pagamento,
            gateway: 'asaas',
            valor: params.valor,
            data_vencimento: params.data_vencimento,
            status: 'pendente',
            gateway_payment_id: response.data.payment.id,
            link_pagamento: response.data.payment.invoiceUrl
          }
        ]);

      if (pagamentoError) {
        throw new Error(`Erro ao registrar pagamento: ${pagamentoError.message}`);
      }

      return {
        success: true,
        paymentId: response.data.payment.id,
        invoiceUrl: response.data.payment.invoiceUrl,
        customerCreated: response.data.customer
      };
    } catch (err: any) {
      const errorMsg = err.message || 'Erro ao processar pagamento';
      setError(errorMsg);
      toast.error(errorMsg);
      return {
        success: false,
        error: errorMsg
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Processa um pagamento usando o gateway Lytex
   */
  const processarPagamentoLytex = async (params: GatewayPaymentParams) => {
    setLoading(true);
    setError(null);
    
    try {
      // Chamar a edge function para processar o pagamento
      const response = await supabase.functions.invoke('lytex-integration', {
        body: {
          operation: "create-customer-and-payment",
          payload: {
            customer: params.customerData,
            payment: {
              customer: "id_sera_substituido", // Será substituído pela função
              billingType: params.forma_pagamento,
              value: params.valor,
              dueDate: params.data_vencimento,
              description: params.description || `Matrícula - Pagamento`
            }
          }
        }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Erro ao processar pagamento no Lytex');
      }

      // Registrar o pagamento no banco de dados
      const { data: pagamentoData, error: pagamentoError } = await supabase
        .from('pagamentos_matricula')
        .insert([
          {
            matricula_id: params.matricula_id,
            tipo: 'matricula',
            forma_pagamento: params.forma_pagamento,
            gateway: 'lytex',
            valor: params.valor,
            data_vencimento: params.data_vencimento,
            status: 'pendente',
            gateway_payment_id: response.data.payment.id,
            link_pagamento: response.data.payment.invoiceUrl
          }
        ]);

      if (pagamentoError) {
        throw new Error(`Erro ao registrar pagamento: ${pagamentoError.message}`);
      }

      return {
        success: true,
        paymentId: response.data.payment.id,
        invoiceUrl: response.data.payment.invoiceUrl,
        customerCreated: response.data.customer
      };
    } catch (err: any) {
      const errorMsg = err.message || 'Erro ao processar pagamento';
      setError(errorMsg);
      toast.error(errorMsg);
      return {
        success: false,
        error: errorMsg
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Processa um pagamento com base no gateway escolhido
   */
  const processarPagamento = async (gateway: GatewayType, params: GatewayPaymentParams) => {
    if (gateway === 'asaas') {
      return processarPagamentoAsaas(params);
    } else if (gateway === 'lytex') {
      return processarPagamentoLytex(params);
    } else {
      const errorMsg = 'Gateway de pagamento inválido';
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  return {
    loading,
    error,
    processarPagamento
  };
};
