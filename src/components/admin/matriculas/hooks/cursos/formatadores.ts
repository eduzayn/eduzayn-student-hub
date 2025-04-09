
/**
 * Formatadores para dados de cursos
 */

/**
 * Formata cursos da API do LearnWorlds para o formato interno
 */
export const formatarCursos = (cursosAPI: any[]): any[] => {
  if (!Array.isArray(cursosAPI) || cursosAPI.length === 0) {
    console.warn("Lista de cursos vazia ou inválida");
    return [];
  }

  return cursosAPI.map((curso, index) => {
    // Extrai informações disponíveis do curso original
    const {
      id,
      title,
      description,
      price = 0,
      price_final = 0,
      free_trial = false,
      image = "",
      access = "",
      duration = ""
    } = curso;

    // Log para debug
    if (index === 0 || index === cursosAPI.length - 1) {
      console.log(`Formatando curso ${id}:`, curso);
    }

    // Determina valores padrão para propriedades potencialmente ausentes
    const valorTotal = price_final || price || 0;
    const valorMensal = valorTotal > 0 ? Math.round(valorTotal / 6) : 0;
    
    return {
      id,
      learning_worlds_id: id,
      titulo: title || "Sem título",
      descricao: description || "",
      codigo: id?.toString().substring(0, 8) || `curso-${index}`,
      modalidade: access === "free" ? "Gratuito" : "Online",
      carga_horaria: duration || "60h",
      valor_total: valorTotal,
      valor_mensalidade: valorMensal,
      url: curso.url || "",
      imagem_url: image || "https://via.placeholder.com/300x180?text=Curso",
      // Dados vindos da API são explicitamente marcados como não simulados
      simulado: false,
      simulatedResponse: false,
      // Atributo para identificar a origem dos dados (API direta com token)
      api_token: true
    };
  });
};
