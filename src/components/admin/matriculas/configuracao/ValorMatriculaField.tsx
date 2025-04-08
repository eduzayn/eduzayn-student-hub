
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { formatarMoeda } from "@/utils/formatarMoeda";

interface FormFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}

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
    <div className="flex flex-col">
      <label htmlFor="valor_matricula" className="text-sm font-medium mb-1">
        Valor da Matrícula
      </label>
      <div className="flex items-center">
        <span className="mr-2">R$</span>
        <Input
          id="valor_matricula"
          {...form.register("valor_matricula")}
          type="number"
          step="0.01"
          min="0"
          defaultValue={valorCurso}
          onFocus={(e) => e.target.select()}
        />
      </div>
    </div>
  );
};

export default ValorMatriculaField;
