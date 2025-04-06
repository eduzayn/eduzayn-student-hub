
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, Clock, BarChart, Award, ChevronRight } from "lucide-react";
import type { RotaAprendizagemType } from "@/types/aprendizagem";

interface RotaProgressoProps {
  rotaAprendizagem: RotaAprendizagemType;
  userId: string;
}

const RotaProgresso: React.FC<RotaProgressoProps> = ({ rotaAprendizagem, userId }) => {
  // Cálculo do progresso geral
  const progressoGeral = rotaAprendizagem.progresso;
  
  // Cálculo de módulos concluídos
  const modulosConcluidos = rotaAprendizagem.modulos.filter(m => m.concluido).length;
  const totalModulos = rotaAprendizagem.modulos.length;
  
  // Verificar se existem certificados disponíveis
  const certificadosDisponiveis = rotaAprendizagem.certificados?.length > 0;

  return (
    <div className="space-y-6">
      {/* Card de Progresso Geral */}
      <Card>
        <CardHeader>
          <CardTitle>Seu Progresso Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progresso Total</span>
                <span className="text-sm font-bold">{progressoGeral}%</span>
              </div>
              <Progress value={progressoGeral} className="h-2.5" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Concluídos</span>
                </div>
                <p className="text-2xl font-bold">{modulosConcluidos} <span className="text-sm text-muted-foreground">de {totalModulos}</span></p>
              </div>
              
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Em Andamento</span>
                </div>
                <p className="text-2xl font-bold">{rotaAprendizagem.modulos.filter(m => m.emAndamento).length}</p>
              </div>
              
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-1">
                  <BarChart className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-medium">Tempo Estimado</span>
                </div>
                <p className="text-2xl font-bold">{rotaAprendizagem.tempoEstimado || "N/A"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Próximo Módulo Recomendado */}
      {rotaAprendizagem.moduloRecomendado && (
        <Card className="border-l-4 border-primary">
          <CardHeader>
            <CardTitle>Próximo Módulo Recomendado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium mb-1">{rotaAprendizagem.moduloRecomendado.titulo}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {rotaAprendizagem.moduloRecomendado.descricao}
                </p>
                {rotaAprendizagem.moduloRecomendado.curso && (
                  <div className="flex items-center">
                    <img 
                      src={rotaAprendizagem.moduloRecomendado.curso.thumbnail || "https://via.placeholder.com/40"} 
                      alt={rotaAprendizagem.moduloRecomendado.curso.title} 
                      className="w-8 h-8 rounded object-cover mr-2"
                    />
                    <span className="text-sm">{rotaAprendizagem.moduloRecomendado.curso.title}</span>
                  </div>
                )}
              </div>
              
              {rotaAprendizagem.moduloRecomendado.curso && (
                <Button asChild>
                  <Link to={`/dashboard/cursos/${rotaAprendizagem.moduloRecomendado.curso.id}`} className="flex items-center">
                    Continuar <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Certificados Disponíveis */}
      {certificadosDisponiveis && (
        <Card>
          <CardHeader>
            <CardTitle>Certificados Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rotaAprendizagem.certificados?.map((certificado) => (
                <div 
                  key={certificado.id}
                  className="flex items-center justify-between border rounded-lg p-4"
                >
                  <div className="flex items-center">
                    <div className="bg-amber-100 p-2 rounded-full mr-4">
                      <Award className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{certificado.titulo}</h4>
                      <p className="text-sm text-muted-foreground">{certificado.descricao}</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant={certificado.disponivel ? "default" : "outline"}
                    disabled={!certificado.disponivel}
                  >
                    {certificado.disponivel ? 'Emitir Certificado' : 'Indisponível'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RotaProgresso;
