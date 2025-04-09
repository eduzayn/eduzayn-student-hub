
import React from "react";

export interface CourseDescriptionProps {
  description?: string;
}

const CourseDescription: React.FC<CourseDescriptionProps> = ({ description }) => {
  return (
    <div className="p-6">
      <h2 className="text-lg font-medium mb-3">Descrição do curso</h2>
      <p className="text-gray-600">
        {description || "Este curso ainda não possui uma descrição detalhada."}
      </p>
    </div>
  );
};

export default CourseDescription;
