
import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorAlertProps {
  error: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => {
  return (
    <div className="bg-destructive/10 p-3 rounded-md flex items-center gap-2 text-sm">
      <AlertCircle className="h-4 w-4 text-destructive" />
      <span>Erro ao buscar alunos: {error}</span>
    </div>
  );
};

export default ErrorAlert;
