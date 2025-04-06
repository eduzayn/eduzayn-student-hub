
export type StatusProtocolo = 'aberto' | 'em_andamento' | 'respondido' | 'encerrado';

export type SetorAtendimento = 'secretaria' | 'tutoria' | 'financeiro' | 'suporte';

export interface Protocolo {
  id: string;
  numero: string;
  titulo: string;
  mensagem: string;
  setor: SetorAtendimento;
  status: StatusProtocolo;
  dataCriacao: string;
  dataAtualizacao: string;
  alunoId: string;
  responsavelId?: string;
  tempoEspera?: string;
  prioridade?: 'baixa' | 'normal' | 'alta' | 'urgente';
}

export interface Mensagem {
  id: string;
  protocoloId: string;
  conteudo: string;
  dataCriacao: string;
  autorId: string;
  autorNome: string;
  autorTipo: 'aluno' | 'atendente';
  lida: boolean;
  anexos?: Anexo[];
}

export interface Anexo {
  id: string;
  nome: string;
  url: string;
  tipo: string;
  tamanho: number;
}

export interface AtendenteOnline {
  id: string;
  nome: string;
  setor: SetorAtendimento;
  disponivel: boolean;
  ultimoStatus: string;
}
