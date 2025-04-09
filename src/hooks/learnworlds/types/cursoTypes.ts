
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
    currentPage?: number;
    page?: number; // Adicionando compatibilidade com o formato da API
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

export interface EnrollmentResponse {
  success?: boolean;
  error?: string;
  id?: string;
  simulatedResponse?: boolean;
  userId?: string;
  courseId?: string;
  status?: string;
  enrollmentDate?: string;
  expirationDate?: string;
  learnworlds_id?: string;
  data?: {
    id: string;
    student_id: string;
    course_id: string;
    status: string;
    enrollment_date?: string;
    completion_date?: string;
    progress?: number;
  };
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success?: boolean;
  message?: string;
  meta?: {
    currentPage?: number;
    page?: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  total?: number;
}
