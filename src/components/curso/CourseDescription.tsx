
import React from "react";
import { Loader2 } from "lucide-react";

export interface CourseDescriptionProps {
  description?: string;
  loading?: boolean;
}

const CourseDescription: React.FC<CourseDescriptionProps> = ({ description, loading }) => {
  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-medium mb-3">Descrição do curso</h2>
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Carregando descrição...</span>
        </div>
      </div>
    );
  }

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
