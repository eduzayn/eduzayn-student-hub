
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormControl, FormDescription } from "@/components/ui/form";
import FormField from "./FormField";

interface ValorMatriculaFieldProps {
  form: UseFormReturn<any>;
  curso: any;
}

const ValorMatriculaField: React.FC<ValorMatriculaFieldProps> = ({ form, curso }) => {
  // Formato de moeda brasileira
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  return (
    <FormField
      form={form}
      name="valor_matricula"
      label="Valor"
    >
      <FormControl>
        <Input
          type="text"
          placeholder="0,00"
          value={form.getValues("valor_matricula") === 0 ? "" : form.getValues("valor_matricula")}
          onChange={(e) => {
            // Remove caracteres não numéricos, exceto vírgula e ponto
            const value = e.target.value.replace(/[^\d.,]/g, "");
            
            // Converte para número (tratando vírgula como decimal)
            const numeroFormatado = value ? parseFloat(value.replace(",", ".")) : 0;
            
            form.setValue("valor_matricula", numeroFormatado);
          }}
        />
      </FormControl>
      <FormDescription>
        Valor mensalidade: {curso?.valor_mensalidade ? formatarMoeda(curso.valor_mensalidade) : "N/A"}
      </FormDescription>
    </FormField>
  );
};

export default ValorMatriculaField;
