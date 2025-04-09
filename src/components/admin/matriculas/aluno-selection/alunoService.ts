
import { Aluno } from "./types";
import { AlunoDTO } from "@/hooks/learnworlds/useLearnWorldsAlunos";
import { toast } from "sonner";

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
