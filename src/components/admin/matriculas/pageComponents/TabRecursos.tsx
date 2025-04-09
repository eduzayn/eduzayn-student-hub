
import React from "react";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { BookOpen, FileText, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TabRecursos: React.FC = () => {
  const navigate = useNavigate();
  
  const irParaCursos = () => navigate("/admin/matriculas/cursos");
  const irParaAlunos = () => navigate("/admin/matriculas/alunos");
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={irParaAlunos}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <svg className="h-5 w-5 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Alunos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Gerenciar alunos e informações de contato
          </p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={irParaCursos}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <svg className="h-5 w-5 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Cursos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Visualizar e gerenciar cursos disponíveis
          </p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            Contratos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Modelos e gestão de contratos
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TabRecursos;
