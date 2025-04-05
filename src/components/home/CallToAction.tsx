
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="eduzayn-section bg-primary relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/5"></div>
        <div className="absolute bottom-10 right-20 w-32 h-32 rounded-full bg-white/5"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-accent/20"></div>
      </div>
      
      <div className="eduzayn-container relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur rounded-full mb-6">
            <Sparkles className="h-4 w-4 mr-2 text-yellow-300" />
            <span className="text-sm font-medium">Comece sua jornada de aprendizado hoje</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para transformar seu futuro com educação de qualidade?
          </h2>
          
          <p className="text-white/80 text-lg mb-8">
            A EduZayn oferece cursos que abrem portas para novas oportunidades profissionais. 
            Matricule-se agora e dê o próximo passo na sua carreira!
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 text-base">
              <Link to="/cursos">
                Explorar Cursos
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-base">
              <Link to="/contato" className="flex items-center">
                Fale com um Consultor <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
