
// Módulo de sincronização para LearnWorlds API
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { corsHeaders, LEARNWORLDS_API_KEY, LEARNWORLDS_SCHOOL_ID } from "./config.ts";

export async function handleSync(req: Request, path: string): Promise<Response> {
  const url = new URL(req.url);
  const type = url.searchParams.get("type") || "users";
  const isSyncAll = url.searchParams.get("syncAll") === "true";
  const pageSize = parseInt(url.searchParams.get("pageSize") || "100");
  const pageNumber = parseInt(url.searchParams.get("page") || "1");
  
  const results = { imported: 0, updated: 0, failed: 0, total: 0, logs: [] };

  function addLog(msg: string) {
    results.logs.push(`[${new Date().toISOString()}] ${msg}`);
    console.log(msg);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabase = createClient(supabaseUrl, anonKey);

    // Verificar se temos os dados necessários
    if (!LEARNWORLDS_API_KEY) {
      addLog("❌ Erro: LEARNWORLDS_API_KEY não configurado");
      throw new Error("LEARNWORLDS_API_KEY não configurado");
    }

    if (!LEARNWORLDS_SCHOOL_ID) {
      addLog("❌ Erro: LEARNWORLDS_SCHOOL_ID não configurado");
      throw new Error("LEARNWORLDS_SCHOOL_ID não configurado");
    }
    
    // URL base da API LearnWorlds
    const apiBaseUrl = "https://api.learnworlds.com";
    const fullApiUrl = `${apiBaseUrl}/v2/${LEARNWORLDS_SCHOOL_ID}`;

    addLog(`Iniciando sincronização de ${type}. sincronizarTodos=${isSyncAll}, página=${pageNumber}`);
    addLog(`Usando School ID: ${LEARNWORLDS_SCHOOL_ID}`);
    addLog(`API Key encontrada: ${LEARNWORLDS_API_KEY ? 'Sim' : 'Não'}`);
    addLog(`URL da API: ${fullApiUrl}`);
    
    // Função para testar a API antes de tentar usar
    const testApiConnection = async () => {
      try {
        addLog(`Testando conexão com API LearnWorlds: ${fullApiUrl}`);
        const testRes = await fetch(`${fullApiUrl}/courses?page=1&limit=1`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${LEARNWORLDS_API_KEY}`
          }
        });
        
        if (!testRes.ok) {
          const errorText = await testRes.text();
          addLog(`⚠️ Teste de API falhou: ${testRes.status} - ${errorText}`);
          throw new Error(`Teste de API falhou: ${testRes.status} - ${errorText}`);
        }
        
        const testJson = await testRes.json();
        addLog(`✅ Teste de API bem-sucedido. Recebeu ${testJson?.data?.length || 0} itens.`);
        return true;
      } catch (error) {
        addLog(`❌ ERRO no teste de API: ${error.message}`);
        throw error;
      }
    };

    const fetchUsers = async (page: number, limit: number) => {
      const endpoint = `${fullApiUrl}/users?page=${page}&limit=${limit}`;
      addLog(`Buscando usuários da API LearnWorlds: ${endpoint}`);
      
      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LEARNWORLDS_API_KEY}`
        }
      });

      if (!res.ok) {
        const errorText = await res.text();
        addLog(`Erro na API LearnWorlds: ${res.status} - ${errorText}`);
        throw new Error(`Erro na API LearnWorlds: ${res.status} - ${errorText}`);
      }

      const text = await res.text();
      try {
        const data = JSON.parse(text);
        addLog(`Resposta da API LearnWorlds usuários: ${data.data ? data.data.length : 0} itens recebidos`);
        return data;
      } catch (err) {
        addLog(`Erro ao analisar JSON (usuários): ${err.message}. Resposta: ${text.substring(0, 100)}...`);
        throw new Error(`Erro ao analisar JSON (usuários): ${err.message}`);
      }
    };

    const fetchCourses = async (page: number, limit: number) => {
      const endpoint = `${fullApiUrl}/courses?page=${page}&limit=${limit}`;
      addLog(`Buscando cursos da API LearnWorlds: ${endpoint}`);
      
      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LEARNWORLDS_API_KEY}`
        }
      });

      if (!res.ok) {
        const errorText = await res.text();
        addLog(`Erro na API LearnWorlds: ${res.status} - ${errorText}`);
        throw new Error(`Erro na API LearnWorlds: ${res.status} - ${errorText}`);
      }

      const text = await res.text();
      try {
        const data = JSON.parse(text);
        addLog(`Resposta da API LearnWorlds cursos: ${data.data ? data.data.length : 0} itens recebidos`);
        return data;
      } catch (err) {
        addLog(`Erro ao analisar JSON (cursos): ${err.message}. Resposta: ${text.substring(0, 100)}...`);
        throw new Error(`Erro ao analisar JSON (cursos): ${err.message}`);
      }
    };

    const supabaseService = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));

    const processUsers = async (users: any[]) => {
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

    const processCourses = async (courses: any[]) => {
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

    // Testar a conexão com a API antes de prosseguir
    await testApiConnection();

    const handler = type === "courses" ? fetchCourses : fetchUsers;
    const processor = type === "courses" ? processCourses : processUsers;

    addLog(`Buscando dados da página ${pageNumber} com limite de ${pageSize} itens...`);
    
    try {
      const firstPage = await handler(pageNumber, pageSize);
      
      if (!firstPage || !firstPage.data || !Array.isArray(firstPage.data)) {
        addLog(`⚠️ Formato de resposta inválido da API: ${JSON.stringify(firstPage).substring(0, 200)}`);
        throw new Error("Formato de resposta da API inválido ou vazio");
      }
      
      results.total = firstPage.total || firstPage.data.length || 0;
      addLog(`Total de itens encontrados: ${results.total}, Páginas: ${firstPage.pages || 1}`);
      
      if (firstPage.data.length === 0) {
        addLog("Nenhum dado encontrado na API LearnWorlds");
      } else {
        await processor(firstPage.data);
        
        if (isSyncAll && firstPage.pages > 1) {
          for (let page = 2; page <= firstPage.pages; page++) {
            addLog(`Processando página ${page} de ${firstPage.pages}...`);
            const nextPage = await handler(page, pageSize);
            
            if (nextPage && nextPage.data && Array.isArray(nextPage.data)) {
              await processor(nextPage.data);
            } else {
              addLog(`⚠️ Erro ao buscar página ${page}: formato de resposta inválido`);
            }
          }
        }
      }
    } catch (apiError) {
      addLog(`ERRO na API LearnWorlds: ${apiError.message}`);
      throw apiError;
    }

    addLog(`Sincronização concluída. Importados: ${results.imported}, Atualizados: ${results.updated}, Falhas: ${results.failed}`);

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: corsHeaders
    });

  } catch (e) {
    addLog(`ERRO GERAL: ${e.message}`);
    console.error('Erro completo:', e);
    return new Response(JSON.stringify({ error: e.message, details: "Erro ao chamar API LearnWorlds. Verifique suas credenciais.", results }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
