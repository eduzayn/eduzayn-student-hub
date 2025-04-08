
import { Course, CoursesResponse } from '../types/cursoTypes';

/**
 * Gera dados simulados de cursos para uso quando a API estiver indisponível
 */
export const getDadosSimulados = (page: number, limit: number, searchTerm: string): CoursesResponse => {
  const cursos = [
    {
      id: "c-001",
      title: "Desenvolvimento Web Frontend",
      description: "Aprenda HTML, CSS e JavaScript para criar sites modernos e responsivos.",
      shortDescription: "Aprenda HTML, CSS e JS",
      price_original: 1200,
      price_final: 1200,
      duration: "60 horas",
      image: "https://via.placeholder.com/300x200",
      access: "paid" as 'free' | 'paid',
      categories: ["Tecnologia", "Desenvolvimento"]
    },
    {
      id: "c-002",
      title: "Python para Ciência de Dados",
      description: "Fundamentos de Python e bibliotecas para análise de dados.",
      shortDescription: "Fundamentos de Python e análise",
      price_original: 1500,
      price_final: 1500,
      duration: "80 horas",
      image: "https://via.placeholder.com/300x200",
      access: "paid" as 'free' | 'paid',
      categories: ["Tecnologia", "Dados"]
    },
    {
      id: "c-003",
      title: "Marketing Digital Avançado",
      description: "Estratégias modernas de marketing para impulsionar sua presença online.",
      shortDescription: "Estratégias modernas de marketing",
      price_original: 1800,
      price_final: 1800,
      duration: "90 horas",
      image: "https://via.placeholder.com/300x200",
      access: "paid" as 'free' | 'paid',
      categories: ["Marketing", "Digital"]
    }
  ];

  const filteredCourses = searchTerm
    ? cursos.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      )
    : cursos;

  const startIndex = (page - 1) * limit;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + limit);
  
  return {
    data: paginatedCourses,
    meta: {
      page,
      totalItems: filteredCourses.length,
      totalPages: Math.ceil(filteredCourses.length / limit),
      itemsPerPage: limit
    }
  };
};

/**
 * Gera dados simulados de detalhes de um curso específico
 */
export const getDetalhesCursoSimulado = (courseId: string): any => {
  return {
    id: courseId,
    title: `Curso ${courseId}`,
    description: `Descrição detalhada do curso ${courseId}`,
    price_original: 1500,
    price_final: 1500,
    duration: "80 horas",
    image: "https://via.placeholder.com/600x400",
    modules: [
      {
        id: "module-1",
        title: "Introdução",
        description: "Fundamentos básicos",
        lessons: [
          { id: "lesson-1-1", title: "Primeiros passos", duration: 45 },
          { id: "lesson-1-2", title: "Conceitos fundamentais", duration: 60 }
        ]
      },
      {
        id: "module-2",
        title: "Intermediário",
        description: "Aprofundamento teórico",
        lessons: [
          { id: "lesson-2-1", title: "Técnicas avançadas", duration: 75 },
          { id: "lesson-2-2", title: "Estudos de caso", duration: 90 }
        ]
      }
    ]
  };
};
