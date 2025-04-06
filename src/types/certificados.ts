
export interface Disciplina {
  id: string;
  nome: string;
  nota: number;
  concluida: boolean;
}

export interface Pagamento {
  id: string;
  status: 'pago' | 'pendente' | 'atrasado';
  dataVencimento: string;
  valor: number;
  numero: number;
}

export interface RequisitoCertificado {
  id: string;
  descricao: string;
  cumprido: boolean;
  detalhe?: string;
}

export type StatusCertificado = 
  | 'disponivel' 
  | 'indisponivel' 
  | 'em_processamento' 
  | 'gerado';

export interface Certificado {
  id: string;
  cursoId: string;
  cursoNome: string;
  dataInicio: string;
  dataFim?: string;
  cargaHoraria: number;
  dataEmissao?: string;
  status: StatusCertificado;
  pdfUrl?: string;
  requisitos: RequisitoCertificado[];
}
