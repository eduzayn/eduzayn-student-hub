
export interface Aluno {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  learnworlds_id?: string;
  status?: 'ativo' | 'inativo' | 'pendente';
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
