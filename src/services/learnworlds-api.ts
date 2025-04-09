
import { LearnWorldsCourse } from "../types/curso";

export const getUserCourses = async (userId: string): Promise<LearnWorldsCourse[]> => {
  // Esta é uma versão simplificada que retorna dados de exemplo
  console.log(`Obtendo cursos para usuário ${userId}`);
  
  // Simula uma pequena latência
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Retorna dados de exemplo
  return [
    {
      id: "course-1",
      title: "Desenvolvimento Web Fullstack",
      description: "Aprenda a desenvolver aplicações web completas.",
      thumbnail: "/placeholder.svg",
      price: 997,
      modalidade: "EAD",
      access: "paid",
      duration: "120 horas",
      progress: 35
    },
    {
      id: "course-2",
      title: "Design UX/UI",
      description: "Aprenda a criar interfaces intuitivas e atraentes.",
      thumbnail: "/placeholder.svg",
      price: 897,
      modalidade: "EAD",
      access: "paid",
      duration: "80 horas",
      progress: 0
    },
    {
      id: "course-3",
      title: "Marketing Digital",
      description: "Estratégias para divulgação online.",
      thumbnail: "/placeholder.svg",
      price: 697,
      modalidade: "EAD",
      access: "paid",
      duration: "60 horas",
      progress: 100
    }
  ];
};

export const getCurrentUserId = async (): Promise<string | null> => {
  // Versão simplificada que retorna um ID de usuário fixo
  return "user123";
};
