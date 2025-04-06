
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

interface HabilitarPagamentoFieldProps {
  form: UseFormReturn<any>;
}

const HabilitarPagamentoField: React.FC<HabilitarPagamentoFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="configurar_pagamento"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Configurar Pagamento</FormLabel>
            <FormDescription>
              Gerar link de pagamento para a matrícula
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default HabilitarPagamentoField;
