
import React from "react";
import { Clock, Laptop, Award } from "lucide-react";

interface CourseHeaderProps {
  title: string;
  duration: string;
  modalidade: string;
  certification: string;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ 
  title, 
  duration, 
  modalidade, 
  certification 
}) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center text-gray-600">
          <Clock className="h-5 w-5 mr-2 text-primary" />
          <span>Duração: {duration}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Laptop className="h-5 w-5 mr-2 text-primary" />
          <span>Modalidade: {modalidade}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Award className="h-5 w-5 mr-2 text-primary" />
          <span>Certificação: {certification}</span>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
