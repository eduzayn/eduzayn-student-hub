
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, RefreshCw, Users, Book } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

const SincronizacaoLearnWorlds: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sincronização com LearnWorlds</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate("/admin/matriculas")}>
            Voltar
          </Button>
        </div>
      </div>
      
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Atenção</AlertTitle>
        <AlertDescription>
          Este módulo permite sincronizar dados entre o sistema e a plataforma LearnWorlds. 
          Selecione abaixo o que deseja sincronizar.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="options">
        <TabsList>
          <TabsTrigger value="options">Opções de Sincronização</TabsTrigger>
        </TabsList>
        
        <TabsContent value="options">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Sincronizar Alunos
                </CardTitle>
                <CardDescription>
                  Sincronize dados dos alunos entre o LearnWorlds e o sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Esta opção irá importar todos os alunos cadastrados no LearnWorlds 
                  para o sistema, atualizando os já existentes e criando novos registros.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => navigate("/admin/matriculas/sincronizacao/alunos")}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sincronizar Alunos
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Sincronizar Cursos
                </CardTitle>
                <CardDescription>
                  Sincronize os cursos e conteúdos entre o LearnWorlds e o sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Esta opção irá importar todos os cursos cadastrados no LearnWorlds 
                  para o sistema, atualizando os já existentes e criando novos registros.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => navigate("/admin/matriculas/sincronizacao/cursos")}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sincronizar Cursos
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SincronizacaoLearnWorlds;
