
import React from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import MatriculasSidebar from "./MatriculasSidebar";
import MatriculasHeader from "./MatriculasHeader";
import MatriculasBreadcrumb from "@/components/admin/matriculas/MatriculasBreadcrumb";

const MatriculasLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  
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
