
/**
 * Tipos relacionados a cursos do LearnWorlds
 */
export interface Course {
  id: string;
  title: string;
  description?: string;
  shortDescription?: string;
  image?: string;
  courseImage?: string;
  price?: number;
  price_original?: number;
  price_final?: number;
  duration?: string;
  access?: 'free' | 'paid';
  categories?: string[];
}

export interface CoursesResponse {
  data: Course[];
  meta?: {
    page: number;
    totalItems: number;
    totalPages: number;
    itemsPerPage: number;
  };
}

export interface SincronizacaoResult {
  success: boolean;
  message: string;
  syncedItems?: number;
  imported?: number;
  updated?: number;
  failed?: number;
  total?: number;
  logs?: string[];
}
