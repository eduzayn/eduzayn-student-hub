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
    "second degree", "licenciatura"
  ];
  
  // Termos para verificar se o contexto está relacionado à educação física
  const physicalEducationTerms = [
    "educação física", "educacao fisica", "physical education", 
    "educacao fisic", "educação fisic", "ed física", "ed fisica", 
    "sports", "esportes", "fitness", "academia", "gym"
  ];
  
  // Termos para verificar se o contexto está relacionado à administração
  const administrationTerms = [
    "administração", "administracao", "gestão", "gestao", "negócios", "negocios",
    "business", "management", "administrador", "finanças", "financas", 
    "contabilidade", "contábeis", "contabeis", "economia", "rh", "recursos humanos",
    "mba", "empreendedor", "empreendedorismo"
  ];
  
  // Termos para verificar se o contexto está relacionado a cursos de direito
  const lawTerms = [
    "direito", "direito administrativo", "direito civil", "direito constitucional",
    "direito penal", "direito tributário", "direito empresarial", "direito do trabalho",
    "direito previdenciário", "direito digital", "direito ambiental", "direito internacional",
    "direito imobiliário", "direito eleitoral", "direito educacional", "direito contratual",
    "direito público", "direito processual", "arbitragem", "compliance", "perícia",
    "law", "legal", "jurídico", "legislação"
  ];
  
  // Termos para verificar se o contexto está relacionado a artes visuais
  const visualArtsTerms = [
    "artes visuais", "arte", "visual arts", "arte digital", "design gráfico",
    "desenho", "pintura", "escultura", "fotografia", "história da arte",
    "estética", "criatividade", "ilustração", "artes", "artista", 
    "expressão artística", "comunicação visual", "educação artística"
  ];
  
  // Termos para verificar se o contexto está relacionado a idosos
  const elderlyTerms = [
    "idosos", "idoso", "terceira idade", "geriatria", "gerontologia",
    "cuidado de idosos", "elderly", "senior", "geriatria e gerontologia",
    "envelhecimento", "atenção e cuidado com idosos"
  ];
  
  // Verificar se é um curso de pós-graduação, exceto educação especial
  const normalizedContext = context.toLowerCase().trim();
  
  // Verifica se o contexto contém termos relacionados a idosos
  for (const term of elderlyTerms) {
    if (normalizedContext.includes(term)) {
      return "/lovable-uploads/6060c7e6-b3f7-4e5f-91cb-b4d81d71dc77.png";
    }
  }
  
  // Verifica se o contexto contém termos relacionados a artes visuais
  for (const term of visualArtsTerms) {
    if (normalizedContext.includes(term)) {
      return "/lovable-uploads/4eb7b4bd-a894-4c26-a3e0-a74bcb8150ab.png";
    }
  }
  
  // Verifica PRIMEIRO se o contexto contém termos relacionados à educação especial
  // Movido para o topo das verificações para garantir prioridade
  for (const term of specialEducationTerms) {
    if (normalizedContext.includes(term)) {
      return "/lovable-uploads/bf2e50f8-5fef-4124-88f6-aae80ba3daaf.png";
    }
  }
  
  // Verifica se o contexto contém termos relacionados a cursos de direito
  for (const term of lawTerms) {
    if (normalizedContext.includes(term)) {
      // Usa o mapeamento específico se existe, ou faz alternância com base no termo
      if (CONTEXT_IMAGES[term]) {
        return CONTEXT_IMAGES[term];
      } else {
        // Alternância baseada no comprimento do termo para criar variedade
        return normalizedContext.length % 2 === 0 
          ? "/lovable-uploads/5a79380b-e832-4e1e-9ac5-58072be80bc9.png" 
          : "/lovable-uploads/3ebbc451-5d30-40f4-b93a-602a15d70127.png";
      }
    }
  }
  
  // Verifica se o contexto contém termos relacionados à administração
  for (const term of administrationTerms) {
    if (normalizedContext.includes(term)) {
      return "/lovable-uploads/230842bd-1461-4f56-bebf-d69b4f691e7b.png";
    }
  }
  
  // Verifica se o contexto contém termos relacionados à educação física
  for (const term of physicalEducationTerms) {
    if (normalizedContext.includes(term)) {
      return "/lovable-uploads/e3fb3c8e-e305-4ea2-bb30-120da66bf35e.png";
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
