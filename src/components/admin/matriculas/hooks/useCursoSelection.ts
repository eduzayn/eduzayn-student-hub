
import { useState, useEffect } from "react";
import useLearnWorldsApi from "@/hooks/useLearnWorldsApi";
import { toast } from "sonner";

export const useCursoSelection = (onCursoSelecionado: (curso: any) => void) => {
  const [busca, setBusca] = useState("");
  const [cursos, setCursos] = useState<any[]>([]);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const { getCourses, loading, error, offlineMode } = useLearnWorldsApi();
  
  // Carregar cursos quando o componente montar
  useEffect(() => {
    carregarCursos();
  }, []);
  
  // Função para extrair o slug da URL do curso do LearnWorlds
  const extractSlugFromUrl = (url: string): string => {
    if (!url) return "";
    
    try {
      // Extrai o último segmento da URL que geralmente é o slug do curso
      const segments = url.split("/");
      return segments[segments.length - 1] || "";
    } catch (error) {
      console.error("Erro ao extrair slug da URL:", error);
      return "";
    }
  };
  
  // Função para buscar cursos na API
  const carregarCursos = async (termoBusca = "") => {
    try {
      console.log("Iniciando busca de cursos com termo:", termoBusca);
      
      // Busca cursos da API LearnWorlds com token atualizado
      const resultado = await getCourses(1, 20, termoBusca);
      
      if (!resultado || !resultado.data) {
        console.error("Erro ao carregar cursos: resultado inválido", resultado);
        throw new Error("Erro ao carregar cursos do LearnWorlds");
      }
      
      console.log("Dados originais dos cursos:", resultado.data);
      
      // Mapeando os dados retornados para o formato necessário para exibição
      const cursosFormatados = resultado.data
        .filter(curso => curso.title && curso.id) // Filtra cursos sem título ou id
        .map((curso: any) => {
          // Extrai o slug da URL se disponível
          let slug = "";
          if (curso.url) {
            slug = extractSlugFromUrl(curso.url);
          }
          
          return {
            id: curso.id,
            titulo: curso.title,
            codigo: curso.id || slug || (curso.title ? curso.title.substring(0, 8).toUpperCase() : "SEM-COD"),
            modalidade: "EAD", // Assumindo que todos os cursos do LearnWorlds são EAD
            carga_horaria: obterCargaHorariaEmMinutos(curso.duration || ""),
            // Não usaremos mais os valores do LearnWorlds para preço
            valor_total: 0, // Zerando para permitir personalização manual
            valor_mensalidade: 0, // Zerando para permitir personalização manual
            descricao: curso.description || curso.shortDescription || "",
            imagem_url: curso.image || curso.courseImage || "",
            categorias: curso.categories || [],
            learning_worlds_id: curso.id,
            acesso: curso.access || "pago",
            url: curso.url || `https://grupozayneducacional.com.br/course/${slug || curso.id}`,
            // Adicionado flag para identificar se é simulado - todos cursos da API não são simulados
            simulado: false
          };
        });
      
      console.log("Cursos formatados:", cursosFormatados);
      setCursos(cursosFormatados);
      
      // Se estamos em modo offline, mostramos um aviso e carregamos dados simulados
      if (offlineMode) {
        toast.warning("Usando dados simulados do LearnWorlds", {
          description: "A API do LearnWorlds está indisponível no momento."
        });
        carregarCursosSimulados(termoBusca);
      }
      
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
      toast.error("Erro ao carregar a lista de cursos. Usando dados simulados.");
      
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
        id: "pos_graduacao_direito_tributario",
        titulo: "Pós-Graduação em Direito Tributário",
        codigo: "DIR-TRIB",
        modalidade: "EAD",
        carga_horaria: 360,
        valor_total: 3600.00,
        valor_mensalidade: 300.00,
        learning_worlds_id: "pos_graduacao_direito_tributario",
        url: "https://grupozayneducacional.com.br/course/pos-graduacao-direito-tributario",
        simulado: true // Identificador explícito para cursos simulados
      },
      {
        id: "pos_graduacao_em_direito_do_agronegocio",
        titulo: "Pós-Graduação em Direito do Agronegócio",
        codigo: "DIR-AGRO",
        modalidade: "EAD",
        carga_horaria: 420,
        valor_total: 5400.00,
        valor_mensalidade: 450.00,
        learning_worlds_id: "pos_graduacao_em_direito_do_agronegocio",
        url: "https://grupozayneducacional.com.br/course/pos-graduacao-em-direito-do-agronegocio",
        simulado: true
      },
      {
        id: "pos_graduacao_em_direito_civil",
        titulo: "Pós-Graduação em Direito Civil",
        codigo: "DIR-CIVIL",
        modalidade: "EAD",
        carga_horaria: 480,
        valor_total: 6000.00,
        valor_mensalidade: 500.00,
        learning_worlds_id: "pos_graduacao_em_direito_civil",
        url: "https://grupozayneducacional.com.br/course/pos-graduacao-em-direito-civil",
        simulado: true
      }
    ];
    
    // Filtragem pela busca (se houver)
    const filtrados = termoBusca ? 
      dadosSimulados.filter(c => 
        c.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
        c.codigo.toLowerCase().includes(termoBusca.toLowerCase())
      ) : dadosSimulados;
    
    console.log(`Filtrando dados simulados por "${termoBusca}", encontrados: ${filtrados.length}`);
    
    // Em modo offline, substituímos os cursos completamente
    if (offlineMode) {
      setCursos(filtrados);
    }
    
    // Aviso sobre dados simulados
    toast.warning("Usando dados simulados para cursos", {
      description: "Não foi possível obter dados reais da API LearnWorlds."
    });
  };
  
  // Handler para a busca de cursos
  const handleBusca = () => {
    carregarCursos(busca);
  };
  
  // Handler para selecionar um curso
  const handleSelecionar = (curso: any) => {
    // Prioriza o ID do LearnWorlds se disponível
    const cursoId = curso.learning_worlds_id || curso.id;
    setSelecionado(cursoId);
    
    onCursoSelecionado({
      ...curso,
      // Garantindo que temos o ID do LearnWorlds
      learning_worlds_id: curso.learning_worlds_id || curso.id
    });
  };

  return {
    busca,
    setBusca,
    cursos,
    selecionado,
    loading,
    error,
    offlineMode,
    handleBusca,
    handleSelecionar
  };
};

export default useCursoSelection;
