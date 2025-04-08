
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

export const useAlunoSelection = ({ onAlunoSelecionado }: AlunoSelectionProps): UseAlunoSelectionReturn => {
  const [busca, setBusca] = useState("");
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [formNovoAluno, setFormNovoAluno] = useState<NovoAlunoForm>({
    nome: "",
    sobrenome: "",
    email: "",
    cpf: "",
    telefone: ""
  });
  
  const { getUsers, cadastrarAluno, loading, error, offlineMode, setOfflineMode } = useLearnWorldsAlunos();

  useEffect(() => {
    carregarAlunos();
  }, []);
  
  const carregarAlunos = async (termoBusca = "") => {
    try {
      const resultado = await getUsers(1, 20);
      
      if (!resultado || !resultado.data) {
        throw new Error("Erro ao carregar alunos do LearnWorlds");
      }
      
      const alunosFormatados = mapearAlunosDeAPI(resultado.data);
      setAlunos(alunosFormatados);
    } catch (error) {
      tratarErroCarregamento(error);
      setAlunos(carregarAlunosSimulados(termoBusca));
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

      // Enviar para a API
      console.log("Enviando dados do aluno:", prepararDadosParaAPI(formNovoAluno));
      const resultado = await cadastrarAluno(prepararDadosParaAPI(formNovoAluno));
      console.log("Resposta da API:", resultado);

      const { id: novoAlunoId, sucesso } = processarRespostaCadastro(resultado);
      
      if (!sucesso) {
        throw new Error("Resposta inválida da API");
      }

      // Criar objeto do novo aluno para a interface
      const novoAluno = criarObjetoAluno(formNovoAluno, novoAlunoId);

      // Adicionar à lista de alunos e selecionar
      setAlunos(prev => [novoAluno, ...prev]);
      handleSelecionar(novoAluno);
      
      finalizarCadastro();
      toast.success("Aluno cadastrado com sucesso!");
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
