
import { useState, useEffect } from "react";
import { toast } from "sonner";
import useLearnWorldsAlunos from "@/hooks/learnworlds/useLearnWorldsAlunos";

interface NovoAlunoForm {
  nome: string;
  sobrenome: string;
  email: string;
  cpf: string;
  telefone: string;
}

export const useAlunoSelection = (onAlunoSelecionado: (aluno: any) => void) => {
  const [busca, setBusca] = useState("");
  const [alunos, setAlunos] = useState<any[]>([]);
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
      
      const alunosFormatados = resultado.data.map((aluno: any) => ({
        id: aluno.id,
        nome: `${aluno.firstName || ''} ${aluno.lastName || ''}`.trim(),
        email: aluno.email,
        cpf: aluno.customField1 || '',
        telefone: aluno.phoneNumber || '',
        learnworlds_id: aluno.id
      }));
      
      setAlunos(alunosFormatados);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      toast.error("Erro ao carregar a lista de alunos", {
        description: "Usando dados em modo offline. Algumas funcionalidades podem estar limitadas."
      });
      
      carregarAlunosSimulados(termoBusca);
    }
  };
  
  const carregarAlunosSimulados = (termoBusca = "") => {
    const dadosSimulados = [
      {
        id: "a1",
        nome: "Ana Silva",
        email: "ana@exemplo.com",
        cpf: "12345678901",
        telefone: "(11) 91234-5678"
      },
      {
        id: "a2",
        nome: "Carlos Santos",
        email: "carlos@exemplo.com",
        cpf: "10987654321",
        telefone: "(11) 98765-4321"
      },
      {
        id: "a3",
        nome: "Patricia Oliveira",
        email: "patricia@exemplo.com",
        cpf: "45678912301",
        telefone: "(11) 97654-3210"
      }
    ];
    
    const filtrados = termoBusca ? 
      dadosSimulados.filter(a => 
        a.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
        a.email.toLowerCase().includes(termoBusca.toLowerCase()) ||
        a.cpf.includes(termoBusca)
      ) : dadosSimulados;
    
    setAlunos(filtrados);
  };
  
  const handleBusca = () => {
    carregarAlunos(busca);
  };
  
  const handleSelecionar = (aluno: any) => {
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

      if (offlineMode) {
        toast.info("Cadastrando aluno em modo offline", {
          description: "O aluno será sincronizado quando a conexão for restaurada."
        });
        
        const offlineId = `offline-${Date.now()}`;
        
        const novoAluno = {
          id: offlineId,
          nome: `${formNovoAluno.nome} ${formNovoAluno.sobrenome}`.trim(),
          email: formNovoAluno.email,
          cpf: formNovoAluno.cpf,
          telefone: formNovoAluno.telefone,
          offline: true,
          learnworlds_id: offlineId
        };

        setAlunos(prev => [novoAluno, ...prev]);
        handleSelecionar(novoAluno);
        
        setDialogAberto(false);
        setFormNovoAluno({
          nome: "",
          sobrenome: "",
          email: "",
          cpf: "",
          telefone: ""
        });
        
        toast.success("Aluno cadastrado no modo offline");
        return;
      }

      const resultado = await cadastrarAluno({
        firstName: formNovoAluno.nome,
        lastName: formNovoAluno.sobrenome,
        email: formNovoAluno.email,
        cpf: formNovoAluno.cpf,
        phoneNumber: formNovoAluno.telefone
      });

      if (!resultado) {
        throw new Error("Falha ao cadastrar aluno no LearnWorlds");
      }

      const novoAluno = {
        id: resultado.id,
        nome: `${formNovoAluno.nome} ${formNovoAluno.sobrenome}`.trim(),
        email: formNovoAluno.email,
        cpf: formNovoAluno.cpf,
        telefone: formNovoAluno.telefone,
        learnworlds_id: resultado.id
      };

      setAlunos(prev => [novoAluno, ...prev]);
      handleSelecionar(novoAluno);
      
      setDialogAberto(false);
      setFormNovoAluno({
        nome: "",
        sobrenome: "",
        email: "",
        cpf: "",
        telefone: ""
      });
      
      toast.success("Aluno cadastrado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao criar novo aluno:", error);
      
      if (error.message && (
          error.message.includes("Failed to fetch") || 
          error.message.includes("Erro de conexão") ||
          error.message.includes("função edge")
      )) {
        if (setOfflineMode) {
          setOfflineMode(true);
        }
        toast.error("Erro de conexão com a API", {
          description: "Passando para modo offline. Deseja cadastrar o aluno offline?"
        });
        
        setTimeout(() => {
          if (confirm("Deseja cadastrar o aluno em modo offline? Os dados serão sincronizados quando a conexão for restabelecida.")) {
            handleCriarNovoAluno();
          }
        }, 500);
      } else {
        toast.error(error.message || "Erro ao criar novo aluno");
      }
    }
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
