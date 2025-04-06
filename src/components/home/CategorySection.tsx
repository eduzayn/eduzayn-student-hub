
import React from "react";
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

// Categorias atualizadas incluindo número de cursos de pós-graduação
const categories = [
  {
    id: 1,
    name: "Graduação",
    icon: GraduationCap,
    courses: 74, 
    color: "bg-blue-500",
    slug: "graduacao",
    description: "Bacharelados, Licenciaturas e Tecnológicos"
  },
  {
    id: 2,
    name: "Segunda Licenciatura",
    icon: BookOpen,
    courses: 31, 
    color: "bg-purple-500",
    slug: "segunda-licenciatura",
    description: "Segunda Licenciatura para Licenciados"
  },
  {
    id: 3,
    name: "Segunda Graduação Bacharelado",
    icon: BookmarkCheck,
    courses: 7,
    color: "bg-indigo-500",
    slug: "segunda-graduacao-bacharelado",
    description: "Exclusivo para quem já possui diploma de bacharel"
  },
  {
    id: 4,
    name: "Pós-Graduação",
    icon: Award,
    courses: 88,
    color: "bg-green-500",
    slug: "pos-graduacao",
    description: "Especialização nas áreas educacional e saúde mental"
  },
  {
    id: 5,
    name: "Formação Livre",
    icon: Library,
    courses: 15,
    color: "bg-orange-500",
    slug: "formacao-livre"
  },
  {
    id: 6,
    name: "Capacitação Profissional",
    icon: Briefcase,
    courses: 22,
    color: "bg-red-500",
    slug: "capacitacao-profissional"
  },
  {
    id: 7,
    name: "Formação Pedagógica",
    icon: School,
    courses: 13,
    color: "bg-teal-500",
    slug: "formacao-pedagogica",
    description: "Exclusivo para bacharéis e tecnólogos"
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
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
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
