
/**
 * Dados simulados para desenvolvimento e testes
 * Usados quando a API está indisponível ou como fallback
 */
export function carregarCursosSimulados(termoBusca = ""): any[] {
  const cursos = [
    {
      id: "c1",
      titulo: "Análise e Desenvolvimento de Sistemas",
      descricao: "Curso técnico em desenvolvimento de software e análise de sistemas",
      imagem: "/placeholder.svg",
      preco: 997.00,
      duracao: "2 anos",
      learning_worlds_id: "c1",
      ativo: true,
      simulado: true
    },
    {
      id: "c2",
      titulo: "Gestão de Projetos",
      descricao: "Metodologias ágeis e tradicionais para gestão de projetos",
      imagem: "/placeholder.svg",
      preco: 897.00,
      duracao: "6 meses",
      learning_worlds_id: "c2",
      ativo: true,
      simulado: true
    },
    {
      id: "c3",
      titulo: "Marketing Digital",
      descricao: "Estratégias avançadas para marketing digital e redes sociais",
      imagem: "/placeholder.svg",
      preco: 797.00,
      duracao: "4 meses",
      learning_worlds_id: "c3",
      ativo: true,
      simulado: true
    },
    {
      id: "c4",
      titulo: "Inteligência Artificial",
      descricao: "Fundamentos e aplicações práticas de IA e machine learning",
      imagem: "/placeholder.svg",
      preco: 1297.00,
      duracao: "8 meses",
      learning_worlds_id: "c4",
      ativo: true,
      simulado: true
    },
    {
      id: "c5",
      titulo: "Design UX/UI",
      descricao: "Princípios de design de interface e experiência do usuário",
      imagem: "/placeholder.svg",
      preco: 897.00,
      duracao: "5 meses",
      learning_worlds_id: "c5",
      ativo: true,
      simulado: true
    }
  ];
  
  // Filtrar por termo de busca se fornecido
  if (termoBusca) {
    const termoLower = termoBusca.toLowerCase();
    return cursos.filter(curso => 
      curso.titulo.toLowerCase().includes(termoLower) || 
      curso.descricao.toLowerCase().includes(termoLower)
    );
  }
  
  return cursos;
}
