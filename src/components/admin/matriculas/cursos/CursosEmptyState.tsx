
import React from "react";
import { BookOpen } from "lucide-react";

const CursosEmptyState: React.FC = () => {
  return (
    <div className="text-center py-8 text-gray-500">
      <BookOpen className="mx-auto h-12 w-12 opacity-20 mb-2" />
      <p>Nenhum curso encontrado</p>
    </div>
  );
};

export default CursosEmptyState;
