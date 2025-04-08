
/**
 * Formata um valor numérico para o formato de moeda brasileira (R$)
 * @param valor O valor numérico a ser formatado
 * @returns String formatada no padrão monetário brasileiro
 */
export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};
