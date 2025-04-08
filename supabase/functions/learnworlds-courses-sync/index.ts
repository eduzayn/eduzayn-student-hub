
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

// Configuração dos cabeçalhos CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

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
    // Log para indicar verificação JWT desativada
    console.log("Verificação JWT desativada. Processando solicitação sem verificação de token.");
    
    // Ainda pegamos o token se foi fornecido, para compatibilidade
    const authHeader = req.headers.get("Authorization");
    
    // Log para depuração
    if (authHeader) {
      console.log("Header de autorização recebido, mas verificação JWT está desativada");
      console.log(`Token recebido (primeiros 5 chars): ${authHeader.substring(7, 12)}...`);
    } else {
      console.log("Nenhum header de autorização fornecido");
    }

    // Autenticação é considerada sempre bem-sucedida
    const isAuthenticated = true;
    console.log("Autenticação bem-sucedida (verificação JWT desativada)");

    // Obter parâmetros da solicitação
    const url = new URL(req.url);
    const isSyncAll = url.searchParams.get('syncAll') === 'true';
    const pageSize = parseInt(url.searchParams.get('pageSize') || '100');
    const pageNumber = parseInt(url.searchParams.get('page') || '1');

    // Obter chaves da API e configurações da LearnWorlds
    const apiKey = Deno.env.get('LEARNWORLDS_API_KEY');
    const schoolId = Deno.env.get('LEARNWORLDS_SCHOOL_ID');
    const apiBaseUrl = Deno.env.get('LEARNWORLDS_BASE_URL') || 'https://api.learnworlds.com';
    
    console.log(`LEARNWORLDS_API_KEY: ${apiKey ? "definido (primeiros 5 chars): " + apiKey.substring(0, 5) + "..." : "indefinido"}`);
    console.log(`LEARNWORLDS_SCHOOL_ID: ${schoolId || "indefinido"}`);
    console.log(`LEARNWORLDS_BASE_URL: ${apiBaseUrl}`);

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
      const apiUrl = `${apiBaseUrl}/api/v2/${schoolId}/courses?page=${page}&limit=${limit}`;
      console.log(`Buscando cursos da LearnWorlds: ${apiUrl}`);
      
      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
        });

        console.log(`Resposta da API LearnWorlds: Status ${response.status}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Erro na API LearnWorlds: ${response.status} - ${errorText}`);
          throw new Error(`LearnWorlds API Error: ${response.status} - ${errorText}`);
        }
        
        // Verificar o tipo de conteúdo para melhor diagnóstico
        const contentType = response.headers.get('content-type') || '';
        console.log(`Tipo de conteúdo da resposta: ${contentType}`);
        
        if (!contentType.includes('application/json')) {
          const textResponse = await response.text();
          console.error('Resposta não-JSON recebida:', textResponse.substring(0, 200) + '...');
          
          if (textResponse.includes('<!DOCTYPE html>') || textResponse.includes('<html>')) {
            throw new Error('Resposta HTML recebida ao invés de JSON. Verifique a URL da API.');
          }
          
          throw new Error(`Resposta não-JSON recebida da API LearnWorlds: ${contentType}`);
        }

        // Tentar fazer o parse do JSON com tratamento de erro aprimorado
        let responseData;
        try {
          const responseText = await response.text();
          responseData = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Erro ao fazer parse da resposta JSON:', parseError);
          throw new Error(`Erro ao fazer parse da resposta JSON: ${parseError.message}`);
        }
        
        return responseData;
      } catch (error) {
        console.error(`Erro ao chamar API LearnWorlds: ${error.message}`);
        
        // Adicionamos mais detalhes ao erro para diagnóstico
        addLog(results, `Falha ao buscar cursos: ${error.message}`);
        
        // Retornar dados vazios em caso de falha
        return { data: [], total: 0, pages: 0 };
      }
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

    // Iniciar a sincronização com a API real
    try {
      if (isSyncAll) {
        // Buscar cursos pela primeira vez para descobrir o total de páginas
        const firstPage = await fetchCourses(1, pageSize);
        results.total = firstPage.total || firstPage.data.length;
        
        if (firstPage.data.length > 0) {
          addLog(results, `Total de ${results.total} cursos encontrados em ${firstPage.pages || 1} páginas`);
          
          // Processar primeira página
          await processCourses(firstPage.data);
          
          // Processar páginas adicionais (se houver)
          if (firstPage.pages && firstPage.pages > 1) {
            for (let page = 2; page <= firstPage.pages; page++) {
              addLog(results, `Processando página ${page} de ${firstPage.pages}`);
              const pageData = await fetchCourses(page, pageSize);
              await processCourses(pageData.data);
            }
          }
        } else {
          addLog(results, `Nenhum curso encontrado na API do LearnWorlds`);
        }
      } else {
        // Buscar apenas uma página específica
        const pageData = await fetchCourses(pageNumber, pageSize);
        results.total = pageData.data.length;
        addLog(results, `Processando ${pageData.data.length} cursos (página ${pageNumber} de ${pageData.pages || 1})`);
        await processCourses(pageData.data);
      }
    } catch (syncError) {
      console.error("Erro durante sincronização:", syncError);
      addLog(results, `Erro na sincronização: ${syncError.message}`);
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
