
import React from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  Award, 
  Users, 
  BookOpen,
  Laptop,
  DollarSign
} from "lucide-react";

// Define proper types for our courses
type CourseModule = {
  module: string;
  hours: number;
};

type BaseCourse = {
  id: number;
  title: string;
  category: string;
  duration: string;
  modalidade: string;
  price: string;
  originalPrice: string;
  payment: string;
  certification: string;
  image: string;
  description: string;
  requirements: string[];
  benefits: string[];
};

type CourseWithEmenta = BaseCourse & {
  ementa: string[];
};

type CourseWithCurriculum = BaseCourse & {
  curriculum: CourseModule[];
  totalHours: string;
};

type Course = CourseWithEmenta | CourseWithCurriculum;

// Dados simulados para os cursos
const mockCourses: Record<string, Course> = {
  // Curso básico padrão
  "176": {
    id: 176,
    title: "Neuropsicopedagogia Institucional, Clínica e Hospitalar",
    category: "Pós-Graduação",
    duration: "6 meses",
    modalidade: "Online",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    payment: "1 matrícula de R$ 150,00 + 16x de R$ 155,00",
    certification: "Certificado de Pós-Graduação",
    image: "/lovable-uploads/d64b34e7-d705-4ad3-9935-1f5b3e0c2142.png",
    description: "Este curso de pós-graduação em Neuropsicopedagogia Institucional, Clínica e Hospitalar prepara profissionais para atuar na avaliação, diagnóstico e intervenção em distúrbios de aprendizagem no contexto clínico, hospitalar e institucional.",
    requirements: [
      "Diploma de graduação em áreas relacionadas à educação ou saúde",
      "Documentação pessoal",
      "Aprovação no processo seletivo"
    ],
    ementa: [
      "Fundamentos da Neuropsicopedagogia",
      "Neurociências e Aprendizagem",
      "Avaliação Neuropsicopedagógica",
      "Intervenção Neuropsicopedagógica",
      "Neuropsicopedagogia Institucional",
      "Neuropsicopedagogia Clínica",
      "Neuropsicopedagogia Hospitalar",
      "Transtornos e Distúrbios de Aprendizagem"
    ],
    benefits: [
      "Aulas 100% online",
      "Material didático digital incluso",
      "Plataforma de aprendizado intuitiva",
      "Tutores especializados",
      "Avaliações online",
      "Flexibilidade de horários"
    ]
  },
  
  // Curso de Nutrição Esportiva
  "422": {
    id: 422,
    title: "Nutrição Esportiva",
    category: "Pós-Graduação",
    duration: "6 meses",
    modalidade: "Online",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    payment: "1 matrícula de R$ 150,00 + 16x de R$ 155,00",
    certification: "Certificado de Pós-Graduação",
    image: "/placeholder.svg",
    description: "O curso de Pós-Graduação em Nutrição Esportiva prepara profissionais para atuação especializada na área de nutrição aplicada ao esporte e atividade física, fornecendo conhecimentos avançados sobre estratégias nutricionais para melhora do desempenho atlético e recuperação física.",
    requirements: [
      "Diploma de graduação em Nutrição ou áreas relacionadas à saúde",
      "Documentação pessoal",
      "Aprovação no processo seletivo"
    ],
    ementa: [
      "Fisiologia do exercício aplicada à nutrição",
      "Avaliação nutricional do atleta",
      "Nutrição aplicada a diferentes modalidades esportivas",
      "Suplementação no esporte",
      "Hidratação e desempenho físico",
      "Periodização nutricional",
      "Estratégias nutricionais para competição",
      "Recursos ergogênicos nutricionais"
    ],
    benefits: [
      "Aulas 100% online",
      "Material didático digital incluso",
      "Plataforma de aprendizado intuitiva",
      "Tutores especializados",
      "Avaliações online",
      "Flexibilidade de horários"
    ]
  },
  
  // Formação Livre em Psicanálise
  "500": {
    id: 500,
    title: "Formação Livre em Psicanálise",
    category: "Formação Livre",
    duration: "12 meses",
    modalidade: "Online",
    price: "R$ 197,00",
    originalPrice: "R$ 297,00",
    payment: "1 matrícula de R$ 197,00 + 12x de R$ 197,00",
    certification: "Certificado de Formação Livre",
    image: "/lovable-uploads/6ae79f95-219e-41e6-97d0-24b2f3dfe9c6.png",
    description: "O curso de Formação Livre em Psicanálise oferece uma base sólida para compreensão dos fundamentos teóricos e práticos da psicanálise, permitindo ao aluno desenvolver habilidades para atuação como psicanalista.",
    totalHours: "800 horas",
    curriculum: [
      { module: "Introdução à EAD", hours: 30 },
      { module: "Diversidade Étnico Racial, Gênero e Direitos Humanos", hours: 40 },
      { module: "Formação e Ética do Psicanalista", hours: 40 },
      { module: "Complexo de Édipo e Castração", hours: 40 },
      { module: "Introdução à Psicanálise", hours: 40 },
      { module: "Libido, Pulsões e Sexualidade", hours: 40 },
      { module: "Metodologia da Pesquisa Científica", hours: 40 },
      { module: "Narcisismo e a Cultura da Indiferença", hours: 40 },
      { module: "O Aparelho psíquico, aspectos clínicos e Teóricos", hours: 40 },
      { module: "O Método Psicanalítico", hours: 40 },
      { module: "Práticas e Procedimentos em Clínica", hours: 40 },
      { module: "Processos de Transferência e Resistência", hours: 40 },
      { module: "Psicanálise da Criança e do Adolescente", hours: 40 },
      { module: "Psicanálise II", hours: 40 },
      { module: "Psicopatologias I", hours: 40 },
      { module: "Psicopatologias II", hours: 40 },
      { module: "Sonhos, Simbologia e Representação", hours: 40 },
      { module: "Tópicos Avançados em Clínica", hours: 40 },
      { module: "Tópicos Avançados em Sexualidade", hours: 40 }
    ],
    requirements: [
      "Ensino médio completo",
      "Documentação pessoal",
      "Interesse pela psicanálise"
    ],
    benefits: [
      "Aulas 100% online",
      "Material didático digital incluso",
      "Plataforma de aprendizado intuitiva",
      "Tutores especializados",
      "Avaliações online",
      "Flexibilidade de horários",
      "Certificado de conclusão reconhecido"
    ]
  },
  
  // Novo curso de Pós-Graduação em Psicanálise
  "501": {
    id: 501,
    title: "Pós-Graduação em Psicanálise",
    category: "Pós-Graduação",
    duration: "6 meses",
    modalidade: "Online",
    price: "R$ 150,00",
    originalPrice: "R$ 155,00",
    payment: "1 matrícula de R$ 150,00 + 16x de R$ 155,00",
    certification: "Certificado de Pós-Graduação",
    image: "/lovable-uploads/6ae79f95-219e-41e6-97d0-24b2f3dfe9c6.png",
    description: "O curso de Pós-Graduação em Psicanálise oferece formação especializada para profissionais que desejam atuar na área clínica psicanalítica, desenvolvendo competências para o atendimento terapêutico e compreensão dos processos psíquicos.",
    totalHours: "600 horas",
    curriculum: [
      { module: "Introdução à EAD", hours: 30 },
      { module: "Diversidade Étnico Racial, Gênero e Direitos Humanos", hours: 40 },
      { module: "Formação e Ética do Psicanalista", hours: 40 },
      { module: "Complexo de Édipo e Castração", hours: 40 },
      { module: "Introdução à Psicanálise", hours: 40 },
      { module: "Libido, Pulsões e Sexualidade", hours: 40 },
      { module: "Metodologia da Pesquisa Científica", hours: 40 },
      { module: "Narcisismo e a Cultura da Indiferença", hours: 40 },
      { module: "O Aparelho psíquico, aspectos clínicos e Teóricos", hours: 40 },
      { module: "O Método Psicanalítico", hours: 40 },
      { module: "Práticas e Procedimentos em Clínica", hours: 40 },
      { module: "Processos de Transferência e Resistência", hours: 40 },
      { module: "Psicanálise da Criança e do Adolescente", hours: 40 },
      { module: "Psicanálise II", hours: 40 },
      { module: "Psicopatologias I", hours: 40 },
      { module: "Psicopatologias II", hours: 40 },
      { module: "Sonhos, Simbologia e Representação", hours: 40 },
      { module: "Tópicos Avançados em Clínica", hours: 40 },
      { module: "Tópicos Avançados em Sexualidade", hours: 40 },
      { module: "Trabalho de Conclusão de Curso (Opcional)", hours: 0 }
    ],
    requirements: [
      "Diploma de graduação em Psicologia ou áreas relacionadas à saúde mental",
      "Documentação pessoal",
      "Aprovação no processo seletivo"
    ],
    benefits: [
      "Aulas 100% online",
      "Material didático digital incluso",
      "Plataforma de aprendizado intuitiva",
      "Tutores especializados",
      "Avaliações online",
      "Flexibilidade de horários",
      "Certificado de Pós-Graduação reconhecido pelo MEC"
    ]
  }
};

const DetalheCurso = () => {
  const { id } = useParams();
  const curso = mockCourses[id || "176"]; // Usar 176 como padrão se id não for encontrado
  
  return (
    <MainLayout>
      <div className="bg-gray-50 py-8">
        <div className="eduzayn-container">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/cursos" className="hover:text-primary">Cursos</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">{curso.title}</span>
          </div>
          
          {/* Seção principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Informações do curso */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="relative h-72">
                  <img 
                    src={curso.image} 
                    alt={curso.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-white px-3 py-1">{curso.category}</Badge>
                  </div>
                </div>
                
                <div className="p-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{curso.title}</h1>
                  
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-5 w-5 mr-2 text-primary" />
                      <span>Duração: {curso.duration}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Laptop className="h-5 w-5 mr-2 text-primary" />
                      <span>Modalidade: {curso.modalidade}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Award className="h-5 w-5 mr-2 text-primary" />
                      <span>Certificação: {curso.certification}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-6">
                    <h2 className="text-xl font-semibold mb-4">Descrição do Curso</h2>
                    <p className="text-gray-600 mb-6">{curso.description}</p>
                    
                    {/* Exibir grade curricular se existir */}
                    {"curriculum" in curso && (
                      <>
                        <h2 className="text-xl font-semibold mb-4">Grade Curricular</h2>
                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                          <h3 className="text-center text-lg font-medium mb-4 bg-blue-50 py-2 rounded">
                            DETALHAMENTO DA CARGA HORÁRIA
                          </h3>
                          <ul className="space-y-2">
                            {curso.curriculum.map((item, index) => (
                              <li key={index} className="flex justify-between py-1 border-b border-gray-100">
                                <span>{item.module}</span>
                                <span className="font-medium">{item.hours}h</span>
                              </li>
                            ))}
                            {curso.totalHours && (
                              <li className="flex justify-between py-3 mt-3 border-t-2 border-gray-200 font-bold">
                                <span>CARGA HORÁRIA TOTAL:</span>
                                <span>{curso.totalHours}</span>
                              </li>
                            )}
                          </ul>
                        </div>
                      </>
                    )}
                    
                    {/* Ementa resumida se não tiver curriculum detalhado */}
                    {"ementa" in curso && (
                      <>
                        <h2 className="text-xl font-semibold mb-4">Ementa Resumida</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                          {curso.ementa.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    
                    <h2 className="text-xl font-semibold mb-4">Pré-requisitos</h2>
                    <ul className="space-y-2 mb-6">
                      {curso.requirements.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <FileText className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <h2 className="text-xl font-semibold mb-4">Benefícios</h2>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <ul className="space-y-2">
                        {curso.benefits.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Card de matrícula */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <div className="mb-6">
                  <div className="text-xl font-semibold mb-4">Investimento:</div>
                  <div className="p-4 bg-blue-50 rounded-lg mb-4">
                    <div className="flex items-center mb-2">
                      <DollarSign className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">Matrícula de {curso.price}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">Mensalidades a partir de {curso.price}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg mb-4">
                    <div className="flex items-center mb-2">
                      <Laptop className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">Modalidade: {curso.modalidade}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">Duração: {curso.duration}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-3 text-primary" />
                    <span>Vagas limitadas</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-3 text-primary" />
                    <span>Material didático incluso</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-5 w-5 mr-3 text-primary" />
                    <span>Certificado reconhecido</span>
                  </div>
                </div>
                
                <Button 
                  asChild 
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg py-6"
                >
                  <Link to={`/matricula/checkout/${id}`}>
                    Matricule-se Agora
                  </Link>
                </Button>
                
                <div className="mt-4 text-center">
                  <Link to="/contato" className="text-primary hover:underline">
                    Precisa de ajuda? Fale com um consultor
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DetalheCurso;
