
import React from "react";
import { UseFormReturn } from "react-hook-form";
import FormaPagamentoField from "./FormaPagamentoField";
import ValorMatriculaField from "./ValorMatriculaField";
import DatePickerField from "./DatePickerField";
import PagamentoHeader from "./PagamentoHeader";
import ResumoInfoPagamento from "./ResumoInfoPagamento";

interface DetalhesPagamentoProps {
  form: UseFormReturn<any>;
  aluno: any;
  curso: any;
}

const DetalhesPagamento: React.FC<DetalhesPagamentoProps> = ({ form, aluno, curso }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/40 p-4 rounded-lg border">
      <PagamentoHeader />
      
      {/* Forma de Pagamento */}
      <FormaPagamentoField form={form} />
      
      {/* Valor da Matrícula */}
      <ValorMatriculaField form={form} curso={curso} />
      
      {/* Data de Vencimento */}
      <DatePickerField
        form={form}
        name="data_vencimento"
        label="Data de Vencimento"
        className="flex flex-col"
      />
      
      {/* Resumo das informações */}
      <ResumoInfoPagamento form={form} aluno={aluno} curso={curso} />
    </div>
  );
};

export default DetalhesPagamento;
