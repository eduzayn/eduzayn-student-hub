
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
  access?: 'free' | 'paid' | string;
  categories?: string[];
  url?: string;
  enrollmentStatus?: 'not_enrolled' | 'enrolled' | 'completed';
  enrollmentId?: string;
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

export interface EnrollmentResponse {
  id: string;
  userId: string;
  courseId: string;
  status: 'active' | 'inactive' | 'completed' | string;
  enrollmentDate: string;
  expirationDate?: string;
  learnworlds_id?: string;
  simulatedResponse?: boolean;
}
