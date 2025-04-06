
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  Library,
  Briefcase
} from "lucide-react";

// Categorias atualizadas conforme solicitado
const categories = [
  {
    id: 1,
    name: "Graduação",
    icon: GraduationCap,
    courses: 48,
    color: "bg-blue-500",
    slug: "graduacao",
    description: "Bacharelados, Licenciaturas e Tecnológicos"
  },
  {
    id: 2,
    name: "Segunda Graduação",
    icon: BookOpen,
    courses: 18,
    color: "bg-purple-500",
    slug: "segunda-graduacao"
  },
  {
    id: 3,
    name: "Pós-Graduação",
    icon: Award,
    courses: 32,
    color: "bg-green-500",
    slug: "pos-graduacao"
  },
  {
    id: 4,
    name: "Formação Livre",
    icon: Library,
    courses: 15,
    color: "bg-orange-500",
    slug: "formacao-livre"
  },
  {
    id: 5,
    name: "Capacitação Profissional",
    icon: Briefcase,
    courses: 22,
    color: "bg-red-500",
    slug: "capacitacao-profissional"
  }
];

const CategorySection = () => {
  return (
    <section className="eduzayn-section bg-gray-50">
      <div className="eduzayn-container">
        <h2 className="eduzayn-heading text-center">Categorias de Cursos</h2>
        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
          Explore nossas categorias de cursos e encontre a formação ideal para 
          impulsionar sua carreira acadêmica e profissional.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link key={category.id} to={`/cursos/${category.slug}`}>
              <Card className="border-none shadow-sm hover:shadow-md transition-shadow h-full">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className={`${category.color} text-white p-3 rounded-lg mb-4`}>
                    <category.icon className="h-6 w-6" />
                  </div>
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
