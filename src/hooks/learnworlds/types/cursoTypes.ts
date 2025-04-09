
export interface Course {
  id: string;
  title: string;
  description?: string;
  shortDescription?: string;
  image?: string;
  courseImage?: string;
  price?: number;
  price_final?: number;
  access?: string;
  duration?: string;
}

export interface EnrollmentResponse {
  id: string;
  user_id: string;
  course_id: string;
  status: string;
  created_at: string;
  progress?: number;
  completed?: boolean;
  certificate?: string;
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
}

export interface CoursesResponse {
  data: Course[];
  meta: {
    total: number;
    pages: number;
    currentPage: number;
  };
}
