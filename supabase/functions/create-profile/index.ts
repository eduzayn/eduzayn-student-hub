
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

// Configuração dos cabeçalhos CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

interface CreateProfileRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  learnworldsId: string;
}

serve(async (req) => {
  // Lidar com solicitações OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Verificar autenticação
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Sem token de autenticação' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Extrair o token do cabeçalho Authorization
    const token = authHeader.replace('Bearer ', '');

    // Criar um cliente Supabase para verificar o token
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verificar se o token é válido
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      console.error('Erro de autenticação:', authError);
      return new Response(
        JSON.stringify({ error: 'Token de autenticação inválido' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Obter dados do corpo da requisição
    const requestData: CreateProfileRequest = await req.json();
    const { email, firstName, lastName, phone, learnworldsId } = requestData;
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'O email é obrigatório' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Verificar se já existe um perfil com este email
    const { data: existingProfile, error: queryError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email)
      .maybeSingle();

    if (queryError) {
      console.error('Erro ao buscar perfil:', queryError);
      throw queryError;
    }

    let profileId;
    
    if (existingProfile) {
      // Atualizar perfil existente
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName || existingProfile.first_name,
          last_name: lastName || existingProfile.last_name,
          phone: phone,
          learnworlds_id: learnworldsId,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingProfile.id)
        .select('id')
        .single();
        
      if (updateError) {
        console.error('Erro ao atualizar perfil:', updateError);
        throw updateError;
      }
      
      profileId = data.id;
      console.log(`Perfil existente atualizado: ${profileId}`);
    } else {
      // Criar novo perfil
      const newProfileId = crypto.randomUUID();
      const { data, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: newProfileId,
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone,
          learnworlds_id: learnworldsId,
          role: 'student',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id')
        .single();
        
      if (insertError) {
        console.error('Erro ao inserir perfil:', insertError);
        throw insertError;
      }
      
      profileId = data.id;
      console.log(`Novo perfil criado: ${profileId}`);
    }

    return new Response(
      JSON.stringify(profileId),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
    
  } catch (error) {
    console.error('Erro ao processar solicitação:', error);
    
    return new Response(
      JSON.stringify({ error: 'Erro ao processar a solicitação', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
