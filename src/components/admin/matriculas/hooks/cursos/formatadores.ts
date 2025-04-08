
/**
 * Utilidades para formatação de dados de cursos
 */

/**
 * Extrai o slug da URL do curso do LearnWorlds
 */
export const extractSlugFromUrl = (url: string): string => {
  if (!url) return "";
  
  try {
    // Extrai o último segmento da URL que geralmente é o slug do curso
    const segments = url.split("/");
    return segments[segments.length - 1] || "";
  } catch (error) {
    console.error("Erro ao extrair slug da URL:", error);
    return "";
  }
};

/**
 * Converte duração em string para minutos
 */
export const obterCargaHorariaEmMinutos = (duration: string): number => {
  if (!duration) return 0;
  
  try {
    // Se for apenas um número, assume que são horas
    if (/^\d+$/.test(duration)) {
      return parseInt(duration) * 60; // Converte horas para minutos
    }
    
    // Se for no formato "X horas" ou "X h"
    const hoursMatch = duration.match(/(\d+)\s*(horas|hora|h)/i);
    if (hoursMatch) {
      return parseInt(hoursMatch[1]) * 60;
    }
    
    // Se for no formato "X minutos" ou "X min"
    const minutesMatch = duration.match(/(\d+)\s*(minutos|minuto|min)/i);
    if (minutesMatch) {
      return parseInt(minutesMatch[1]);
    }
    
    return 0;
  } catch (error) {
    console.error("Erro ao converter duração:", error);
    return 0;
  }
};

/**
 * Formata os cursos retornados da API para o formato utilizado pelo app
 */
export const formatarCursos = (cursosData: any[]) => {
  return cursosData
    .filter(curso => curso.title && curso.id) // Filtra cursos sem título ou id
    .map((curso: any) => {
      // Extrai o slug da URL se disponível
      let slug = "";
      if (curso.url) {
        slug = extractSlugFromUrl(curso.url);
      }
      
      return {
        id: curso.id,
        titulo: curso.title,
        codigo: curso.id || slug || (curso.title ? curso.title.substring(0, 8).toUpperCase() : "SEM-COD"),
        modalidade: "EAD", // Assumindo que todos os cursos do LearnWorlds são EAD
        carga_horaria: obterCargaHorariaEmMinutos(curso.duration || ""),
        valor_total: 0, // Zerando para permitir personalização manual
        valor_mensalidade: 0, // Zerando para permitir personalização manual
        descricao: curso.description || curso.shortDescription || "",
        imagem_url: curso.image || curso.courseImage || "",
        categorias: curso.categories || [],
        learning_worlds_id: curso.id,
        acesso: curso.access || "pago",
        url: curso.url || `https://grupozayneducacional.com.br/course/${slug || curso.id}`,
        simulado: false
      };
    });
};
