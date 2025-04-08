
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { formatarMoeda } from "@/utils/formatarMoeda";
import FormField from "./FormField";

interface ValorMatriculaFieldProps {
  form: UseFormReturn<any>;
  curso?: any;
}

const ValorMatriculaField: React.FC<ValorMatriculaFieldProps> = ({ 
  form,
  curso
}) => {
  const valorCurso = curso?.valor_mensalidade || 0;

  return (
    <FormField
      form={form}
      name="valor_matricula"
      label="Valor da Matrícula"
      className="flex flex-col"
    >
      {field => (
        <div className="flex items-center">
          <span className="mr-2">R$</span>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={field.value || valorCurso}
            onChange={field.onChange}
            onFocus={(e) => e.target.select()}
          />
        </div>
      )}
    </FormField>
  );
};

export default ValorMatriculaField;
