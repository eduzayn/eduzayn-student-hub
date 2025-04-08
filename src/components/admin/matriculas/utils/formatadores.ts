
/**
 * Utilitários para formatar valores para exibição
 */

// Formato de moeda brasileira
export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

// Formata carga horária para exibição
export const formatarCargaHoraria = (minutos: number): string => {
  if (!minutos) return "0h";
  
  if (minutos < 60) return `${minutos}min`;
  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;
  return minutosRestantes > 0 ? `${horas}h ${minutosRestantes}min` : `${horas}h`;
};
