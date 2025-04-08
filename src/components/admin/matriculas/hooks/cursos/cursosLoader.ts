
import { toast } from "sonner";
import { formatarCursos } from "./formatadores";
import { carregarCursosSimulados } from "./cursosMock";

/**
 * Funções para carregar cursos da API
 */
interface CursosLoaderProps {
  getCourses: (page?: number, limit?: number, searchTerm?: string) => Promise<any>;
  setTotalPages: (pages: number) => void;
  setCursos: (cursos: any[]) => void;
  offlineMode: boolean;
}

/**
 * Carrega cursos da API ou dados simulados como fallback
 */
export const carregarCursos = async (
  { getCourses, setTotalPages, setCursos, offlineMode }: CursosLoaderProps,
  termoBusca = "",
  pagina = 1,
  cursosPerPage = 50
) => {
  try {
    console.log(`Iniciando busca de cursos com termo: "${termoBusca}", página: ${pagina}`);
    
    // Se estamos em modo offline, carregamos dados simulados diretamente
    if (offlineMode) {
      console.log("Modo offline ativo, carregando dados simulados");
      handleFallbackData(setCursos, setTotalPages, termoBusca);
      return;
    }
    
    // Busca cursos da API LearnWorlds com token atualizado
    const resultado = await getCourses(pagina, cursosPerPage, termoBusca);
    
    if (!resultado || !resultado.data) {
      console.error("Erro ao carregar cursos: resultado inválido", resultado);
      throw new Error("Erro ao carregar cursos do LearnWorlds");
    }
    
    console.log("Dados originais dos cursos:", resultado.data);
    console.log("Metadados da paginação:", resultado.meta);
    
    // Verificar se os dados da API são válidos e não estão vazios
    if (Array.isArray(resultado.data) && resultado.data.length > 0) {
      // Atualizar o total de páginas baseado na resposta da API
      if (resultado.meta && resultado.meta.totalPages) {
        setTotalPages(resultado.meta.totalPages);
      }
      
      // Mapeando os dados retornados para o formato necessário para exibição
      const cursosFormatados = formatarCursos(resultado.data);
      
      console.log("Cursos formatados:", cursosFormatados);
      console.log("Total de cursos da API:", cursosFormatados.length);
      setCursos(cursosFormatados);
    } else {
      console.warn("API retornou um array vazio de cursos ou formato inesperado");
      handleFallbackData(setCursos, setTotalPages, termoBusca);
    }
  } catch (error) {
    console.error("Erro ao carregar cursos:", error);
    toast.error("Erro ao carregar a lista de cursos. Usando dados simulados.");
    
    // Em caso de falha, carrega dados simulados como fallback
    handleFallbackData(setCursos, setTotalPages, termoBusca);
  }
};

/**
 * Trata o fallback com dados simulados
 */
const handleFallbackData = (
  setCursos: (cursos: any[]) => void,
  setTotalPages: (pages: number) => void,
  termoBusca: string
) => {
  const cursos = carregarCursosSimulados(termoBusca);
  setCursos(cursos);
  setTotalPages(1); // Com dados simulados, temos apenas uma página
  
  console.log("Usando dados simulados como fallback, total:", cursos.length);
};
