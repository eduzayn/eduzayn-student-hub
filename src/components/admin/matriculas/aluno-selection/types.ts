
export interface NovoAlunoForm {
  nome: string;
  sobrenome: string;
  email: string;
  cpf: string;
  telefone: string;
}

export interface Aluno {
  id: string;
  nome: string;
  email: string;
  cpf?: string;
  telefone?: string;
  learnworlds_id?: string;
  offline?: boolean;
}

export interface AlunoSelectionProps {
  onAlunoSelecionado: (aluno: Aluno) => void;
}

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
