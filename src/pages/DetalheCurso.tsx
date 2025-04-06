
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

// Dados simulados para o curso de exemplo
const mockCourseData = {
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
};

const DetalheCurso = () => {
  const { id } = useParams();
  const curso = mockCourseData; // Em uma implementação real, buscaria com base no ID
  
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
                    
                    <h2 className="text-xl font-semibold mb-4">Ementa Resumida</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                      {curso.ementa.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    
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
                      <span className="font-medium">Matrícula de R$ 150,00</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">16x de R$ 155,00</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg mb-4">
                    <div className="flex items-center mb-2">
                      <Laptop className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">Modalidade: Online</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">Duração: A partir de 6 meses</span>
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
