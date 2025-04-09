
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface ValorMatriculaFieldProps {
  form: UseFormReturn<any>;
  curso: {
    valor_mensalidade?: number;
  };
}

const ValorMatriculaField: React.FC<ValorMatriculaFieldProps> = ({ 
  form, 
  curso 
}) => {
  return (
    <FormField
      control={form.control}
      name="valor_matricula"
      render={({ field }) => {
        // Converte para número antes de exibir
        const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const valor = parseFloat(e.target.value);
          field.onChange(isNaN(valor) ? 0 : valor);
        };

        return (
          <FormItem>
            <FormLabel>Valor da Matrícula</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                value={field.value} 
                onChange={handleValueChange}
                min={0}
                step={0.01}
                placeholder={curso.valor_mensalidade ? `Valor sugerido: R$ ${curso.valor_mensalidade.toFixed(2)}` : "Informe o valor"} 
              />
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};

export default ValorMatriculaField;
