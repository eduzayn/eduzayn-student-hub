import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Clock, Award, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Dados simulados para os cursos
const mockCourses = [
  // Cursos existentes
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
    title: "Artes Visuais",
    category: "Segunda Licenciatura",
    categorySlug: "segunda-licenciatura",
    duration: "1 ano",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
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
  
  // Novos cursos de graduação tecnológica (18 meses)
  // ... keep existing code (Cursos de graduação tecnológica)
  
  // Novos cursos de licenciatura (3.5+ anos)
  // ... keep existing code (Cursos de licenciatura)
  
  // Novos cursos de Bacharelado (3.5+ anos)
  // ... keep existing code (Cursos de bacharelado)
  
  // Adicionando novos cursos de Segunda Licenciatura
  {
    id: 100,
    title: "Sociologia",
    category: "Segunda Licenciatura",
    categorySlug: "segunda-licenciatura",
    duration: "1 ano",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  },
  {
    id: 101,
    title: "Ciências da Religião",
    category: "Segunda Licenciatura",
    categorySlug: "segunda-licenciatura",
    duration: "1 ano",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  },
  {
    id: 102,
    title: "Educação Especial",
    category: "Segunda Licenciatura",
    categorySlug: "segunda-licenciatura",
    duration: "1 ano",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  },
  {
    id: 103,
    title: "Educação Física",
    category: "Segunda Licenciatura",
    categorySlug: "segunda-licenciatura",
    duration: "1 ano",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  },
  {
    id: 104,
    title: "Filosofia",
    category: "Segunda Licenciatura",
    categorySlug: "segunda-licenciatura",
    duration: "1 ano",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  },
  {
    id: 105,
    title: "Geografia",
    category: "Segunda Licenciatura",
    categorySlug: "segunda-licenciatura",
    duration: "1 ano",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  },
  {
    id: 106,
    title: "História",
    category: "Segunda Licenciatura",
    categorySlug: "segunda-licenciatura",
    duration: "1 ano",
    price: "R$ 397,00",
    originalPrice: "R$ 597,00",
    image: "/placeholder.svg",
  }
];

const Cursos = () => {
  const { categoria } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  
  const [filteredCourses, setFilteredCourses] = useState(mockCourses);
  
  // Filter courses based on category slug and search query
  useEffect(() => {
    const filtered = mockCourses.filter(course => {
      // Filter by category if provided
      const categoryMatch = categoria 
        ? course.categorySlug === categoria
        : true;
      
      // Filter by search query if provided
      const searchMatch = searchQuery
        ? course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          course.category.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      
      return categoryMatch && searchMatch;
    });
    
    setFilteredCourses(filtered);
  }, [categoria, searchQuery]);

  // Function to get the page title based on category
  const getPageTitle = () => {
    if (!categoria) return "Todos os Cursos";
    
    switch (categoria) {
      case "graduacao": return "Cursos de Graduação";
      case "segunda-licenciatura": return "Cursos de Segunda Licenciatura";
      case "segunda-graduacao-bacharelado": return "Cursos de Segunda Graduação Bacharelado";
      case "pos-graduacao": return "Cursos de Pós-Graduação";
      case "formacao-livre": return "Cursos de Formação Livre";
      case "capacitacao-profissional": return "Cursos de Capacitação Profissional";
      case "formacao-pedagogica": return "Cursos de Formação Pedagógica";
      default: return "Cursos";
    }
  };

  return (
    <MainLayout>
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">{getPageTitle()}</h1>
          <p className="text-gray-600 mb-8">
            Encontre o curso ideal para sua formação acadêmica e profissional
          </p>
          
          <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nome de curso ou categoria..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-48 object-cover" 
                    />
                    <Badge 
                      className="absolute top-3 right-3"
                      variant="secondary"
                    >
                      {course.category}
                    </Badge>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl">
                      <Link 
                        to={`/curso/${course.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {course.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center text-gray-500 mb-4">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">{course.duration}</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <div className="text-2xl font-bold text-gray-900">{course.price}</div>
                      <div className="text-sm text-gray-500">
                        <span className="line-through">{course.originalPrice}</span>
                        <span className="ml-2">em até 12x no cartão</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="border-t pt-4">
                    <Button asChild className="w-full">
                      <Link to={`/curso/${course.id}`}>
                        Saiba Mais
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <Award className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">Nenhum curso encontrado</h3>
                <p className="text-gray-600 mb-6">
                  Tente ajustar seus filtros ou busca para encontrar o curso desejado.
                </p>
                <Button onClick={() => setSearchQuery("")}>
                  Limpar Busca
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Cursos;
