
// Constantes da API do LearnWorlds para uso em toda a aplicação

// URL da função edge do Supabase para comunicação com LearnWorlds
// URL correta da função edge com base nas imagens fornecidas
export const LEARNWORLDS_API_ENDPOINT = 'https://bioarzkfmcobctblzztm.functions.supabase.co/v1/learnworlds-api';

// School ID da escola no LearnWorlds
export const SCHOOL_ID = 'grupozayneducacional';

// Tokens para acesso à API (quando aplicável)
export const LEARNWORLDS_PUBLIC_TOKEN = '8BtSujQd7oBzSgJIWAeNtjYrmfeWHCZSBIXTGRpR'; // Token mostrado na imagem

// Headers padrão para requisições
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'School-Id': SCHOOL_ID,
  'X-API-Version': '2.0',
  'Lw-Client': SCHOOL_ID  // Cabeçalho obrigatório conforme documentação
};
