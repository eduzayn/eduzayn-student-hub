
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Award, BookOpen, Clock, DollarSign, Laptop, Users } from "lucide-react";

interface CourseEnrollCardProps {
  id: number | string;
  price: string;
  modalidade: string;
  duration: string;
}

const CourseEnrollCard: React.FC<CourseEnrollCardProps> = ({ 
  id, 
  price, 
  modalidade, 
  duration 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
      <div className="mb-6">
        <div className="text-xl font-semibold mb-4">Investimento:</div>
        <div className="p-4 bg-blue-50 rounded-lg mb-4">
          <div className="flex items-center mb-2">
            <DollarSign className="h-5 w-5 mr-2 text-primary" />
            <span className="font-medium">Matrícula de {price}</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-primary" />
            <span className="font-medium">Mensalidades a partir de {price}</span>
          </div>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg mb-4">
          <div className="flex items-center mb-2">
            <Laptop className="h-5 w-5 mr-2 text-primary" />
            <span className="font-medium">Modalidade: {modalidade}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-primary" />
            <span className="font-medium">Duração: {duration}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-center">
          <Users className="h-5 w-5 mr-3 text-primary" />
          <span>Vagas limitadas</span>
        </div>
        <div className="flex items-center">
          <BookOpen className="h-5 w-5 mr-3 text-primary" />
          <span>Material didático incluso</span>
        </div>
        <div className="flex items-center">
          <Award className="h-5 w-5 mr-3 text-primary" />
          <span>Certificado reconhecido</span>
        </div>
      </div>
      
      <Button 
        asChild 
        className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg py-6"
      >
        <Link to={`/matricula/checkout/${id}`}>
          Matricule-se Agora
        </Link>
      </Button>
      
      <div className="mt-4 text-center">
        <Link to="/contato" className="text-primary hover:underline">
          Precisa de ajuda? Fale com um consultor
        </Link>
      </div>
    </div>
  );
};

export default CourseEnrollCard;
