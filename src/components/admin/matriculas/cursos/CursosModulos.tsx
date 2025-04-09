
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, ChevronDown, Video, FileText, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

interface CursosModulosProps {
  cursoId: string;
}

const CursosModulos: React.FC<CursosModulosProps> = ({ cursoId }) => {
  const [modulos, setModulos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const carregarModulos = async () => {
      setLoading(true);
      try {
        // Simulando carregamento de dados - substituir por chamada à API real
        setTimeout(() => {
          setModulos(modulosSimulados);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Erro ao carregar módulos:", error);
        setLoading(false);
      }
    };

    carregarModulos();
  }, [cursoId]);

  const toggleModulo = (id: string) => {
    setExpandidos(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getIconPorTipo = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'documento':
        return <FileText className="h-4 w-4" />;
      case 'quiz':
        return <ClipboardList className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Módulos e Aulas</CardTitle>
        </CardHeader>
        <CardContent>
          {modulos.length === 0 ? (
            <p className="text-muted-foreground">Este curso não possui módulos cadastrados.</p>
          ) : (
            <div className="space-y-4">
              {modulos.map((modulo) => (
                <div key={modulo.id} className="border rounded-md overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-4 bg-muted/50 cursor-pointer hover:bg-muted"
                    onClick={() => toggleModulo(modulo.id)}
                  >
                    <div className="font-medium">{modulo.titulo}</div>
                    <div>
                      {expandidos[modulo.id] ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                  <div className={cn(
                    "overflow-hidden transition-all", 
                    expandidos[modulo.id] ? "max-h-[1000px]" : "max-h-0"
                  )}>
                    <div className="p-4 space-y-2 border-t">
                      {modulo.aulas.map((aula: any) => (
                        <div key={aula.id} className="flex items-center p-2 hover:bg-muted/50 rounded-md">
                          {getIconPorTipo(aula.tipo)}
                          <span className="ml-2">{aula.titulo}</span>
                          <span className="ml-auto text-xs text-muted-foreground">
                            {aula.duracao} min
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Dados simulados para desenvolvimento
const modulosSimulados = [
  {
    id: 'mod-1',
    titulo: 'Módulo 1: Introdução ao Curso',
    ordem: 1,
    aulas: [
      { id: 'aula-1-1', titulo: 'Boas-vindas', tipo: 'video', duracao: 5 },
      { id: 'aula-1-2', titulo: 'Objetivos do curso', tipo: 'video', duracao: 8 },
      { id: 'aula-1-3', titulo: 'Material de apoio', tipo: 'documento', duracao: 0 },
    ]
  },
  {
    id: 'mod-2',
    titulo: 'Módulo 2: Conceitos Fundamentais',
    ordem: 2,
    aulas: [
      { id: 'aula-2-1', titulo: 'Teoria principal', tipo: 'video', duracao: 15 },
      { id: 'aula-2-2', titulo: 'Estudo de caso', tipo: 'video', duracao: 12 },
      { id: 'aula-2-3', titulo: 'Quiz de fixação', tipo: 'quiz', duracao: 10 },
    ]
  }
];

export default CursosModulos;
