
export interface Course {
  id: string;
  title: string;
  shortDescription?: string;
  description?: string;
  image?: string;
  courseImage?: string;
  price?: number;
  price_final?: number;
  access?: string;
  duration?: string;
  simulado?: boolean;
  api_token?: boolean;
  api_oauth?: boolean;
  learning_worlds_id?: string;
}

export interface CoursesResponse {
  data: Course[];
  meta?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  total?: number;
  success?: boolean;
}

export interface SincronizacaoResult {
  success: boolean;
  message: string;
  imported: number;
  updated: number;
  failed: number;
  total: number;
  logs: string[];
  syncedItems?: number;
}
