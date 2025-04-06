
export type TipoCurso = 'graduacao' | 'posgraduacao' | 'segunda_graduacao' | 'segunda_licenciatura' | 'formacao_pedagogica' | 'formacao_livre';

export type StatusDocumento = 'pendente' | 'em_analise' | 'aprovado' | 'rejeitado';

export interface TipoDocumento {
  id: string;
  nome: string;
  descricao?: string;
  obrigatorio: boolean;
  formatosAceitos: string[];
  tamanhoMaximo: number;
  requisitoTipo?: string[];
}

export interface Documento {
  id: string;
  tipoDocumentoId: string;
  tipoDocumento: TipoDocumento;
  status: StatusDocumento;
  dataEnvio?: string;
  dataAnalise?: string;
  arquivoUrl?: string;
  motivoRejeicao?: string;
}
