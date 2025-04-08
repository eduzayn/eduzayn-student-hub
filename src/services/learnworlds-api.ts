
/**
 * Serviço de integração com a API da LearnWorlds e Supabase
 * Documentação: https://developers.learnworlds.com/
 */
import { supabase } from "@/integrations/supabase/client";
import type { RotaAprendizagemType } from "@/types/aprendizagem";

// URL base correta para funções do Supabase
const SUPABASE_FUNCTION_BASE_URL = "https://bioarzkfmcobctblzztm.supabase.co/functions/v1";

interface LearnWorldsCourse {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  modalidade: string;
  access: string;
  duration: string;
  progress: number;
}

interface LearnWorldsLesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  videoUrl: string;
  completed: boolean;
  locked: boolean;
}

// Credenciais da API LearnWorlds
const API_KEY = "5lT9XbVrXwv9ulYNufC3OdU4ewon4wUocMENvWEa3pBc8hIOix";
const SCHOOL_ID = "66abb5fdf8655b4b800c7278";
const API_BASE_URL = "https://grupozayneducacional.com.br/admin/api";

// Headers padrão para requisições
const getHeaders = () => ({
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
});

/**
 * Busca todos os cursos disponíveis para o aluno usando Supabase e LearnWorlds
 * @param userId ID do usuário/aluno
 */
export const getUserCourses = async (userId: string): Promise<LearnWorldsCourse[]> => {
  try {
    // Tenta buscar os cursos do usuário pelo Supabase
    const { data: matriculas, error: matriculasError } = await supabase
      .from('matriculas')
      .select(`
        curso_id,
        progresso,
        cursos(
          id,
          titulo,
          descricao,
          imagem_url,
          learning_worlds_id,
          valor_total,
          valor_mensalidade,
          modalidade,
          carga_horaria
        )
      `)
      .eq('aluno_id', userId);
    
    if (matriculasError) {
      console.error("Erro ao buscar matrículas do Supabase:", matriculasError);
      throw new Error("Erro ao buscar matrículas");
    }
    
    // Se não houver dados no Supabase, retorna os dados mockados
    if (!matriculas || matriculas.length === 0) {
      console.log("Nenhuma matrícula encontrada, usando dados mockados");
      return getMockCourses();
    }
    
    // Para cada matrícula, tenta buscar informações adicionais da API LearnWorlds
    // No contexto atual, estamos apenas usando os dados do Supabase e acrescentando fallbacks
    const courses = matriculas.map(matricula => {
      const curso = matricula.cursos;
      
      // Dados do curso, com fallbacks seguros
      return {
        id: matricula.curso_id,
        title: curso?.titulo || "Sem título",
        description: curso?.descricao || "Sem descrição",
        thumbnail: curso?.imagem_url || "https://via.placeholder.com/300x180?text=Curso",
        price: curso?.valor_total || 0,
        modalidade: curso?.modalidade || "EAD",
        access: "paid", // Valor padrão já que não temos essa coluna
        duration: curso?.carga_horaria ? `${curso.carga_horaria} horas` : "Sem duração",
        progress: matricula.progresso || 0,
        learnWorldsId: curso?.learning_worlds_id || null
      };
    });
    
    // TODO: Se necessário, enriquecer os dados com informações da API LearnWorlds
    // usando os learning_worlds_id disponíveis nos cursos
    
    return courses;
  } catch (error) {
    console.error("Erro ao buscar cursos do usuário:", error);
    
    // Em caso de erro, usa os dados mockados como fallback
    console.log("Usando dados mockados devido a erro");
    return getMockCourses();
  }
};

/**
 * Função auxiliar para retornar cursos mockados
 */
const getMockCourses = (): LearnWorldsCourse[] => {
  return [
    {
      id: "curso-1",
      title: "Desenvolvimento Web Frontend",
      description: "Aprenda a criar interfaces web modernas com HTML, CSS e JavaScript",
      thumbnail: "https://via.placeholder.com/300x180?text=Frontend",
      price: 100,
      modalidade: "Online",
      access: "Aberto",
      duration: "6 meses",
      progress: 65
    },
    {
      id: "curso-2",
      title: "Desenvolvimento Backend com Node.js",
      description: "Construa APIs robustas e escaláveis com Node.js e Express",
      thumbnail: "https://via.placeholder.com/300x180?text=Backend",
      price: 150,
      modalidade: "Presencial",
      access: "Aberto",
      duration: "4 meses",
      progress: 30
    },
    {
      id: "curso-3",
      title: "React Native para Iniciantes",
      description: "Crie aplicativos móveis nativos usando JavaScript",
      thumbnail: "https://via.placeholder.com/300x180?text=React+Native",
      price: 200,
      modalidade: "Online",
      access: "Aberto",
      duration: "3 meses",
      progress: 10
    }
  ];
};

/**
 * Busca as aulas de um curso específico usando Supabase
 * @param courseId ID do curso
 * @param userId ID do usuário/aluno
 */
export const getCourseLessons = async (courseId: string, userId: string): Promise<LearnWorldsLesson[]> => {
  try {
    // Busca módulos do curso
    const { data: modulos, error: modulosError } = await supabase
      .from('modulos_curso')
      .select('id, titulo')
      .eq('curso_id', courseId)
      .order('ordem', { ascending: true });
    
    if (modulosError) {
      console.error("Erro ao buscar módulos do curso:", modulosError);
      throw new Error("Erro ao buscar módulos do curso");
    }
    
    // Se não houver módulos, retorna dados mockados
    if (!modulos || modulos.length === 0) {
      console.log("Nenhum módulo encontrado, usando dados mockados");
      return getMockLessons();
    }
    
    // Para cada módulo, busca suas aulas
    let todasAulas: LearnWorldsLesson[] = [];
    
    for (const modulo of modulos) {
      // Busca aulas do módulo
      const { data: aulas, error: aulasError } = await supabase
        .from('aulas')
        .select(`
          id,
          titulo,
          descricao,
          duracao,
          url,
          progresso_aulas(concluido)
        `)
        .eq('modulo_id', modulo.id)
        .order('ordem', { ascending: true });
      
      if (aulasError) {
        console.error(`Erro ao buscar aulas do módulo ${modulo.id}:`, aulasError);
        continue;
      }
      
      // Mapeia as aulas para o formato esperado
      if (aulas && aulas.length > 0) {
        const aulasFormatadas = aulas.map((aula, index) => {
          // Verifica se a aula está concluída
          const concluida = aula.progresso_aulas && aula.progresso_aulas.length > 0
            ? aula.progresso_aulas[0].concluido || false
            : false;
          
          // A lógica de bloqueio pode ser personalizada
          // Por exemplo, aulas posteriores podem ser bloqueadas se as anteriores não estiverem concluídas
          const bloqueada = index > 0 && !todasAulas[index - 1]?.completed;
          
          return {
            id: aula.id,
            title: aula.titulo,
            description: aula.descricao || "",
            duration: aula.duracao || 0,
            videoUrl: aula.url || "https://www.youtube.com/embed/dQw4w9WgXcQ",
            completed: concluida,
            locked: bloqueada
          };
        });
        
        todasAulas = [...todasAulas, ...aulasFormatadas];
      }
    }
    
    // Se não encontrou nenhuma aula, retorna dados mockados
    if (todasAulas.length === 0) {
      console.log("Nenhuma aula encontrada, usando dados mockados");
      return getMockLessons();
    }
    
    return todasAulas;
  } catch (error) {
    console.error("Erro ao buscar aulas do curso:", error);
    
    // Em caso de erro, usa os dados mockados como fallback
    console.log("Usando dados mockados devido a erro");
    return getMockLessons();
  }
};

/**
 * Função auxiliar para retornar aulas mockadas
 */
const getMockLessons = (): LearnWorldsLesson[] => {
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
      locked: true
    }
  ];
};

/**
 * Marca uma aula como concluída no Supabase
 * @param courseId ID do curso
 * @param lessonId ID da aula
 * @param userId ID do usuário/aluno
 */
export const markLessonAsCompleted = async (courseId: string, lessonId: string, userId: string): Promise<boolean> => {
  try {
    // Verifica se já existe um registro de progresso para esta aula
    const { data: progressoExistente, error: consultaError } = await supabase
      .from('progresso_aulas')
      .select('id, concluido')
      .eq('aluno_id', userId)
      .eq('aula_id', lessonId)
      .maybeSingle();
    
    if (consultaError) {
      console.error("Erro ao verificar progresso existente:", consultaError);
      throw new Error("Erro ao verificar progresso da aula");
    }
    
    // Se já existe um registro, atualiza-o
    if (progressoExistente) {
      const { error: updateError } = await supabase
        .from('progresso_aulas')
        .update({
          concluido: true,
          data_conclusao: new Date().toISOString(),
          data_atualizacao: new Date().toISOString()
        })
        .eq('id', progressoExistente.id);
      
      if (updateError) {
        console.error("Erro ao atualizar progresso:", updateError);
        throw new Error("Não foi possível atualizar o progresso da aula");
      }
    } 
    // Se não existe, cria um novo registro
    else {
      const { error: insertError } = await supabase
        .from('progresso_aulas')
        .insert({
          aluno_id: userId,
          aula_id: lessonId,
          concluido: true,
          data_inicio: new Date().toISOString(),
          data_conclusao: new Date().toISOString()
        });
      
      if (insertError) {
        console.error("Erro ao inserir progresso:", insertError);
        throw new Error("Não foi possível registrar o progresso da aula");
      }
    }
    
    console.log(`Aula ${lessonId} do curso ${courseId} marcada como concluída para o usuário ${userId}`);
    
    // TODO: Se necessário, também atualizar o progresso na API LearnWorlds
    
    return true;
  } catch (error) {
    console.error("Erro ao marcar aula como concluída:", error);
    throw new Error("Não foi possível atualizar o progresso da aula. Tente novamente mais tarde.");
  }
};

/**
 * Registra o progresso do vídeo de uma aula no Supabase
 * @param courseId ID do curso
 * @param lessonId ID da aula
 * @param userId ID do usuário/aluno
 * @param progressSeconds Tempo em segundos assistido
 */
export const trackVideoProgress = async (courseId: string, lessonId: string, userId: string, progressSeconds: number): Promise<boolean> => {
  try {
    // Verifica se já existe um registro de progresso para esta aula
    const { data: progressoExistente, error: consultaError } = await supabase
      .from('progresso_aulas')
      .select('id')
      .eq('aluno_id', userId)
      .eq('aula_id', lessonId)
      .maybeSingle();
    
    if (consultaError) {
      console.error("Erro ao verificar progresso existente:", consultaError);
      throw new Error("Erro ao verificar progresso do vídeo");
    }
    
    // Se já existe um registro, atualiza-o
    if (progressoExistente) {
      const { error: updateError } = await supabase
        .from('progresso_aulas')
        .update({
          tempo_assistido: progressSeconds,
          data_atualizacao: new Date().toISOString()
        })
        .eq('id', progressoExistente.id);
      
      if (updateError) {
        console.error("Erro ao atualizar tempo assistido:", updateError);
        throw new Error("Não foi possível atualizar o progresso do vídeo");
      }
    } 
    // Se não existe, cria um novo registro
    else {
      const { error: insertError } = await supabase
        .from('progresso_aulas')
        .insert({
          aluno_id: userId,
          aula_id: lessonId,
          tempo_assistido: progressSeconds,
          data_inicio: new Date().toISOString(),
          concluido: false
        });
      
      if (insertError) {
        console.error("Erro ao inserir progresso do vídeo:", insertError);
        throw new Error("Não foi possível registrar o progresso do vídeo");
      }
    }
    
    console.log(`Progresso de ${progressSeconds}s registrado na aula ${lessonId} do curso ${courseId} para o usuário ${userId}`);
    
    // TODO: Se necessário, também atualizar o progresso na API LearnWorlds
    
    return true;
  } catch (error) {
    console.error("Erro ao registrar progresso do vídeo:", error);
    throw new Error("Não foi possível salvar seu progresso. Seu avanço pode não ser registrado corretamente.");
  }
};

/**
 * Busca o usuário atual do Supabase
 * Retorna o ID do usuário ou null se não estiver autenticado
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session?.user?.id) {
      console.log("Usuário não autenticado ou erro ao obter sessão");
      return null;
    }
    
    return data.session.user.id;
  } catch (error) {
    console.error("Erro ao buscar usuário atual:", error);
    return null;
  }
};

/**
 * Busca a rota de aprendizagem do aluno
 * @param userId ID do usuário/aluno
 */
export const getRotaAprendizagem = async (userId: string): Promise<RotaAprendizagemType> => {
  try {
    // Como as tabelas rotas_aprendizagem e modulos_rota_aprendizagem não existem no banco de dados,
    // vamos usar diretamente os dados mockados para evitar erros
    console.log("Usando dados mockados para rota de aprendizagem");
    return getMockRotaAprendizagem();
  } catch (error) {
    console.error("Erro ao buscar rota de aprendizagem:", error);
    
    // Em caso de erro, usa os dados mockados como fallback
    console.log("Usando dados mockados devido a erro");
    return getMockRotaAprendizagem();
  }
};

/**
 * Função auxiliar para retornar uma rota de aprendizagem mockada
 */
const getMockRotaAprendizagem = (): RotaAprendizagemType => {
  const cursosFake = getMockCourses();
  
  return {
    id: "rota-1",
    titulo: "Desenvolvimento Web Fullstack",
    descricao: "Trilha completa de desenvolvimento web, do básico ao avançado.",
    progresso: 45,
    tempoEstimado: "6 meses",
    modulos: [
      {
        id: "modulo-1",
        titulo: "Fundamentos de Desenvolvimento Web",
        descricao: "Conceitos básicos de HTML, CSS e JavaScript",
        concluido: true,
        bloqueado: false,
        emAndamento: false,
        curso: {
          id: cursosFake[0].id,
          title: cursosFake[0].title,
          thumbnail: cursosFake[0].thumbnail,
          progress: 100,
          lessions: 12
        },
        submodulos: [
          {
            id: "submodulo-1-1",
            titulo: "HTML5 Semântico",
            concluido: true,
            descricao: "Aprendendo a estruturar páginas HTML de forma semântica"
          },
          {
            id: "submodulo-1-2",
            titulo: "CSS3 e Design Responsivo",
            concluido: true,
            descricao: "Estilizando páginas web para diversos dispositivos"
          },
          {
            id: "submodulo-1-3",
            titulo: "JavaScript Básico",
            concluido: true,
            descricao: "Fundamentos da programação com JavaScript"
          }
        ]
      },
      {
        id: "modulo-2",
        titulo: "Desenvolvimento Frontend",
        descricao: "Frameworks e bibliotecas para desenvolvimento frontend moderno",
        concluido: false,
        bloqueado: false,
        emAndamento: true,
        curso: {
          id: cursosFake[0].id,
          title: "React Native para Iniciantes",
          thumbnail: "https://via.placeholder.com/300x180?text=React+Native",
          progress: 45,
          lessions: 10
        },
        submodulos: [
          {
            id: "submodulo-2-1",
            titulo: "Introdução ao React",
            concluido: true,
            descricao: "Conhecendo a biblioteca React"
          },
          {
            id: "submodulo-2-2",
            titulo: "Componentes e Props",
            concluido: true,
            descricao: "Criando componentes reutilizáveis"
          },
          {
            id: "submodulo-2-3",
            titulo: "Estado e Ciclo de Vida",
            concluido: false,
            descricao: "Gerenciando estados e ciclos de vida de componentes"
          },
          {
            id: "submodulo-2-4",
            titulo: "Hooks e Context API",
            concluido: false,
            descricao: "Usando hooks e contextos para compartilhar estados"
          }
        ]
      },
      {
        id: "modulo-3",
        titulo: "Desenvolvimento Backend",
        descricao: "Criação de APIs e serviços de backend",
        concluido: false,
        bloqueado: true,
        emAndamento: false,
        curso: {
          id: cursosFake[1].id,
          title: cursosFake[1].title,
          thumbnail: cursosFake[1].thumbnail,
          progress: 0,
          lessions: 15
        }
      },
      {
        id: "modulo-4",
        titulo: "Bancos de Dados e ORM",
        descricao: "Trabalho com bancos de dados relacionais e não-relacionais",
        concluido: false,
        bloqueado: true,
        emAndamento: false
      },
      {
        id: "modulo-5",
        titulo: "DevOps e Deploy",
        descricao: "Implementação de aplicações em produção",
        concluido: false,
        bloqueado: true,
        emAndamento: false
      }
    ],
    moduloRecomendado: {
      id: "modulo-2",
      titulo: "Desenvolvimento Frontend",
      descricao: "Frameworks e bibliotecas para desenvolvimento frontend moderno",
      concluido: false,
      bloqueado: false,
      emAndamento: true,
      curso: {
        id: cursosFake[0].id,
        title: "React Native para Iniciantes",
        thumbnail: "https://via.placeholder.com/300x180?text=React+Native",
        progress: 45,
        lessions: 10
      }
    },
    certificados: [
      {
        id: "cert-1",
        titulo: "Certificado de Fundamentos Web",
        descricao: "Conclusão do módulo de Fundamentos de Desenvolvimento Web",
        disponivel: true,
        dataEmissao: "2023-06-15"
      },
      {
        id: "cert-2",
        titulo: "Certificado de Desenvolvedor Frontend",
        descricao: "Conclusão do módulo de Desenvolvimento Frontend",
        disponivel: false
      }
    ]
  };
};

// Exportamos os tipos para uso em outros componentes
export type { LearnWorldsCourse, LearnWorldsLesson };
