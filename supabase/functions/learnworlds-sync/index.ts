
// Unified LearnWorlds Sync Function (Sem autenticação obrigatória)
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

// Atualizando os cabeçalhos CORS para incluir todos os cabeçalhos necessários
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, lw-client, x-school-id',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

const ADMIN_BYPASS_JWT = Deno.env.get("ADMIN_BYPASS_TOKEN") || "byZ4yn-#v0lt-2025!SEC";
const LEARNWORLDS_PUBLIC_TOKEN = Deno.env.get("LEARNWORLDS_PUBLIC_TOKEN") || "8BtSujQd7oBzSgJIWAeNtjYrmfeWHCZSBIXTGRpR";

serve(async (req) => {
  // Garantir o tratamento correto das requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  // Verificar se temos uma chave de API na requisição
  const url = new URL(req.url);
  const apiKey = req.headers.get('apikey') || url.searchParams.get('apikey');
  
  // Se não encontrar a apiKey, retornar um erro apropriado
  if (!apiKey) {
    return new Response(JSON.stringify({
      message: "No API key found in request",
      hint: "No `apikey` request header or url param was found."
    }), { 
      status: 401, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }

  const results = { imported: 0, updated: 0, failed: 0, total: 0, logs: [] };
  const type = url.searchParams.get("type") || "users";
  const isSyncAll = url.searchParams.get("syncAll") === "true";
  const pageSize = parseInt(url.searchParams.get("pageSize") || "100");
  const pageNumber = parseInt(url.searchParams.get("page") || "1");

  function addLog(msg) {
    results.logs.push(`[${new Date().toISOString()}] ${msg}`);
    console.log(msg);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabase = createClient(supabaseUrl, anonKey);

    const apiKey = Deno.env.get("LEARNWORLDS_API_KEY");
    const schoolId = Deno.env.get("LEARNWORLDS_SCHOOL_ID") || "grupozayneducacional";
    const apiBaseUrl = Deno.env.get("LEARNWORLDS_API_URL") || "https://api.learnworlds.com";
    const fullApiUrl = `${apiBaseUrl}/api/v2/${schoolId}`;

    addLog(`Iniciando sincronização de ${type}. sincronizarTodos=${isSyncAll}, página=${pageNumber}`);
    addLog(`Usando School ID: ${schoolId}`);
    addLog(`API Key encontrada: ${apiKey ? 'Sim' : 'Não'}`);

    const fetchUsers = async (page, limit) => {
      const res = await fetch(`${fullApiUrl}/users?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Lw-Client': schoolId
        }
      });

      if (!res.ok) {
        const errorText = await res.text();
        addLog(`Erro na API LearnWorlds: ${res.status} - ${errorText}`);
        throw new Error(`Erro na API LearnWorlds: ${res.status} - ${errorText}`);
      }

      return res.json();
    };

    const fetchCourses = async (page, limit) => {
      addLog(`Buscando cursos da API LearnWorlds: página ${page}, limite ${limit}`);
      
      const res = await fetch(`${fullApiUrl}/courses?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Lw-Client': schoolId
        }
      });

      if (!res.ok) {
        const errorText = await res.text();
        addLog(`Erro na API LearnWorlds: ${res.status} - ${errorText}`);
        throw new Error(`Erro na API LearnWorlds: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      addLog(`Resposta da API LearnWorlds cursos: ${data.data ? data.data.length : 0} itens recebidos`);
      return data;
    };

    const supabaseService = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));

    const processUsers = async (users) => {
      addLog(`Processando ${users.length} usuários...`);
      for (const user of users) {
        try {
          const { data: existing, error } = await supabaseService.from("profiles").select("id").eq("email", user.email).maybeSingle();
          const profile = {
            first_name: user.firstName || '',
            last_name: user.lastName || '',
            email: user.email,
            phone: user.phoneNumber || '',
            learnworlds_id: user.id,
            updated_at: new Date().toISOString()
          };
          
          if (existing) {
            await supabaseService.from("profiles").update(profile).eq("id", existing.id);
            results.updated++;
            addLog(`Atualizado: ${user.email}`);
          } else {
            await supabaseService.rpc("create_profile_without_auth", {
              user_email: profile.email,
              user_first_name: profile.first_name,
              user_last_name: profile.last_name,
              user_phone: profile.phone,
              user_learnworlds_id: profile.learnworlds_id
            });
            results.imported++;
            addLog(`Importado: ${user.email}`);
          }
        } catch (userError) {
          results.failed++;
          addLog(`ERRO ao processar usuário ${user.email}: ${userError.message}`);
        }
      }
    };

    const processCourses = async (courses) => {
      addLog(`Processando ${courses.length} cursos...`);
      for (const course of courses) {
        try {
          if (!course.id || !course.title) {
            addLog(`Curso inválido encontrado: faltando ID ou título`);
            results.failed++;
            continue;
          }
          
          const data = {
            titulo: course.title,
            descricao: course.description || '',
            learning_worlds_id: course.id,
            valor_total: course.price || 0,
            valor_mensalidade: course.price ? course.price / 12 : 0,
            carga_horaria: 60,
            imagem_url: course.image || '',
            codigo: `LW-${course.id.substring(0, 6).toUpperCase()}`,
            data_atualizacao: new Date().toISOString()
          };
          
          const { data: exists } = await supabaseService.from("cursos").select("id").eq("learning_worlds_id", course.id).maybeSingle();
          
          if (exists) {
            await supabaseService.from("cursos").update(data).eq("id", exists.id);
            results.updated++;
            addLog(`Curso atualizado: ${course.title}`);
          } else {
            await supabaseService.from("cursos").insert({ ...data, data_criacao: new Date().toISOString() });
            results.imported++;
            addLog(`Curso importado: ${course.title}`);
          }
        } catch (courseError) {
          results.failed++;
          addLog(`ERRO ao processar curso ${course.title || 'desconhecido'}: ${courseError.message}`);
        }
      }
    };

    const handler = type === "courses" ? fetchCourses : fetchUsers;
    const processor = type === "courses" ? processCourses : processUsers;

    addLog(`Buscando dados da página ${pageNumber} com limite de ${pageSize} itens...`);
    
    try {
      const firstPage = await handler(pageNumber, pageSize);
      results.total = firstPage.total || firstPage.data?.length || 0;
      addLog(`Total de itens encontrados: ${results.total}, Páginas: ${firstPage.pages || 1}`);
      
      if (!firstPage.data || firstPage.data.length === 0) {
        addLog("Nenhum dado encontrado na API LearnWorlds");
      } else {
        await processor(firstPage.data);
        
        if (isSyncAll && firstPage.pages > 1) {
          for (let page = 2; page <= firstPage.pages; page++) {
            addLog(`Processando página ${page} de ${firstPage.pages}...`);
            const nextPage = await handler(page, pageSize);
            await processor(nextPage.data);
          }
        }
      }
    } catch (apiError) {
      addLog(`ERRO na API LearnWorlds: ${apiError.message}`);
      return new Response(JSON.stringify({ 
        error: apiError.message,
        details: "Erro ao chamar API LearnWorlds. Verifique suas credenciais.",
        results 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    addLog(`Sincronização concluída. Importados: ${results.imported}, Atualizados: ${results.updated}, Falhas: ${results.failed}`);

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (e) {
    addLog(`ERRO GERAL: ${e.message}`);
    console.error('Erro completo:', e);
    return new Response(JSON.stringify({ error: e.message, results }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
