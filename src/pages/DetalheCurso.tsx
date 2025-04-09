
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import { getCachedFreepikImage } from "@/utils/imageUtils";

// Importando os componentes criados
import CourseImage from "@/components/curso/CourseImage";
import CourseHeader from "@/components/curso/CourseHeader";
import CourseDescription from "@/components/curso/CourseDescription";
import CourseEnrollCard from "@/components/curso/CourseEnrollCard";
import CourseNotFound from "@/components/curso/CourseNotFound";

// Importando os dados dos cursos
import mockCourses from "@/data/mockCourses";

const DetalheCurso: React.FC = () => {
  const { id } = useParams();
  const [courseImage, setCourseImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Verifica se o parâmetro ID é um número ou uma string
  const courseId = id ? id.toString() : "";
  
  // Carrega a imagem contextual do curso baseada no título ou categoria
  useEffect(() => {
    const loadCourseImage = async () => {
      if (!courseId || !mockCourses[courseId]) return;
      
      try {
        setLoading(true);
        const curso = mockCourses[courseId];
        
        // Se já tiver uma imagem personalizada carregada, use-a
        if (curso.image && curso.image.startsWith("/lovable-uploads/")) {
          setCourseImage(curso.image);
          setLoading(false);
          return;
        }
        
        // Caso contrário, busque uma imagem contextual baseada no título ou categoria
        const contextKey = curso.title || curso.category;
        const imageUrl = await getCachedFreepikImage(contextKey);
        setCourseImage(imageUrl);
      } catch (error) {
        console.error("Erro ao carregar imagem do curso:", error);
        // Fallback para uma imagem padrão em caso de erro
        setCourseImage('/lovable-uploads/359b596a-c889-4fda-9b37-6c5c76ea2f53.png');
      } finally {
        setLoading(false);
      }
    };
    
    loadCourseImage();
  }, [courseId]);
  
  // Verifica se o curso existe
  if (!courseId || !mockCourses[courseId]) {
    // Mostrar mensagem amigável quando o curso não for encontrado
    toast.error(`Curso com ID ${courseId} não encontrado`);
    console.warn(`Curso com ID ${courseId} não encontrado na lista de cursos disponíveis`);
    return (
      <MainLayout>
        <CourseNotFound courseId={courseId || ""} />
      </MainLayout>
    );
  }
  
  const curso = mockCourses[courseId];
  
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
                <CourseImage 
                  image={courseImage || curso.image}
                  title={curso.title}
                  category={curso.category}
                  loading={loading}
                />
                
                <CourseHeader 
                  title={curso.title}
                  duration={curso.duration}
                  modalidade={curso.modalidade}
                  certification={curso.certification}
                />
                
                <CourseDescription 
                  description={curso.description}
                  loading={loading}
                />
              </div>
            </div>
            
            {/* Card de matrícula */}
            <div className="lg:col-span-1">
              <CourseEnrollCard 
                id={courseId}
                price={curso.price}
                modalidade={curso.modalidade}
                duration={curso.duration}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DetalheCurso;
