
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import SelectAluno from "./SelectAluno";
import SelectCurso from "./SelectCurso";
import ConfiguracaoMatricula from "./ConfiguracaoMatricula";
import { useMatricula } from "@/hooks/useMatricula";
import { useMatriculaFormSteps } from "@/hooks/useMatriculaFormSteps";
import useLearnWorldsApi from "@/hooks/useLearnWorldsApi";
import { useMatriculaPagamento } from "@/hooks/useMatriculaPagamento";
import LinkPagamentoCard from "./LinkPagamentoCard";
import LearnWorldsErrorAlert from "./LearnWorldsErrorAlert";

const NovaMatriculaForm: React.FC = () => {
  const navigate = useNavigate();
  const { criarMatricula, loading: loadingMatricula } = useMatricula();
  const { formStep, nextStep, prevStep, resetSteps } = useMatriculaFormSteps();
  const { matricularAlunoEmCurso, offlineMode } = useLearnWorldsApi();
  const { gerarLinkPagamento, pagamentoInfo, redirecionarParaMatriculas, criarNovaMatricula } = useMatriculaPagamento();
  
  const [alunoSelecionado, setAlunoSelecionado] = useState<any>(null);
  const [cursoSelecionado, setCursoSelecionado] = useState<any>(null);
  const [matriculaConfig, setMatriculaConfig] = useState<any>({
    data_inicio: format(new Date(), 'yyyy-MM-dd'),
    valor_matricula: 0,
    forma_pagamento: 'pix',
    observacoes: '',
    com_pagamento: true,
    status: 'pendente' as 'pendente' | 'ativo' | 'inativo' | 'trancado' | 'formado'
  });
  
  const [matriculaCriada, setMatriculaCriada] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const handleAlunoSelecionado = (aluno: any) => {
    setAlunoSelecionado(aluno);
    if (aluno) nextStep();
  };
  
  const handleCursoSelecionado = (curso: any) => {
    setCursoSelecionado(curso);
    // Usar o valor do curso como valor padrão para a matrícula
    setMatriculaConfig(prev => ({
      ...prev,
      valor_matricula: curso.valor_mensalidade || 0
    }));
    if (curso) nextStep();
  };
  
  const handleConfigChange = (config: any) => {
    setMatriculaConfig(config);
  };
  
  const handleSubmit = async () => {
    if (!alunoSelecionado || !cursoSelecionado) {
      toast.error("Selecione um aluno e um curso para prosseguir");
      return;
    }
    
    setLoading(true);
    
    try {
      // Criar a matrícula
      const novaMatricula = {
        aluno_id: alunoSelecionado.id,
        curso_id: cursoSelecionado.id,
        valor: matriculaConfig.valor_matricula,
        data_inicio: matriculaConfig.data_inicio,
        status: matriculaConfig.status,
        observacoes: matriculaConfig.observacoes,
        forma_pagamento: matriculaConfig.com_pagamento ? matriculaConfig.forma_pagamento : 'isento',
        criado_por: 'sistema',
        aluno_email: alunoSelecionado.email,
        aluno_nome: alunoSelecionado.nome,
        curso_nome: cursoSelecionado.titulo || cursoSelecionado.nome,
        learnworlds_aluno_id: alunoSelecionado.learnworlds_id,
        learnworlds_curso_id: cursoSelecionado.learning_worlds_id,
      };
      
      // Chamar o hook para criar a matrícula
      const resultado = await criarMatricula(novaMatricula);
      
      if (!resultado) {
        throw new Error('Erro ao criar matrícula');
      }
      
      // Guardar a matrícula criada
      setMatriculaCriada(resultado);
      
      // Matricular aluno no LearnWorlds se não estiver em modo offline
      if (alunoSelecionado.learnworlds_id && cursoSelecionado.learning_worlds_id) {
        try {
          const matriculaLearnWorlds = await matricularAlunoEmCurso(
            alunoSelecionado.learnworlds_id,
            cursoSelecionado.learning_worlds_id
          );
          
          console.log('Matrícula no LearnWorlds:', matriculaLearnWorlds);
          
          if (matriculaLearnWorlds) {
            toast.success('Aluno matriculado no LearnWorlds com sucesso!');
          } else if (!offlineMode) {
            toast.warning('Não foi possível confirmar a matrícula no LearnWorlds');
          }
        } catch (learnWorldsError) {
          console.error('Erro ao matricular no LearnWorlds:', learnWorldsError);
          toast.error('Erro ao matricular aluno no LearnWorlds');
        }
      } else if (!offlineMode) {
        toast.warning('IDs do LearnWorlds não disponíveis para matrícula na plataforma');
      }
      
      // Se a matrícula requer pagamento, gerar o link
      if (matriculaConfig.com_pagamento) {
        const pagamentoParams = {
          customerData: {
            name: alunoSelecionado.nome,
            email: alunoSelecionado.email,
            phone: alunoSelecionado.telefone || '',
            cpfCnpj: alunoSelecionado.cpf || ''
          },
          curso: {
            nome: cursoSelecionado.titulo || cursoSelecionado.nome,
            valor: matriculaConfig.valor_matricula
          },
          matriculaId: resultado.id
        };
        
        await gerarLinkPagamento(
          resultado.id, 
          matriculaConfig.forma_pagamento, 
          pagamentoParams
        );
      } else {
        toast.success('Matrícula criada com sucesso!');
      }
      
      nextStep();
    } catch (error) {
      console.error('Erro ao processar matrícula:', error);
      toast.error('Erro ao processar matrícula');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {offlineMode && (
        <LearnWorldsErrorAlert 
          errorMessage="A API do LearnWorlds está offline ou indisponível no momento."
        />
      )}
      
      {formStep === 1 && (
        <SelectAluno onAlunoSelecionado={handleAlunoSelecionado} />
      )}
      
      {formStep === 2 && (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              Aluno: {alunoSelecionado?.nome}
            </h3>
            <Button variant="outline" onClick={prevStep}>Voltar e trocar aluno</Button>
          </div>
          <Separator className="my-4" />
          <SelectCurso onCursoSelecionado={handleCursoSelecionado} />
        </>
      )}
      
      {formStep === 3 && (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">
                Aluno: {alunoSelecionado?.nome}
              </h3>
              <h3 className="text-lg font-medium mt-1">
                Curso: {cursoSelecionado?.titulo || cursoSelecionado?.nome}
              </h3>
            </div>
            <Button variant="outline" onClick={prevStep}>Voltar e trocar curso</Button>
          </div>
          <Separator className="my-4" />
          
          <ConfiguracaoMatricula 
            config={matriculaConfig}
            onChange={handleConfigChange}
            valorCurso={cursoSelecionado?.valor_mensalidade || 0}
            onProsseguir={handleSubmit}
            isLoading={loading}
          />
        </>
      )}
      
      {formStep === 4 && (
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold text-center text-green-600 mb-4">
                Matrícula Concluída com Sucesso!
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Aluno:</span>
                  <span>{alunoSelecionado?.nome}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Curso:</span>
                  <span>{cursoSelecionado?.titulo || cursoSelecionado?.nome}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Data Início:</span>
                  <span>
                    {matriculaConfig?.data_inicio ? 
                      format(new Date(matriculaConfig.data_inicio), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : 
                      'Não definido'}
                  </span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Forma de Pagamento:</span>
                  <span className="capitalize">
                    {!matriculaConfig?.com_pagamento ? 'Isento' : matriculaConfig?.forma_pagamento}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Valor:</span>
                  <span className="font-bold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(matriculaConfig?.valor_matricula || 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {matriculaConfig?.com_pagamento && pagamentoInfo?.link && (
            <LinkPagamentoCard
              link={pagamentoInfo.link}
              copiado={pagamentoInfo.copiado}
              enviado={pagamentoInfo.enviado}
              email={alunoSelecionado?.email}
              onCopiar={() => {}}
              onVoltar={redirecionarParaMatriculas}
              onNova={criarNovaMatricula}
            />
          )}
          
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={redirecionarParaMatriculas}
            >
              Voltar para Matrículas
            </Button>
            
            <Button 
              onClick={criarNovaMatricula}
            >
              Criar Nova Matrícula
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NovaMatriculaForm;
