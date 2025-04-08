
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import MatriculasSidebar from "./MatriculasSidebar";
import MatriculasHeader from "./MatriculasHeader";
import MatriculasBreadcrumb from "@/components/admin/matriculas/MatriculasBreadcrumb";

const MatriculasLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  
  // Efeito para prevenir tremulação da tela
  useEffect(() => {
    // Adiciona classe para prevenir mudanças de layout que causam tremor
    document.body.classList.add("overflow-y-scroll");
    
    // Adiciona padding-right para compensar a barra de rolagem e evitar saltos
    document.body.style.paddingRight = "0px";
    document.body.style.overscrollBehavior = "none";
    
    return () => {
      // Remove as classes e estilos ao desmontar o componente
      document.body.classList.remove("overflow-y-scroll");
      document.body.style.paddingRight = "";
      document.body.style.overscrollBehavior = "";
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <MatriculasSidebar />
      
      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col">
        <MatriculasHeader />
        
        <div className="flex-1 p-4 overflow-auto">
          <MatriculasBreadcrumb />
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default MatriculasLayout;
