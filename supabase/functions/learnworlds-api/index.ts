
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.26.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Configuração da API LearnWorlds
    const LEARNWORLDS_SCHOOL_ID = Deno.env.get('LEARNWORLDS_SCHOOL_ID') || '66abb5fdf8655b4b800c7278'
    const LEARNWORLDS_API_KEY = Deno.env.get('LEARNWORLDS_API_KEY') || '5lT9XbVrXwv9ulYNufC3OdU4ewon4wUocMENvWEa3pBc8hIOix'
    const LEARNWORLDS_API_URL = Deno.env.get('LEARNWORLDS_API_URL') || 'https://grupozayneducacional.com.br/admin/api'

    const url = new URL(req.url)
    const path = url.pathname.split('/learnworlds-api/')[1]

    if (!path) {
      return new Response(
        JSON.stringify({ error: 'Endpoint específico não fornecido' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Obter o token de autorização da requisição
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Autorização necessária' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      )
    }

    // Criar cliente do Supabase para verificar autenticação
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://bioarzkfmcobctblzztm.supabase.co'
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Verificar token JWT do Supabase
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Usuário não autenticado', details: authError }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      )
    }

    // Construir a URL para a API LearnWorlds
    const apiUrl = `${LEARNWORLDS_API_URL}/${path}`
    
    // Preparar headers para a requisição à API LearnWorlds
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LEARNWORLDS_API_KEY}`
    }

    // Preparar o corpo da requisição se for um método POST, PUT
    let options: RequestInit = {
      method: req.method,
      headers
    }

    // Se for POST ou PUT, adiciona o corpo da requisição
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      const body = await req.json()
      options.body = JSON.stringify(body)
    }

    // Fazer a requisição para a API LearnWorlds
    console.log(`Fazendo requisição para: ${apiUrl}`)
    const response = await fetch(apiUrl, options)
    
    const responseData = await response.json()
    
    // Retornar a resposta da API LearnWorlds
    return new Response(
      JSON.stringify(responseData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: response.status,
      }
    )
  } catch (error) {
    console.error('Erro na Edge Function:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor', details: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
