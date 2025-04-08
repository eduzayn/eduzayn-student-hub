
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, ArrowRight, AlertTriangle } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MatriculaStep3Props {
  alunoSelecionado: any;
  cursoSelecionado: any;
  matriculaConfig: any;
  onChange: (config: any) => void;
  onProsseguir: () => void;
  prevStep: () => void;
  isLoading: boolean;
}

const MatriculaStep3: React.FC<MatriculaStep3Props> = ({
  alunoSelecionado,
  cursoSelecionado,
  matriculaConfig,
  onChange,
  onProsseguir,
  prevStep,
  isLoading
}) => {
  const [comPagamento, setComPagamento] = useState(matriculaConfig.com_pagamento);
  const [valorTotal, setValorTotal] = useState(matriculaConfig.valor_total || 0);
  const [valorMensal, setValorMensal] = useState(matriculaConfig.valor_matricula || 0);
  
  // Use um valor padrão para o formulário
  const form = useForm({
    defaultValues: {
      data_inicio: matriculaConfig.data_inicio || format(new Date(), 'yyyy-MM-dd'),
      valor_matricula: matriculaConfig.valor_matricula || 0,
      valor_total: matriculaConfig.valor_total || 0,
      forma_pagamento: matriculaConfig.forma_pagamento || 'pix',
      observacoes: matriculaConfig.observacoes || '',
      status: matriculaConfig.status || 'ativo',
      com_pagamento: matriculaConfig.com_pagamento
    }
  });
  
  // Atualiza os valores quando o valorTotal muda
  const handleValorTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = Number(e.target.value);
    setValorTotal(valor);
    
    // Calcula o valor da mensalidade (dividido por 12 meses)
    const mensalidade = valor / 12;
    setValorMensal(mensalidade);
    
    form.setValue('valor_total', valor);
    form.setValue('valor_matricula', mensalidade);
  };
  
  // Atualiza os valores quando o valorMensal muda
  const handleValorMensalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = Number(e.target.value);
    setValorMensal(valor);
    
    // Calcula o valor total (multiplicado por 12 meses)
    const total = valor * 12;
    setValorTotal(total);
    
    form.setValue('valor_matricula', valor);
    form.setValue('valor_total', total);
  };
  
  const handleSubmit = (data: any) => {
    const novaConfig = {
      ...data,
      com_pagamento: comPagamento,
      valor_total: valorTotal,
      valor_matricula: valorMensal
    };
    
    onChange(novaConfig);
    onProsseguir();
  };
  
  const handleComPagamentoChange = (checked: boolean) => {
    setComPagamento(checked);
    form.setValue('com_pagamento', checked);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Configurar Matrícula</h2>
        <p className="text-sm text-gray-500">
          Defina os detalhes da matrícula para {alunoSelecionado?.nome} no curso {cursoSelecionado?.titulo || cursoSelecionado?.title}
        </p>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
        <h3 className="font-medium text-blue-800 mb-2">Informações do Curso</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-blue-700">Curso</p>
            <p className="text-sm">{cursoSelecionado?.titulo || cursoSelecionado?.title}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-700">Código</p>
            <p className="text-sm">{cursoSelecionado?.codigo || cursoSelecionado?.id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-700">Modalidade</p>
            <p className="text-sm">{cursoSelecionado?.modalidade || 'EAD'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-700">Carga Horária</p>
            <p className="text-sm">{cursoSelecionado?.carga_horaria || cursoSelecionado?.duration || '0'} min</p>
          </div>
          {cursoSelecionado?.learning_worlds_id && (
            <div className="col-span-2">
              <p className="text-sm font-medium text-blue-700">ID LearnWorlds</p>
              <p className="text-sm font-mono">{cursoSelecionado?.learning_worlds_id || cursoSelecionado?.id}</p>
            </div>
          )}
          {cursoSelecionado?.simulado && (
            <div className="col-span-2 mt-2">
              <Alert variant="warning" className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription>
                  Este é um curso simulado que não existe no LearnWorlds. Use apenas para fins de teste.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="data_inicio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Início</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                      <SelectItem value="trancado">Trancado</SelectItem>
                      <SelectItem value="formado">Formado</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          
          <Separator />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Pagamento</h3>
              <div className="flex items-center space-x-2">
                <Switch
                  id="com-pagamento"
                  checked={comPagamento}
                  onCheckedChange={handleComPagamentoChange}
                />
                <label
                  htmlFor="com-pagamento"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Gerar cobrança
                </label>
              </div>
            </div>
            
            {comPagamento && (
              <div className="space-y-6 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Campo de Valor Total */}
                  <FormItem>
                    <FormLabel>Valor Total do Curso (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        min="0"
                        value={valorTotal} 
                        onChange={handleValorTotalChange}
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </FormControl>
                  </FormItem>
                  
                  {/* Campo de Valor da Matrícula/Mensalidade */}
                  <FormItem>
                    <FormLabel>Valor da Mensalidade (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.01" 
                        min="0"
                        value={valorMensal}
                        onChange={handleValorMensalChange}
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </FormControl>
                  </FormItem>
                </div>
                
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
                          <SelectItem value="pix">PIX</SelectItem>
                          <SelectItem value="boleto">Boleto</SelectItem>
                          <SelectItem value="cartao">Cartão de Crédito</SelectItem>
                          <SelectItem value="isento">Isento</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
          
          <FormField
            control={form.control}
            name="observacoes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Informações adicionais sobre a matrícula"
                    className="h-24"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={prevStep}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  Prosseguir
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MatriculaStep3;
