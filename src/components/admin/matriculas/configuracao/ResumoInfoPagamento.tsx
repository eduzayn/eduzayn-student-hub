
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ResumoInfoPagamentoProps {
  form: UseFormReturn<any>;
  aluno: any;
  curso: any;
}

const ResumoInfoPagamento: React.FC<ResumoInfoPagamentoProps> = ({
  form,
  aluno,
  curso
}) => {
  // Formato de moeda brasileira
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <div className="md:col-span-2 mt-4 bg-gray-50 p-4 rounded-lg border">
      <h4 className="font-medium mb-2">Resumo</h4>
      <dl className="space-y-1 text-sm">
        <div className="flex justify-between">
          <dt>Aluno:</dt>
          <dd>{aluno?.nome || "N/A"}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Curso:</dt>
          <dd>{curso?.titulo || "N/A"}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Valor:</dt>
          <dd>{form.watch("valor_matricula") ? formatarMoeda(form.watch("valor_matricula")) : "N/A"}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Data de Vencimento:</dt>
          <dd>
            {form.watch("data_vencimento") 
              ? format(form.watch("data_vencimento"), "dd/MM/yyyy", { locale: ptBR }) 
              : "N/A"
            }
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default ResumoInfoPagamento;
