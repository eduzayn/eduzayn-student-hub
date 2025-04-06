
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, Clock, Lock, BookOpen, ChevronRight, Circle as CircleIcon } from "lucide-react";
import type { RotaAprendizagemType, ModuloAprendizagemType, SubmoduloAprendizagemType } from "@/types/aprendizagem";

interface RotaMapaProps {
  rotaAprendizagem: RotaAprendizagemType;
  userId: string;
}

const RotaMapa: React.FC<RotaMapaProps> = ({ rotaAprendizagem, userId }) => {
  // Função para renderizar o status do módulo
  const renderModuloStatus = (modulo: ModuloAprendizagemType | SubmoduloAprendizagemType) => {
    if (modulo.concluido) {
      return <Badge variant="outline" className="bg-green-500 text-white border-green-500">Concluído</Badge>;
    } else if (modulo.emAndamento) {
      return <Badge variant="outline" className="bg-blue-500 text-white border-blue-500">Em Andamento</Badge>;
    } else if (modulo.bloqueado) {
      return <Badge variant="secondary" className="bg-gray-400">Bloqueado</Badge>;
    } else {
      return <Badge variant="outline">Não Iniciado</Badge>;
    }
  };

  // Função para renderizar o ícone do status do módulo
  const renderModuloIcon = (modulo: ModuloAprendizagemType) => {
    if (modulo.concluido) {
      return <CheckCircle className="h-8 w-8 text-green-500" />;
    } else if (modulo.emAndamento) {
      return <Clock className="h-8 w-8 text-blue-500" />;
    } else if (modulo.bloqueado) {
      return <Lock className="h-8 w-8 text-gray-400" />;
    } else {
      return <BookOpen className="h-8 w-8 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Mapa de Aprendizagem: {rotaAprendizagem.titulo}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">{rotaAprendizagem.descricao}</p>
          
          <div className="relative mt-8">
            {/* Linha conectando os módulos */}
            <div className="absolute top-14 left-6 h-full w-1 bg-gray-200"></div>
            
            {/* Lista de módulos */}
            <div className="space-y-8 relative">
              {rotaAprendizagem.modulos.map((modulo, index) => (
                <div key={modulo.id} className="flex">
                  {/* Ícone do status */}
                  <div className="relative z-10 mr-6 flex-shrink-0">
                    {renderModuloIcon(modulo)}
                  </div>
                  
                  {/* Conteúdo do módulo */}
                  <Card className={`flex-grow ${modulo.bloqueado ? 'opacity-75' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-medium">{modulo.titulo}</h3>
                        {renderModuloStatus(modulo)}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">{modulo.descricao}</p>
                      
                      {/* Informações sobre o curso associado */}
                      {modulo.curso && (
                        <div className="flex items-center justify-between bg-muted rounded-lg p-3">
                          <div className="flex items-center">
                            <img 
                              src={modulo.curso.thumbnail || "https://via.placeholder.com/40"} 
                              alt={modulo.curso.title} 
                              className="w-10 h-10 rounded object-cover mr-3"
                            />
                            <div>
                              <span className="block text-sm font-medium">{modulo.curso.title}</span>
                              <span className="block text-xs text-muted-foreground">
                                {modulo.curso.lessions} aulas • {modulo.curso.progress}% concluído
                              </span>
                            </div>
                          </div>
                          
                          <Button 
                            variant={modulo.bloqueado ? "ghost" : "default"} 
                            size="sm"
                            disabled={modulo.bloqueado}
                            asChild
                          >
                            {modulo.bloqueado ? (
                              <span className="flex items-center">
                                <Lock className="h-4 w-4 mr-1" /> Bloqueado
                              </span>
                            ) : (
                              <Link to={`/dashboard/cursos/${modulo.curso.id}`} className="flex items-center">
                                Acessar <ChevronRight className="h-4 w-4 ml-1" />
                              </Link>
                            )}
                          </Button>
                        </div>
                      )}
                      
                      {/* Exibir submódulos se houver */}
                      {modulo.submodulos && modulo.submodulos.length > 0 && (
                        <div className="mt-4 space-y-3">
                          <h4 className="text-sm font-medium">Etapas:</h4>
                          <div className="grid gap-2">
                            {modulo.submodulos.map((submodulo) => (
                              <div 
                                key={submodulo.id}
                                className="flex items-center justify-between border rounded-md p-2"
                              >
                                <div className="flex items-center">
                                  {submodulo.concluido ? 
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> : 
                                    <CircleIcon className="h-4 w-4 text-gray-300 mr-2" />
                                  }
                                  <span className="text-sm">{submodulo.titulo}</span>
                                </div>
                                {renderModuloStatus(submodulo)}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
              
              {/* Marcador final */}
              <div className="flex">
                <div className="relative z-10 mr-6 flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium">Jornada Concluída</h3>
                  <p className="text-sm text-muted-foreground">
                    Parabéns por completar sua rota de aprendizagem!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RotaMapa;
