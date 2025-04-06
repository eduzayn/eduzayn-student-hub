
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

interface CourseNotFoundProps {
  courseId: string;
}

const CourseNotFound: React.FC<CourseNotFoundProps> = ({ courseId }) => {
  return (
    <MainLayout>
      <div className="bg-gray-50 py-12">
        <div className="eduzayn-container text-center">
          <Award className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold mb-4">Curso não encontrado</h1>
          <p className="text-gray-600 mb-6">
            O curso que você está procurando (ID: {courseId}) não está disponível ou pode ter sido removido.
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link to="/cursos">Ver todos os cursos</Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default CourseNotFound;
