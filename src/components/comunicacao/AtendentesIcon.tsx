
import React from "react";

export const AtendentesIcon: React.FC<{setor: string}> = ({ setor }) => {
  return <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
    {setor.charAt(0).toUpperCase()}
  </div>;
};
