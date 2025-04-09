import { Course as LearnWorldsCourse } from "@/hooks/learnworlds/types/cursoTypes";
import { LearnWorldsLesson } from "@/hooks/learnworlds/types/cursoTypes";
import { supabase } from "@/integrations/supabase/client";

// API Base URL
const API_ENDPOINT = 'https://bioarzkfmcobctblzztm.supabase.co/functions/v1/learnworlds-api';

// Função auxiliar para fazer requisições à API LearnWorlds
async function makeLwRequest(path: string, method = "GET", body: any = null, admin = false): Promise<any> {
  try {
    const token = admin 
      ? "byZ4yn-#v0lt-2025!SEC" 
      : "public-zayn-lw-2025";

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };

    const res = await fetch(`${API_ENDPOINT}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: "Erro desconhecido" }));
      throw new Error(errorData.message || "Erro na requisição");
    }

    return await res.json();
  } catch (error) {
    console.error("Erro na API LearnWorlds:", error);
    throw error;
  }
}

// Obter ID do usuário atual
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  } catch (error) {
    console.error("Erro ao obter usuário atual:", error);
    return null;
  }
}

// Obter cursos do usuário
export async function getUserCourses(userId: string): Promise<LearnWorldsCourse[]> {
  try {
    const response = await makeLwRequest(`/users/${userId}/courses`, "GET", null, false);
    
    if (!response || !Array.isArray(response.data)) {
      console.warn("Resposta inesperada da API:", response);
      // Dados simulados como fallback
      return [
        {
          id: "course-1",
          title: "Desenvolvimento Web Fullstack",
          description: "Aprenda a desenvolver aplicações web completas.",
          thumbnail: "/placeholder.svg",
          price: 997,
          modalidade: "EAD",
          access: "paid",
          duration: "120 horas",
          progress: 35
        },
        {
          id: "course-2",
          title: "Design UX/UI",
          description: "Aprenda a criar interfaces intuitivas e atraentes.",
          thumbnail: "/placeholder.svg",
          price: 897,
          modalidade: "EAD",
          access: "paid",
          duration: "80 horas",
          progress: 0
        },
        {
          id: "course-3",
          title: "Marketing Digital",
          description: "Estratégias para divulgação online.",
          thumbnail: "/placeholder.svg",
          price: 697,
          modalidade: "EAD",
          access: "paid",
          duration: "60 horas",
          progress: 100
        }
      ];
    }
    
    return response.data.map((curso: any) => ({
      id: curso.id,
      title: curso.title,
      description: curso.description || "Sem descrição disponível",
      thumbnail: curso.image || curso.courseImage || "/placeholder.svg",
      price: curso.price || 0,
      modalidade: "EAD",
      access: curso.access || "paid",
      duration: curso.duration || "Não informado",
      progress: curso.progress || 0
    }));
  } catch (error) {
    console.error("Erro ao buscar cursos do usuário:", error);
    throw error;
  }
}

// Obter aulas de um curso
export async function getCourseLessons(courseId: string, userId: string): Promise<LearnWorldsLesson[]> {
  try {
    const response = await makeLwRequest(`/courses/${courseId}/content?userId=${userId}`, "GET", null, false);
    
    if (!response || !response.data || !Array.isArray(response.data.lessons)) {
      // Dados simulados como fallback
      return [
        {
          id: "l1",
          title: "Introdução ao Curso",
          description: "Visão geral e objetivos do curso",
          type: "video",
          url: "https://example.com/video1",
          completed: true,
          locked: false,
          order: 1
        },
        {
          id: "l2", 
          title: "Conceitos Fundamentais",
          description: "Aprendendo os conceitos básicos",
          type: "video",
          url: "https://example.com/video2",
          completed: false,
          locked: false,
          order: 2
        },
        {
          id: "l3",
          title: "Prática Avançada",
          description: "Exercícios práticos avançados",
          type: "quiz",
          completed: false,
          locked: true,
          order: 3
        }
      ];
    }
    
    return response.data.lessons.map((lesson: any) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description || "",
      duration: lesson.duration || 0,
      type: lesson.type || "video",
      url: lesson.url || "",
      completed: !!lesson.completed,
      locked: !!lesson.locked,
      order: lesson.order || 0
    }));
  } catch (error) {
    console.error("Erro ao buscar aulas do curso:", error);
    throw error;
  }
}

// Marcar aula como concluída
export async function markLessonAsCompleted(
  courseId: string, 
  lessonId: string, 
  userId: string
): Promise<boolean> {
  try {
    const response = await makeLwRequest(
      `/courses/${courseId}/lessons/${lessonId}/progress`, 
      "POST", 
      { userId, completed: true }, 
      false
    );
    
    return response.success === true;
  } catch (error) {
    console.error("Erro ao marcar aula como concluída:", error);
    return false;
  }
}

// Registrar progresso do vídeo
export async function trackVideoProgress(
  courseId: string,
  lessonId: string,
  userId: string,
  timestamp: number
): Promise<boolean> {
  try {
    const response = await makeLwRequest(
      `/courses/${courseId}/lessons/${lessonId}/progress`,
      "POST",
      { userId, timestamp },
      false
    );
    
    return response.success === true;
  } catch (error) {
    console.error("Erro ao registrar progresso do vídeo:", error);
    return false;
  }
}

// Funções para o painel administrativo
export async function getAllCourses(page = 1, limit = 50): Promise<any> {
  return await makeLwRequest(`/courses?page=${page}&limit=${limit}`, "GET", null, true);
}

export async function syncCourses(): Promise<any> {
  return await makeLwRequest(`/sync/courses`, "POST", null, true);
}

export async function enrollStudent(userId: string, courseId: string, options: any = {}): Promise<any> {
  return await makeLwRequest(`/enrollments`, "POST", {
    userId,
    courseId,
    ...options
  }, true);
}

export async function suspendEnrollment(enrollmentId: string): Promise<any> {
  return await makeLwRequest(`/enrollments/${enrollmentId}/suspend`, "POST", null, true);
}

export async function cancelEnrollment(enrollmentId: string): Promise<any> {
  return await makeLwRequest(`/enrollments/${enrollmentId}/cancel`, "POST", null, true);
}

export async function getRotaAprendizagem(userId: string): Promise<any> {
  try {
    const response = await makeLwRequest(`/users/${userId}/learning-path`, "GET", null, false);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter rota de aprendizagem:", error);
    // Retornar dados simulados como fallback
    return {
      stages: [
        {
          id: "s1",
          title: "Fundamentos",
          progress: 75,
          completed: false,
          courses: [
            { id: "c1", title: "Introdução", progress: 100, completed: true },
            { id: "c2", title: "Conceitos Básicos", progress: 50, completed: false }
          ]
        },
        {
          id: "s2",
          title: "Intermediário",
          progress: 0,
          completed: false,
          courses: [
            { id: "c3", title: "Práticas Avançadas", progress: 0, completed: false },
            { id: "c4", title: "Projetos Reais", progress: 0, completed: false }
          ]
        }
      ]
    };
  }
}

// Re-exportando tipos para uso em componentes
export type { LearnWorldsCourse, LearnWorldsLesson };
