// 👥 handlers.ts - Manipuladores de rota para API LearnWorlds
import { callLearnWorldsApi } from "./api.ts";
import { corsHeaders } from "./config.ts";

// Manipulador para rotas relacionadas a usuários
export async function handleUsuarios(req: Request, path: string): Promise<Response> {
  try {
    const url = new URL(req.url);
    const method = req.method;
    let body = null;
    
    if (method === "POST" || method === "PUT") {
      body = await req.json();
    }

    // Identificar o tipo de requisição de usuário
    if (path.includes("/users")) {
      console.log(`📋 Processando requisição de usuários: ${method} ${path}`);
      
      // Extrair parâmetros da URL
      const page = url.searchParams.get("page") || "1";
      const limit = url.searchParams.get("items_per_page") || "20";
      const search = url.searchParams.get("search") || "";
      const email = url.searchParams.get("email") || "";
      
      // Formatar endpoint corretamente para API V2
      let endpoint = `users?page=${page}&items_per_page=${limit}`;
      
      // Adicionar parâmetros de busca se houver
      if (search) {
        endpoint += `&search=${encodeURIComponent(search)}`;
      }
      if (email) {
        endpoint += `&email=${encodeURIComponent(email)}`;
      }
      
      // Se for busca por ID específico
      if (path.match(/\/users\/[a-zA-Z0-9-]+$/)) {
        const userId = path.split("/").pop();
        endpoint = `users/${userId}`;
      }
      
      console.log(`🔍 Endpoint formatado: ${endpoint}`);
      
      // Chamar a API do LearnWorlds usando OAuth
      const data = await callLearnWorldsApi(endpoint, method, body, true);
      
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    return new Response(JSON.stringify({ error: "Rota de usuário não encontrada" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error("❌ Erro ao processar requisição de usuários:", error);
    
    return new Response(JSON.stringify({
      success: false,
      message: error.message || "Erro ao processar requisição de usuários"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}

// Manipulador para rotas relacionadas a cursos
export async function handleCursos(req: Request, path: string): Promise<Response> {
  try {
    const url = new URL(req.url);
    const params = url.searchParams;
    
    // GET /courses - Listar cursos
    if (path === "/courses" && req.method === "GET") {
      const page = Number(params.get("page") || "1");
      const limit = Number(params.get("limit") || "50");
      const searchTerm = params.get("q") || "";
      
      const result = await callLearnWorldsApi(
        `/courses?page=${page}&limit=${limit}${searchTerm ? `&q=${searchTerm}` : ""}`,
        "GET",
        null,
        true
      );
      
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: corsHeaders
      });
    }
    
    // GET /courses/:id - Obter curso específico
    if (path.match(/^\/courses\/[^\/]+$/) && req.method === "GET") {
      const courseId = path.split("/")[2];
      
      const result = await callLearnWorldsApi(`/courses/${courseId}`, "GET", null, true);
      
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: corsHeaders
      });
    }
    
    // GET /courses/:id/content - Obter conteúdo de um curso
    if (path.match(/^\/courses\/[^\/]+\/content$/) && req.method === "GET") {
      const courseId = path.split("/")[2];
      const userId = params.get("userId");
      
      if (!userId) {
        return new Response(JSON.stringify({
          success: false,
          message: "Parâmetro userId é obrigatório"
        }), {
          status: 400,
          headers: corsHeaders
        });
      }
      
      // Buscar módulos/seções do curso
      const modulesResult = await callLearnWorldsApi(
        `/courses/${courseId}/modules`,
        "GET",
        null,
        true
      );
      
      // Buscar progresso do usuário para este curso
      const progressResult = await callLearnWorldsApi(
        `/users/${userId}/courses/${courseId}/progress`,
        "GET",
        null,
        true
      );
      
      // Extrair o progresso das aulas do usuário para este curso
      const userLessonsProgress = progressResult.data?.lessons_progress || {};
      
      // Criar lista de aulas com informação de progresso
      const lessons = [];
      let order = 1;
      
      // Processar módulos e suas aulas
      for (const module of (modulesResult.data || [])) {
        for (const lesson of (module.lessons || [])) {
          const lessonProgress = userLessonsProgress[lesson.id] || {};
          
          lessons.push({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            type: lesson.type,
            url: lesson.content_url,
            duration: lesson.duration,
            completed: !!lessonProgress.completed,
            locked: !!lesson.locked,
            order: order++
          });
        }
      }
      
      return new Response(JSON.stringify({
        success: true,
        data: {
          lessons,
          total_lessons: lessons.length,
          course_title: modulesResult.course_title || "Curso",
          course_progress: progressResult.data?.progress || 0
        }
      }), {
        status: 200,
        headers: corsHeaders
      });
    }
    
    // POST /sync/courses - Sincronizar cursos (import)
    if (path === "/sync/courses" && req.method === "POST") {
      const result = await callLearnWorldsApi("/import/courses", "POST", null, true);
      
      return new Response(JSON.stringify({
        success: true,
        message: "Sincronização de cursos iniciada com sucesso",
        imported: result.imported || 0,
        updated: result.updated || 0,
        failed: result.failed || 0,
        total: result.total || 0,
        logs: result.logs || []
      }), {
        status: 200,
        headers: corsHeaders
      });
    }
    
    // Rota não implementada para cursos
    return new Response(JSON.stringify({
      success: false,
      message: "Endpoint de curso não implementado",
      path
    }), {
      status: 404,
      headers: corsHeaders
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: error.message || "Erro ao processar requisição de curso"
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

// Manipulador para rotas relacionadas a matrículas
export async function handleMatriculas(req: Request, path: string): Promise<Response> {
  try {
    // POST /enrollments - Criar matrícula
    if (path === "/enrollments" && req.method === "POST") {
      const enrollmentData = await req.json();
      
      // Validar dados mínimos
      if (!enrollmentData.userId || !enrollmentData.courseId) {
        return new Response(JSON.stringify({
          success: false,
          message: "Dados incompletos: userId e courseId são obrigatórios"
        }), {
          status: 400,
          headers: corsHeaders
        });
      }
      
      // Criar a matrícula
      const result = await callLearnWorldsApi(
        `/courses/${enrollmentData.courseId}/users/${enrollmentData.userId}/enrollment`, 
        "POST", 
        {
          access_type: enrollmentData.accessType || "paid",
          expiration_date: enrollmentData.expirationDate || null
        },
        true
      );
      
      return new Response(JSON.stringify({
        success: true,
        data: {
          id: result.id || result.enrollment_id,
          user_id: enrollmentData.userId,
          course_id: enrollmentData.courseId,
          status: result.status || "active",
          created_at: result.created_at || new Date().toISOString()
        }
      }), {
        status: 201,
        headers: corsHeaders
      });
    }
    
    // POST /enrollments/:id/suspend - Suspender matrícula
    if (path.match(/^\/enrollments\/[^\/]+\/suspend$/) && req.method === "POST") {
      const enrollmentId = path.split("/")[2];
      
      // Obter dados da matrícula para saber o usuário e curso
      const enrollmentData = await req.json();
      
      if (!enrollmentData.userId || !enrollmentData.courseId) {
        return new Response(JSON.stringify({
          success: false,
          message: "Dados incompletos: userId e courseId são obrigatórios"
        }), {
          status: 400,
          headers: corsHeaders
        });
      }
      
      // Suspender a matrícula
      const result = await callLearnWorldsApi(
        `/courses/${enrollmentData.courseId}/users/${enrollmentData.userId}/enrollment/suspend`,
        "POST",
        null,
        true
      );
      
      return new Response(JSON.stringify({
        success: true,
        message: "Matrícula suspensa com sucesso",
        data: {
          id: enrollmentId,
          status: "suspended"
        }
      }), {
        status: 200,
        headers: corsHeaders
      });
    }
    
    // POST /enrollments/:id/cancel - Cancelar matrícula
    if (path.match(/^\/enrollments\/[^\/]+\/cancel$/) && req.method === "POST") {
      const enrollmentId = path.split("/")[2];
      
      // Obter dados da matrícula para saber o usuário e curso
      const enrollmentData = await req.json();
      
      if (!enrollmentData.userId || !enrollmentData.courseId) {
        return new Response(JSON.stringify({
          success: false,
          message: "Dados incompletos: userId e courseId são obrigatórios"
        }), {
          status: 400,
          headers: corsHeaders
        });
      }
      
      // Cancelar a matrícula
      const result = await callLearnWorldsApi(
        `/courses/${enrollmentData.courseId}/users/${enrollmentData.userId}/enrollment`,
        "DELETE",
        null,
        true
      );
      
      return new Response(JSON.stringify({
        success: true,
        message: "Matrícula cancelada com sucesso",
        data: {
          id: enrollmentId,
          status: "canceled"
        }
      }), {
        status: 200,
        headers: corsHeaders
      });
    }
    
    // POST /courses/:courseId/lessons/:lessonId/progress
    // Atualizar progresso de uma aula
    if (path.match(/^\/courses\/[^\/]+\/lessons\/[^\/]+\/progress$/) && req.method === "POST") {
      const pathParts = path.split("/");
      const courseId = pathParts[2];
      const lessonId = pathParts[4];
      
      const progressData = await req.json();
      
      if (!progressData.userId) {
        return new Response(JSON.stringify({
          success: false,
          message: "UserId é obrigatório para atualizar progresso"
        }), {
          status: 400,
          headers: corsHeaders
        });
      }
      
      let result;
      
      // Marca aula como concluída
      if (progressData.completed) {
        result = await callLearnWorldsApi(
          `/users/${progressData.userId}/courses/${courseId}/lessons/${lessonId}/complete`,
          "POST",
          null,
          true
        );
      } 
      // Atualiza timestamp do vídeo
      else if (progressData.timestamp !== undefined) {
        result = await callLearnWorldsApi(
          `/users/${progressData.userId}/courses/${courseId}/lessons/${lessonId}/progress`,
          "POST",
          { timestamp: progressData.timestamp },
          true
        );
      }
      
      return new Response(JSON.stringify({
        success: true,
        message: progressData.completed 
          ? "Aula marcada como concluída" 
          : "Progresso atualizado com sucesso"
      }), {
        status: 200,
        headers: corsHeaders
      });
    }
    
    // Rota não implementada para matrículas
    return new Response(JSON.stringify({
      success: false,
      message: "Endpoint de matrícula não implementado",
      path
    }), {
      status: 404,
      headers: corsHeaders
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: error.message || "Erro ao processar requisição de matrícula"
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
