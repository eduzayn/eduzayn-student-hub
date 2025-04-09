
import { useState, useEffect } from "react";
import { toast } from "sonner";
import useLearnWorldsAlunos from "@/hooks/learnworlds/useLearnWorldsAlunos";
import { NovoAlunoForm, Aluno, AlunoSelectionProps, UseAlunoSelectionReturn } from "./types";
import { 
  mapearAlunosDeAPI, 
  tratarErroCarregamento 
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
    cpf: "", // Será tratado como opcional
    telefone: ""
  });
  
  const { getUsers, loading, error } = useLearnWorldsAlunos();

  useEffect(() => {
    carregarAlunos();
  }, []);
  
  const carregarAlunos = async (termoBusca = "") => {
    try {
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
      setAlunos([]);
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

      // Preparar dados para a API
      const dadosAluno = prepararDadosParaAPI(formNovoAluno);
      console.log("🚀 Iniciando cadastro de aluno com dados:", dadosAluno);
      
      // Tentar com a API direta da escola (rota principal solicitada)
      console.log("🔄 Cadastrando aluno diretamente na API da escola");
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

      throw new Error("Falha ao cadastrar aluno");
    } catch (error: any) {
      exibirErroAoCadastrar(error);
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
    offlineMode: false, // Sempre retorna false pois não existe modo offline
    handleBusca,
    handleSelecionar,
    handleInputChange,
    handleCriarNovoAluno
  };
};
