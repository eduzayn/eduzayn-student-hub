
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, BookOpen, Star, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getCachedFreepikImage } from "@/utils/freepikAPI";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Mock featured courses data
const featuredCourses = [
  {
    id: 1,
    title: "Gestão de Projetos",
    category: "Administração",
    categorySlug: "mba",
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
    categorySlug: "capacitacao-profissional",
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
    categorySlug: "pos-graduacao",
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
    categorySlug: "capacitacao-profissional",
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
        
        // Prepare initial images (use existing custom uploads if available)
        const initialImages = featuredCourses.reduce((acc, course) => {
          if (course.image.startsWith("/lovable-uploads/")) {
            acc[course.id] = course.image;
          } else {
            acc[course.id] = '/placeholder.svg'; // Initial placeholder
          }
          return acc;
        }, {} as Record<number, string>);
        
        setCourseImages(initialImages);
        
        // Load context-specific images for each course
        const imagesPromises = featuredCourses.map(async (course) => {
          // Skip courses with custom images
          if (course.image.startsWith("/lovable-uploads/")) {
            return { id: course.id, imageUrl: course.image };
          }
          
          try {
            // Use title first for best matching, then fallback to category
            const contextKey = course.title || course.imageQuery || course.categorySlug;
            const imageUrl = await getCachedFreepikImage(contextKey);
            return { id: course.id, imageUrl };
          } catch (error) {
            console.warn(`Failed to load image for ${course.title}:`, error);
            return { id: course.id, imageUrl: '/lovable-uploads/359b596a-c889-4fda-9b37-6c5c76ea2f53.png' };
          }
        });
        
        const results = await Promise.all(imagesPromises);
        
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

  return (
    <section className="eduzayn-section bg-gray-50 py-16">
      <div className="eduzayn-container max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="eduzayn-heading text-3xl font-bold text-gray-800 mb-3">Cursos em Destaque</h2>
            <p className="text-gray-600 max-w-2xl">
              Conheça os cursos mais populares da EduZayn, escolhidos para impulsionar sua carreira 
              e garantir seu diferencial no mercado de trabalho.
            </p>
          </div>
          <Button asChild variant="outline" className="mt-4 md:mt-0 hover:bg-primary hover:text-white transition-colors">
            <Link to="/cursos">Ver todos os cursos</Link>
          </Button>
        </div>
        
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Carregando cursos em destaque...</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {!loading && featuredCourses.map((course) => (
            <Card key={course.id} className="eduzayn-card animate-fade-in group hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200">
              <div className="relative overflow-hidden">
                <AspectRatio ratio={16/9}>
                  <img 
                    src={courseImages[course.id] || '/lovable-uploads/359b596a-c889-4fda-9b37-6c5c76ea2f53.png'} 
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      // Fallback to placeholder if image fails
                      const target = e.target as HTMLImageElement;
                      target.src = '/lovable-uploads/359b596a-c889-4fda-9b37-6c5c76ea2f53.png';
                    }}
                  />
                </AspectRatio>
                <div className="absolute top-3 left-3 flex gap-2 z-10">
                  {course.isFeatured && (
                    <Badge variant="secondary" className="bg-primary text-white font-medium shadow-sm">
                      Destaque
                    </Badge>
                  )}
                  {course.popular && (
                    <Badge variant="secondary" className="bg-orange-500 text-white font-medium shadow-sm">
                      Popular
                    </Badge>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="bg-gray-50">
                    {course.category}
                  </Badge>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm ml-1 font-medium">{course.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-lg mt-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
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
                
                <div className="mt-4 bg-gray-50 -mx-6 px-6 py-3">
                  <div className="text-xl font-bold text-gray-900">{course.price}</div>
                  <div className="text-xs text-gray-500 flex items-center justify-between">
                    <span className="line-through">{course.originalPrice || ''}</span>
                    <span className="text-green-600 font-medium">em até 12x no cartão</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t pt-4">
                <Button asChild className="w-full bg-gradient-to-r from-primary to-primary/90 hover:opacity-90 shadow-md">
                  <Link to={`/curso/${course.id}`}>
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
