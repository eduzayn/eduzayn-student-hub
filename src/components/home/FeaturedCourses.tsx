
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, BookOpen, Star, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
    originalPrice: "R$ 797,00",
    imageQuery: "project management business"
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
    originalPrice: "R$ 1.297,00",
    imageQuery: "web development coding"
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
    originalPrice: "R$ 250,00",
    imageQuery: "neuropsychology clinical"
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
    originalPrice: "R$ 897,00",
    imageQuery: "data analysis python"
  },
];

const FeaturedCourses = () => {
  const [courseImages, setCourseImages] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        
        // Configurar imagens iniciais (usar o placeholder ou imagens existentes)
        const initialImages = featuredCourses.reduce((acc, course) => {
          // Use a imagem existente se for um upload personalizado
          if (course.image.startsWith("/lovable-uploads/")) {
            acc[course.id] = course.image;
          } else {
            acc[course.id] = '/placeholder.svg'; // Placeholder inicial
          }
          return acc;
        }, {} as Record<number, string>);
        
        setCourseImages(initialImages);
        
        // Tentar carregar imagens do bucket do Supabase para cada curso
        const imagePromises = featuredCourses.map(async (course) => {
          // Pular cursos que já têm imagem personalizada
          if (course.image.startsWith("/lovable-uploads/")) {
            return { id: course.id, imageUrl: course.image };
          }
          
          try {
            // Tentar buscar por categoria primeiro
            const categoryName = course.category.toLowerCase().replace(/\s+/g, '-');
            
            // Listar arquivos no bucket com um prefixo correspondente à categoria
            const { data: files, error } = await supabase
              .storage
              .from('category_images')
              .list(categoryName);
              
            if (error || !files?.length) {
              // Tentar usar a imageQuery como fallback
              const querySlug = course.imageQuery.toLowerCase().replace(/\s+/g, '-');
              const { data: queryFiles } = await supabase
                .storage
                .from('course_images')
                .list(querySlug);
                
              if (queryFiles?.length) {
                const randomIndex = Math.floor(Math.random() * queryFiles.length);
                const selectedFile = queryFiles[randomIndex];
                
                const { data: publicURL } = supabase
                  .storage
                  .from('course_images')
                  .getPublicUrl(`${querySlug}/${selectedFile.name}`);
                  
                return { id: course.id, imageUrl: publicURL.publicUrl };
              }
              
              // Usar placeholder se não encontrar
              return { id: course.id, imageUrl: '/placeholder.svg' };
            }
            
            // Escolher uma imagem aleatória se várias estiverem disponíveis
            const randomIndex = Math.floor(Math.random() * files.length);
            const selectedFile = files[randomIndex];
            
            // Obter a URL pública para o arquivo
            const { data: publicURL } = supabase
              .storage
              .from('category_images')
              .getPublicUrl(`${categoryName}/${selectedFile.name}`);
              
            return { id: course.id, imageUrl: publicURL.publicUrl };
          } catch (error) {
            console.warn(`Failed to load image for course ${course.title}:`, error);
            return { id: course.id, imageUrl: '/placeholder.svg' };
          }
        });
        
        const results = await Promise.all(imagePromises);
        
        const imagesMap = results.reduce((acc, { id, imageUrl }) => {
          acc[id] = imageUrl;
          return acc;
        }, {} as Record<number, string>);
        
        setCourseImages(imagesMap);
      } catch (err) {
        console.error("Failed to load course images:", err);
        toast.error("Não foi possível carregar algumas imagens");
      } finally {
        setLoading(false);
      }
    };
    
    loadImages();
  }, []);

  // Verificar se o curso existe nos cursos mockados antes de redirecionar
  const checkCourseExists = (courseId: number) => {
    // Para a página de detalhes do curso, verificamos se o ID está no mockCourses
    // Aqui estamos apenas verificando se o ID está em featuredCourses
    return featuredCourses.some(course => course.id === courseId);
  };

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
        
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Carregando cursos em destaque...</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {!loading && featuredCourses.map((course) => (
            <Card key={course.id} className="eduzayn-card animate-fade-in group">
              <div className="relative overflow-hidden">
                <img 
                  src={courseImages[course.id] || '/placeholder.svg'} 
                  alt={course.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback para placeholder se a imagem falhar
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
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
                  <div className="text-xs text-gray-500">
                    <span className="line-through">{course.originalPrice || ''}</span>
                    <span className="ml-2">em até 12x no cartão</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t pt-4">
                <Button asChild className="w-full bg-gradient-to-r from-primary to-primary/90 hover:opacity-90">
                  <Link to={checkCourseExists(course.id) ? `/matricula/checkout/${course.id}` : `/curso/${course.id}`}>
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
