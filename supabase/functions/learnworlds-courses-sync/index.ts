
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

// Configuração dos cabeçalhos CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Interface para resultados da sincronização
interface SyncResults {
  imported: number;
  updated: number;
  failed: number;
  total: number;
  logs: string[];
}

serve(async (req) => {
  // Log para diagnóstico inicial
  console.log(`Recebida requisição ${req.method} para ${req.url}`);
  
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
    // Helper para adicionar logs
    function addLog(message: string) {
      results.logs.push(`[${new Date().toISOString()}] ${message}`);
      console.log(message);
    }

    // Obter parâmetros da solicitação
    const url = new URL(req.url);
    const isSyncAll = url.searchParams.get('syncAll') === 'true';
    const pageSize = parseInt(url.searchParams.get('pageSize') || '100');
    const pageNumber = parseInt(url.searchParams.get('page') || '1');

    // Obter chaves da API e configurações da LearnWorlds
    const schoolId = Deno.env.get('LEARNWORLDS_SCHOOL_ID') || "grupozayneducacional";
    const clientId = Deno.env.get('CLIENTE_ID');
    const clientSecret = Deno.env.get('CLIENT_SECRET');
    const tokenPath = Deno.env.get('LEARNWORLDS_OAUTH_TOKEN') || "token";
    const apiBaseUrl = Deno.env.get('LEARNWORLDS_BASE_URL') || 'https://api.learnworlds.com';
    
    // Log detalhado das configurações - IMPORTANTE para diagnóstico!
    addLog(`LEARNWORLDS_SCHOOL_ID: ${schoolId || "indefinido"}`);
    addLog(`CLIENTE_ID: ${clientId ? "definido" : "indefinido"}`);
    addLog(`CLIENT_SECRET: ${clientSecret ? "definido" : "indefinido"}`);
    addLog(`LEARNWORLDS_BASE_URL: ${apiBaseUrl}`);
    addLog(`LEARNWORLDS_OAUTH_TOKEN: ${tokenPath}`);

    if (!clientId || !clientSecret || !schoolId) {
      const errorMsg = 'Configurações da API LearnWorlds ausentes (CLIENT_ID, CLIENT_SECRET ou SCHOOL_ID)';
      addLog(`Erro: ${errorMsg}`);
      return new Response(
        JSON.stringify({ 
          error: errorMsg,
          results
        }),
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

    addLog(`Iniciando sincronização de cursos da LearnWorlds${isSyncAll ? ' (todos os cursos)' : ''}`);

    // Solicitar token de acesso OAuth
    addLog('Solicitando token de acesso...');
    const tokenUrl = `${apiBaseUrl}/oauth2/${tokenPath}`;
    addLog(`URL do token: ${tokenUrl}`);
    
    const authRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Lw-Client': schoolId
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      })
    });
    
    if (!authRes.ok) {
      const errorText = await authRes.text();
      addLog(`Erro ao solicitar token: ${authRes.status} - ${errorText}`);
      throw new Error(`Erro de autenticação OAuth: ${authRes.status} - ${errorText}`);
    }
    
    const authData = await authRes.json();
    const accessToken = authData.access_token;
    
    if (!accessToken) {
      addLog("Token de acesso não recebido na resposta");
      throw new Error("Token de acesso não recebido na resposta OAuth");
    }
    
    addLog('Token de acesso OAuth recebido com sucesso');

    // Função para buscar cursos da LearnWorlds
    const fetchCourses = async (page: number, limit: number): Promise<{ data: any[], total: number, pages: number }> => {
      // Construir a URL da API com os parâmetros de paginação - usando a URL base configurada
      const apiUrl = `${apiBaseUrl}/api/v2/${schoolId}/courses?page=${page}&limit=${limit}`;
      addLog(`Buscando cursos da LearnWorlds: ${apiUrl}`);
      
      try {
        // Usando o token OAuth obtido
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        };
        
        addLog("Enviando requisição com token OAuth");
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: headers,
        });

        addLog(`Resposta da API LearnWorlds: Status ${response.status}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          addLog(`Erro na API LearnWorlds: ${response.status} - ${errorText}`);
          throw new Error(`LearnWorlds API Error: ${response.status} - ${errorText}`);
        }
        
        // Verificar o tipo de conteúdo para melhor diagnóstico
        const contentType = response.headers.get('content-type') || '';
        addLog(`Tipo de conteúdo da resposta: ${contentType}`);
        
        // Processar a resposta
        const responseText = await response.text();
        
        // Verificar se a resposta não está vazia
        if (!responseText) {
          const errorMsg = "Resposta vazia recebida da API LearnWorlds";
          addLog(errorMsg);
          return { data: [], total: 0, pages: 0 };
        }
        
        // Tentar analisar o JSON
        try {
          const responseData = JSON.parse(responseText);
          
          // Adicionar logs detalhados sobre a estrutura da resposta
          addLog(`Resposta recebida com ${responseData.data?.length || 0} cursos`);
          if (responseData.meta) {
            addLog(`Meta: página ${responseData.meta.page}, total ${responseData.meta.totalItems} itens`);
          }
          
          // Validar a estrutura da resposta
          if (!responseData || !Array.isArray(responseData.data)) {
            addLog(`Estrutura de resposta inválida: ${JSON.stringify(responseData).substring(0, 100)}...`);
            return { data: [], total: 0, pages: 0 };
          }
          
          addLog(`Recebidos ${responseData.data.length} cursos da API`);
          
          return responseData;
        } catch (jsonError) {
          addLog(`Erro ao analisar JSON da resposta: ${jsonError.message}`);
          addLog(`Primeiros 100 caracteres da resposta: ${responseText.substring(0, 100)}...`);
          throw new Error(`Falha ao analisar resposta JSON: ${jsonError.message}`);
        }
      } catch (error: any) {
        addLog(`Falha ao buscar cursos: ${error.message}`);
        return { data: [], total: 0, pages: 0 };
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

    // Função para processar e sincronizar cursos
    const processCourses = async (courses: any[]): Promise<void> => {
      if (!courses || courses.length === 0) {
        addLog("Nenhum curso para processar");
        return;
      }
      
      addLog(`Processando ${courses.length} cursos`);
      
      for (const course of courses) {
        try {
          // Verificar dados obrigatórios do curso
          if (!course.id || !course.title) {
            addLog(`Falha: Curso com dados incompletos (ID: ${course.id || 'desconhecido'})`);
            results.failed++;
            continue;
          }

          // Verificar se o curso já existe no Supabase
          const { data: existingCourse, error: queryError } = await supabase
            .from('cursos')
            .select('id, titulo, data_atualizacao')
            .eq('learning_worlds_id', course.id)
            .maybeSingle();
          
          if (queryError) {
            addLog(`Falha ao processar curso ${course.id}: ${queryError.message}`);
            results.failed++;
            continue;
          }
          
          // Preparar dados para inserir/atualizar
          const courseData = {
            titulo: course.title,
            descricao: course.description || course.shortDescription || '',
            learning_worlds_id: course.id,
            valor_total: course.price || 0,
            valor_mensalidade: course.price ? course.price / 12 : 0,
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
              addLog(`Falha ao atualizar curso ${course.id}: ${updateError.message}`);
              results.failed++;
            } else {
              results.updated++;
              addLog(`Curso atualizado: ${course.title} (${course.id})`);
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
              addLog(`Falha ao criar curso ${course.id}: ${insertError.message}`);
              results.failed++;
            } else {
              results.imported++;
              addLog(`Novo curso importado: ${course.title} (${course.id})`);
            }
          }
        } catch (error: any) {
          addLog(`Erro não tratado com curso ${course.id}: ${error.message}`);
          results.failed++;
        }
      }
    };

    // Iniciar a sincronização com a API
    try {
      if (isSyncAll) {
        // Buscar cursos pela primeira vez para descobrir o total de páginas
        const firstPage = await fetchCourses(1, pageSize);
        results.total = firstPage.total || firstPage.data.length;
        
        if (firstPage.data.length > 0) {
          addLog(`Total de ${results.total} cursos encontrados em ${firstPage.pages || 1} páginas`);
          
          // Processar primeira página
          await processCourses(firstPage.data);
          
          // Processar páginas adicionais (se houver)
          if (firstPage.pages && firstPage.pages > 1) {
            for (let page = 2; page <= firstPage.pages; page++) {
              addLog(`Processando página ${page} de ${firstPage.pages}`);
              const pageData = await fetchCourses(page, pageSize);
              await processCourses(pageData.data);
            }
          }
        } else {
          addLog(`Nenhum curso encontrado na API do LearnWorlds`);
        }
      } else {
        // Buscar apenas uma página específica
        const pageData = await fetchCourses(pageNumber, pageSize);
        results.total = pageData.data.length;
        
        if (pageData.data.length > 0) {
          addLog(`Processando ${pageData.data.length} cursos (página ${pageNumber} de ${pageData.pages || 1})`);
          await processCourses(pageData.data);
        } else {
          addLog(`Nenhum curso encontrado na página ${pageNumber}`);
        }
      }
    } catch (syncError: any) {
      addLog(`Erro na sincronização: ${syncError.message}`);
    }

    addLog(`Sincronização concluída: ${results.imported} importados, ${results.updated} atualizados, ${results.failed} falhas`);
    
    // Retornar resultados
    return new Response(
      JSON.stringify(results),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
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
