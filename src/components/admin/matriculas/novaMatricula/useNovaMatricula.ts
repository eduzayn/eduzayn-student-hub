
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useMatricula } from "@/hooks/useMatricula";
import { useMatriculaFormSteps } from "@/hooks/useMatriculaFormSteps";
import useLearnWorldsApi from "@/hooks/useLearnWorldsApi";
import { useMatriculaPagamento } from "@/hooks/useMatriculaPagamento";
import { useNavigate } from "react-router-dom";

export const useNovaMatricula = () => {
  const navigate = useNavigate();
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
  const [matriculaErro, setMatriculaErro] = useState<string | null>(null);
  
  const handleAlunoSelecionado = (aluno: any) => {
    console.log("Aluno selecionado:", aluno);
    setAlunoSelecionado(aluno);
    if (aluno) nextStep();
  };
  
  const handleCursoSelecionado = (curso: any) => {
    console.log("Curso selecionado:", curso);
    setCursoSelecionado(curso);
    setMatriculaConfig(prev => ({
      ...prev,
      valor_matricula: curso.valor_mensalidade || curso.price_final || curso.price || 0
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
    setMatriculaErro(null);
    
    try {
      console.log("Iniciando processo de matrícula");
      console.log("Aluno:", alunoSelecionado);
      console.log("Curso:", cursoSelecionado);
      console.log("Configuração:", matriculaConfig);
      
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
        throw new Error('Erro ao criar matrícula no banco de dados local');
      }
      
      console.log("Matrícula criada localmente:", resultado);
      
      // Guardar a matrícula criada
      setMatriculaCriada(resultado);
      
      // Verificar se podemos matricular no LearnWorlds
      const alunoLearnWorldsId = alunoSelecionado.learnworlds_id; 
      const cursoLearnWorldsId = cursoSelecionado.learning_worlds_id || cursoSelecionado.id;
      
      console.log("ID do aluno no LearnWorlds:", alunoLearnWorldsId);
      console.log("ID do curso no LearnWorlds:", cursoLearnWorldsId);
      
      if (alunoLearnWorldsId && cursoLearnWorldsId) {
        try {
          // Primeiro verificar se o aluno já está matriculado no curso
          const matriculaExistente = await verificarMatricula(
            alunoLearnWorldsId,
            cursoLearnWorldsId
          );
          
          console.log('Verificação de matrícula existente:', matriculaExistente);
          
          // Se a matrícula já existe, exibir mensagem informativa
          if (matriculaExistente) {
            setLearnWorldsMatriculaInfo(matriculaExistente);
            toast.info('Aluno já matriculado no LearnWorlds');
          } else {
            // Caso não exista, criar nova matrícula
            console.log("Criando nova matrícula no LearnWorlds");
            
            const matriculaLearnWorlds = await matricularAlunoEmCurso(
              alunoLearnWorldsId,
              cursoLearnWorldsId,
              {
                status: "active",
                notifyUser: true
              }
            );
            
            console.log('Matrícula no LearnWorlds:', matriculaLearnWorlds);
            
            if (matriculaLearnWorlds) {
              setLearnWorldsMatriculaInfo(matriculaLearnWorlds);
              
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
        } catch (learnWorldsError: any) {
          console.error('Erro ao matricular no LearnWorlds:', learnWorldsError);
          setMatriculaErro(learnWorldsError.message || 'Erro ao matricular aluno no LearnWorlds');
          toast.error('Erro ao matricular aluno no LearnWorlds', {
            description: learnWorldsError.message
          });
        }
      } else if (!offlineMode) {
        console.log("IDs do LearnWorlds não disponíveis");
        toast.warning('IDs do LearnWorlds não disponíveis para matrícula na plataforma', {
          description: 'Verifique se o aluno e o curso possuem IDs válidos no LearnWorlds'
        });
      }
      
      // Processar pagamento se necessário
      if (matriculaConfig.com_pagamento && matriculaConfig.forma_pagamento !== 'isento') {
        console.log("Gerando link de pagamento");
        
        const pagamentoParams = {
          customerData: {
            name: alunoSelecionado.nome,
            email: alunoSelecionado.email,
            phone: alunoSelecionado.telefone || '',
            cpfCnpj: alunoSelecionado.cpf || ''
          },
          curso: {
            nome: cursoSelecionado.titulo || cursoSelecionado.nome || cursoSelecionado.title,
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
    } catch (error: any) {
      console.error('Erro ao processar matrícula:', error);
      setMatriculaErro(error.message || 'Erro desconhecido ao processar matrícula');
      toast.error('Erro ao processar matrícula', {
        description: error.message || 'Tente novamente mais tarde'
      });
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
    matriculaErro,
    redirecionarParaMatriculas,
    criarNovaMatricula,
    handleAlunoSelecionado,
    handleCursoSelecionado,
    handleConfigChange,
    handleSubmit
  };
};
