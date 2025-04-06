
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CursosAluno: React.FC = () => {
  const cursos = [
    {
      id: 1,
      titulo: "Desenvolvimento Web Frontend",
      codigo: "DEV-001",
      descricao: "Curso completo de HTML, CSS e JavaScript para desenvolvimento web frontend.",
      modalidade: "EAD",
      progresso: 45,
      ultimaAtividade: "1 dia atrás",
      imagen: "bg-gradient-to-r from-primary to-accent"
    },
    {
      id: 2,
      titulo: "Design de Interfaces",
      codigo: "DES-023",
      descricao: "Aprenda a criar interfaces modernas e acessíveis para aplicações web e mobile.",
      modalidade: "Híbrido",
      progresso: 78,
      ultimaAtividade: "Hoje",
      imagen: "bg-gradient-to-r from-blue-600 to-purple-600"
    },
    {
      id: 3,
      titulo: "Marketing Digital",
      codigo: "MKT-104",
      descricao: "Estratégias avançadas de marketing para promover seu negócio online.",
      modalidade: "EAD",
      progresso: 23,
      ultimaAtividade: "3 dias atrás",
      imagen: "bg-gradient-to-r from-amber-500 to-orange-500"
    }
  ];
  
  const cursosConcluidos = [
    {
      id: 4,
      titulo: "Lógica de Programação",
      codigo: "LOG-001",
      descricao: "Fundamentos de lógica de programação para iniciantes na área de desenvolvimento.",
      modalidade: "EAD",
      dataFinalizacao: "10/03/2025",
      notaFinal: 9.5,
      imagen: "bg-gradient-to-r from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meus Cursos</h1>
        <p className="text-muted-foreground">
          Gerencie e acesse todos os seus cursos em um só lugar.
        </p>
      </div>
      
      <Tabs defaultValue="ativos" className="w-full">
        <TabsList>
          <TabsTrigger value="ativos">Cursos Ativos</TabsTrigger>
          <TabsTrigger value="concluidos">Cursos Concluídos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ativos" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {cursos.map((curso) => (
              <Card key={curso.id} className="overflow-hidden">
                <div className={`h-32 ${curso.imagen}`}></div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{curso.titulo}</CardTitle>
                      <span className="text-sm text-muted-foreground">Código: {curso.codigo}</span>
                    </div>
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {curso.modalidade}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{curso.descricao}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-medium">{curso.progresso}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${curso.progresso}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Última atividade: <span className="font-medium">{curso.ultimaAtividade}</span>
                    </p>
                    <button className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md font-medium">
                      Acessar Curso
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="concluidos" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {cursosConcluidos.map((curso) => (
              <Card key={curso.id} className="overflow-hidden">
                <div className={`h-32 ${curso.imagen}`}></div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{curso.titulo}</CardTitle>
                      <span className="text-sm text-muted-foreground">Código: {curso.codigo}</span>
                    </div>
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {curso.modalidade}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{curso.descricao}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Data de Conclusão</span>
                      <span className="text-sm font-medium">{curso.dataFinalizacao}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Nota Final</span>
                      <span className="text-sm font-medium">{curso.notaFinal}</span>
                    </div>
                    <div className="flex justify-between mt-6">
                      <button className="bg-muted hover:bg-muted/80 text-foreground py-2 px-4 rounded-md text-sm font-medium">
                        Ver Certificado
                      </button>
                      <button className="bg-muted hover:bg-muted/80 text-foreground py-2 px-4 rounded-md text-sm font-medium">
                        Detalhes
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CursosAluno;
