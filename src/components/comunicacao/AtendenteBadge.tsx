
import React from "react";
import { Badge } from "@/components/ui/badge";

interface AtendenteBadgeProps {
  nome: string;
  setor: string;
}

export const AtendenteBadge: React.FC<AtendenteBadgeProps> = ({ nome, setor }) => {
  const getBadgeStyle = () => {
    switch (setor) {
      case "secretaria":
        return "bg-green-50 text-green-600 border-green-200";
      case "tutoria":
        return "bg-purple-50 text-purple-600 border-purple-200";
      case "financeiro":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "suporte":
        return "bg-blue-50 text-blue-600 border-blue-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={`${getBadgeStyle()} flex items-center gap-1`}
    >
      <span className="h-2 w-2 rounded-full bg-green-500"></span>
      {nome}
    </Badge>
  );
};
