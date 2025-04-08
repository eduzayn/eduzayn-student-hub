
import React from "react";
import { AlertCircle } from "lucide-react";

interface ApiErrorDisplayProps {
  error: string | null;
}

const ApiErrorDisplay: React.FC<ApiErrorDisplayProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <div className="bg-destructive/10 p-3 rounded-md flex items-center gap-2 text-sm">
      <AlertCircle className="h-4 w-4 text-destructive" />
      <span>Erro ao buscar cursos: {error}</span>
    </div>
  );
};

export default ApiErrorDisplay;
