
import React from "react";
import { Outlet } from "react-router-dom";
import MatriculasSidebar from "./MatriculasSidebar";
import MatriculasHeader from "./MatriculasHeader";
import MatriculasBreadcrumb from "@/components/admin/matriculas/MatriculasBreadcrumb";
import { usePreventLayoutShift } from "@/hooks/usePreventLayoutShift";

/**
 * Componente para envolver o conteúdo principal do layout
 */
const MatriculasMainContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex-1 p-4 overflow-auto">
      <MatriculasBreadcrumb />
      {children || <Outlet />}
    </div>
  );
};

/**
 * Layout principal para o módulo de matrículas
 * Implementa a estrutura básica com sidebar e conteúdo
 */
const MatriculasLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  // Usa o hook personalizado para prevenir tremulação da tela
  usePreventLayoutShift();
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <MatriculasSidebar />
      
      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col">
        <MatriculasHeader />
        <MatriculasMainContent>
          {children}
        </MatriculasMainContent>
      </div>
    </div>
  );
};

export default MatriculasLayout;
