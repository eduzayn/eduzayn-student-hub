
// Dados simulados para cursos
const cursosMock = [
  {
    id: "course-1",
    title: "Desenvolvimento Web Frontend",
    description: "Aprenda HTML, CSS e JS",
    price: 1200,
    price_final: 1200,
    price_original: 1200,
    duration: "60 horas",
    image: "https://via.placeholder.com/300x200",
    access: "paid"
  },
  {
    id: "course-2",
    title: "Python para Ciência de Dados",
    description: "Fundamentos de Python e análise",
    price: 1500,
    price_final: 1500,
    price_original: 1500,
    duration: "80 horas",
    image: "https://via.placeholder.com/300x200",
    access: "paid"
  },
  {
    id: "course-3",
    title: "Marketing Digital Avançado",
    description: "Estratégias modernas de marketing",
    price: 1800,
    price_final: 1800,
    price_original: 1800,
    duration: "90 horas",
    image: "https://via.placeholder.com/300x200",
    access: "paid"
  },
  {
    id: "course-4",
    title: "Design UX/UI",
    description: "Princípios de design e experiência",
    price: 1400,
    price_final: 1400,
    price_original: 1400,
    duration: "70 horas",
    image: "https://via.placeholder.com/300x200",
    access: "paid"
  },
  // Adicionando cursos relacionados à Psicanálise para simulação
  {
    id: "course-5",
    title: "Pós-Graduação em Psicanálise",
    description: "Formação completa em psicanálise clínica",
    price: 2400,
    price_final: 2400,
    price_original: 2400,
    duration: "360 horas",
    image: "https://via.placeholder.com/300x200",
    access: "paid",
    categories: ["Psicologia", "Saúde Mental"]
  },
  {
    id: "course-6",
    title: "Psicanálise na Prática Clínica",
    description: "Aplicações práticas da teoria psicanalítica",
    price: 1800,
    price_final: 1800,
    price_original: 1800,
    duration: "120 horas",
    image: "https://via.placeholder.com/300x200",
    access: "paid",
    categories: ["Psicologia", "Saúde Mental"]
  },
  {
    id: "course-7",
    title: "Introdução à Teoria Psicanalítica",
    description: "Fundamentos da teoria psicanalítica de Freud a Lacan",
    price: 1200,
    price_final: 1200,
    price_original: 1200,
    duration: "80 horas",
    image: "https://via.placeholder.com/300x200",
    access: "paid",
    categories: ["Psicologia", "Saúde Mental", "Teoria"]
  },
  {
    id: "course-8",
    title: "Psicanálise e Educação",
    description: "A aplicação dos conceitos psicanalíticos no contexto educacional",
    price: 1500,
    price_final: 1500,
    price_original: 1500,
    duration: "100 horas",
    image: "https://via.placeholder.com/300x200",
    access: "paid",
    categories: ["Psicologia", "Educação"]
  }
];

/**
 * Retorna cursos simulados, opcionalmente filtrados por termo de busca
 */
export const getDadosSimulados = (page: number, limit: number, searchTerm = "") => {
  let dados = [...cursosMock];
  
  // Filtra por termo de busca se fornecido
  if (searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    dados = dados.filter(curso => 
      curso.title.toLowerCase().includes(searchTerm) || 
      curso.description.toLowerCase().includes(searchTerm) ||
      curso.categories?.some(cat => cat.toLowerCase().includes(searchTerm))
    );
    
    console.log(`Filtrando dados simulados por "${searchTerm}", encontrados: ${dados.length}`);
  }
  
  // Calcular paginação
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = dados.slice(startIndex, endIndex);
  
  // Retornar com formato de meta compatível com CoursesResponse
  return {
    data: paginatedData,
    meta: {
      totalItems: dados.length,
      totalPages: Math.ceil(dados.length / limit),
      page: page,
      itemsPerPage: limit
    }
  };
};

/**
 * Retorna detalhes simulados de um curso
 */
export const getDetalhesCursoSimulado = (courseId: string) => {
  const curso = cursosMock.find(c => c.id === courseId);
  
  if (!curso) {
    return {
      error: "Curso não encontrado",
      simulatedResponse: true
    };
  }
  
  return {
    ...curso,
    sections: [
      {
        id: "section-1",
        title: "Introdução",
        lessons: 4
      },
      {
        id: "section-2",
        title: "Fundamentos",
        lessons: 6
      },
      {
        id: "section-3",
        title: "Prática Avançada",
        lessons: 5
      }
    ],
    instructors: [
      {
        id: "instructor-1",
        name: "Prof. Maria Santos",
        bio: "Especialista com 10 anos de experiência"
      }
    ],
    simulatedResponse: true
  };
};

// Exportação para uso em outros módulos
export default {
  getDadosSimulados,
  getDetalhesCursoSimulado
};
