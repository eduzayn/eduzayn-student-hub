
// Interfaces para a seleção de alunos

// Dados de um aluno
export interface Aluno {
  id: string;
  nome: string;
  email: string;
  cpf?: string;
  telefone?: string;
  learnworlds_id?: string;
}

// Props para AlunoSelection
export interface AlunoSelectionProps {
  onAlunoSelecionado: (aluno: Aluno) => void;
}

// Formulário de novo aluno
export interface NovoAlunoForm {
  nome: string;
  sobrenome: string;
  email: string;
  cpf: string;
  telefone: string;
}

// Props para NovoAlunoDialog
export interface NovoAlunoDialogProps {
  aberto: boolean;
  setAberto: (aberto: boolean) => void;
  formData: NovoAlunoForm;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCriarNovoAluno: () => void;
  loading: boolean;
}

// Retorno do hook useAlunoSelection
export interface UseAlunoSelectionReturn {
  busca: string;
  setBusca: (busca: string) => void;
  alunos: Aluno[];
  selecionado: string | null;
  dialogAberto: boolean;
  setDialogAberto: (aberto: boolean) => void;
  formNovoAluno: NovoAlunoForm;
  loading: boolean;
  error: string | null;
  handleBusca: () => void;
  handleSelecionar: (aluno: Aluno) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCriarNovoAluno: () => void;
}
