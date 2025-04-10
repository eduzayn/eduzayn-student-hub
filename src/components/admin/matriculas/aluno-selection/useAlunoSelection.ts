
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { NovoAlunoForm, Aluno, AlunoSelectionProps, UseAlunoSelectionReturn } from "./types";
import { 
  mapearAlunosDeAPI, 
  tratarErroCarregamento,
  formatarAlunoParaExibicao
} from "./alunoService";
import { 
  processarRespostaCadastro, 
  criarObjetoAluno, 
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
    cpf: "",
    telefone: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarAlunos();
  }, []);
  
  const carregarAlunos = async (termoBusca = "") => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Carregando alunos diretamente do LearnWorlds com termo:", termoBusca);
      
      // Tentando buscar alunos da API
      const resultado = await apiDirectClient.getUsers(1, 20, termoBusca);
      
      console.log("Resultado da busca de alunos:", resultado);
      
      if (resultado.error) {
        // Se a API retornar um erro específico
        setError(resultado.error);
        toast.error("Erro ao buscar alunos", {
          description: resultado.error
        });
        
        // Definir lista vazia para evitar erros na UI
        setAlunos([]);
        return;
      }
      
      // Quando não há dados, retornamos uma lista vazia
      if (!resultado || !resultado.data || resultado.data.length === 0) {
        console.log("Nenhum aluno encontrado na API");
        setAlunos([]);
        return;
      }
      
      // Mapear alunos da API para o formato esperado pelo componente
      const alunosFormatados = mapearAlunosDeAPI(resultado.data);
      
      setAlunos(alunosFormatados);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      setError(error.message || "Erro ao carregar alunos");
      tratarErroCarregamento(error);
      setAlunos([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleBusca = () => {
    carregarAlunos(busca);
  };
  
  const handleSelecionar = (aluno: Aluno) => {
    setSelecionado(aluno.id);
    
    // Formatar aluno para garantir consistência
    const alunoFormatado = formatarAlunoParaExibicao(aluno);
    
    console.log("Aluno selecionado:", alunoFormatado);
    onAlunoSelecionado(alunoFormatado);
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

      // Preparar dados para a API
      const dadosAluno = prepararDadosParaAPI(formNovoAluno);
      console.log("🚀 Iniciando cadastro de aluno com dados:", dadosAluno);
      
      setLoading(true);
      
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

      throw new Error("Falha ao cadastrar aluno");
    } catch (error: any) {
      exibirErroAoCadastrar(error);
    } finally {
      setLoading(false);
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
    handleBusca,
    handleSelecionar,
    handleInputChange,
    handleCriarNovoAluno
  };
};
