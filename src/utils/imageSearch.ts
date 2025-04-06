
import { CONTEXT_IMAGES, PLACEHOLDER_IMAGES, imageCache } from './imageMapping';

/**
 * Função para encontrar imagens correspondentes para contextos educacionais
 */
export function getContextImage(context: string): string {
  // Verifica se o contexto está relacionado à educação especial e retorna a nova imagem
  const specialEducationTerms = [
    "educação especial", "educacao especial", "inclusão", "inclusao", 
    "autismo", "deficiência", "deficiencia", "transtorno", 
    "tea", "tdah", "neurodiversidade", "atendimento educacional especializado", 
    "aee", "special education", "special needs", "autism", "adhd"
  ];
  
  // Verifica se o contexto está relacionado à formação pedagógica
  const pedagogicalTrainingTerms = [
    "formacao pedagogica", "formação pedagógica", "pedagogical training", 
    "teacher training", "formação de professores", "formacao de professores"
  ];
  
  // Verifica se o contexto está relacionado à segunda licenciatura
  const secondDegreeTerms = [
    "segunda licenciatura", "segunda-licenciatura", "sociologia", "filosofia",
    "geografia", "história", "letras", "matemática", "ciências da religião",
    "educação física", "second degree", "licenciatura"
  ];
  
  // Verificar se é um curso de pós-graduação, exceto educação especial
  const normalizedContext = context.toLowerCase().trim();
  
  // Verifica se o contexto contém termos relacionados à educação especial
  for (const term of specialEducationTerms) {
    if (normalizedContext.includes(term)) {
      return "/lovable-uploads/bf2e50f8-5fef-4124-88f6-aae80ba3daaf.png";
    }
  }
  
  // Verifica se o contexto contém termos relacionados à formação pedagógica
  for (const term of pedagogicalTrainingTerms) {
    if (normalizedContext.includes(term)) {
      return "/lovable-uploads/ce9a7952-791b-4019-8cd7-a181e8d2224d.png";
    }
  }
  
  // Verifica se o contexto contém termos relacionados à segunda licenciatura
  for (const term of secondDegreeTerms) {
    if (normalizedContext.includes(term)) {
      return "/lovable-uploads/1bfc1ad9-bf1a-4193-bf15-92aab488ed41.png";
    }
  }
  
  // Se for de pós-graduação e não for de educação especial, não retorna imagem
  if (
    normalizedContext.includes("pós-graduação") || 
    normalizedContext.includes("pos-graduacao") || 
    normalizedContext.includes("postgraduate") ||
    normalizedContext === "pos-graduacao"
  ) {
    // Retorna placeholder genérico para cursos de pós sem imagem
    return "/placeholder.svg";
  }
  
  // Tenta encontrar uma correspondência direta
  if (CONTEXT_IMAGES[normalizedContext]) {
    // Se for null, significa que removemos a imagem (é um curso de pós-graduação)
    if (CONTEXT_IMAGES[normalizedContext] === null) {
      return "/placeholder.svg";
    }
    return CONTEXT_IMAGES[normalizedContext];
  }
  
  // Tenta encontrar correspondências parciais com pontuação
  let bestMatch = "";
  let bestScore = 0;
  
  for (const key in CONTEXT_IMAGES) {
    // Calcula uma pontuação simples baseada em quantas palavras são compartilhadas
    const keyWords = key.toLowerCase().split(/\s+/);
    const contextWords = normalizedContext.split(/\s+/);
    
    let matchCount = 0;
    for (const word of contextWords) {
      if (word.length > 2 && keyWords.some(kw => kw.includes(word) || word.includes(kw))) {
        matchCount++;
      }
    }
    
    // Se o contexto está completamente contido na chave ou vice-versa
    if (key.toLowerCase().includes(normalizedContext) || normalizedContext.includes(key.toLowerCase())) {
      matchCount += 2;
    }
    
    if (matchCount > bestScore) {
      bestScore = matchCount;
      bestMatch = key;
    }
  }
  
  // Se encontrou uma correspondência parcial boa
  if (bestScore > 0) {
    // Se for null, significa que removemos a imagem (é um curso de pós-graduação)
    if (CONTEXT_IMAGES[bestMatch] === null) {
      return "/placeholder.svg";
    }
    return CONTEXT_IMAGES[bestMatch];
  }
  
  // Retorna uma imagem aleatória se não encontrar nada
  let index;
  do {
    index = Math.floor(Math.random() * PLACEHOLDER_IMAGES.length);
  } while (PLACEHOLDER_IMAGES[index] === null);
  
  return PLACEHOLDER_IMAGES[index] || "/placeholder.svg";
}

/**
 * Retorna URLs de imagens com base no contexto
 * @param query A categoria ou termo de pesquisa para encontrar uma imagem
 * @returns URL de uma imagem de placeholder que corresponde ao contexto
 */
export function searchFreepikImages(query: string, limit: number = 1): Promise<string[]> {
  // Retorna imagens específicas de contexto
  return Promise.resolve(Array(limit).fill('').map(() => getContextImage(query)));
}

/**
 * Obtém uma URL de imagem com base em uma consulta
 * @param query O termo de pesquisa
 * @returns Uma única URL de imagem que corresponde ao contexto
 */
export function getFreepikImage(query: string): Promise<string> {
  return Promise.resolve(getContextImage(query));
}

/**
 * Obtém uma URL de imagem com cache
 * @param query O termo de pesquisa
 * @returns Uma promise resolvendo para uma URL de imagem correspondente ao contexto
 */
export async function getCachedFreepikImage(query: string): Promise<string> {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (imageCache[normalizedQuery]) {
    return imageCache[normalizedQuery];
  }
  
  // Use both category and title for matching
  const contextImage = getContextImage(normalizedQuery);
  imageCache[normalizedQuery] = contextImage;
  
  return contextImage;
}

// Adicionando uma função para atualizar manualmente uma imagem de um curso no cache
export function setManualCourseImage(courseId: number, imageUrl: string): void {
  imageCache[`course-${courseId}`] = imageUrl;
}

// Adicionando uma função para atualizar uma correspondência de contexto específica
export function setContextImage(context: string, imageUrl: string): void {
  if (context) {
    CONTEXT_IMAGES[context.toLowerCase().trim()] = imageUrl;
  }
}

/**
 * Obtém todas as imagens disponíveis no sistema
 * @returns Um objeto com todas as imagens do contexto
 */
export function getAllContextImages(): Record<string, string> {
  return { ...CONTEXT_IMAGES };
}

/**
 * Obtém todas as imagens disponíveis no cache
 * @returns Um objeto com todas as imagens do cache
 */
export function getAllCachedImages(): Record<string, string> {
  return { ...imageCache };
}
