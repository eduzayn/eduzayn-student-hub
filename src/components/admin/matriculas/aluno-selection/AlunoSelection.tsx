
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, UserPlus } from "lucide-react";
import NovoAlunoDialog from "./NovoAlunoDialog";
import { useAlunoSelection } from "./useAlunoSelection";
import { Aluno } from "./types";

interface AlunoSelectionProps {
  onAlunoSelecionado: (aluno: Aluno) => void;
}

const AlunoSelection: React.FC<AlunoSelectionProps> = ({ onAlunoSelecionado }) => {
  const {
    busca,
    setBusca,
    alunos,
    selecionado,
    dialogAberto,
    setDialogAberto,
    formNovoAluno,
    loading,
    error,
    handleBusca,
    handleSelecionar,
    handleInputChange,
    handleCriarNovoAluno
  } = useAlunoSelection({ onAlunoSelecionado });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Selecionar Aluno</span>
            <Button variant="outline" onClick={() => setDialogAberto(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Aluno
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por nome ou email"
                  className="pl-8"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleBusca()}
                />
              </div>
              <Button onClick={handleBusca}>
                Buscar
              </Button>
            </div>

            {alunos.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-2">
                  {alunos.length} aluno(s) encontrado(s)
                </p>
                {alunos.map(aluno => (
                  <div 
                    key={aluno.id} 
                    className={`p-4 border rounded-md cursor-pointer hover:bg-slate-50 ${selecionado === aluno.id ? 'border-primary bg-primary/5' : ''}`}
                    onClick={() => handleSelecionar(aluno)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{aluno.nome}</p>
                        <p className="text-sm text-muted-foreground">{aluno.email}</p>
                        {aluno.cpf && <p className="text-sm text-muted-foreground">CPF: {aluno.cpf}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : loading ? (
              <div className="text-center p-4">
                <p>Carregando alunos...</p>
              </div>
            ) : busca ? (
              <div className="text-center p-4">
                <p>Nenhum aluno encontrado</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Tente outro termo de busca ou{" "}
                  <Button variant="link" className="h-auto p-0" onClick={() => setDialogAberto(true)}>
                    cadastre um novo aluno
                  </Button>
                </p>
              </div>
            ) : (
              <div className="text-center p-4">
                <p>Busque por um aluno ou cadastre um novo</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <NovoAlunoDialog
        aberto={dialogAberto}
        setAberto={setDialogAberto}
        formData={formNovoAluno}
        handleInputChange={handleInputChange}
        handleCriarNovoAluno={handleCriarNovoAluno}
        loading={loading}
      />
    </div>
  );
};

export default AlunoSelection;
