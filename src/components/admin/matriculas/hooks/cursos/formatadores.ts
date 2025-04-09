
import { Course } from "@/hooks/learnworlds/types/cursoTypes";

/**
 * Formata dados de cursos da API LearnWorlds para o formato esperado pelo frontend
 */
export function formatarCursos(cursos: any[]): any[] {
  return cursos.map(curso => ({
    id: curso.id,
    titulo: curso.title,
    descricao: curso.description || curso.shortDescription || "Sem descrição disponível",
    imagem: curso.image || curso.courseImage || "/placeholder.svg",
    preco: curso.price || curso.price_final || 0,
    duracao: curso.duration || "Não informado",
    learning_worlds_id: curso.id,
    ativo: curso.is_active !== false
  }));
}

/**
 * Formata valores monetários para exibição
 */
export function formatarPreco(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

/**
 * Formata data para exibição
 */
export function formatarData(data: string): string {
  if (!data) return "Data não disponível";
  
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}
