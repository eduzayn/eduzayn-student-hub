
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroBanner = () => {
  return (
    <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-16 md:py-24">
      <div className="eduzayn-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Transforme seu <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">futuro</span> com nossos cursos
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              A EduZayn oferece uma plataforma completa para sua jornada educacional. 
              Matricule-se, gerencie seus cursos e acompanhe sua evolução em um único lugar.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-base">
                <Link to="/cursos">Conheça Nossos Cursos</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base">
                <Link to="/quem-somos">Saiba Mais</Link>
              </Button>
            </div>
            
            <div className="mt-10 grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-primary">100+</div>
                <p className="text-gray-600 text-sm mt-1">Cursos disponíveis</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-accent">15k+</div>
                <p className="text-gray-600 text-sm mt-1">Alunos ativos</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-eduzayn-blue">98%</div>
                <p className="text-gray-600 text-sm mt-1">Satisfação</p>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 animate-fade-in">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-30"></div>
              <div className="relative bg-white p-6 rounded-2xl shadow-xl">
                <img 
                  src="/placeholder.svg" 
                  alt="Estudantes da EduZayn" 
                  className="w-full h-auto rounded-lg"
                />
                <div className="absolute -bottom-4 -right-4 bg-white rounded-full p-4 shadow-lg">
                  <div className="bg-gradient-to-r from-primary to-accent p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"></path>
                      <circle cx="17" cy="7" r="5"></circle>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
