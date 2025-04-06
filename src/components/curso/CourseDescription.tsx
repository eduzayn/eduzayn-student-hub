
import React from "react";
import { CheckCircle2, FileText } from "lucide-react";
import { Course, CourseWithCurriculum } from "@/data/mockCourses";

interface CourseDescriptionProps {
  curso: Course;
}

const CourseDescription: React.FC<CourseDescriptionProps> = ({ curso }) => {
  // Verifica se o curso possui currículo
  const hasCurriculum = 'curriculum' in curso;
  // Verifica se o curso possui ementa
  const hasEmenta = 'ementa' in curso;

  return (
    <div className="border-t border-gray-100 pt-6 p-6">
      <h2 className="text-xl font-semibold mb-4">Descrição do Curso</h2>
      <p className="text-gray-600 mb-6">{curso.description}</p>
      
      {/* Exibir grade curricular se existir */}
      {hasCurriculum && (
        <>
          <h2 className="text-xl font-semibold mb-4">Grade Curricular</h2>
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-center text-lg font-medium mb-4 bg-blue-50 py-2 rounded">
              DETALHAMENTO DA CARGA HORÁRIA
            </h3>
            <ul className="space-y-2">
              {(curso as CourseWithCurriculum).curriculum.map((item, index) => (
                <li key={index} className="flex justify-between py-1 border-b border-gray-100">
                  <span>{item.module}</span>
                  <span className="font-medium">{item.hours}h</span>
                </li>
              ))}
              {(curso as CourseWithCurriculum).totalHours && (
                <li className="flex justify-between py-3 mt-3 border-t-2 border-gray-200 font-bold">
                  <span>CARGA HORÁRIA TOTAL:</span>
                  <span>{(curso as CourseWithCurriculum).totalHours}</span>
                </li>
              )}
            </ul>
          </div>
        </>
      )}
      
      {/* Ementa resumida se não tiver curriculum detalhado */}
      {hasEmenta && (
        <>
          <h2 className="text-xl font-semibold mb-4">Ementa Resumida</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
            {curso.ementa.map((item, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      
      <h2 className="text-xl font-semibold mb-4">Pré-requisitos</h2>
      <ul className="space-y-2 mb-6">
        {curso.requirements.map((item, index) => (
          <li key={index} className="flex items-start">
            <FileText className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      
      <h2 className="text-xl font-semibold mb-4">Benefícios</h2>
      <div className="bg-gray-50 rounded-lg p-4">
        <ul className="space-y-2">
          {curso.benefits.map((item, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseDescription;
