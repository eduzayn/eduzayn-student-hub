/**
 * Serviço de integração com a API da LearnWorlds
 * Documentação: https://developers.learnworlds.com/
 */

interface LearnWorldsCourse {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  progress: number;
}

interface LearnWorldsLesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  videoUrl: string;
  completed: boolean;
  locked: boolean;  // Adicionando a propriedade locked
}

// No ambiente real, essas credenciais devem vir de variáveis de ambiente seguras
const API_KEY = "api_key_simulada";
const SCHOOL_ID = "eduzayn";
const API_BASE_URL = `https://api.learnworlds.com/v2/school/${SCHOOL_ID}`;

// Headers padrão para requisições
const getHeaders = () => ({
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
});

/**
 * Busca todos os cursos disponíveis para o aluno
 * @param userId ID do usuário/aluno
 */
export const getUserCourses = async (userId: string): Promise<LearnWorldsCourse[]> => {
  try {
    // Em um ambiente real, faríamos uma chamada à API
    // const response = await fetch(`${API_BASE_URL}/users/${userId}/courses`, { headers: getHeaders() });
    
    // Para simulação, retornamos dados mockados
    return [
      {
        id: "curso-1",
        title: "Desenvolvimento Web Frontend",
        description: "Aprenda a criar interfaces web modernas com HTML, CSS e JavaScript",
        thumbnail: "https://via.placeholder.com/300x180?text=Frontend",
        progress: 65
      },
      {
        id: "curso-2",
        title: "Desenvolvimento Backend com Node.js",
        description: "Construa APIs robustas e escaláveis com Node.js e Express",
        thumbnail: "https://via.placeholder.com/300x180?text=Backend",
        progress: 30
      },
      {
        id: "curso-3",
        title: "React Native para Iniciantes",
        description: "Crie aplicativos móveis nativos usando JavaScript",
        thumbnail: "https://via.placeholder.com/300x180?text=React+Native",
        progress: 10
      }
    ];
  } catch (error) {
    console.error("Erro ao buscar cursos do usuário:", error);
    throw new Error("Não foi possível carregar os cursos. Tente novamente mais tarde.");
  }
};

/**
 * Busca as aulas de um curso específico
 * @param courseId ID do curso
 * @param userId ID do usuário/aluno
 */
export const getCourseLessons = async (courseId: string, userId: string): Promise<LearnWorldsLesson[]> => {
  try {
    // Em um ambiente real, faríamos uma chamada à API
    // const response = await fetch(`${API_BASE_URL}/courses/${courseId}/lessons?userId=${userId}`, { headers: getHeaders() });
    
    // Para simulação, retornamos dados mockados
    return [
      {
        id: "aula-1",
        title: "Introdução ao Curso",
        description: "Visão geral e objetivos do curso",
        duration: 15 * 60, // 15 minutos em segundos
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        completed: true,
        locked: false
      },
      {
        id: "aula-2",
        title: "Configurando o Ambiente",
        description: "Instalação e configuração das ferramentas necessárias",
        duration: 25 * 60, // 25 minutos em segundos
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        completed: true,
        locked: false
      },
      {
        id: "aula-3",
        title: "Fundamentos Básicos",
        description: "Conceitos fundamentais que você precisa conhecer",
        duration: 45 * 60, // 45 minutos em segundos
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        completed: false,
        locked: false
      },
      {
        id: "aula-4",
        title: "Projeto Prático - Parte 1",
        description: "Início da aplicação prática dos conceitos",
        duration: 60 * 60, // 60 minutos em segundos
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        completed: false,
        locked: false
      }
    ];
  } catch (error) {
    console.error("Erro ao buscar aulas do curso:", error);
    throw new Error("Não foi possível carregar as aulas do curso. Tente novamente mais tarde.");
  }
};

/**
 * Marca uma aula como concluída
 * @param courseId ID do curso
 * @param lessonId ID da aula
 * @param userId ID do usuário/aluno
 */
export const markLessonAsCompleted = async (courseId: string, lessonId: string, userId: string): Promise<boolean> => {
  try {
    // Em um ambiente real, faríamos uma chamada à API
    /*
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/lessons/${lessonId}/complete`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userId })
    });
    */
    
    // Para simulação, apenas retornamos sucesso
    console.log(`Aula ${lessonId} do curso ${courseId} marcada como concluída para o usuário ${userId}`);
    return true;
  } catch (error) {
    console.error("Erro ao marcar aula como concluída:", error);
    throw new Error("Não foi possível atualizar o progresso da aula. Tente novamente mais tarde.");
  }
};

/**
 * Registra o progresso do vídeo de uma aula
 * @param courseId ID do curso
 * @param lessonId ID da aula
 * @param userId ID do usuário/aluno
 * @param progressSeconds Tempo em segundos assistido
 */
export const trackVideoProgress = async (courseId: string, lessonId: string, userId: string, progressSeconds: number): Promise<boolean> => {
  try {
    // Em um ambiente real, faríamos uma chamada à API
    /*
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/lessons/${lessonId}/progress`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userId, progressSeconds })
    });
    */
    
    // Para simulação, apenas logamos e retornamos sucesso
    console.log(`Progresso de ${progressSeconds}s registrado na aula ${lessonId} do curso ${courseId} para o usuário ${userId}`);
    return true;
  } catch (error) {
    console.error("Erro ao registrar progresso do vídeo:", error);
    throw new Error("Não foi possível salvar seu progresso. Seu avanço pode não ser registrado corretamente.");
  }
};

// Exportamos os tipos para uso em outros componentes
export type { LearnWorldsCourse, LearnWorldsLesson };
