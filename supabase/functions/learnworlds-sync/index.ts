
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

// Configuração dos cabeçalhos CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Token de bypass para admins
const ADMIN_BYPASS_JWT = "byZ4yn-#v0lt-2025!SEC";

// Interface para dados do aluno da LearnWorlds
interface LearnWorldsUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  customField1?: string; // CPF
  enrollments?: string[];
  createdAt: string;
  updatedAt: string;
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
    // Verificar autenticação
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Sem token de autenticação', code: 401 }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Extrair o token do cabeçalho Authorization
    const token = authHeader.replace('Bearer ', '');
    
    // Log para depuração
    console.log(`Token recebido: ${token.substring(0, 10)}...`);

    // Verificar o token de bypass admin primeiro
    let isAuthenticated = false;
    let user = null;

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
        const { data: userData, error: authError } = await supabase.auth.getUser(token);
        
        if (authError || !userData.user) {
          console.error('Erro de autenticação:', authError);
          return new Response(
            JSON.stringify({ error: 'Token de autenticação inválido', code: 401, details: authError }),
            {
              status: 401,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
        
        user = userData.user;
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

    console.log(`Iniciando sincronização de alunos da LearnWorlds${isSyncAll ? ' (todos os alunos)' : ''}`);
    addLog(results, `Iniciando sincronização de alunos - Página ${pageNumber}, Tamanho ${pageSize}`);

    // Função para buscar alunos da LearnWorlds
    const fetchUsers = async (page: number, limit: number): Promise<{ data: LearnWorldsUser[], total: number, pages: number }> => {
      const apiUrl = `${apiBaseUrl}/${schoolId}/users?page=${page}&limit=${limit}`;
      console.log(`Buscando alunos da LearnWorlds: ${apiUrl}`);
      
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

    // Função para processar e sincronizar usuários
    const processUsers = async (users: LearnWorldsUser[]): Promise<void> => {
      for (const user of users) {
        try {
          // Verificar se o usuário já existe no Supabase
          const { data: existingUser, error: queryError } = await supabase
            .from('profiles')
            .select('id, email')
            .eq('email', user.email)
            .maybeSingle();
          
          if (queryError) {
            console.error(`Erro ao buscar usuário no Supabase: ${queryError.message}`);
            results.failed++;
            addLog(results, `Falha ao processar ${user.email}: ${queryError.message}`);
            continue;
          }
          
          // Preparar dados para inserir/atualizar
          const userData = {
            first_name: user.firstName || '',
            last_name: user.lastName || '',
            email: user.email,
            phone: user.phoneNumber || '',
            learnworlds_id: user.id,
            updated_at: new Date().toISOString()
          };
          
          if (existingUser) {
            // Atualizar usuário existente
            const { error: updateError } = await supabase
              .from('profiles')
              .update(userData)
              .eq('id', existingUser.id);
              
            if (updateError) {
              console.error(`Erro ao atualizar usuário no Supabase: ${updateError.message}`);
              results.failed++;
              addLog(results, `Falha ao atualizar ${user.email}: ${updateError.message}`);
            } else {
              results.updated++;
              addLog(results, `Usuário atualizado: ${user.email}`);
            }
          } else {
            // Criar novo usuário
            // Gerar um UUID para o usuário (já que não temos um usuário real no auth.users)
            const { data: insertData, error: insertError } = await supabase
              .rpc('create_profile_without_auth', {
                user_email: user.email,
                user_first_name: userData.first_name,
                user_last_name: userData.last_name,
                user_phone: userData.phone,
                user_learnworlds_id: userData.learnworlds_id
              });
              
            if (insertError) {
              console.error(`Erro ao inserir usuário no Supabase: ${insertError.message}`);
              results.failed++;
              addLog(results, `Falha ao criar perfil para ${user.email}: ${insertError.message}`);
            } else {
              results.imported++;
              addLog(results, `Novo usuário importado: ${user.email}`);
            }
          }
        } catch (error) {
          console.error(`Erro ao processar usuário ${user.email}:`, error);
          results.failed++;
          addLog(results, `Erro não tratado com ${user.email}: ${error.message}`);
        }
      }
    };

    // Helper para adicionar logs
    function addLog(results: SyncResults, message: string) {
      results.logs.push(`[${new Date().toISOString()}] ${message}`);
      console.log(message);
    }

    // Iniciar a sincronização
    if (isSyncAll) {
      // Buscar alunos pela primeira vez para descobrir o total de páginas
      const firstPage = await fetchUsers(1, pageSize);
      results.total = firstPage.total;
      
      addLog(results, `Total de ${firstPage.total} alunos encontrados em ${firstPage.pages} páginas`);
      
      // Processar primeira página
      await processUsers(firstPage.data);
      
      // Processar páginas adicionais (se houver)
      for (let page = 2; page <= firstPage.pages; page++) {
        addLog(results, `Processando página ${page} de ${firstPage.pages}`);
        const pageData = await fetchUsers(page, pageSize);
        await processUsers(pageData.data);
      }
    } else {
      // Buscar apenas uma página específica
      const pageData = await fetchUsers(pageNumber, pageSize);
      results.total = pageData.data.length;
      addLog(results, `Processando ${pageData.data.length} alunos (página ${pageNumber} de ${pageData.pages})`);
      await processUsers(pageData.data);
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
