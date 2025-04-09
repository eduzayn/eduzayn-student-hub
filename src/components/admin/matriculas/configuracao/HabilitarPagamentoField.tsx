
import React from "react";
import { FormField } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";

interface HabilitarPagamentoFieldProps {
  form: UseFormReturn<any>;
}

const HabilitarPagamentoField: React.FC<HabilitarPagamentoFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="configurar_pagamento"
      render={({ field }) => (
        <div className="flex items-center space-x-3">
          <Switch
            checked={field.value}
            onCheckedChange={field.onChange}
          />
          <Label>Configurar pagamento para essa matrícula</Label>
        </div>
      )}
    />
  );
};

export default HabilitarPagamentoField;
