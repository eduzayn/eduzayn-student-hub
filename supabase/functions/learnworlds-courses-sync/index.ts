import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

// Configuração dos cabeçalhos CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Token de bypass para admins - usando um nome padronizado
const ADMIN_BYPASS_JWT = Deno.env.get("ADMIN_BYPASS_TOKEN") || "byZ4yn-#v0lt-2025!SEC";

// Interface para dados do curso da LearnWorlds
interface LearnWorldsCourse {
  id: string;
  title: string;
  description?: string;
  shortDescription?: string;
  price?: number;
  duration?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Interface para resultados da sincronização
interface SyncResults {
  imported: number;
  updated: number;
  failed: number;
  total: number;
  logs: string[];
}

serve(async (req) => {
  // Lidar com solicitações OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Iniciar resultados da sincronização
  const results: SyncResults = {
    imported: 0,
    updated: 0,
    failed: 0,
    total: 0,
    logs: []
  };

  try {
    // Verificação de token JWT
    const authHeader = req.headers.get("Authorization");
    console.log("Auth header recebido:", authHeader ? "Sim" : "Não");
    
    if (!authHeader) {
      console.error("Requisição sem cabeçalho de autorização");
      return new Response(
        JSON.stringify({ error: 'Sem token de autenticação', code: 401 }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Extrair o token do cabeçalho - agora padronizado para formato Bearer
    let token = "";
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    } else {
      token = authHeader.trim();
    }
    
    // Log para depuração
    console.log(`Token recebido (primeiros 5 chars): ${token.substring(0, 5)}...`);
    console.log(`Token esperado (primeiros 5 chars): ${ADMIN_BYPASS_JWT.substring(0, 5)}...`);

    // Verificação com o token padronizado
    let isAuthenticated = false;

    // Verificar se é o token de bypass
    if (token === ADMIN_BYPASS_JWT) {
      console.log("Autenticação via token bypass de admin");
      isAuthenticated = true;
    } else {
      // Se não for o token de bypass, verificar no Supabase
      try {
        // Criar um cliente Supabase para verificar o token
        const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
        const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') as string;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Verificar se o token é válido
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user) {
          console.error('Erro de autenticação:', authError);
          return new Response(
            JSON.stringify({ error: 'Token de autenticação inválido', code: 401, details: authError }),
            {
              status: 401,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
        isAuthenticated = true;
        console.log(`Autenticado como: ${user.email}`);
      } catch (authError) {
        console.error('Erro ao verificar token:', authError);
        return new Response(
          JSON.stringify({ error: 'Erro ao verificar token', code: 401, details: authError.message }),
          {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }
    
    if (!isAuthenticated) {
      return new Response(
        JSON.stringify({ error: 'Não autenticado', code: 401 }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Obter parâmetros da solicitação
    const url = new URL(req.url);
    const isSyncAll = url.searchParams.get('syncAll') === 'true';
    const pageSize = parseInt(url.searchParams.get('pageSize') || '100');
    const pageNumber = parseInt(url.searchParams.get('page') || '1');

    // Obter chaves da API e configurações da LearnWorlds
    const apiKey = Deno.env.get('LEARNWORLDS_API_KEY');
    const schoolId = Deno.env.get('LEARNWORLDS_SCHOOL_ID');
    const apiBaseUrl = Deno.env.get('LEARNWORLDS_API_URL') || 'https://api.learnworlds.com';

    if (!apiKey || !schoolId) {
      console.error('Configurações da API LearnWorlds ausentes');
      return new Response(
        JSON.stringify({ error: 'Configurações da API ausentes' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Criar um cliente Supabase para operações no banco de dados
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Iniciando sincronização de cursos da LearnWorlds${isSyncAll ? ' (todos os cursos)' : ''}`);
    addLog(results, `Iniciando sincronização de cursos - Página ${pageNumber}, Tamanho ${pageSize}`);

    // Função para buscar cursos da LearnWorlds
    const fetchCourses = async (page: number, limit: number): Promise<{ data: LearnWorldsCourse[], total: number, pages: number }> => {
      const apiUrl = `${apiBaseUrl}/${schoolId}/courses?page=${page}&limit=${limit}`;
      console.log(`Buscando cursos da LearnWorlds: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erro na API LearnWorlds: ${response.status} - ${errorText}`);
        throw new Error(`LearnWorlds API Error: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();
      return responseData;
    };

    // Função para processar e sincronizar cursos
    const processCourses = async (courses: LearnWorldsCourse[]): Promise<void> => {
      for (const course of courses) {
        try {
          // Verificar se o curso já existe no Supabase
          const { data: existingCourse, error: queryError } = await supabase
            .from('cursos')
            .select('id, titulo')
            .eq('learning_worlds_id', course.id)
            .maybeSingle();
          
          if (queryError) {
            console.error(`Erro ao buscar curso no Supabase: ${queryError.message}`);
            results.failed++;
            addLog(results, `Falha ao processar curso ${course.id}: ${queryError.message}`);
            continue;
          }
          
          // Preparar dados para inserir/atualizar
          const courseData = {
            titulo: course.title,
            descricao: course.description || course.shortDescription || '',
            learning_worlds_id: course.id,
            valor_total: course.price || 0,
            valor_mensalidade: course.price ? course.price / 12 : 0, // Exemplo simples, ajuste conforme necessário
            carga_horaria: parseDuration(course.duration || '0'),
            imagem_url: course.image || '',
            codigo: `LW-${course.id.substring(0, 6).toUpperCase()}`,
            data_atualizacao: new Date().toISOString()
          };
          
          if (existingCourse) {
            // Atualizar curso existente
            const { error: updateError } = await supabase
              .from('cursos')
              .update(courseData)
              .eq('id', existingCourse.id);
              
            if (updateError) {
              console.error(`Erro ao atualizar curso no Supabase: ${updateError.message}`);
              results.failed++;
              addLog(results, `Falha ao atualizar curso ${course.id}: ${updateError.message}`);
            } else {
              results.updated++;
              addLog(results, `Curso atualizado: ${course.title} (${course.id})`);
            }
          } else {
            // Criar novo curso
            const { error: insertError } = await supabase
              .from('cursos')
              .insert({
                ...courseData,
                data_criacao: new Date().toISOString()
              });
              
            if (insertError) {
              console.error(`Erro ao inserir curso no Supabase: ${insertError.message}`);
              results.failed++;
              addLog(results, `Falha ao criar curso ${course.id}: ${insertError.message}`);
            } else {
              results.imported++;
              addLog(results, `Novo curso importado: ${course.title} (${course.id})`);
            }
          }
        } catch (error) {
          console.error(`Erro ao processar curso ${course.id}:`, error);
          results.failed++;
          addLog(results, `Erro não tratado com curso ${course.id}: ${error.message}`);
        }
      }
    };

    // Helper para converter duração em string para minutos
    function parseDuration(duration: string): number {
      // Tenta converter a duração para um número de horas
      try {
        // Se for apenas um número, assume que são horas
        if (/^\d+$/.test(duration)) {
          return parseInt(duration) * 60; // Converte horas para minutos
        }
        
        // Se for no formato "X horas" ou "X h"
        const hoursMatch = duration.match(/(\d+)\s*(horas|hora|h)/i);
        if (hoursMatch) {
          return parseInt(hoursMatch[1]) * 60;
        }
        
        // Se for no formato "X minutos" ou "X min"
        const minutesMatch = duration.match(/(\d+)\s*(minutos|minuto|min)/i);
        if (minutesMatch) {
          return parseInt(minutesMatch[1]);
        }
        
        // Formato desconhecido, retorna 0
        return 0;
      } catch (error) {
        console.error("Erro ao converter duração:", error);
        return 0;
      }
    }

    // Helper para adicionar logs
    function addLog(results: SyncResults, message: string) {
      results.logs.push(`[${new Date().toISOString()}] ${message}`);
      console.log(message);
    }

    // Iniciar a sincronização
    if (isSyncAll) {
      // Buscar cursos pela primeira vez para descobrir o total de páginas
      const firstPage = await fetchCourses(1, pageSize);
      results.total = firstPage.total;
      
      addLog(results, `Total de ${firstPage.total} cursos encontrados em ${firstPage.pages} páginas`);
      
      // Processar primeira página
      await processCourses(firstPage.data);
      
      // Processar páginas adicionais (se houver)
      for (let page = 2; page <= firstPage.pages; page++) {
        addLog(results, `Processando página ${page} de ${firstPage.pages}`);
        const pageData = await fetchCourses(page, pageSize);
        await processCourses(pageData.data);
      }
    } else {
      // Buscar apenas uma página específica
      const pageData = await fetchCourses(pageNumber, pageSize);
      results.total = pageData.data.length;
      addLog(results, `Processando ${pageData.data.length} cursos (página ${pageNumber} de ${pageData.pages})`);
      await processCourses(pageData.data);
    }

    addLog(results, `Sincronização concluída: ${results.imported} importados, ${results.updated} atualizados, ${results.failed} falhas`);
    
    // Retornar resultados
    return new Response(
      JSON.stringify(results),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    // Lidar com erros gerais
    console.error('Erro ao processar solicitação:', error);
    results.logs.push(`[${new Date().toISOString()}] Erro geral: ${error.message}`);
    
    return new Response(
      JSON.stringify({ error: 'Erro ao processar a solicitação', details: error.message, results }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
