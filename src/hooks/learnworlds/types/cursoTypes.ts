
export interface Course {
  id: string;
  title: string;
  description?: string;
  shortDescription?: string;
  image?: string;
  courseImage?: string;
  thumbnail?: string;
  price?: number;
  price_final?: number;
  access?: string;
  duration?: string;
  progress?: number;
  modalidade?: string;
}

export interface EnrollmentResponse {
  id: string;
  course_id: string;
  status: string;
  enrollmentDate: string;
  expirationDate?: string;
  learnworlds_id?: string;
  simulatedResponse?: boolean;
  data?: {
    id: string;
    student_id: string;
    course_id: string;
    status: string;
    enrollment_date: string;
  };
}

export interface CourseSyncResponse {
  success: boolean;
  message: string;
  data?: Course[];
  imported?: number;
  updated?: number;
  failed?: number;
  total?: number;
  logs?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    pages: number;
    currentPage: number;
  };
}

export interface LearnWorldsLesson {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  type: string;
  url?: string;
  videoUrl?: string;
  completed?: boolean;
  locked?: boolean;
  order?: number;
}

export interface SincronizacaoResult {
  success: boolean;
  message: string;
  imported?: number;
  updated?: number;
  failed?: number;
  total?: number;
  logs?: string[];
  syncedItems?: any[];
}

export interface CoursesResponse {
  data: Course[];
  meta: {
    total: number;
    pages: number;
    currentPage: number;
  };
}

// Exportando os tipos para serem usados por outros componentes
export type { Course as LearnWorldsCourse, LearnWorldsLesson };
