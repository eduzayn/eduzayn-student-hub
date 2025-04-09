
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface MatriculaStep1Props {
  onAlunoSelecionado: (aluno: any) => void;
  alunoSelecionado: any;
  prevStep?: () => void;
}

const MatriculaStep1: React.FC<MatriculaStep1Props> = ({
  onAlunoSelecionado,
  alunoSelecionado,
  prevStep
}) => {
  const [busca, setBusca] = useState("");
  const [alunosEncontrados, setAlunosEncontrados] = useState<any[]>([]);

  // Função simulada para buscar alunos
  const buscarAlunos = (termo: string) => {
    // Simulação de alunos encontrados
    const simulados = [
      { id: "1", nome: "Ana Silva", email: "ana@example.com", cpf: "111.222.333-44" },
      { id: "2", nome: "João Santos", email: "joao@example.com", cpf: "222.333.444-55" },
      { id: "3", nome: "Maria Oliveira", email: "maria@example.com", cpf: "333.444.555-66" },
    ].filter(aluno => 
      aluno.nome.toLowerCase().includes(termo.toLowerCase()) || 
      aluno.email.toLowerCase().includes(termo.toLowerCase())
    );

    return simulados;
  };

  const handleBusca = () => {
    if (busca.trim()) {
      const resultados = buscarAlunos(busca);
      setAlunosEncontrados(resultados);
    } else {
      setAlunosEncontrados([]);
    }
  };

  const handleSelecionarAluno = (aluno: any) => {
    onAlunoSelecionado(aluno);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Selecionar Aluno</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input 
                  placeholder="Buscar por nome ou email"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
              <Button onClick={handleBusca}>
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>

            {alunosEncontrados.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-2">
                  {alunosEncontrados.length} aluno(s) encontrado(s)
                </p>
                {alunosEncontrados.map(aluno => (
                  <div 
                    key={aluno.id} 
                    className="p-4 border rounded-md cursor-pointer hover:bg-slate-50"
                    onClick={() => handleSelecionarAluno(aluno)}
                  >
                    <p className="font-medium">{aluno.nome}</p>
                    <p className="text-sm text-muted-foreground">{aluno.email}</p>
                    {aluno.cpf && <p className="text-sm text-muted-foreground">CPF: {aluno.cpf}</p>}
                  </div>
                ))}
              </div>
            ) : busca ? (
              <div className="text-center p-4">
                <p>Nenhum aluno encontrado</p>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatriculaStep1;
