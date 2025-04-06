
import React from "react";

interface StatusMatriculaProps {
  status: string;
}

const StatusMatricula: React.FC<StatusMatriculaProps> = ({ status }) => {
  const getBadgeStyles = () => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'trancado':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'formado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'inativo':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getStatusLabel = () => {
    switch (status) {
      case 'ativo':
        return 'Ativo';
      case 'pendente':
        return 'Pendente';
      case 'trancado':
        return 'Trancado';
      case 'formado':
        return 'Formado';
      case 'inativo':
        return 'Inativo';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyles()}`}>
      {getStatusLabel()}
    </span>
  );
};

export default StatusMatricula;
