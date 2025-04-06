
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import SelectField from "./configuracao/SelectField";
import DatePickerField from "./configuracao/DatePickerField";
import TextareaField from "./configuracao/TextareaField";

interface ConfiguracaoMatriculaProps {
  form: UseFormReturn<any>;
}

const ConfiguracaoMatricula: React.FC<ConfiguracaoMatriculaProps> = ({ form }) => {
  const statusOptions = [
    { value: "ativo", label: "Ativo" },
    { value: "pendente", label: "Pendente" },
    { value: "trancado", label: "Trancado" },
    { value: "formado", label: "Formado" },
    { value: "inativo", label: "Inativo" }
  ];

  const formaIngressoOptions = [
    { value: "Online", label: "Online" },
    { value: "Presencial", label: "Presencial" },
    { value: "Transferência", label: "Transferência" },
    { value: "Reingresso", label: "Reingresso" },
    { value: "Bolsa", label: "Bolsa" }
  ];

  const origemMatriculaOptions = [
    { value: "Site", label: "Site" },
    { value: "Indicação", label: "Indicação" },
    { value: "Parceria", label: "Parceria" },
    { value: "Presencial", label: "Presencial" },
    { value: "Campanha Marketing", label: "Campanha de Marketing" }
  ];

  const turnoOptions = [
    { value: "Matutino", label: "Matutino" },
    { value: "Vespertino", label: "Vespertino" },
    { value: "Noturno", label: "Noturno" },
    { value: "Integral", label: "Integral" },
    { value: "Livre", label: "Livre" }
  ];

  return (
    <Form {...form}>
      <div className="space-y-4">
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
          
          {/* Forma de Ingresso */}
          <SelectField
            form={form}
            name="forma_ingresso"
            label="Forma de Ingresso"
            options={formaIngressoOptions}
            placeholder="Selecione a forma de ingresso"
          />
          
          {/* Origem da Matrícula */}
          <SelectField
            form={form}
            name="origem_matricula"
            label="Origem da Matrícula"
            options={origemMatriculaOptions}
            placeholder="Selecione a origem"
          />
          
          {/* Turno */}
          <SelectField
            form={form}
            name="turno"
            label="Turno"
            options={turnoOptions}
            placeholder="Selecione o turno"
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
      </div>
    </Form>
  );
};

export default ConfiguracaoMatricula;
