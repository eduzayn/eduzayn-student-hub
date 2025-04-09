
import { toast } from 'sonner';

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
  } else if (errorMessage.includes('500')) {
    errorMessage = 'Erro interno do servidor LearnWorlds. Verifique os dados enviados e as configurações da API.';
  } else if (errorMessage.includes('No API key found')) {
    errorMessage = 'Chave de API do Supabase não encontrada na requisição. Verifique a configuração do cliente Supabase.';
  } else if (errorMessage.includes('HTML recebida') || errorMessage.includes('não-JSON') || errorMessage.includes('API retornou conteúdo')) {
    errorMessage = 'A API retornou HTML em vez de JSON. Isso pode indicar um problema de roteamento ou configuração da API.';
  } else if (errorMessage.includes('Lw-Client')) {
    errorMessage = 'Cabeçalho Lw-Client ausente ou incorreto. Verifique se o LEARNWORLDS_SCHOOL_ID está configurado corretamente.';
  } else if (errorMessage.includes('URL incorreta')) {
    errorMessage = 'A URL da API está incorreta. Verifique se está usando /learnworlds-api/ em vez de /api/learnworlds-api/.';
  }
  
  return errorMessage;
};

/**
 * Verifica se a resposta é um HTML em vez de JSON
 * @param text Texto da resposta
 * @returns Verdadeiro se for HTML
 */
export const isHtmlResponse = (text: string): boolean => {
  return (
    text.includes("<!DOCTYPE html>") || 
    text.includes("<html") || 
    text.includes("</html>") ||
    text.includes("<head") || 
    text.includes("<body")
  );
};

/**
 * Exibe um toast de erro e retorna o erro tratado
 * @param error Erro original
 * @param endpoint Endpoint chamado
 * @param showToast Se deve exibir uma notificação toast
 */
export const handleApiError = (error: any, endpoint: string, showToast = true): string => {
  const errorMessage = handleLearnWorldsApiError(error, endpoint);
  
  if (showToast) {
    toast.error(errorMessage, {
      description: `Erro na chamada para ${endpoint}`
    });
  }
  
  return errorMessage;
};

/**
 * Verifica se a resposta da API contém dados válidos
 * @param response Resposta da API
 * @returns Verdadeiro se a resposta contiver dados válidos
 */
export const hasValidData = (response: any): boolean => {
  return response && 
         response.data && 
         Array.isArray(response.data) && 
         response.data.length > 0 &&
         !isHtmlResponse(JSON.stringify(response));
};
