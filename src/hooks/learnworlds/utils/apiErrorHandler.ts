
/**
 * Utilitário para tratamento de erros da API LearnWorlds
 */
export const handleLearnWorldsApiError = (err: any, endpoint: string): string => {
  console.error(`Erro na API LearnWorlds (${endpoint}):`, err);
  
  let errorMessage = err.message || 'Erro ao comunicar com a API';
  
  if (errorMessage.includes('Failed to fetch')) {
    errorMessage = 'Falha de conexão com a API. Verifique se a função edge está ativa e se não há bloqueios de rede ou CORS.';
  } else if (errorMessage.includes('client_id')) {
    errorMessage = 'Erro de configuração do LearnWorlds: client_id ausente ou incorreto. Verifique o valor de LEARNWORLDS_SCHOOL_ID.';
  } else if (errorMessage.includes('401') || errorMessage.includes('403')) {
    errorMessage = 'Erro de autenticação na API LearnWorlds. Verifique se o token API tem permissões suficientes.';
  } else if (errorMessage.includes('No API key found')) {
    errorMessage = 'Chave de API do Supabase não encontrada na requisição. Verifique a configuração do cliente Supabase.';
  } else if (errorMessage.includes('HTML recebida')) {
    errorMessage = 'A API retornou HTML em vez de JSON. Ativando modo offline para usar dados simulados.';
  }
  
  return errorMessage;
};
