
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Search, CheckCircle, BookOpen, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import useLearnWorldsApi from "@/hooks/useLearnWorldsApi";
import { Badge } from "@/components/ui/badge";

interface SelectCursoProps {
  onCursoSelecionado: (curso: any) => void;
}

const SelectCurso: React.FC<SelectCursoProps> = ({ onCursoSelecionado }) => {
  const [busca, setBusca] = useState("");
  const [cursos, setCursos] = useState<any[]>([]);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const { getCourses, loading, error, offlineMode } = useLearnWorldsApi();
  
  useEffect(() => {
    carregarCursos();
  }, []);
  
  const carregarCursos = async (termoBusca = "") => {
    try {
      console.log("Iniciando busca de cursos com termo:", termoBusca);
      // Busca cursos da API LearnWorlds
      const resultado = await getCourses(1, 20, termoBusca);
      
      if (!resultado || !resultado.data) {
        throw new Error("Erro ao carregar cursos do LearnWorlds");
      }
      
      // Mapeando os dados retornados para o formato necessário para exibição
      const cursosFormatados = resultado.data.map((curso: any) => ({
        id: curso.id,
        titulo: curso.title,
        codigo: curso.id.substring(0, 8).toUpperCase(),
        modalidade: "EAD", // Assumindo que todos os cursos do LearnWorlds são EAD
        carga_horaria: obterCargaHorariaEmMinutos(curso.duration || ""),
        valor_total: curso.price_final || curso.price_original || 0,
        valor_mensalidade: (curso.price_final || curso.price_original || 0) / 12,
        descricao: curso.description || curso.shortDescription || "",
        imagem_url: curso.image || curso.courseImage || "",
        categorias: curso.categories || [],
        learning_worlds_id: curso.id,
        acesso: curso.access || "pago"
      }));
      
      console.log("Cursos formatados:", cursosFormatados);
      setCursos(cursosFormatados);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
      toast.error("Erro ao carregar a lista de cursos do LearnWorlds");
      
      // Em caso de falha, carrega dados simulados como fallback
      carregarCursosSimulados(termoBusca);
    }
  };
  
  // Função para converter duração em string para minutos
  const obterCargaHorariaEmMinutos = (duration: string): number => {
    if (!duration) return 0;
    
    try {
      // Se for apenas um número, assume que são horas
      if (/^\d+$/.test(duration)) {
        return parseInt(duration) * 60; // Converte horas para minutos
      }
      
      // Se for no formato "X horas" ou "X h"
      const hoursMatch = duration.match(/(\d+)\s*(horas|hora|h)/i);
      if (hoursMatch) {
        return parseInt(hoursMatch[1]) * 60;
      }
      
      // Se for no formato "X minutos" ou "X min"
      const minutesMatch = duration.match(/(\d+)\s*(minutos|minuto|min)/i);
      if (minutesMatch) {
        return parseInt(minutesMatch[1]);
      }
      
      return 0;
    } catch (error) {
      console.error("Erro ao converter duração:", error);
      return 0;
    }
  };
  
  // Função de fallback com dados simulados
  const carregarCursosSimulados = (termoBusca = "") => {
    const dadosSimulados = [
      {
        id: "c1",
        titulo: "Análise de Sistemas",
        codigo: "AS-2023",
        modalidade: "EAD",
        carga_horaria: 360,
        valor_total: 3600.00,
        valor_mensalidade: 300.00,
        learning_worlds_id: "lw12345"
      },
      {
        id: "c2",
        titulo: "Engenharia de Software",
        codigo: "ES-2023",
        modalidade: "EAD",
        carga_horaria: 420,
        valor_total: 5400.00,
        valor_mensalidade: 450.00,
        learning_worlds_id: "lw67890"
      },
      {
        id: "c3",
        titulo: "Ciência da Computação",
        codigo: "CC-2023",
        modalidade: "EAD",
        carga_horaria: 480,
        valor_total: 6000.00,
        valor_mensalidade: 500.00,
        learning_worlds_id: "lw24680"
      }
    ];
    
    // Filtragem pela busca (se houver)
    const filtrados = termoBusca ? 
      dadosSimulados.filter(c => 
        c.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
        c.codigo.toLowerCase().includes(termoBusca.toLowerCase())
      ) : dadosSimulados;
    
    setCursos(filtrados);
  };
  
  const handleBusca = () => {
    carregarCursos(busca);
  };
  
  const handleSelecionar = (curso: any) => {
    setSelecionado(curso.id);
    onCursoSelecionado({
      ...curso,
      // Garantindo que temos o ID do LearnWorlds
      learning_worlds_id: curso.learning_worlds_id || curso.id
    });
  };

  // Formato de moeda brasileira
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };
  
  // Formata carga horária para exibição
  const formatarCargaHoraria = (minutos: number) => {
    if (minutos < 60) return `${minutos}min`;
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    return minutosRestantes > 0 ? `${horas}h ${minutosRestantes}min` : `${horas}h`;
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Selecione o Curso</h2>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar por título ou código..."
            className="pl-9"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleBusca()}
          />
        </div>
        <Button onClick={handleBusca} disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </Button>
      </div>
      
      {error && (
        <div className="bg-destructive/10 p-3 rounded-md flex items-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <span>Erro ao buscar cursos: {error}</span>
        </div>
      )}
      
      <div className="mt-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-60" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {cursos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="mx-auto h-12 w-12 opacity-20 mb-2" />
                <p>Nenhum curso encontrado</p>
              </div>
            ) : (
              cursos.map(curso => (
                <Card 
                  key={curso.id} 
                  className={`cursor-pointer transition-colors ${selecionado === curso.id ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'}`}
                  onClick={() => handleSelecionar(curso)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex gap-3 items-center">
                          <p className="font-medium text-lg">{curso.titulo}</p>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                            {curso.codigo}
                          </span>
                          {curso.learning_worlds_id && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                              LearnWorlds
                            </Badge>
                          )}
                          {curso.acesso && (
                            <Badge 
                              variant="outline" 
                              className={`ml-1 ${
                                curso.acesso === 'free' || curso.acesso === 'gratis' || curso.acesso === 'livre' ? 
                                'bg-green-50 text-green-600 border-green-200' : 
                                curso.acesso === 'pago' ? 
                                'bg-amber-50 text-amber-600 border-amber-200' :
                                'bg-gray-50 text-gray-600 border-gray-200'
                              }`}
                            >
                              {curso.acesso === 'free' || curso.acesso === 'gratis' || curso.acesso === 'livre' ? 'Gratuito' :
                               curso.acesso === 'pago' ? 'Pago' : curso.acesso}
                            </Badge>
                          )}
                        </div>
                        
                        {curso.categorias && curso.categorias.length > 0 && (
                          <div className="flex gap-1 flex-wrap mt-1">
                            {curso.categorias.slice(0, 3).map((categoria: string, i: number) => (
                              <span key={i} className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                                {categoria}
                              </span>
                            ))}
                            {curso.categorias.length > 3 && (
                              <span className="text-xs text-gray-500">+{curso.categorias.length - 3}</span>
                            )}
                          </div>
                        )}
                        
                        <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                          <span>{curso.modalidade}</span>
                          <span>{formatarCargaHoraria(curso.carga_horaria)}</span>
                        </div>
                        
                        <div className="mt-2">
                          <span className="text-sm font-medium text-green-600">
                            Mensalidade: {formatarMoeda(curso.valor_mensalidade)}
                          </span>
                          <span className="text-sm text-muted-foreground ml-3">
                            Total: {formatarMoeda(curso.valor_total)}
                          </span>
                        </div>
                      </div>
                      
                      {selecionado === curso.id && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectCurso;
