
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Clock, Award } from "lucide-react";

// Dados simulados para os cursos
const mockCourses = [
  {
    id: 1,
    title: "Administração de Empresas",
    category: "Graduação",
    categorySlug: "graduacao",
    duration: "4 anos",
    price: "R$ 597,00",
    originalPrice: "R$ 897,00",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Pedagogia",
    category: "Graduação",
    categorySlug: "graduacao",
    duration: "4 anos",
    price: "R$ 547,00",
    originalPrice: "R$ 847,00",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Engenharia Civil",
    category: "Segunda Graduação",
    categorySlug: "segunda-graduacao",
    duration: "3 anos",
    price: "R$ 697,00",
    originalPrice: "R$ 997,00",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    title: "Gestão de Recursos Humanos",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "1.5 anos",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  },
  {
    id: 5,
    title: "Marketing Digital",
    category: "Pós-Graduação",
    categorySlug: "pos-graduacao",
    duration: "1.5 anos",
    price: "R$ 427,00",
    originalPrice: "R$ 627,00",
    image: "/placeholder.svg",
  },
  {
    id: 6,
    title: "Excel Avançado",
    category: "Formação Livre",
    categorySlug: "formacao-livre",
    duration: "60 horas",
    price: "R$ 197,00",
    originalPrice: "R$ 297,00",
    image: "/placeholder.svg",
  },
  {
    id: 7,
    title: "Técnicas de Vendas",
    category: "Capacitação Profissional",
    categorySlug: "capacitacao-profissional",
    duration: "80 horas",
    price: "R$ 247,00",
    originalPrice: "R$ 347,00",
    image: "/placeholder.svg",
  },
  {
    id: 8,
    title: "Data Science",
    category: "Capacitação Profissional",
    categorySlug: "capacitacao-profissional",
    duration: "120 horas",
    price: "R$ 347,00",
    originalPrice: "R$ 447,00",
    image: "/placeholder.svg",
  },
];

const Cursos = () => {
  const { categoria } = useParams();
  const [currentCategory, setCurrentCategory] = useState(categoria || "todos");
  
  // Filtrar cursos com base na categoria selecionada
  const filteredCourses = currentCategory === "todos" 
    ? mockCourses 
    : mockCourses.filter(course => course.categorySlug === currentCategory);

  // Categorias disponíveis
  const categories = [
    { id: "todos", name: "Todos os Cursos" },
    { id: "graduacao", name: "Graduação" },
    { id: "segunda-graduacao", name: "Segunda Graduação" },
    { id: "pos-graduacao", name: "Pós-Graduação" },
    { id: "formacao-livre", name: "Formação Livre" },
    { id: "capacitacao-profissional", name: "Capacitação Profissional" }
  ];

  return (
    <MainLayout>
      <div className="bg-gray-50 py-8">
        <div className="eduzayn-container">
          <h1 className="text-3xl font-bold mb-6">
            {currentCategory === "todos" 
              ? "Todos os Cursos" 
              : categories.find(cat => cat.id === currentCategory)?.name || "Cursos"}
          </h1>
          
          {/* Filtros de Categoria */}
          <div className="mb-8 overflow-x-auto pb-2">
            <div className="flex space-x-2">
              {categories.map((cat) => (
                <Button 
                  key={cat.id} 
                  variant={currentCategory === cat.id ? "default" : "outline"}
                  className="whitespace-nowrap"
                  onClick={() => setCurrentCategory(cat.id)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Grid de Cursos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-primary">{course.category}</Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">
                    <Link to={`/curso/${course.id}`} className="hover:text-primary transition-colors">
                      {course.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pb-2 space-y-3">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-1" />
                      <span>Certificado</span>
                    </div>
                  </div>
                  
                  <div className="flex items-end gap-2">
                    <span className="text-xl font-bold text-primary">{course.price}</span>
                    <span className="text-sm text-gray-500 line-through">{course.originalPrice}</span>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to={`/curso/${course.id}`}>
                      Saiba Mais
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Cursos;
