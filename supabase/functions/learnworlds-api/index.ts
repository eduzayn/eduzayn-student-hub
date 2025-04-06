
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
    const LEARNWORLDS_SCHOOL_ID = Deno.env.get('LEARNWORLDS_SCHOOL_ID')
    const LEARNWORLDS_API_KEY = Deno.env.get('LEARNWORLDS_API_KEY')
    const LEARNWORLDS_API_URL = Deno.env.get('LEARNWORLDS_API_URL') || 'https://api.learnworlds.com'
    const LEARNWORLDS_PUBLIC_TOKEN = Deno.env.get('LEARNWORLDS_PUBLIC_TOKEN')

    if (!LEARNWORLDS_SCHOOL_ID || !LEARNWORLDS_API_KEY) {
      return new Response(
        JSON.stringify({ 
          error: 'Configuração da API LearnWorlds incompleta',
          details: 'LEARNWORLDS_SCHOOL_ID ou LEARNWORLDS_API_KEY não configurados'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ 
          error: 'Configuração do Supabase incompleta',
          details: 'Variáveis de ambiente do Supabase não configuradas'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }
    
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
    // Determinar se deve usar a API URL base ou a URL específica da escola
    let apiUrl
    
    if (path.startsWith('public/')) {
      // API pública - requer token público
      apiUrl = `${LEARNWORLDS_API_URL}/${path}`
      if (!LEARNWORLDS_PUBLIC_TOKEN) {
        return new Response(
          JSON.stringify({ 
            error: 'Token público da LearnWorlds não configurado',
            details: 'LEARNWORLDS_PUBLIC_TOKEN não encontrado'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        )
      }
    } else {
      // API administrativa - usa URL da escola e API KEY
      apiUrl = `${LEARNWORLDS_API_URL}/${path}`
    }
    
    // Adicionar parâmetros de query se existirem
    const queryParams = url.search
    if (queryParams) {
      apiUrl = `${apiUrl}${queryParams}`
    }
    
    // Preparar headers para a requisição à API LearnWorlds
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    
    // Usar o token apropriado baseado no tipo de endpoint
    if (path.startsWith('public/')) {
      headers['Authorization'] = `Bearer ${LEARNWORLDS_PUBLIC_TOKEN}`
    } else {
      headers['Authorization'] = `Bearer ${LEARNWORLDS_API_KEY}`
    }

    // Preparar o corpo da requisição se for um método POST, PUT, PATCH
    let options: RequestInit = {
      method: req.method,
      headers
    }

    // Se for POST, PUT ou PATCH, adiciona o corpo da requisição
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      try {
        const body = await req.json()
        options.body = JSON.stringify(body)
      } catch (e) {
        console.warn('Corpo da requisição vazio ou inválido:', e)
      }
    }

    // Fazer a requisição para a API LearnWorlds
    console.log(`Fazendo requisição para: ${apiUrl}`)
    console.log(`Método: ${req.method}`)
    console.log(`Headers:`, JSON.stringify(headers, null, 2))
    
    try {
      const response = await fetch(apiUrl, options)
      
      // Obter corpo da resposta
      let responseData
      const contentType = response.headers.get('content-type')
      
      if (contentType?.includes('application/json')) {
        responseData = await response.json()
      } else {
        // Para outros tipos de conteúdo, retorna como texto
        const text = await response.text()
        responseData = { data: text }
      }
      
      // Log do status da resposta
      console.log(`Status da resposta: ${response.status}`)
      
      // Implementar limite de retentativas para erros 429 (Rate Limiting)
      if (response.status === 429) {
        console.warn('Rate limit atingido na API LearnWorlds')
      }
      
      // Retornar a resposta da API LearnWorlds
      return new Response(
        JSON.stringify(responseData),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: response.status,
        }
      )
    } catch (fetchError) {
      console.error('Erro ao chamar API LearnWorlds:', fetchError)
      
      return new Response(
        JSON.stringify({ 
          error: 'Erro ao chamar a API da LearnWorlds', 
          details: fetchError.message 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }
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
