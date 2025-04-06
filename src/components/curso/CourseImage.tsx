
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface CourseImageProps {
  image: string | null;
  title: string;
  category: string;
  loading: boolean;
}

const CourseImage: React.FC<CourseImageProps> = ({ image, title, category, loading }) => {
  const defaultImage = '/lovable-uploads/359b596a-c889-4fda-9b37-6c5c76ea2f53.png';
  
  // Verifica se o título contém "Educação Especial" para usar imagem específica
  const isSpecialEducation = 
    title.toLowerCase().includes("educação especial") || 
    title.toLowerCase().includes("educacao especial");
  
  // Imagem específica para cursos de educação especial
  const specialEducationImage = '/lovable-uploads/bf2e50f8-5fef-4124-88f6-aae80ba3daaf.png';
  
  // Determina qual imagem usar
  const displayImage = isSpecialEducation ? specialEducationImage : (image || defaultImage);
  
  return (
    <div className="relative h-64">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="h-full">
          <img 
            src={displayImage} 
            alt={title}
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback para imagem padrão se falhar
              const target = e.target as HTMLImageElement;
              target.src = defaultImage;
            }}
          />
        </div>
      )}
      <div className="absolute top-4 left-4">
        <Badge className="bg-primary text-white px-3 py-1">{category}</Badge>
      </div>
    </div>
  );
};

export default CourseImage;
