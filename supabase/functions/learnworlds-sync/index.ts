
// Unified LearnWorlds Sync Function (Sem autenticação obrigatória)
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

const ADMIN_BYPASS_JWT = Deno.env.get("ADMIN_BYPASS_TOKEN") || "byZ4yn-#v0lt-2025!SEC";
const LEARNWORLDS_PUBLIC_TOKEN = Deno.env.get("LEARNWORLDS_PUBLIC_TOKEN") || "8BtSujQd7oBzSgJIWAeNtjYrmfeWHCZSBIXTGRpR";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const results = { imported: 0, updated: 0, failed: 0, total: 0, logs: [] };
  const url = new URL(req.url);
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
    const schoolId = Deno.env.get("LEARNWORLDS_SCHOOL_ID");
    const apiBaseUrl = Deno.env.get("LEARNWORLDS_API_URL") || "https://api.learnworlds.com";
    const fullApiUrl = `${apiBaseUrl}/api/v2/${schoolId}`;

    const fetchUsers = async (page, limit) => {
      const res = await fetch(`${fullApiUrl}/users?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Lw-Client': schoolId
        }
      });
      return res.json();
    };

    const fetchCourses = async (page, limit) => {
      const res = await fetch(`${fullApiUrl}/courses?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Lw-Client': schoolId
        }
      });
      return res.json();
    };

    const supabaseService = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));

    const processUsers = async (users) => {
      for (const user of users) {
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
      }
    };

    const processCourses = async (courses) => {
      for (const course of courses) {
        if (!course.id || !course.title) continue;
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
      }
    };

    const handler = type === "courses" ? fetchCourses : fetchUsers;
    const processor = type === "courses" ? processCourses : processUsers;

    const firstPage = await handler(pageNumber, pageSize);
    results.total = firstPage.total || firstPage.data.length;
    await processor(firstPage.data);
    for (let page = 2; page <= (firstPage.pages || 1); page++) {
      const nextPage = await handler(page, pageSize);
      await processor(nextPage.data);
    }

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (e) {
    results.logs.push(`[${new Date().toISOString()}] ERRO GERAL: ${e.message}`);
    return new Response(JSON.stringify({ error: e.message, results }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
