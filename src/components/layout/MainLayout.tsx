
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import BreadcrumbNav from "../navigation/Breadcrumbs";

const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  // Verifica se estamos em uma página de detalhes de curso para evitar duplicação
  const isDetailPage = location.pathname.includes('/curso/');
  
  return (
    <div className="flex flex-col min-h-screen">
      {!isDetailPage && <NavBar />}
      {!isDetailPage && <BreadcrumbNav />}
      <main className="flex-grow">
        {children || <Outlet />}
      </main>
      {!isDetailPage && <Footer />}
    </div>
  );
};

export default MainLayout;
