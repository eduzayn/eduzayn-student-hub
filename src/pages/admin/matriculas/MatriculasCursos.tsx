
import React from "react";
import MatriculasLayout from "@/components/layout/MatriculasLayout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ExternalLink, 
  ChevronLeft,
  BookOpen
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CursosList from "@/components/admin/matriculas/cursos/CursosList";
import CursosDetalhes from "@/components/admin/matriculas/cursos/CursosDetalhes";
import { useNavigate } from "react-router-dom";
import useLearnWorldsApi from "@/hooks/useLearnWorldsApi";

const MatriculasCursos: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("lista");
  const [selectedCursoId, setSelectedCursoId] = useState<string | null>(null);
  const { loading, offlineMode } = useLearnWorldsApi();
  const navigate = useNavigate();

  const handleCursoSelect = (cursoId: string) => {
    setSelectedCursoId(cursoId);
    setActiveTab("detalhes");
  };

  const handleVoltar = () => {
    setActiveTab("lista");
    setSelectedCursoId(null);
  };

  return (
    <MatriculasLayout>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Cursos Disponíveis</h1>
          {offlineMode && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
              Modo Offline
            </Badge>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-[400px]">
            <TabsTrigger value="lista">Lista de Cursos</TabsTrigger>
            <TabsTrigger value="detalhes" disabled={!selectedCursoId}>Detalhes do Curso</TabsTrigger>
            <TabsTrigger value="sincronizacao">Sincronização</TabsTrigger>
          </TabsList>

          <TabsContent value="lista" className="pt-4">
            <CursosList onCursoSelect={handleCursoSelect} />
          </TabsContent>

          <TabsContent value="detalhes" className="pt-4">
            {selectedCursoId ? (
              <>
                <Button variant="outline" onClick={handleVoltar} className="mb-4">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Voltar para Lista
                </Button>
                <CursosDetalhes cursoId={selectedCursoId} />
              </>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">
                    Selecione um curso para ver os detalhes.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="sincronizacao" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Sincronização com LearnWorlds</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Sincronize os cursos da plataforma LearnWorlds com o sistema de matrículas.
                </p>
                <div className="flex items-center space-x-4">
                  <Button onClick={() => {
                    navigate("/admin/matriculas/sincronizacao/cursos");
                  }}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Sincronizar Cursos
                  </Button>
                  <Button variant="outline" onClick={() => {
                    navigate("/admin/matriculas/sincronizacao");
                  }}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Painel de Sincronização
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MatriculasLayout>
  );
};

export default MatriculasCursos;
