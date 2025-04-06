
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PagamentoInput {
  matricula_id: string;
  aluno_nome: string;
  aluno_email: string;
  aluno_cpf: string;
  valor: number;
  descricao: string;
  data_vencimento: string;
  forma_pagamento: string;
  parcelamento?: number;
}

export function useGatewayPagamento() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const processarPagamentoAsaas = async (pagamento: PagamentoInput) => {
    setLoading(true);
    setError(null);

    try {
      // Chamar a edge function para criar o cliente e o pagamento no Asaas
      const { data, error: fnError } = await supabase.functions.invoke('asaas-payments', {
        body: {
          operation: 'create-customer-and-payment',
          payload: {
            customer: {
              name: pagamento.aluno_nome,
              email: pagamento.aluno_email,
              cpfCnpj: pagamento.aluno_cpf
            },
            payment: {
              billingType: pagamento.forma_pagamento,
              value: pagamento.valor,
              dueDate: pagamento.data_vencimento,
              description: pagamento.descricao,
              installmentCount: pagamento.parcelamento || 1
            }
          }
        }
      });

      if (fnError) throw new Error(fnError.message);
      if (!data.success) throw new Error(data.message || 'Falha ao processar pagamento');

      // Salvar o registro de pagamento no banco de dados
      const { error: dbError } = await supabase
        .from('pagamentos_matricula')
        .insert([{
          matricula_id: pagamento.matricula_id,
          tipo: pagamento.parcelamento && pagamento.parcelamento > 1 ? 'parcelado' : 'único',
          forma_pagamento: pagamento.forma_pagamento,
          gateway: 'asaas',
          valor: pagamento.valor,
          data_vencimento: pagamento.data_vencimento,
          status: 'pendente',
          gateway_payment_id: data.payment.id,
          link_pagamento: data.payment.invoiceUrl
        }]);

      if (dbError) throw dbError;

      toast.success('Pagamento processado com sucesso!');
      return { success: true, data: data.payment };
    } catch (err: any) {
      const errorMsg = err.message || 'Erro ao processar pagamento';
      setError(new Error(errorMsg));
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const processarPagamentoLytex = async (pagamento: PagamentoInput) => {
    setLoading(true);
    setError(null);

    try {
      // Este é um exemplo simulado, já que a integração Lytex ainda não está implementada
      // Aqui você chamaria a edge function correspondente

      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.info('Integração com Lytex ainda não implementada completamente');
      
      // Salvar o registro de pagamento no banco de dados (simulação)
      const { data, error: dbError } = await supabase
        .from('pagamentos_matricula')
        .insert([{
          matricula_id: pagamento.matricula_id,
          tipo: pagamento.parcelamento && pagamento.parcelamento > 1 ? 'parcelado' : 'único',
          forma_pagamento: pagamento.forma_pagamento,
          gateway: 'lytex',
          valor: pagamento.valor,
          data_vencimento: pagamento.data_vencimento,
          status: 'pendente',
          gateway_payment_id: `LYTEX-${Date.now()}`,
          link_pagamento: '#'
        }])
        .select();

      if (dbError) throw dbError;

      toast.success('Pagamento registrado com sucesso!');
      return { success: true, data };
    } catch (err: any) {
      const errorMsg = err.message || 'Erro ao processar pagamento';
      setError(new Error(errorMsg));
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    processarPagamentoAsaas,
    processarPagamentoLytex
  };
}
