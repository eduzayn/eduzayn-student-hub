
import React, { useEffect, useState } from "react";
import BuscaCurso from "./cursos/BuscaCurso";
import CursosLista from "./cursos/CursosLista";
import ApiErrorDisplay from "./cursos/ApiErrorDisplay";
import OfflineModeIndicator from "./OfflineModeIndicator";
import useCursoSelection from "./hooks/useCursoSelection";
import CursosPagination from "./cursos/lista/CursosPagination";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle, ExternalLink, RefreshCw, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface SelectCursoProps {
  onCursoSelecionado: (curso: any) => void;
}

const SelectCurso: React.FC<SelectCursoProps> = ({ onCursoSelecionado }) => {
  const {
    busca,
    setBusca,
    cursos,
    selecionado,
    loading,
    error,
    offlineMode,
    page,
    totalPages,
    setPage,
    handleBusca,
    handleSelecionar,
    limparBusca,
    recarregarCursos
  } = useCursoSelection(onCursoSelecionado);
  
  // Verificar se todos os cursos são simulados
  const [todosCursosSimulados, setTodosCursosSimulados] = useState<boolean>(false);
  const [problemaDeDados, setProblemasDeDados] = useState<boolean>(false);
  const [cursosAPI, setCursosAPI] = useState<number>(0);
  
  // Verificar quando os cursos são carregados
  useEffect(() => {
    if (!loading && cursos.length > 0) {
      // Verificar se todos os cursos são marcados como simulados
      const cursosSimuladosCount = cursos.filter(curso => curso.simulado === true).length;
      const todosCursosMaradosComoSimulados = cursosSimuladosCount === cursos.length;
      setTodosCursosSimulados(todosCursosMaradosComoSimulados);
      
      // Contar cursos API
      const countAPI = cursos.filter(curso => curso.api_token === true).length;
      setCursosAPI(countAPI);
      
      // Verificar se os IDs dos cursos parecem problemáticos
      const idsSuspeitosComCourse = cursos.filter(curso => 
        curso.id && curso.id.toString().startsWith('course-')
      ).length;
      
      // Se mais de 75% dos cursos têm IDs que começam com "course-"
      const percentagemSuspeita = (idsSuspeitosComCourse / cursos.length) * 100;
      if (percentagemSuspeita > 75) {
        setProblemasDeDados(true);
      } else {
        setProblemasDeDados(false);
      }
    }
  }, [cursos, loading]);
  
  const handleForcarRecarga = () => {
    toast.info("Recarregando cursos...");
    recarregarCursos();
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Selecione o Curso</h2>
      
      {offlineMode && (
        <OfflineModeIndicator message="API do LearnWorlds indisponível. Usando dados simulados para cursos." />
      )}
      
      {!offlineMode && todosCursosSimulados && cursos.length > 0 && !loading && (
        <Alert variant="warning" className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium">
              Aviso: Todos os cursos estão marcados como simulados
            </p>
            <p className="mt-1">
              Apesar da API estar respondendo, os dados parecem ser de teste ou há um problema na identificação. 
              Verifique as credenciais da API ou contate o suporte técnico.
            </p>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline" onClick={handleForcarRecarga} className="gap-1">
                <RefreshCw className="h-3 w-3" /> Recarregar dados
              </Button>
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={() => window.open("https://grupozayneducacional.com.br/author/courses", "_blank")}
                className="gap-1"
              >
                <ExternalLink className="h-3 w-3" /> Ver cursos no LearnWorlds
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {!offlineMode && !todosCursosSimulados && cursosAPI > 0 && !loading && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription>
            <p className="font-medium text-green-700">
              Conexão com API LearnWorlds estabelecida com sucesso!
            </p>
            <p className="mt-1">
              {cursosAPI} cursos carregados via API do LearnWorlds com token de acesso.
            </p>
          </AlertDescription>
        </Alert>
      )}
      
      {!offlineMode && problemaDeDados && !todosCursosSimulados && !loading && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription>
            <p>Observação: Os IDs dos cursos do LearnWorlds estão no formato "course-X".</p>
            <p className="mt-1">Isso é normal se a instalação do LearnWorlds estiver configurada para usar esse formato de IDs.</p>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col gap-2">
        <BuscaCurso 
          busca={busca}
          setBusca={setBusca}
          handleBusca={handleBusca}
          loading={loading}
        />
        
        {busca && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Filtrando por: <strong>{busca}</strong>
            </span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={limparBusca}
              className="h-8 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Limpar filtro
            </Button>
          </div>
        )}
      </div>
      
      {error && !offlineMode && <ApiErrorDisplay error={error} />}
      
      <div className="mt-6">
        <CursosLista 
          cursos={cursos}
          selecionado={selecionado}
          loading={loading}
          offlineMode={offlineMode}
          onSelecionar={handleSelecionar}
        />
      </div>
      
      {!loading && cursos.length > 0 && totalPages > 1 && (
        <CursosPagination 
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      )}
    </div>
  );
};

export default SelectCurso;
