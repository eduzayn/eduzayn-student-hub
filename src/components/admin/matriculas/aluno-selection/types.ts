
export interface Aluno {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  learnworlds_id?: string;
  status?: 'ativo' | 'inativo' | 'pendente';
  simulado?: boolean;
  offline?: boolean;
  data_cadastro?: string;
  ultimo_login?: string;
  endereco?: {
    rua?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
  };
}

export interface NovoAluno {
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  ddd?: string;
  senha?: string;
  endereco?: {
    rua?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
  };
}

export interface NovoAlunoForm {
  nome: string;
  sobrenome: string;
  email: string;
  cpf?: string;
  telefone?: string;
}

export interface BuscarAlunosParams {
  termo?: string;
  status?: string;
  pagina?: number;
  porPagina?: number;
}

export interface AlunoResponse {
  status: 'success' | 'error';
  data?: Aluno[];
  error?: string;
  mensagem?: string;
  meta?: {
    total: number;
    pagina: number;
    porPagina: number;
    paginas: number;
  };
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
