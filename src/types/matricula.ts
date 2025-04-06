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
  modalidade?: string;
  carga_horaria?: number;
  valor_mensalidade?: number;
  valor_total?: number;
}

export interface Matricula {
  id: string;
  aluno_id: string;
  curso_id: string;
  data_inicio: string;
  data_conclusao?: string;
  status: 'ativo' | 'pendente' | 'trancado' | 'formado' | 'inativo';
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
