
import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { formatarMoeda } from "@/utils/formatarMoeda";

interface ValorMatriculaFieldProps {
  form: UseFormReturn<any>;
  curso?: any;
}

const ValorMatriculaField: React.FC<ValorMatriculaFieldProps> = ({ 
  form,
  curso
}) => {
  // Definir o valor do curso com fallbacks adequados
  const valorCurso = curso?.valor_mensalidade || curso?.price_final || curso?.price || 0;
  
  // Atualizar o valor no formulário quando o curso mudar
  useEffect(() => {
    if (valorCurso > 0) {
      form.setValue("valor_matricula", valorCurso);
    }
  }, [curso, valorCurso, form]);

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
