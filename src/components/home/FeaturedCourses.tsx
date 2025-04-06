
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, BookOpen, Star } from "lucide-react";

// Mock featured courses data
const featuredCourses = [
  {
    id: 1,
    title: "Gestão de Projetos",
    category: "Administração",
    duration: "60 horas",
    students: 1240,
    rating: 4.8,
    image: "/placeholder.svg",
    isFeatured: true,
    popular: true,
    price: "R$ 597,00",
  },
  {
    id: 2,
    title: "Desenvolvimento Web Full Stack",
    category: "Tecnologia",
    duration: "120 horas",
    students: 2150,
    rating: 4.9,
    image: "/placeholder.svg",
    isFeatured: true,
    popular: true,
    price: "R$ 997,00",
  },
  {
    id: 176,
    title: "Neuropsicopedagogia Institucional, Clínica e Hospitalar",
    category: "Saúde Mental",
    duration: "6 meses",
    students: 845,
    rating: 4.8,
    image: "/lovable-uploads/d64b34e7-d705-4ad3-9935-1f5b3e0c2142.png",
    isFeatured: true,
    popular: true,
    price: "R$ 150,00",
  },
  {
    id: 4,
    title: "Análise de Dados com Python",
    category: "Dados",
    duration: "80 horas",
    students: 760,
    rating: 4.6,
    image: "/placeholder.svg",
    isFeatured: true,
    popular: false,
    price: "R$ 697,00",
  },
];

const FeaturedCourses = () => {
  return (
    <section className="eduzayn-section bg-white">
      <div className="eduzayn-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h2 className="eduzayn-heading">Cursos em Destaque</h2>
            <p className="text-gray-600 max-w-2xl">
              Conheça os cursos mais populares da EduZayn, escolhidos para impulsionar sua carreira 
              e garantir seu diferencial no mercado de trabalho.
            </p>
          </div>
          <Button asChild variant="ghost" className="mt-4 md:mt-0">
            <Link to="/cursos">Ver todos os cursos</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCourses.map((course) => (
            <Card key={course.id} className="eduzayn-card animate-fade-in group">
              <div className="relative overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {course.isFeatured && (
                    <Badge variant="secondary" className="bg-primary text-white">
                      Destaque
                    </Badge>
                  )}
                  {course.popular && (
                    <Badge variant="secondary" className="bg-accent text-white">
                      Popular
                    </Badge>
                  )}
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="bg-gray-50">
                    {course.category}
                  </Badge>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm ml-1">{course.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-lg mt-2 line-clamp-2">
                  <Link 
                    to={`/curso/${course.id}`} 
                    className="hover:text-primary transition-colors"
                  >
                    {course.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{course.students} alunos</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>Certificado</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-xl font-bold text-gray-900">{course.price}</div>
                  <div className="text-xs text-gray-500">Em até 12x no cartão</div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button asChild className="w-full bg-gradient-to-r from-primary to-primary/90 hover:opacity-90">
                  <Link to={`/matricula/checkout/${course.id}`}>
                    Matricule-se
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
