
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useMatricula } from "@/hooks/useMatricula";
import { useMatriculaFormSteps } from "@/hooks/useMatriculaFormSteps";
import useLearnWorldsApi from "@/hooks/useLearnWorldsApi";
import { useMatriculaPagamento } from "@/hooks/useMatriculaPagamento";

export const useNovaMatricula = () => {
  const navigate = () => window.location.href = "/admin/matriculas";
  const { criarMatricula, loading: loadingMatricula } = useMatricula();
  const { formStep, nextStep, prevStep, resetSteps } = useMatriculaFormSteps();
  const { 
    matricularAlunoEmCurso, 
    verificarMatricula, 
    offlineMode 
  } = useLearnWorldsApi();
  const { 
    gerarLinkPagamento, 
    pagamentoInfo, 
    redirecionarParaMatriculas, 
    criarNovaMatricula 
  } = useMatriculaPagamento();
  
  const [alunoSelecionado, setAlunoSelecionado] = useState<any>(null);
  const [cursoSelecionado, setCursoSelecionado] = useState<any>(null);
  const [matriculaConfig, setMatriculaConfig] = useState<any>({
    data_inicio: format(new Date(), 'yyyy-MM-dd'),
    valor_matricula: 0,
    forma_pagamento: 'pix',
    observacoes: '',
    com_pagamento: true,
    status: 'ativo' as 'ativo' | 'inativo' | 'trancado' | 'formado'
  });
  
  const [matriculaCriada, setMatriculaCriada] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [learnWorldsMatriculaInfo, setLearnWorldsMatriculaInfo] = useState<any>(null);
  
  const handleAlunoSelecionado = (aluno: any) => {
    setAlunoSelecionado(aluno);
    if (aluno) nextStep();
  };
  
  const handleCursoSelecionado = (curso: any) => {
    setCursoSelecionado(curso);
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
      const novaMatricula = {
        aluno_id: alunoSelecionado.id,
        curso_id: cursoSelecionado.id,
        data_inicio: matriculaConfig.data_inicio,
        status: matriculaConfig.status,
        observacoes: matriculaConfig.observacoes,
        forma_ingresso: matriculaConfig.forma_pagamento === 'isento' ? 'isento' : matriculaConfig.forma_pagamento,
        valor: matriculaConfig.valor_matricula
      };
      
      console.log("Dados da matrícula a criar:", novaMatricula);
      
      // Criar matrícula local
      const resultado = await criarMatricula(novaMatricula);
      
      if (!resultado) {
        throw new Error('Erro ao criar matrícula');
      }
      
      // Guardar a matrícula criada
      setMatriculaCriada(resultado);
      
      // Verificar se podemos matricular no LearnWorlds
      if (alunoSelecionado.learnworlds_id && cursoSelecionado.learning_worlds_id) {
        try {
          // Primeiro verificar se o aluno já está matriculado no curso
          const matriculaExistente = await verificarMatricula(
            alunoSelecionado.learnworlds_id,
            cursoSelecionado.learning_worlds_id
          );
          
          console.log('Verificação de matrícula existente:', matriculaExistente);
          
          // Se a matrícula já existe, exibir mensagem informativa
          if (matriculaExistente && !matriculaExistente.error) {
            setLearnWorldsMatriculaInfo(matriculaExistente);
            toast.info('Aluno já matriculado no LearnWorlds');
          } else {
            // Caso não exista, criar nova matrícula
            const matriculaLearnWorlds = await matricularAlunoEmCurso(
              alunoSelecionado.learnworlds_id,
              cursoSelecionado.learning_worlds_id,
              {
                status: "active",
                notifyUser: true
              }
            );
            
            console.log('Matrícula no LearnWorlds:', matriculaLearnWorlds);
            setLearnWorldsMatriculaInfo(matriculaLearnWorlds);
            
            if (matriculaLearnWorlds) {
              toast.success('Aluno matriculado no LearnWorlds com sucesso!');
              
              // Atualizar a matrícula local com o ID da matrícula no LearnWorlds
              if (matriculaLearnWorlds.id && !matriculaLearnWorlds.simulatedResponse) {
                // Aqui poderia ser implementada uma atualização da matrícula local
                console.log('ID da matrícula no LearnWorlds:', matriculaLearnWorlds.id);
              }
            } else if (!offlineMode) {
              toast.warning('Não foi possível confirmar a matrícula no LearnWorlds');
            }
          }
        } catch (learnWorldsError) {
          console.error('Erro ao matricular no LearnWorlds:', learnWorldsError);
          toast.error('Erro ao matricular aluno no LearnWorlds');
        }
      } else if (!offlineMode) {
        toast.warning('IDs do LearnWorlds não disponíveis para matrícula na plataforma');
      }
      
      // Processar pagamento se necessário
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

  return {
    formStep,
    nextStep,
    prevStep,
    resetSteps,
    alunoSelecionado,
    cursoSelecionado,
    matriculaConfig,
    matriculaCriada,
    loading,
    offlineMode,
    pagamentoInfo,
    learnWorldsMatriculaInfo,
    redirecionarParaMatriculas,
    criarNovaMatricula,
    handleAlunoSelecionado,
    handleCursoSelecionado,
    handleConfigChange,
    handleSubmit
  };
};
