
export interface Aluno {
  id: string;
  nome: string;
  email: string;
  cpf?: string;
  telefone?: string;
  endereco?: string;
}

export interface Curso {
  id: string;
  titulo: string;
  descricao?: string;
  codigo: string;
  modalidade?: string;
  valor_total: number;
  valor_mensalidade: number;
  carga_horaria?: number;
  total_parcelas?: number;
  ativo?: boolean;
  learning_worlds_id?: string;
  data_criacao?: string;
  data_atualizacao?: string;
  imagem_url?: string;
}

export interface Matricula {
  id: string;
  aluno_id: string;
  curso_id: string;
  data_inicio: string;
  data_conclusao?: string;
  status: 'ativo' | 'inativo' | 'trancado' | 'formado';
  forma_ingresso?: string;
  origem_matricula?: string;
  turno?: string;
  observacoes?: string;
  progresso?: number;
  learnworlds_enrollment_id?: string;
}

export interface Contrato {
  id: string;
  aluno_id: string;
  matricula_id: string;
  codigo: string;
  titulo: string;
  conteudo: string;
  versao: string;
  data_geracao: string;
  data_aceite?: string;
  ip_aceite?: string;
  assinado: boolean;
  url_contrato_assinado?: string;
  hash_validacao?: string;
  // Adicionar propriedades aninhadas para compatibilidade com o código existente
  aluno?: {
    nome: string;
    email: string;
  };
  matricula?: {
    id: string;
    curso: string;
  };
}

export interface Aditivo {
  id: string;
  contrato_id: string;
  codigo?: string;
  titulo: string;
  conteudo: string;
  versao: string;
  motivo: string;
  data_geracao: string;
  data_aceite?: string;
  ip_aceite?: string;
  assinado: boolean;
  url_aditivo_assinado?: string;
  hash_validacao?: string;
  // Adicionar propriedade aninhada para compatibilidade
  aluno?: {
    nome: string;
  };
}

export interface Pagamento {
  id: string;
  matricula_id: string;
  tipo: string;
  forma_pagamento: string;
  gateway: string;
  valor: number;
  desconto?: number;
  data_vencimento: string;
  data_pagamento?: string;
  status: 'pendente' | 'processando' | 'pago' | 'cancelado' | 'atrasado' | 'estornado';
  gateway_payment_id?: string;
  link_pagamento?: string;
  comprovante_url?: string;
}

export interface HistoricoMatricula {
  id: string;
  matricula_id: string;
  status_anterior: string;
  status_novo: string;
  data_alteracao: string;
  alterado_por?: string;
  motivo?: string;
  observacoes?: string;
}

// Interface estendida para uso na página de pagamentos
export interface PagamentoCompleto extends Pagamento {
  matriculas: {
    id: string;
    alunos?: {
      nome?: string;
      email?: string;
    };
    cursos?: {
      titulo?: string;
    };
  };
}
