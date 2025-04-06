
import React from "react";
import { UseFormReturn } from "react-hook-form";
import SelectField from "./SelectField";

interface FormaPagamentoFieldProps {
  form: UseFormReturn<any>;
}

const FormaPagamentoField: React.FC<FormaPagamentoFieldProps> = ({ form }) => {
  const opcoesPagamento = [
    { value: "asaas_boleto", label: "Boleto (Asaas)" },
    { value: "asaas_credit_card", label: "Cartão de Crédito (Asaas)" },
    { value: "asaas_pix", label: "PIX (Asaas)" },
    { value: "lytex_boleto", label: "Boleto (Lytex)" },
    { value: "lytex_credit_card", label: "Cartão de Crédito (Lytex)" },
    { value: "lytex_pix", label: "PIX (Lytex)" }
  ];

  return (
    <SelectField
      form={form}
      name="forma_pagamento"
      label="Forma de Pagamento"
      options={opcoesPagamento}
      placeholder="Selecione a forma de pagamento"
    />
  );
};

export default FormaPagamentoField;
