import React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import SelectField from "./configuracao/SelectField";
import DatePickerField from "./configuracao/DatePickerField";
import TextareaField from "./configuracao/TextareaField";
import ValorMatriculaField from "./configuracao/ValorMatriculaField";

interface ConfiguracaoMatriculaProps {
  config: any;
  onChange: (config: any) => void;
  valorCurso?: number;
  onProsseguir: () => Promise<void>;
  isLoading?: boolean;
}

const ConfiguracaoMatricula: React.FC<ConfiguracaoMatriculaProps> = ({ 
  config, 
  onChange, 
  valorCurso = 0,
  onProsseguir,
  isLoading = false
}) => {
  const form = useForm({
    defaultValues: {
      status: config.status || "ativo",
      data_inicio: config.data_inicio || new Date().toISOString().split('T')[0],
      forma_pagamento: config.forma_pagamento || "pix",
      valor_matricula: config.valor_matricula || valorCurso,
      observacoes: config.observacoes || "",
      com_pagamento: config.com_pagamento !== undefined ? config.com_pagamento : true
    }
  });

  // Atualiza o estado pai quando os valores do formulário mudam
  const handleFormChange = () => {
    const values = form.getValues();
    onChange(values);
  };

  // Observa as mudanças do formulário
  React.useEffect(() => {
    const subscription = form.watch(handleFormChange);
    return () => subscription.unsubscribe();
  }, [form, form.watch]);

  const statusOptions = [
    { value: "ativo", label: "Ativo" },
    { value: "inativo", label: "Inativo" },
    { value: "trancado", label: "Trancado" },
    { value: "formado", label: "Formado" }
  ];

  const formasPagamento = [
    { value: "pix", label: "PIX" },
    { value: "boleto", label: "Boleto" },
    { value: "cartao", label: "Cartão de Crédito" },
    { value: "dinheiro", label: "Dinheiro" },
    { value: "isento", label: "Isento" }
  ];

  return (
    <Form {...form}>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Configuração da Matrícula</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status */}
          <SelectField
            form={form}
            name="status"
            label="Status"
            options={statusOptions}
            placeholder="Selecione o status"
          />
          
          {/* Data de Início */}
          <DatePickerField
            form={form}
            name="data_inicio"
            label="Data de Início"
            className="flex flex-col"
          />
          
          {/* Forma de Pagamento */}
          <SelectField
            form={form}
            name="forma_pagamento"
            label="Forma de Pagamento"
            options={formasPagamento}
            placeholder="Selecione a forma de pagamento"
          />
          
          {/* Valor da Matrícula */}
          <ValorMatriculaField 
            form={form} 
            curso={{ valor_mensalidade: valorCurso }}
          />
          
          {/* Observações */}
          <TextareaField
            form={form}
            name="observacoes"
            label="Observações"
            placeholder="Informações adicionais sobre a matrícula..."
            className="md:col-span-2"
          />
        </div>

        <div className="flex justify-end mt-6">
          <Button 
            onClick={onProsseguir}
            disabled={isLoading}
          >
            {isLoading ? "Processando..." : "Prosseguir"}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default ConfiguracaoMatricula;
