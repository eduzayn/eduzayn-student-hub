
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import BreadcrumbNav from "../navigation/Breadcrumbs";

const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  // Removendo a lógica que esconde o cabeçalho na página inicial
  // A página inicial deve sempre mostrar o cabeçalho
  const isDetailPage = location.pathname.includes('/curso/');
  
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      {!isDetailPage && <BreadcrumbNav />}
      <main className="flex-grow">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
