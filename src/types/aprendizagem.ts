
/**
 * Tipos para a Rota de Aprendizagem
 */

// Tipo para o curso dentro da rota de aprendizagem
export interface CursoAprendizagemType {
  id: string;
  title: string;
  thumbnail?: string;
  progress: number;
  lessions: number;
}

// Tipo para submódulos ou etapas de um módulo
export interface SubmoduloAprendizagemType {
  id: string;
  titulo: string;
  descricao: string; // Alteramos de opcional para obrigatório para compatibilidade
  concluido: boolean;
  bloqueado?: boolean;
  emAndamento?: boolean;
}

// Tipo para módulos na rota de aprendizagem
export interface ModuloAprendizagemType {
  id: string;
  titulo: string;
  descricao: string;
  concluido: boolean;
  bloqueado: boolean;
  emAndamento: boolean;
  curso?: CursoAprendizagemType;
  submodulos?: SubmoduloAprendizagemType[];
}

// Tipo para certificados disponíveis
export interface CertificadoAprendizagemType {
  id: string;
  titulo: string;
  descricao: string;
  disponivel: boolean;
  dataEmissao?: string;
}

// Tipo principal para a rota de aprendizagem
export interface RotaAprendizagemType {
  id: string;
  titulo: string;
  descricao: string;
  progresso: number;
  tempoEstimado?: string;
  modulos: ModuloAprendizagemType[];
  moduloRecomendado?: ModuloAprendizagemType;
  certificados?: CertificadoAprendizagemType[];
}
