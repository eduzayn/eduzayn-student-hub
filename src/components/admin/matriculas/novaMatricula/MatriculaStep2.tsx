
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";

interface MatriculaStep2Props {
  onCursoSelecionado: (curso: any) => void;
  alunoSelecionado: any;
  prevStep: () => void;
}

const MatriculaStep2: React.FC<MatriculaStep2Props> = ({
  onCursoSelecionado,
  alunoSelecionado,
  prevStep
}) => {
  const [busca, setBusca] = useState("");
  const [cursosEncontrados, setCursosEncontrados] = useState<any[]>([]);

  // Função simulada para buscar cursos
  const buscarCursos = (termo: string) => {
    // Simulação de cursos encontrados
    const simulados = [
      { id: "1", titulo: "Introdução à Programação", valor_mensalidade: 299.90, duracao: "6 meses" },
      { id: "2", titulo: "Marketing Digital", valor_mensalidade: 349.90, duracao: "4 meses" },
      { id: "3", titulo: "Design Gráfico", valor_mensalidade: 399.90, duracao: "8 meses" },
    ].filter(curso => 
      curso.titulo.toLowerCase().includes(termo.toLowerCase())
    );

    return simulados;
  };

  const handleBusca = () => {
    if (busca.trim()) {
      const resultados = buscarCursos(busca);
      setCursosEncontrados(resultados);
    } else {
      setCursosEncontrados([]);
    }
  };

  const handleSelecionarCurso = (curso: any) => {
    onCursoSelecionado(curso);
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={prevStep}
        className="mb-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Selecionar Curso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input 
                  placeholder="Buscar curso"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
              <Button onClick={handleBusca}>
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>

            {cursosEncontrados.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-2">
                  {cursosEncontrados.length} curso(s) encontrado(s)
                </p>
                {cursosEncontrados.map(curso => (
                  <div 
                    key={curso.id} 
                    className="p-4 border rounded-md cursor-pointer hover:bg-slate-50"
                    onClick={() => handleSelecionarCurso(curso)}
                  >
                    <p className="font-medium">{curso.titulo}</p>
                    <div className="flex justify-between mt-2 text-sm">
                      <span>Mensalidade: R$ {curso.valor_mensalidade.toFixed(2)}</span>
                      <span>Duração: {curso.duracao}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : busca ? (
              <div className="text-center p-4">
                <p>Nenhum curso encontrado</p>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatriculaStep2;
