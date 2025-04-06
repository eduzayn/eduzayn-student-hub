
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AtendentesIcon } from "./AtendentesIcon";
import { AtendenteSkeleton } from "./AtendenteSkeleton";
import { AtendentesNenhum } from "./AtendentesNenhum";
import { AtendenteBadge } from "./AtendenteBadge";
import { AtendentesOffline } from "./AtendentesOffline";
import { AtendentesOnline as AtendentesOnlineType } from "./AtendentesOnlineGroup";
import { AtendentesStats } from "./AtendentesStats";
import { AtendenteBadgeSkeleton } from "./AtendenteBadgeSkeleton";

export const AtendentesOnline: React.FC = () => {
  const [atendentes, setAtendentes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAtendentes = async () => {
      // Simulando uma chamada à API
      setTimeout(() => {
        setAtendentes([
          { id: "1", nome: "Carlos Silva", setor: "secretaria", disponivel: true, ultimoStatus: "1 min atrás" },
          { id: "2", nome: "Ana Souza", setor: "tutoria", disponivel: true, ultimoStatus: "Agora" },
          { id: "3", nome: "Roberto Lima", setor: "financeiro", disponivel: true, ultimoStatus: "5 min atrás" },
          { id: "4", nome: "Maria Oliveira", setor: "suporte", disponivel: true, ultimoStatus: "Agora" },
          { id: "5", nome: "Juliana Santos", setor: "secretaria", disponivel: false, ultimoStatus: "30 min atrás" }
        ]);
        setLoading(false);
      }, 1000);
    };

    fetchAtendentes();
  }, []);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Atendentes Online</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <div className="flex space-x-2 py-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <div className="flex space-x-2 py-2">
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <div className="flex space-x-2 py-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Secretaria</h4>
              <div className="flex flex-wrap gap-2">
                {atendentes
                  .filter(a => a.setor === "secretaria" && a.disponivel)
                  .map(atendente => (
                    <Badge 
                      key={atendente.id}
                      variant="outline" 
                      className="bg-green-50 text-green-600 border-green-200 flex items-center gap-1"
                    >
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      {atendente.nome}
                    </Badge>
                  ))}
                {atendentes.filter(a => a.setor === "secretaria" && a.disponivel).length === 0 && (
                  <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                    Nenhum atendente disponível
                  </Badge>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Tutoria</h4>
              <div className="flex flex-wrap gap-2">
                {atendentes
                  .filter(a => a.setor === "tutoria" && a.disponivel)
                  .map(atendente => (
                    <Badge 
                      key={atendente.id}
                      variant="outline" 
                      className="bg-purple-50 text-purple-600 border-purple-200 flex items-center gap-1"
                    >
                      <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                      {atendente.nome}
                    </Badge>
                  ))}
                {atendentes.filter(a => a.setor === "tutoria" && a.disponivel).length === 0 && (
                  <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                    Nenhum atendente disponível
                  </Badge>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Financeiro</h4>
              <div className="flex flex-wrap gap-2">
                {atendentes
                  .filter(a => a.setor === "financeiro" && a.disponivel)
                  .map(atendente => (
                    <Badge 
                      key={atendente.id}
                      variant="outline" 
                      className="bg-emerald-50 text-emerald-600 border-emerald-200 flex items-center gap-1"
                    >
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      {atendente.nome}
                    </Badge>
                  ))}
                {atendentes.filter(a => a.setor === "financeiro" && a.disponivel).length === 0 && (
                  <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                    Nenhum atendente disponível
                  </Badge>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Suporte</h4>
              <div className="flex flex-wrap gap-2">
                {atendentes
                  .filter(a => a.setor === "suporte" && a.disponivel)
                  .map(atendente => (
                    <Badge 
                      key={atendente.id}
                      variant="outline" 
                      className="bg-blue-50 text-blue-600 border-blue-200 flex items-center gap-1"
                    >
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      {atendente.nome}
                    </Badge>
                  ))}
                {atendentes.filter(a => a.setor === "suporte" && a.disponivel).length === 0 && (
                  <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                    Nenhum atendente disponível
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                Tempo médio de resposta: <strong>15 minutos</strong>
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
