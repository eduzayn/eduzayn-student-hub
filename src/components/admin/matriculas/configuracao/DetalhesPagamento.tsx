
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface DetalhesPagamentoProps {
  form: UseFormReturn<any>;
  aluno: any;
  curso: any;
}

const DetalhesPagamento: React.FC<DetalhesPagamentoProps> = ({ form, aluno, curso }) => {
  return (
    <div className="space-y-6 bg-slate-50 p-4 rounded-lg border">
      <h3 className="text-lg font-medium">Detalhes do Pagamento</h3>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Valor da Matrícula */}
        <FormField
          control={form.control}
          name="valor_matricula"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor (R$)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  value={field.value}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        {/* Data de Vencimento */}
        <FormField
          control={form.control}
          name="data_vencimento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Vencimento</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field}
                  value={typeof field.value === 'string' ? field.value : field.value?.toISOString().split('T')[0]}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        {/* Forma de Pagamento */}
        <FormField
          control={form.control}
          name="forma_pagamento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Forma de Pagamento</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a forma de pagamento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="boleto">Boleto</SelectItem>
                  <SelectItem value="cartao">Cartão de Crédito</SelectItem>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="isento">Isento</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        
        {/* Número de Parcelas */}
        <FormField
          control={form.control}
          name="num_parcelas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Parcelas</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1" 
                  max="12"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  value={field.value || 1}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default DetalhesPagamento;
