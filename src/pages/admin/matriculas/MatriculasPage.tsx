
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Plus, FileText, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const MatriculasPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("visao-geral");
  const navigate = useNavigate();

  // Funções para navegar para outras páginas
  const irParaNovaMatricula = () => navigate("/admin/matriculas/nova");
  const irParaCursos = () => navigate("/admin/matriculas/cursos");
  const irParaAlunos = () => navigate("/admin/matriculas/alunos");
  const irParaConfiguracoes = () => navigate("/admin/matriculas/configuracoes");

  // Função para lidar com botões ainda não implementados
  const handleConfigurarClick = (tipo: string) => {
    if (tipo === "LearnWorlds" || tipo === "e-mail" || tipo === "gerais") {
      navigate("/admin/matriculas/configuracoes");
    } else {
      toast.info(`Configurações de ${tipo} serão implementadas em breve`, {
        duration: 3000,
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Módulo de Matrículas</h1>
          <p className="text-muted-foreground">
            Gerenciamento de matrículas, alunos e cursos
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button onClick={irParaNovaMatricula}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Matrícula
          </Button>
        </div>
      </div>
      
      <Alert variant="warning" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Integração em Desenvolvimento</AlertTitle>
        <AlertDescription>
          O módulo de matrículas está sendo reformulado. A integração com o LearnWorlds está em desenvolvimento.
        </AlertDescription>
      </Alert>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="recursos">Recursos</TabsTrigger>
          <TabsTrigger value="configuracao">Configuração</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visao-geral">
          <Card>
            <CardHeader>
              <CardTitle>Módulo de Matrículas - Nova Versão</CardTitle>
              <CardDescription>
                O sistema de matrículas está sendo redesenhado para uma melhor experiência.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Estamos trabalhando em uma nova versão mais robusta e confiável 
                para o gerenciamento de matrículas. Em breve, novas funcionalidades 
                estarão disponíveis.
              </p>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
                <p className="text-blue-800 font-medium">Nota de desenvolvimento</p>
                <p className="text-blue-600 text-sm">
                  Aguarde as próximas atualizações para ter acesso a todas as funcionalidades.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recursos">
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
        </TabsContent>
        
        <TabsContent value="configuracao">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Módulo</CardTitle>
              <CardDescription>
                Personalize o módulo de matrículas de acordo com suas necessidades.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">Integração com LearnWorlds</p>
                    <p className="text-sm text-muted-foreground">Configurações da integração com LearnWorlds</p>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => handleConfigurarClick("LearnWorlds")}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configurar
                  </Button>
                </div>
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">Temas de E-mail</p>
                    <p className="text-sm text-muted-foreground">Configurações de temas para e-mails de matrícula</p>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => handleConfigurarClick("e-mail")}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configurar
                  </Button>
                </div>
                
                <div className="flex items-center justify-between pb-4">
                  <div>
                    <p className="font-medium">Configurações Gerais</p>
                    <p className="text-sm text-muted-foreground">Ajustes gerais do módulo de matrículas</p>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => handleConfigurarClick("gerais")}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configurar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MatriculasPage;
