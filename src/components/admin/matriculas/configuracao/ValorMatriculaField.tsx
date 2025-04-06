
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
          type="number"
          step="0.01"
          placeholder="0.00"
          value={form.getValues("valor_matricula") || ""}
          onChange={(e) => form.setValue("valor_matricula", parseFloat(e.target.value))}
        />
      </FormControl>
      <FormDescription>
        Valor mensalidade: {curso?.valor_mensalidade ? formatarMoeda(curso.valor_mensalidade) : "N/A"}
      </FormDescription>
    </FormField>
  );
};

export default ValorMatriculaField;
