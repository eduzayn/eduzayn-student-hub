
import { Aluno } from "./types";
import { AlunoDTO } from "@/hooks/learnworlds/useLearnWorldsAlunos";
import { toast } from "sonner";

/**
 * Carrega uma lista de alunos simulados para uso em modo offline
 */
export const carregarAlunosSimulados = (termoBusca = ""): Aluno[] => {
  const alunosSimulados: Aluno[] = [
    {
      id: "sim-1",
      nome: "João Silva",
      email: "joao@exemplo.com.br",
      cpf: "123.456.789-00",
      telefone: "(11) 98765-4321",
      simulado: true
    },
    {
      id: "sim-2",
      nome: "Maria Oliveira",
      email: "maria@exemplo.com.br",
      cpf: "987.654.321-00",
      telefone: "(11) 91234-5678",
      simulado: true
    },
    {
      id: "sim-3",
      nome: "Carlos Santos",
      email: "carlos@exemplo.com.br",
      cpf: "456.789.123-00",
      telefone: "(21) 98765-4321",
      simulado: true
    }
  ];

  if (!termoBusca) return alunosSimulados;

  // Filtrar alunos simulados pelo termo de busca
  const termoBuscaLower = termoBusca.toLowerCase();
  return alunosSimulados.filter(
    aluno =>
      aluno.nome?.toLowerCase().includes(termoBuscaLower) ||
      aluno.email?.toLowerCase().includes(termoBuscaLower) ||
      aluno.cpf?.toLowerCase().includes(termoBuscaLower)
  );
};

/**
 * Mapeia alunos da API para o formato interno
 */
export const mapearAlunosDeAPI = (alunosAPI: AlunoDTO[]): Aluno[] => {
  return alunosAPI.map(aluno => ({
    id: aluno.id,
    learnworlds_id: aluno.id,
    nome: formatarNomeCompleto(aluno.firstName || "", aluno.lastName || "", aluno.username || ""),
    email: aluno.email,
    cpf: aluno.fields?.cpf || aluno.customField1 || "",
    telefone: aluno.fields?.phone_number || aluno.phoneNumber || "",
    data_cadastro: formatarDataCadastro(aluno.created),
    ultimo_login: formatarDataUltimoLogin(aluno.last_login)
  }));
};

/**
 * Formata nome completo com base nas informações disponíveis
 */
const formatarNomeCompleto = (firstName: string, lastName: string, username: string): string => {
  // Se temos nome e sobrenome, usamos eles
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  
  // Se temos apenas nome, usamos ele
  if (firstName) {
    return firstName;
  }
  
  // Se temos apenas username, usamos ele
  if (username) {
    return username;
  }
  
  // Fallback para o caso de nenhum nome disponível
  return "Sem nome";
};

/**
 * Formata a data de cadastro (timestamp unix para data legível)
 */
const formatarDataCadastro = (timestamp?: number): string => {
  if (!timestamp) return "";
  
  try {
    const data = new Date(timestamp * 1000);
    return data.toLocaleDateString('pt-BR');
  } catch (error) {
    console.error("Erro ao formatar data de cadastro:", error);
    return "";
  }
};

/**
 * Formata a data do último login (timestamp unix para data legível)
 */
const formatarDataUltimoLogin = (timestamp?: number): string => {
  if (!timestamp) return "";
  
  try {
    const data = new Date(timestamp * 1000);
    return data.toLocaleDateString('pt-BR');
  } catch (error) {
    console.error("Erro ao formatar data de último login:", error);
    return "";
  }
};

/**
 * Trata erros ao carregar alunos
 */
export const tratarErroCarregamento = (error: any): void => {
  console.error("Erro ao carregar alunos:", error);
  
  // Verificar tipo de erro para mostrar mensagem apropriada
  let mensagem = "Não foi possível carregar os alunos";
  
  if (error?.message) {
    if (error.message.includes("Failed to fetch") || 
        error.message.includes("NetworkError")) {
      mensagem = "Sem conexão com o servidor";
    } else if (error.message.includes("HTML recebida")) {
      mensagem = "Resposta inválida do servidor";
    } else if (error.message.includes("Token")) {
      mensagem = "Erro de autenticação";
    } else {
      mensagem = `Erro: ${error.message}`;
    }
  }
  
  toast.error("Falha ao carregar alunos", {
    description: mensagem,
    duration: 5000
  });
};
