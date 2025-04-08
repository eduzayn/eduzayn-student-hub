
import { toast } from "sonner";

/**
 * Fornece dados simulados de cursos quando a API está indisponível
 */
export const carregarCursosSimulados = (termoBusca = "") => {
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
    },
    // Adicionar indicadores claros para os cursos que são simulados na API
    {
      id: "course-1",
      titulo: "[SIMULADO] Desenvolvimento Web Frontend",
      codigo: "SIM-WEB",
      modalidade: "EAD",
      carga_horaria: 60,
      valor_total: 1200.00,
      valor_mensalidade: 200.00,
      learning_worlds_id: "course-1",
      url: "https://grupozayneducacional.com.br/course/course-1",
      simulado: true
    },
    {
      id: "course-2",
      titulo: "[SIMULADO] Python para Ciência de Dados",
      codigo: "SIM-PY",
      modalidade: "EAD",
      carga_horaria: 80,
      valor_total: 1500.00,
      valor_mensalidade: 250.00,
      learning_worlds_id: "course-2",
      url: "https://grupozayneducacional.com.br/course/course-2",
      simulado: true
    },
  ];
  
  // Filtragem pela busca (se houver)
  const filtrados = termoBusca ? 
    dadosSimulados.filter(c => 
      c.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
      c.codigo.toLowerCase().includes(termoBusca.toLowerCase())
    ) : dadosSimulados;
  
  console.log(`Filtrando dados simulados por "${termoBusca}", encontrados: ${filtrados.length}`);
  
  // Aviso sobre dados simulados
  toast.warning("Usando dados simulados para cursos", {
    description: "Não foi possível obter dados reais da API LearnWorlds."
  });
  
  return filtrados;
};
