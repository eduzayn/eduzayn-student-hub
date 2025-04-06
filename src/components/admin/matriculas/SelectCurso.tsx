
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Search, CheckCircle, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface SelectCursoProps {
  onCursoSelecionado: (curso: any) => void;
}

const SelectCurso: React.FC<SelectCursoProps> = ({ onCursoSelecionado }) => {
  const [busca, setBusca] = useState("");
  const [cursos, setCursos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  
  useEffect(() => {
    carregarCursos();
  }, []);
  
  const carregarCursos = async (termoBusca = "") => {
    setLoading(true);
    
    try {
      // Simular carregamento de cursos do banco de dados
      // No futuro, substituir por chamada real ao Supabase
      setTimeout(() => {
        const dadosSimulados = [
          {
            id: "c1",
            titulo: "Análise de Sistemas",
            codigo: "AS-2023",
            modalidade: "EAD",
            carga_horaria: 360,
            valor_total: 3600.00,
            valor_mensalidade: 300.00
          },
          {
            id: "c2",
            titulo: "Engenharia de Software",
            codigo: "ES-2023",
            modalidade: "EAD",
            carga_horaria: 420,
            valor_total: 5400.00,
            valor_mensalidade: 450.00
          },
          {
            id: "c3",
            titulo: "Ciência da Computação",
            codigo: "CC-2023",
            modalidade: "EAD",
            carga_horaria: 480,
            valor_total: 6000.00,
            valor_mensalidade: 500.00
          }
        ];
        
        // Filtragem pela busca (se houver)
        const filtrados = termoBusca ? 
          dadosSimulados.filter(c => 
            c.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
            c.codigo.toLowerCase().includes(termoBusca.toLowerCase())
          ) : dadosSimulados;
        
        setCursos(filtrados);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
      toast.error("Erro ao carregar a lista de cursos");
      setLoading(false);
    }
  };
  
  const handleBusca = () => {
    carregarCursos(busca);
  };
  
  const handleSelecionar = (curso: any) => {
    setSelecionado(curso.id);
    onCursoSelecionado(curso);
  };

  // Formato de moeda brasileira
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
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
        <Button onClick={handleBusca}>Buscar</Button>
      </div>
      
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
                        </div>
                        
                        <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                          <span>{curso.modalidade}</span>
                          <span>{curso.carga_horaria}h</span>
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
