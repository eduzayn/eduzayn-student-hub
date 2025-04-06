
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  Library,
  Briefcase,
  School,
  BookmarkCheck
} from "lucide-react";
import { getCachedFreepikImage } from "@/utils/freepikAPI";
import { supabase } from "@/integrations/supabase/client";

const categories = [
  {
    id: 1,
    name: "Graduação",
    icon: GraduationCap,
    courses: 74, 
    color: "bg-blue-500",
    slug: "graduacao",
    description: "Bacharelados, Licenciaturas e Tecnológicos",
    imageQuery: "graduacao"
  },
  {
    id: 2,
    name: "Segunda Licenciatura",
    icon: BookOpen,
    courses: 31, 
    color: "bg-purple-500",
    slug: "segunda-licenciatura",
    description: "Segunda Licenciatura para Licenciados",
    imageQuery: "segunda-licenciatura"
  },
  {
    id: 3,
    name: "Segunda Graduação Bacharelado",
    icon: BookmarkCheck,
    courses: 7,
    color: "bg-indigo-500",
    slug: "segunda-graduacao-bacharelado",
    description: "Exclusivo para quem já possui diploma de bacharel",
    imageQuery: "segunda-graduacao-bacharelado"
  },
  {
    id: 4,
    name: "Pós-Graduação",
    icon: Award,
    courses: 115,
    color: "bg-green-500",
    slug: "pos-graduacao",
    description: "Especialização nas áreas educacional, saúde e direito",
    imageQuery: "pos-graduacao"
  },
  {
    id: 5,
    name: "MBA",
    icon: Briefcase,
    courses: 20,
    color: "bg-yellow-500",
    slug: "mba",
    description: "Cursos de especialização em gestão empresarial",
    imageQuery: "mba"
  },
  {
    id: 6,
    name: "Formação Livre",
    icon: Library,
    courses: 16,
    color: "bg-orange-500",
    slug: "formacao-livre",
    description: "Cursos livres para capacitação profissional",
    imageQuery: "formacao-livre"
  },
  {
    id: 7,
    name: "Capacitação Profissional",
    icon: Briefcase,
    courses: 22,
    color: "bg-red-500",
    slug: "capacitacao-profissional",
    description: "Cursos de curta duração para aprimoramento profissional",
    imageQuery: "capacitacao-profissional"
  },
  {
    id: 8,
    name: "Formação Pedagógica",
    icon: School,
    courses: 13,
    color: "bg-teal-500",
    slug: "formacao-pedagogica",
    description: "Exclusivo para bacharéis e tecnólogos",
    imageQuery: "formacao-pedagogica"
  }
];

const CategorySection = () => {
  const [categoryImages, setCategoryImages] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set initial placeholder icons
    const initialImages = categories.reduce((acc, category) => {
      acc[category.id] = '';
      return acc;
    }, {} as Record<number, string>);
    
    setCategoryImages(initialImages);
    
    // Load context-specific images
    const loadImages = async () => {
      try {
        setLoading(true);
        
        // For each category, get a context-appropriate image
        const imagesMap = {} as Record<number, string>;
        
        for (const category of categories) {
          try {
            // Use the category slug as the context key
            const imageUrl = await getCachedFreepikImage(category.slug);
            imagesMap[category.id] = imageUrl;
          } catch (error) {
            console.warn(`Failed to load image for ${category.name}:`, error);
            imagesMap[category.id] = '';
          }
        }
        
        setCategoryImages(imagesMap);
      } catch (err) {
        console.error("Failed to load category images:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadImages();
  }, []);

  return (
    <section className="eduzayn-section bg-gray-50">
      <div className="eduzayn-container">
        <h2 className="eduzayn-heading text-center">Categorias de Cursos</h2>
        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
          Explore nossas categorias de cursos e encontre a formação ideal para 
          impulsionar sua carreira acadêmica e profissional.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link key={category.id} to={`/cursos/${category.slug}`}>
              <Card className="border-none shadow-sm hover:shadow-md transition-shadow h-full overflow-hidden">
                <div className="h-32 overflow-hidden">
                  {categoryImages[category.id] ? (
                    <img 
                      src={categoryImages[category.id]} 
                      alt={category.name} 
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className={`${category.color} w-full h-full flex items-center justify-center`}>
                      <category.icon className="h-12 w-12 text-white" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <h3 className="font-medium text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500">
                    {category.description ? category.description : `${category.courses} cursos`}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
