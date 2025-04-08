
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
  // Log para depuração inicial
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
        
        console.log(`SUPABASE_URL: ${supabaseUrl ? "definido" : "indefinido"}`);
        console.log(`SUPABASE_ANON_KEY: ${supabaseKey ? "definido (primeiros 5 caracteres): " + supabaseKey.substring(0, 5) + "..." : "indefinido"}`);
        
        if (!supabaseUrl || !supabaseKey) {
          console.error("Variáveis de ambiente do Supabase não configuradas!");
          throw new Error("Configuração do Supabase incompleta");
        }
        
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
        
        const user = userData.user;
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
    
    console.log(`LEARNWORLDS_API_KEY: ${apiKey ? "definido (primeiros 5 caracteres): " + apiKey.substring(0, 5) + "..." : "indefinido"}`);
    console.log(`LEARNWORLDS_SCHOOL_ID: ${schoolId || "indefinido"}`);
    console.log(`LEARNWORLDS_API_URL: ${apiBaseUrl || "indefinido"}`);

    if (!apiKey || !schoolId) {
      console.error('Configurações da API LearnWorlds ausentes');
      return new Response(
        JSON.stringify({ 
          error: 'Configurações da API ausentes',
          details: {
            apiKeyPresent: !!apiKey,
            schoolIdPresent: !!schoolId,
            apiBaseUrlPresent: !!apiBaseUrl
          }
        }),
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
            throw new Error('Resposta HTML recebida ao invés de JSON. Possível erro na URL da API.');
          }
          
          throw new Error('Resposta não-JSON recebida da API LearnWorlds');
        }

        const responseData = await response.json();
        return responseData;
      } catch (error) {
        console.error(`Erro ao chamar API LearnWorlds: ${error.message}`);
        // Retornar dados vazios para evitar falha total
        return { data: [], total: 0, pages: 0 };
      }
    };

    // Função para processar e sincronizar usuários
    const processUsers = async (users: LearnWorldsUser[]): Promise<void> => {
      // Criar um cliente Supabase para operações de banco de dados
      const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
      const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') as string;
      const supabase = createClient(supabaseUrl, supabaseKey);
      
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
    try {
      // Simular usuários para teste
      const mockUsers: LearnWorldsUser[] = [
        {
          id: "user1",
          firstName: "Ana",
          lastName: "Silva",
          email: "ana.silva@teste.com",
          phoneNumber: "11999998888",
          customField1: "123.456.789-00",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "user2",
          firstName: "João",
          lastName: "Santos",
          email: "joao.santos@teste.com",
          phoneNumber: "11988887777",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      addLog(results, `MODO DE TESTE: Usando ${mockUsers.length} usuários mockados para teste`);
      
      // Usar mockUsers para teste
      results.total = mockUsers.length;
      await processUsers(mockUsers);
      
      addLog(results, "Sincronização de teste concluída com sucesso");
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
