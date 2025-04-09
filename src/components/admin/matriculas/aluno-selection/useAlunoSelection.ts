
import { useState, useEffect } from "react";
import { toast } from "sonner";
import useLearnWorldsAlunos from "@/hooks/learnworlds/useLearnWorldsAlunos";
import { NovoAlunoForm, Aluno, AlunoSelectionProps, UseAlunoSelectionReturn } from "./types";
import { 
  carregarAlunosSimulados, 
  mapearAlunosDeAPI, 
  tratarErroCarregamento 
} from "./alunoService";
import { 
  processarRespostaCadastro, 
  criarObjetoAluno, 
  criarAlunoOffline, 
  prepararDadosParaAPI,
  exibirErroAoCadastrar 
} from "./novosAlunosService";
import { apiDirectClient } from "@/hooks/learnworlds/utils/apiDirectClient";

export const useAlunoSelection = ({ onAlunoSelecionado }: AlunoSelectionProps): UseAlunoSelectionReturn => {
  const [busca, setBusca] = useState("");
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [formNovoAluno, setFormNovoAluno] = useState<NovoAlunoForm>({
    nome: "",
    sobrenome: "",
    email: "",
    cpf: "", // Será tratado como opcional
    telefone: ""
  });
  
  const { getUsers, cadastrarAluno, loading, error, offlineMode, setOfflineMode } = useLearnWorldsAlunos();

  useEffect(() => {
    carregarAlunos();
  }, []);
  
  const carregarAlunos = async (termoBusca = "") => {
    try {
      if (offlineMode) {
        console.log("Usando modo offline para carregar alunos");
        const alunosSimulados = carregarAlunosSimulados(termoBusca);
        setAlunos(alunosSimulados);
        toast.warning("Usando dados simulados para alunos", {
          description: "A API do LearnWorlds está indisponível."
        });
        return;
      }
      
      console.log("Carregando alunos do LearnWorlds com termo:", termoBusca);
      const resultado = await getUsers(1, 20, termoBusca);
      
      if (!resultado || !resultado.data) {
        console.warn("Nenhum dado retornado pela API");
        setAlunos([]);
        return;
      }
      
      console.log("Dados obtidos da API:", resultado.data);
      
      // Mapear alunos da API para o formato esperado pelo componente
      const alunosFormatados = mapearAlunosDeAPI(resultado.data);
      console.log("Alunos formatados:", alunosFormatados);
      
      setAlunos(alunosFormatados);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      tratarErroCarregamento(error);
      
      // Se ocorrer erro, usar dados simulados
      const alunosSimulados = carregarAlunosSimulados(termoBusca);
      setAlunos(alunosSimulados);
      
      if (setOfflineMode) {
        setOfflineMode(true);
      }
    }
  };
  
  const handleBusca = () => {
    carregarAlunos(busca);
  };
  
  const handleSelecionar = (aluno: Aluno) => {
    setSelecionado(aluno.id);
    onAlunoSelecionado({
      ...aluno,
      learnworlds_id: aluno.learnworlds_id || aluno.id
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormNovoAluno(prev => ({ ...prev, [name]: value }));
  };

  const handleCriarNovoAluno = async () => {
    try {
      if (!formNovoAluno.nome || !formNovoAluno.email) {
        toast.error("Nome e e-mail são obrigatórios");
        return;
      }

      // Modo offline
      if (offlineMode) {
        toast.info("Cadastrando aluno em modo offline", {
          description: "O aluno será sincronizado quando a conexão for restaurada."
        });
        
        const novoAluno = criarAlunoOffline(formNovoAluno);
        setAlunos(prev => [novoAluno, ...prev]);
        handleSelecionar(novoAluno);
        
        finalizarCadastro();
        toast.success("Aluno cadastrado no modo offline");
        return;
      }

      // Preparar dados para a API
      const dadosAluno = prepararDadosParaAPI(formNovoAluno);
      console.log("🚀 Iniciando cadastro de aluno com dados:", dadosAluno);
      
      // Tentar primeiro a API direta da escola (rota principal solicitada)
      try {
        console.log("🔄 Tentando cadastrar aluno diretamente na API da escola");
        toast.loading("Cadastrando aluno na plataforma...");
        
        // Chamar a API direta da escola
        const resultadoDireto = await apiDirectClient.createUser(dadosAluno);
        console.log("✅ Resposta da API direta:", resultadoDireto);
        
        // Processar o resultado
        const { id: novoAlunoId, sucesso } = processarRespostaCadastro(resultadoDireto);
        
        if (sucesso) {
          // Criar objeto do novo aluno para a interface
          const novoAluno = criarObjetoAluno(formNovoAluno, novoAlunoId);
          
          // Adicionar à lista de alunos e selecionar
          setAlunos(prev => [novoAluno, ...prev]);
          handleSelecionar(novoAluno);
          
          finalizarCadastro();
          toast.success("Aluno cadastrado com sucesso na plataforma!");
          return;
        }
      } catch (erroApiDireta) {
        console.error("❌ Erro ao cadastrar aluno na API direta:", erroApiDireta);
        toast.error("Não foi possível cadastrar o aluno diretamente na plataforma", {
          description: "Tentando método alternativo via API do Edge Function..."
        });
        
        // Continuar com o método de fallback
      }

      // Método de fallback: usar a Edge Function do Supabase
      console.log("🔄 Usando método de fallback para cadastrar aluno");
      toast.loading("Tentando método alternativo de cadastro...");
      
      const resultado = await cadastrarAluno(dadosAluno);
      console.log("📄 Resposta da API de fallback:", resultado);

      const { id: novoAlunoId, sucesso } = processarRespostaCadastro(resultado);
      
      if (!sucesso) {
        throw new Error("Falha em todos os métodos de cadastro de aluno");
      }

      // Criar objeto do novo aluno para a interface
      const novoAluno = criarObjetoAluno(formNovoAluno, novoAlunoId);

      // Adicionar à lista de alunos e selecionar
      setAlunos(prev => [novoAluno, ...prev]);
      handleSelecionar(novoAluno);
      
      finalizarCadastro();
      toast.success("Aluno cadastrado com sucesso (via método alternativo)!");
    } catch (error: any) {
      exibirErroAoCadastrar(error);
      
      // Se o erro indicar problema de conexão ou formato de dados incorreto, ativar modo offline
      if (error.message && (
          error.message.includes("Failed to fetch") || 
          error.message.includes("Erro de conexão") ||
          error.message.includes("função edge") ||
          error.message.includes("API retornou conteúdo não-JSON") ||
          error.message.includes("HTML recebida")
      )) {
        if (setOfflineMode) {
          setOfflineMode(true);
          
          // Perguntar se deseja cadastrar em modo offline
          setTimeout(() => {
            const confirmOfflineMode = window.confirm("Deseja cadastrar o aluno em modo offline? Os dados serão sincronizados quando a conexão for restabelecida.");
            if (confirmOfflineMode) {
              handleCriarNovoAluno(); // Vai cair no bloco de modo offline agora
            }
          }, 500);
        }
      }
    }
  };

  const finalizarCadastro = () => {
    setDialogAberto(false);
    setFormNovoAluno({
      nome: "",
      sobrenome: "",
      email: "",
      cpf: "",
      telefone: ""
    });
  };

  return {
    busca,
    setBusca,
    alunos,
    selecionado,
    dialogAberto,
    setDialogAberto,
    formNovoAluno,
    loading,
    error,
    offlineMode,
    handleBusca,
    handleSelecionar,
    handleInputChange,
    handleCriarNovoAluno
  };
};
