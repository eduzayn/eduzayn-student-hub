
import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import HabilitarPagamentoField from "./configuracao/HabilitarPagamentoField";
import DetalhesPagamento from "./configuracao/DetalhesPagamento";

interface ConfiguracaoPagamentoProps {
  form: UseFormReturn<any>;
  aluno: any;
  curso: any;
}

const ConfiguracaoPagamento: React.FC<ConfiguracaoPagamentoProps> = ({ 
  form,
  aluno,
  curso
}) => {
  const configurarPagamento = form.watch("configurar_pagamento");
  
  // Ajusta a data de vencimento para o próximo mês se não estiver definida
  useEffect(() => {
    if (configurarPagamento && !form.getValues("data_vencimento")) {
      const dataAtual = new Date();
      const proximoMes = new Date(dataAtual);
      proximoMes.setMonth(dataAtual.getMonth() + 1);
      proximoMes.setDate(10); // Define para o dia 10 do próximo mês
      
      form.setValue("data_vencimento", proximoMes);
    }
    
    // Define o valor da matrícula se não estiver definido
    if (configurarPagamento && !form.getValues("valor_matricula") && curso?.valor_mensalidade) {
      form.setValue("valor_matricula", curso.valor_mensalidade);
    }
  }, [configurarPagamento, curso, form]);
  
  return (
    <Form {...form}>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Configuração de Pagamento</h2>
        
        {/* Opção para configurar pagamento */}
        <HabilitarPagamentoField form={form} />
        
        {configurarPagamento && (
          <DetalhesPagamento form={form} aluno={aluno} curso={curso} />
        )}
      </div>
    </Form>
  );
};

export default ConfiguracaoPagamento;
