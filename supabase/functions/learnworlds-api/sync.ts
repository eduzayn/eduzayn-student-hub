// Funções de sincronização para LearnWorlds API
import { corsHeaders, LEARNWORLDS_API_KEY, LEARNWORLDS_SCHOOL_ID } from "./config.ts";
import { callLearnWorldsApi } from "./api.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

// Configuração do cliente Supabase
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

// Função para adicionar logs
function addLog(results: any, msg: string) {
  results.logs.push(`[${new Date().toISOString()}] ${msg}`);
  console.log(msg);
}

// Função principal para sincronização
export async function handleSync(req: Request, path: string): Promise<Response> {
  const url = new URL(req.url);
  const type = url.searchParams.get("type") || "courses";
  const isSyncAll = url.searchParams.get("syncAll") === "true";
  const pageSize = parseInt(url.searchParams.get("pageSize") || "100");
  const pageNumber = parseInt(url.searchParams.get("page") || "1");
  
  const results = { imported: 0, updated: 0, failed: 0, total: 0, logs: [] };
  
  try {
    addLog(results, `Iniciando sincronização de ${type}. sincronizarTodos=${isSyncAll}, página=${pageNumber}`);
    
    // Verificar se temos os dados necessários
    if (!LEARNWORLDS_API_KEY) {
      addLog(results, "❌ Erro: LEARNWORLDS_API_KEY não configurado");
      throw new Error("LEARNWORLDS_API_KEY não configurado");
    }

    if (!LEARNWORLDS_SCHOOL_ID) {
      addLog(results, "❌ Erro: LEARNWORLDS_SCHOOL_ID não configurado");
      throw new Error("LEARNWORLDS_SCHOOL_ID não configurado");
    }
    
    // Testar a conexão com a API antes de prosseguir
    await testApiConnection(results);
    
    // Determinar qual tipo de dados sincronizar
    if (type === "courses") {
      await syncCourses(results, isSyncAll, pageNumber, pageSize);
    } else if (type === "users") {
      await syncUsers(results, isSyncAll, pageNumber, pageSize);
    } else {
      addLog(results, `⚠️ Tipo de sincronização não suportado: ${type}`);
      throw new Error(`Tipo de sincronização não suportado: ${type}`);
    }
    
    addLog(results, `Sincronização concluída. Importados: ${results.imported}, Atualizados: ${results.updated}, Falhas: ${results.failed}`);
    
    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (e) {
    addLog(results, `ERRO GERAL: ${e.message}`);
    console.error('Erro completo:', e);
    return new Response(JSON.stringify({ 
      error: e.message, 
      details: "Erro ao chamar API LearnWorlds. Verifique suas credenciais.", 
      results 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Função para testar a conexão com a API
async function testApiConnection(results: any): Promise<boolean> {
  try {
    addLog(results, `Testando conexão com API LearnWorlds`);
    const testData = await callLearnWorldsApi("/courses?page=1&limit=1", "GET");
    
    if (!testData || !testData.data) {
      addLog(results, `⚠️ Teste de API falhou: resposta inválida`);
      throw new Error(`Teste de API falhou: resposta inválida`);
    }
    
    addLog(results, `✅ Teste de API bem-sucedido. Recebeu ${testData?.data?.length || 0} itens.`);
    return true;
  } catch (error) {
    addLog(results, `❌ ERRO no teste de API: ${error.message}`);
    throw error;
  }
}

// Função para sincronizar cursos
async function syncCourses(results: any, syncAll: boolean, page: number, limit: number): Promise<void> {
  try {
    addLog(results, `Buscando cursos da página ${page} com limite de ${limit} itens...`);
    
    const firstPage = await callLearnWorldsApi(`/courses?page=${page}&limit=${limit}`, "GET");
    
    if (!firstPage || !firstPage.data || !Array.isArray(firstPage.data)) {
      addLog(results, `⚠️ Formato de resposta inválido da API: ${JSON.stringify(firstPage).substring(0, 200)}`);
      throw new Error("Formato de resposta da API inválido ou vazio");
    }
    
    results.total = firstPage.total || firstPage.data.length || 0;
    addLog(results, `Total de cursos encontrados: ${results.total}, Páginas: ${firstPage.pages || 1}`);
    
    if (firstPage.data.length === 0) {
      addLog(results, "Nenhum curso encontrado na API LearnWorlds");
    } else {
      await processCourses(results, firstPage.data);
      
      if (syncAll && firstPage.pages > 1) {
        for (let p = 2; p <= firstPage.pages; p++) {
          addLog(results, `Processando página ${p} de ${firstPage.pages}...`);
          const nextPage = await callLearnWorldsApi(`/courses?page=${p}&limit=${limit}`, "GET");
          
          if (nextPage && nextPage.data && Array.isArray(nextPage.data)) {
            await processCourses(results, nextPage.data);
          } else {
            addLog(results, `⚠️ Erro ao buscar página ${p}: formato de resposta inválido`);
          }
        }
      }
    }
  } catch (apiError) {
    addLog(results, `ERRO na API LearnWorlds: ${apiError.message}`);
    throw apiError;
  }
}

// Função para processar cursos
async function processCourses(results: any, courses: any[]): Promise<void> {
  addLog(results, `Processando ${courses.length} cursos...`);
  for (const course of courses) {
    try {
      if (!course.id || !course.title) {
        addLog(results, `Curso inválido encontrado: faltando ID ou título`);
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
        addLog(results, `Curso atualizado: ${course.title}`);
      } else {
        await supabaseService.from("cursos").insert({ ...data, data_criacao: new Date().toISOString() });
        results.imported++;
        addLog(results, `Curso importado: ${course.title}`);
      }
    } catch (courseError) {
      results.failed++;
      addLog(results, `ERRO ao processar curso ${course.title || 'desconhecido'}: ${courseError.message}`);
    }
  }
}

// Função para sincronizar usuários
async function syncUsers(results: any, syncAll: boolean, page: number, limit: number): Promise<void> {
  try {
    addLog(results, `Buscando usuários da página ${page} com limite de ${limit} itens...`);
    
    const firstPage = await callLearnWorldsApi(`/users?page=${page}&limit=${limit}`, "GET");
    
    if (!firstPage || !firstPage.data || !Array.isArray(firstPage.data)) {
      addLog(results, `⚠️ Formato de resposta inválido da API: ${JSON.stringify(firstPage).substring(0, 200)}`);
      throw new Error("Formato de resposta da API inválido ou vazio");
    }
    
    results.total = firstPage.total || firstPage.data.length || 0;
    addLog(results, `Total de usuários encontrados: ${results.total}, Páginas: ${firstPage.pages || 1}`);
    
    if (firstPage.data.length === 0) {
      addLog(results, "Nenhum usuário encontrado na API LearnWorlds");
    } else {
      await processUsers(results, firstPage.data);
      
      if (syncAll && firstPage.pages > 1) {
        for (let p = 2; p <= firstPage.pages; p++) {
          addLog(results, `Processando página ${p} de ${firstPage.pages}...`);
          const nextPage = await callLearnWorldsApi(`/users?page=${p}&limit=${limit}`, "GET");
          
          if (nextPage && nextPage.data && Array.isArray(nextPage.data)) {
            await processUsers(results, nextPage.data);
          } else {
            addLog(results, `⚠️ Erro ao buscar página ${p}: formato de resposta inválido`);
          }
        }
      }
    }
  } catch (apiError) {
    addLog(results, `ERRO na API LearnWorlds: ${apiError.message}`);
    throw apiError;
  }
}

// Função para processar usuários
async function processUsers(results: any, users: any[]): Promise<void> {
  addLog(results, `Processando ${users.length} usuários...`);
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
        addLog(results, `Atualizado: ${user.email}`);
      } else {
        await supabaseService.rpc("create_profile_without_auth", {
          user_email: profile.email,
          user_first_name: profile.first_name,
          user_last_name: profile.last_name,
          user_phone: profile.phone,
          user_learnworlds_id: profile.learnworlds_id
        });
        results.imported++;
        addLog(results, `Importado: ${user.email}`);
      }
    } catch (userError) {
      results.failed++;
      addLog(results, `ERRO ao processar usuário ${user.email}: ${userError.message}`);
    }
  }
}
