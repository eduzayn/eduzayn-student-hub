
export interface Aluno {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  learnworlds_id?: string;
  simulado?: boolean;
  simulatedResponse?: boolean;
  offline?: boolean;
}

// Interface para o formulário de novo aluno
export interface NovoAlunoForm {
  nome: string;
  sobrenome: string;
  email: string;
  cpf: string;
  telefone: string;
}

// Interface para os props de seleção de aluno
export interface AlunoSelectionProps {
  onAlunoSelecionado: (aluno: Aluno) => void;
}

// Interface para o retorno do hook useAlunoSelection
export interface UseAlunoSelectionReturn {
  busca: string;
  setBusca: (value: string) => void;
  alunos: Aluno[];
  selecionado: string | null;
  dialogAberto: boolean;
  setDialogAberto: (value: boolean) => void;
  formNovoAluno: NovoAlunoForm;
  loading: boolean;
  error: string | null;
  offlineMode: boolean;
  handleBusca: () => void;
  handleSelecionar: (aluno: Aluno) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCriarNovoAluno: () => Promise<void>;
}

// Outros tipos relacionados a alunos
export interface AlunoResponse {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  cpf?: string;
  cpfCnpj?: string;
  phoneNumber?: string;
  phone?: string;
  simulatedResponse?: boolean;
}
