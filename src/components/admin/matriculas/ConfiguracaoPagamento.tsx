
import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

interface ConfiguracaoPagamentoProps {
  form: UseFormReturn<any>;
  aluno: any;
  curso: any;
}

const ConfiguracaoPagamento: React.FC<ConfiguracaoPagamentoProps> = ({ 
  form,
  aluno,
  curso
}) => {
  const configurarPagamento = form.watch("configurar_pagamento");
  
  // Formato de moeda brasileira
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };
  
  // Ajusta a data de vencimento para o próximo mês se não estiver definida
  useEffect(() => {
    if (configurarPagamento && !form.getValues("data_vencimento")) {
      const dataAtual = new Date();
      const proximoMes = new Date(dataAtual);
      proximoMes.setMonth(dataAtual.getMonth() + 1);
      proximoMes.setDate(10); // Define para o dia 10 do próximo mês
      
      form.setValue("data_vencimento", proximoMes);
    }
    
    // Define o valor da matrícula se não estiver definido
    if (configurarPagamento && !form.getValues("valor_matricula") && curso?.valor_mensalidade) {
      form.setValue("valor_matricula", curso.valor_mensalidade);
    }
  }, [configurarPagamento, curso]);
  
  return (
    <Form {...form}>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Configuração de Pagamento</h2>
        
        {/* Opção para configurar pagamento */}
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
        
        {configurarPagamento && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/40 p-4 rounded-lg border">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Detalhes do Pagamento</h3>
              </div>
            </div>
            
            {/* Forma de Pagamento */}
            <FormField
              control={form.control}
              name="forma_pagamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forma de Pagamento</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a forma de pagamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="asaas_boleto">Boleto (Asaas)</SelectItem>
                      <SelectItem value="asaas_credit_card">Cartão de Crédito (Asaas)</SelectItem>
                      <SelectItem value="asaas_pix">PIX (Asaas)</SelectItem>
                      <SelectItem value="lytex_boleto">Boleto (Lytex)</SelectItem>
                      <SelectItem value="lytex_credit_card">Cartão de Crédito (Lytex)</SelectItem>
                      <SelectItem value="lytex_pix">PIX (Lytex)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Valor da Matrícula */}
            <FormField
              control={form.control}
              name="valor_matricula"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Valor mensalidade: {curso?.valor_mensalidade ? formatarMoeda(curso.valor_mensalidade) : "N/A"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Data de Vencimento */}
            <FormField
              control={form.control}
              name="data_vencimento"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Vencimento</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy", { locale: ptBR })
                          ) : (
                            "Selecione a data de vencimento"
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Resumo das informações */}
            <div className="md:col-span-2 mt-4 bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-medium mb-2">Resumo</h4>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt>Aluno:</dt>
                  <dd>{aluno?.nome || "N/A"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Curso:</dt>
                  <dd>{curso?.titulo || "N/A"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Valor:</dt>
                  <dd>{form.watch("valor_matricula") ? formatarMoeda(form.watch("valor_matricula")) : "N/A"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Data de Vencimento:</dt>
                  <dd>
                    {form.watch("data_vencimento") 
                      ? format(form.watch("data_vencimento"), "dd/MM/yyyy", { locale: ptBR }) 
                      : "N/A"
                    }
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </div>
    </Form>
  );
};

export default ConfiguracaoPagamento;
