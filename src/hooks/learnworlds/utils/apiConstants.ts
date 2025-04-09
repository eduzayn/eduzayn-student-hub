
// Constantes da API do LearnWorlds para uso em toda a aplicação

// URL da função edge do Supabase para comunicação com LearnWorlds
export const LEARNWORLDS_API_ENDPOINT = 'https://bioarzkfmcobctblzztm.functions.supabase.co/v1/learnworlds-api';

// School ID da escola no LearnWorlds
export const SCHOOL_ID = 'grupozayneducacional';

// Token de acesso API Key para a API do LearnWorlds
export const LEARNWORLDS_PUBLIC_TOKEN = '8BtSujQd7oBzSgJIWAeNtjYrmfeWHCZSBIXTGRpR'; 

// Headers padrão para requisições
// IMPORTANTE: Lw-Client é um cabeçalho obrigatório pela API do LearnWorlds
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'School-Id': SCHOOL_ID,
  'X-API-Version': '2.0',
  'Lw-Client': SCHOOL_ID  // Cabeçalho obrigatório conforme documentação
};
