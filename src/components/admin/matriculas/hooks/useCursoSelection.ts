
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
      const cursosFormatados = resultado.data.map((curso: any) => ({
        id: curso.id,
        titulo: curso.title,
        codigo: curso.id.substring(0, 8).toUpperCase(),
        modalidade: "EAD", // Assumindo que todos os cursos do LearnWorlds são EAD
        carga_horaria: obterCargaHorariaEmMinutos(curso.duration || ""),
        valor_total: curso.price_final || curso.price_original || curso.price || 0,
        valor_mensalidade: (curso.price_final || curso.price_original || curso.price || 0) / 12,
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
  
  // Handler para a busca de cursos
  const handleBusca = () => {
    carregarCursos(busca);
  };
  
  // Handler para selecionar um curso
  const handleSelecionar = (curso: any) => {
    setSelecionado(curso.id || curso.learning_worlds_id);
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
