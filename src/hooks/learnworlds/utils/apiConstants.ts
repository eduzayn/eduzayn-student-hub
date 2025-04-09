
// Constantes da API do LearnWorlds para uso em toda a aplicação

// URL da função edge do Supabase para comunicação com LearnWorlds
// Deve apontar para a URL completa da função edge, não para o frontend
export const LEARNWORLDS_API_ENDPOINT = 'https://bioarzkfmcobctblzztm.functions.supabase.co/learnworlds-api';

// School ID da escola no LearnWorlds
export const SCHOOL_ID = 'grupozayneducacional';

// Headers padrão para requisições
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'School-Id': SCHOOL_ID,
  'X-API-Version': '2.0'
};
