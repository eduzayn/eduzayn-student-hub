
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Save, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SelectAluno from "./SelectAluno";
import SelectCurso from "./SelectCurso";
import ConfiguracaoMatricula from "./ConfiguracaoMatricula";
import ConfiguracaoPagamento from "./ConfiguracaoPagamento";
import LearnWorldsErrorAlert from "./LearnWorldsErrorAlert";
import LinkPagamentoCard from "./LinkPagamentoCard";
import { useMatricula } from "@/hooks/useMatricula";
import useLearnWorldsApi from "@/hooks/useLearnWorldsApi";
import { useMatriculaPagamento } from "@/hooks/useMatriculaPagamento";
import { useMatriculaFormSteps } from "@/hooks/useMatriculaFormSteps";
import type { Matricula } from "@/types/matricula";

const novaMatriculaSchema = z.object({
  aluno_id: z.string().min(1, "Selecione um aluno válido"),
  curso_id: z.string().min(1, "Selecione um curso válido"),
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
  // Dados adicionais para integração com LearnWorlds
  learnworlds_aluno_id: z.string().optional(),
  learnworlds_curso_id: z.string().optional(),
});

type NovaMatriculaForm = z.infer<typeof novaMatriculaSchema>;

const NovaMatriculaForm: React.FC = () => {
  const { criarMatricula } = useMatricula();
  const { matricularAlunoEmCurso } = useLearnWorldsApi();
  const { activeTab, setActiveTab, proximaAba, voltarAba } = useMatriculaFormSteps();
  const { 
    pagamentoInfo, 
    gerarLinkPagamento,
    copiarLinkPagamento,
    redirecionarParaMatriculas,
    criarNovaMatricula
  } = useMatriculaPagamento();
  
  const [submitting, setSubmitting] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState<any>(null);
  const [cursoSelecionado, setCursoSelecionado] = useState<any>(null);
  const [learnworldsError, setLearnworldsError] = useState<string | null>(null);
  
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
    setLearnworldsError(null);
    
    try {
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
      
      if (data.learnworlds_aluno_id && data.learnworlds_curso_id) {
        try {
          const resultadoLearnWorlds = await matricularAlunoEmCurso(
            data.learnworlds_aluno_id,
            data.learnworlds_curso_id
          );
          
          if (resultadoLearnWorlds) {
            matriculaData.learnworlds_enrollment_id = resultadoLearnWorlds.id;
            console.log("Matrícula criada no LearnWorlds:", resultadoLearnWorlds.id);
          }
        } catch (learnWorldsError: any) {
          console.error("Erro ao matricular aluno no LearnWorlds:", learnWorldsError);
          setLearnworldsError(learnWorldsError.message || "Erro ao matricular aluno no LearnWorlds");
        }
      }
      
      const resultado = await criarMatricula(matriculaData);
      
      if (!resultado) {
        throw new Error("Falha ao criar a matrícula");
      }
      
      if (data.configurar_pagamento && data.forma_pagamento && data.valor_matricula && data.data_vencimento && alunoSelecionado) {
        const gateway = data.forma_pagamento.startsWith("asaas") ? 'asaas' : 'lytex';
        
        const pagamentoParams = {
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
        
        await gerarLinkPagamento(resultado.id, gateway, pagamentoParams);
      } else {
        toast.success("Matrícula criada com sucesso!");
      }
      
      if (!pagamentoInfo.link) {
        setTimeout(() => redirecionarParaMatriculas(), 2000);
      }
    } catch (error: any) {
      console.error("Erro ao criar matrícula:", error);
      toast.error(error.message || "Erro ao criar a matrícula");
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleAlunoSelecionado = (aluno: any) => {
    setAlunoSelecionado(aluno);
    form.setValue("aluno_id", aluno.id);
    
    if (aluno.learnworlds_id) {
      form.setValue("learnworlds_aluno_id", aluno.learnworlds_id);
    }
    
    proximaAba();
  };
  
  const handleCursoSelecionado = (curso: any) => {
    setCursoSelecionado(curso);
    form.setValue("curso_id", curso.id);
    
    if (curso.learning_worlds_id) {
      form.setValue("learnworlds_curso_id", curso.learning_worlds_id);
    }
    
    proximaAba();
  };
  
  const matriculaConcluida = !!pagamentoInfo.link;
  
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
              {learnworldsError && <LearnWorldsErrorAlert errorMessage={learnworldsError} />}
              
              {matriculaConcluida ? (
                <LinkPagamentoCard 
                  link={pagamentoInfo.link || ""}
                  copiado={pagamentoInfo.copiado}
                  enviado={pagamentoInfo.enviado}
                  email={alunoSelecionado?.email}
                  onCopiar={copiarLinkPagamento}
                  onVoltar={redirecionarParaMatriculas}
                  onNova={criarNovaMatricula}
                />
              ) : (
                <>
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
                </>
              )}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </form>
  );
};

export default NovaMatriculaForm;
