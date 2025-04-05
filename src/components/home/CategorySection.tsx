
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Briefcase, 
  Code, 
  LineChart, 
  PenTool, 
  BookOpen, 
  Headphones, 
  Heart, 
  ShoppingBag 
} from "lucide-react";

// Mock category data
const categories = [
  {
    id: 1,
    name: "Administração",
    icon: Briefcase,
    courses: 24,
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Tecnologia",
    icon: Code,
    courses: 38,
    color: "bg-purple-500",
  },
  {
    id: 3,
    name: "Negócios",
    icon: LineChart,
    courses: 19,
    color: "bg-green-500",
  },
  {
    id: 4,
    name: "Design",
    icon: PenTool,
    courses: 15,
    color: "bg-orange-500",
  },
  {
    id: 5,
    name: "Educação",
    icon: BookOpen,
    courses: 22,
    color: "bg-red-500",
  },
  {
    id: 6,
    name: "Marketing",
    icon: ShoppingBag,
    courses: 17,
    color: "bg-indigo-500",
  },
  {
    id: 7,
    name: "Música",
    icon: Headphones,
    courses: 8,
    color: "bg-yellow-500",
  },
  {
    id: 8,
    name: "Saúde",
    icon: Heart,
    courses: 12,
    color: "bg-pink-500",
  },
];

const CategorySection = () => {
  return (
    <section className="eduzayn-section bg-gray-50">
      <div className="eduzayn-container">
        <h2 className="eduzayn-heading text-center">Categorias de Cursos</h2>
        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
          Explore nossa ampla variedade de categorias e encontre o curso perfeito 
          para impulsionar seu desenvolvimento pessoal e profissional.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link key={category.id} to={`/cursos?categoria=${category.id}`}>
              <Card className="border-none shadow-sm hover:shadow-md transition-shadow h-full">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className={`${category.color} text-white p-3 rounded-lg mb-4`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.courses} cursos</p>
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
