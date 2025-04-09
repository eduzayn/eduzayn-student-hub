
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
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    pages: number;
    currentPage: number;
  };
}
