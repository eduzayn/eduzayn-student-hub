
import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Sistema de Gestão Educacional</h1>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto py-6 px-4">
        <Outlet />
      </main>
      
      <footer className="bg-gray-100 p-4 text-center text-sm text-gray-600">
        <div className="container mx-auto">
          © {new Date().getFullYear()} Sistema de Gestão Educacional
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
