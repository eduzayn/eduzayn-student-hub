import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Map of context-specific placeholder images for different categories/topics
const CONTEXT_IMAGES = {
  // Education categories
  "graduacao": "/lovable-uploads/4fb9144a-86ed-4030-8d66-cdb558e4703b.png",
  "segunda-licenciatura": "/lovable-uploads/6a6678fb-105a-4b78-aa5b-db08e95c7323.png",
  "segunda-graduacao-bacharelado": "/lovable-uploads/6ae79f95-219e-41e6-97d0-24b2f3dfe9c6.png",
  "pos-graduacao": "/lovable-uploads/d64b34e7-d705-4ad3-9935-1f5b3e0c2142.png",
  "mba": "/lovable-uploads/ccac1e61-2311-44b6-b9a5-1aedbfb2a20b.png",
  "formacao-livre": "/lovable-uploads/6ae79f95-219e-41e6-97d0-24b2f3dfe9c6.png",
  "capacitacao-profissional": "/lovable-uploads/4fb9144a-86ed-4030-8d66-cdb558e4703b.png",
  "formacao-pedagogica": "/lovable-uploads/6a6678fb-105a-4b78-aa5b-db08e95c7323.png",
  
  // Course topics
  "education graduation university": "/lovable-uploads/4fb9144a-86ed-4030-8d66-cdb558e4703b.png",
  "teaching license education": "/lovable-uploads/6a6678fb-105a-4b78-aa5b-db08e95c7323.png",
  "bachelor degree education": "/lovable-uploads/6ae79f95-219e-41e6-97d0-24b2f3dfe9c6.png",
  "postgraduate education specialization": "/lovable-uploads/d64b34e7-d705-4ad3-9935-1f5b3e0c2142.png",
  "business management mba": "/lovable-uploads/ccac1e61-2311-44b6-b9a5-1aedbfb2a20b.png",
  "free education training": "/lovable-uploads/6ae79f95-219e-41e6-97d0-24b2f3dfe9c6.png",
  "professional training course": "/lovable-uploads/4fb9144a-86ed-4030-8d66-cdb558e4703b.png",
  "pedagogical training education": "/lovable-uploads/6a6678fb-105a-4b78-aa5b-db08e95c7323.png",
  
  // Subject areas
  "project management business": "/lovable-uploads/ccac1e61-2311-44b6-b9a5-1aedbfb2a20b.png",
  "web development coding": "/lovable-uploads/6ae79f95-219e-41e6-97d0-24b2f3dfe9c6.png",
  "neuropsychology clinical": "/lovable-uploads/d64b34e7-d705-4ad3-9935-1f5b3e0c2142.png",
  "data analysis python": "/lovable-uploads/4fb9144a-86ed-4030-8d66-cdb558e4703b.png",
  
  // Course titles (adicionando correspondências específicas para títulos de cursos populares)
  "administração de empresas": "/lovable-uploads/ccac1e61-2311-44b6-b9a5-1aedbfb2a20b.png",
  "pedagogia": "/lovable-uploads/6a6678fb-105a-4b78-aa5b-db08e95c7323.png",
  "artes visuais": "/lovable-uploads/6ae79f95-219e-41e6-97d0-24b2f3dfe9c6.png",
  "gestão de recursos humanos": "/lovable-uploads/ccac1e61-2311-44b6-b9a5-1aedbfb2a20b.png",
  "marketing digital": "/lovable-uploads/4fb9144a-86ed-4030-8d66-cdb558e4703b.png", 
  "excel avançado": "/lovable-uploads/6ae79f95-219e-41e6-97d0-24b2f3dfe9c6.png",
  "técnicas de vendas": "/lovable-uploads/ccac1e61-2311-44b6-b9a5-1aedbfb2a20b.png",
  "data science": "/lovable-uploads/4fb9144a-86ed-4030-8d66-cdb558e4703b.png",
  "neuropsicopedagogia": "/lovable-uploads/d64b34e7-d705-4ad3-9935-1f5b3e0c2142.png",
  "psicanálise": "/lovable-uploads/d64b34e7-d705-4ad3-9935-1f5b3e0c2142.png",
  
  // Adicionando chaves específicas para elementos da interface
  "hero-banner": "/lovable-uploads/638ad6c9-a3be-4cca-85e0-145d4f8f4974.png",
  "about-us": "/lovable-uploads/6a6678fb-105a-4b78-aa5b-db08e95c7323.png",
  "testimonials": "/lovable-uploads/6ae79f95-219e-41e6-97d0-24b2f3dfe9c6.png",
  "call-to-action": "/lovable-uploads/d64b34e7-d705-4ad3-9935-1f5b3e0c2142.png",
  
  // Generic fallback
  "default": "/lovable-uploads/359b596a-c889-4fda-9b37-6c5c76ea2f53.png"
};

// Fallback images when context isn't found
const PLACEHOLDER_IMAGES = [
  "/lovable-uploads/4fb9144a-86ed-4030-8d66-cdb558e4703b.png",
  "/lovable-uploads/6a6678fb-105a-4b78-aa5b-db08e95c7323.png",
  "/lovable-uploads/6ae79f95-219e-41e6-97d0-24b2f3dfe9c6.png",
  "/lovable-uploads/d64b34e7-d705-4ad3-9935-1f5b3e0c2142.png",
  "/lovable-uploads/ccac1e61-2311-44b6-b9a5-1aedbfb2a20b.png",
  "/lovable-uploads/359b596a-c889-4fda-9b37-6c5c76ea2f53.png"
];

// Função mais poderosa e flexível para encontrar imagens correspondentes para contextos educacionais
function getContextImage(context: string): string {
  // Normaliza o contexto para melhorar a correspondência
  const normalizedContext = context.toLowerCase().trim();
  
  // Tenta encontrar uma correspondência direta
  if (CONTEXT_IMAGES[normalizedContext]) {
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
    return CONTEXT_IMAGES[bestMatch];
  }
  
  // Retorna uma imagem aleatória se não encontrar nada
  const index = Math.floor(Math.random() * PLACEHOLDER_IMAGES.length);
  return PLACEHOLDER_IMAGES[index];
}

/**
 * Returns an image URL based on the context
 * @param context The category or search term to find an image for
 * @returns A placeholder image URL that matches the context
 */
export function searchFreepikImages(query: string, limit: number = 1): Promise<string[]> {
  // Return context-specific images
  return Promise.resolve(Array(limit).fill('').map(() => getContextImage(query)));
}

/**
 * Gets a single image URL based on a query
 * @param query The search term
 * @returns A single image URL that matches the context
 */
export function getFreepikImage(query: string): Promise<string> {
  return Promise.resolve(getContextImage(query));
}

// Cache mechanism to store already fetched images by category
const imageCache: Record<string, string> = {};

/**
 * Gets an image URL with caching
 * @param query The search term
 * @returns A promise resolving to a context-matching image URL
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

/**
 * Faz upload de uma imagem para o armazenamento do Supabase
 * @param file O arquivo para fazer upload
 * @param path O caminho no bucket (ex: 'categoria/imagem.png')
 * @param bucket O bucket para fazer upload
 * @returns A URL pública da imagem carregada
 */
export async function uploadImage(
  file: File,
  path: string,
  bucket: 'course_images' | 'category_images' | 'avatars' | 'site_images'
): Promise<string | undefined> {
  try {
    // Upload do arquivo
    const { error: uploadError } = await supabase
      .storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (uploadError) {
      console.error('Erro ao fazer upload da imagem:', uploadError);
      toast.error('Erro ao fazer upload da imagem');
      return undefined;
    }
    
    // Obter a URL pública
    const { data } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(path);
      
    return data.publicUrl;
  } catch (error) {
    console.error('Erro em uploadImage:', error);
    toast.error('Erro ao processar imagem');
    return undefined;
  }
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
