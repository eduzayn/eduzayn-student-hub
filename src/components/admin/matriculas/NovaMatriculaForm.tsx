
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SelectAluno from "./SelectAluno";
import SelectCurso from "./SelectCurso";
import ConfiguracaoMatricula from "./ConfiguracaoMatricula";
import ConfiguracaoPagamento from "./ConfiguracaoPagamento";
import { useMatricula } from "@/hooks/useMatricula";
import type { Matricula } from "@/types/matricula";

const novaMatriculaSchema = z.object({
  aluno_id: z.string().uuid("Selecione um aluno válido"),
  curso_id: z.string().uuid("Selecione um curso válido"),
  data_inicio: z.date({
    required_error: "A data de início é obrigatória",
  }),
  status: z.enum(["pendente", "ativo", "trancado", "formado", "inativo"], {
    required_error: "Selecione um status",
  }).default("ativo"),
  forma_ingresso: z.string().optional(),
  origem_matricula: z.string().optional(),
  turno: z.string().optional(),
  observacoes: z.string().optional(),
  configurar_pagamento: z.boolean().default(false),
  forma_pagamento: z.string().optional(),
  valor_matricula: z.number().optional(),
  data_vencimento: z.date().optional(),
});

type NovaMatriculaForm = z.infer<typeof novaMatriculaSchema>;

const NovaMatriculaForm: React.FC = () => {
  const navigate = useNavigate();
  const { criarMatricula } = useMatricula();
  const { useGatewayPagamento } = require("@/hooks/useGatewayPagamento");
  const { processarPagamento } = useGatewayPagamento();
  
  const [activeTab, setActiveTab] = useState("aluno");
  const [submitting, setSubmitting] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState<any>(null);
  const [cursoSelecionado, setCursoSelecionado] = useState<any>(null);
  
  const form = useForm<NovaMatriculaForm>({
    resolver: zodResolver(novaMatriculaSchema),
    defaultValues: {
      status: "ativo",
      data_inicio: new Date(),
      configurar_pagamento: false,
    },
  });
  
  const handleSubmit = async (data: NovaMatriculaForm) => {
    setSubmitting(true);
    
    try {
      // Preparar os dados da matrícula para o formato correto
      const matriculaData: Omit<Matricula, "id"> = {
        aluno_id: data.aluno_id,
        curso_id: data.curso_id,
        data_inicio: data.data_inicio.toISOString(),
        status: data.status,
        forma_ingresso: data.forma_ingresso || "",
        origem_matricula: data.origem_matricula || "",
        turno: data.turno || "",
        observacoes: data.observacoes || "",
        progresso: 0
      };
      
      // Criar a matrícula no sistema
      const resultado = await criarMatricula(matriculaData);
      
      if (!resultado) {
        throw new Error("Falha ao criar a matrícula");
      }
      
      // Se configurar pagamento está ativado, processar pagamento
      if (data.configurar_pagamento && data.forma_pagamento && data.valor_matricula && data.data_vencimento && alunoSelecionado) {
        // Configurar pagamento através do gateway selecionado
        const gateway = data.forma_pagamento.startsWith("asaas") ? 'asaas' : 'lytex';
        
        const pagamentoParams = {
          matricula_id: resultado.id,
          valor: data.valor_matricula,
          data_vencimento: data.data_vencimento.toISOString().split('T')[0],
          forma_pagamento: data.forma_pagamento,
          customerData: {
            name: alunoSelecionado.nome,
            email: alunoSelecionado.email,
            cpfCnpj: alunoSelecionado.cpf || "00000000000"
          },
          description: `Matrícula - ${cursoSelecionado?.titulo || 'Curso'}`
        };
        
        const resultadoPagamento = await processarPagamento(gateway, pagamentoParams);
        
        if (!resultadoPagamento.success) {
          toast.warning("Matrícula criada, mas houve um problema ao configurar o pagamento");
        } else {
          toast.success("Matrícula e pagamento configurados com sucesso!");
        }
      } else {
        toast.success("Matrícula criada com sucesso!");
      }
      
      // Redirecionar para a lista de matrículas
      navigate("/admin/matriculas");
    } catch (error: any) {
      console.error("Erro ao criar matrícula:", error);
      toast.error(error.message || "Erro ao criar a matrícula");
    } finally {
      setSubmitting(false);
    }
  };
  
  // Avançar para a próxima aba do formulário
  const proximaAba = () => {
    if (activeTab === "aluno") setActiveTab("curso");
    else if (activeTab === "curso") setActiveTab("configuracao");
    else if (activeTab === "configuracao") setActiveTab("pagamento");
  };
  
  // Voltar para a aba anterior do formulário
  const voltarAba = () => {
    if (activeTab === "pagamento") setActiveTab("configuracao");
    else if (activeTab === "configuracao") setActiveTab("curso");
    else if (activeTab === "curso") setActiveTab("aluno");
  };
  
  // Quando um aluno é selecionado
  const handleAlunoSelecionado = (aluno: any) => {
    setAlunoSelecionado(aluno);
    form.setValue("aluno_id", aluno.id);
    if (Object.keys(form.formState.errors).length === 0) {
      proximaAba();
    }
  };
  
  // Quando um curso é selecionado
  const handleCursoSelecionado = (curso: any) => {
    setCursoSelecionado(curso);
    form.setValue("curso_id", curso.id);
    if (Object.keys(form.formState.errors).length === 0) {
      proximaAba();
    }
  };
  
  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="aluno">1. Aluno</TabsTrigger>
          <TabsTrigger value="curso">2. Curso</TabsTrigger>
          <TabsTrigger value="configuracao">3. Configuração</TabsTrigger>
          <TabsTrigger value="pagamento">4. Pagamento</TabsTrigger>
        </TabsList>
        
        <Card>
          <CardContent className="pt-6">
            <TabsContent value="aluno">
              <SelectAluno onAlunoSelecionado={handleAlunoSelecionado} />
              
              <div className="flex justify-end mt-6">
                <Button type="button" onClick={proximaAba} disabled={!form.getValues("aluno_id")}>
                  Próximo
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="curso">
              <SelectCurso onCursoSelecionado={handleCursoSelecionado} />
              
              <div className="flex justify-between mt-6">
                <Button type="button" variant="outline" onClick={voltarAba}>
                  Voltar
                </Button>
                <Button type="button" onClick={proximaAba} disabled={!form.getValues("curso_id")}>
                  Próximo
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="configuracao">
              <ConfiguracaoMatricula form={form} />
              
              <div className="flex justify-between mt-6">
                <Button type="button" variant="outline" onClick={voltarAba}>
                  Voltar
                </Button>
                <Button type="button" onClick={proximaAba}>
                  Próximo
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="pagamento">
              <ConfiguracaoPagamento 
                form={form} 
                aluno={alunoSelecionado} 
                curso={cursoSelecionado} 
              />
              
              <div className="flex justify-between mt-6">
                <Button type="button" variant="outline" onClick={voltarAba}>
                  Voltar
                </Button>
                <Button type="submit" disabled={submitting} className="gap-2">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Salvar Matrícula
                </Button>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </form>
  );
};

export default NovaMatriculaForm;
