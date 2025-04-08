
import { toast } from "sonner";
import { Aluno } from "./types";

/**
 * Função para carregar alunos simulados quando a API não estiver disponível
 */
export const carregarAlunosSimulados = (termoBusca = ""): Aluno[] => {
  const alunosSimulados: Aluno[] = [
    {
      id: "mock-user-1",
      nome: "João Silva",
      email: "joao@exemplo.com",
      cpf: "12345678900",
      telefone: "11999990000",
      simulado: true,
      learnworlds_id: "mock-user-1"
    },
    {
      id: "mock-user-2",
      nome: "Maria Oliveira",
      email: "maria@exemplo.com",
      cpf: "98765432100",
      telefone: "11988880000",
      simulado: true,
      learnworlds_id: "mock-user-2"
    },
    {
      id: "mock-user-3",
      nome: "Pedro Santos",
      email: "pedro@exemplo.com",
      cpf: "45678912300",
      telefone: "11977770000",
      simulado: true,
      learnworlds_id: "mock-user-3"
    }
  ];

  // Filtrar pelo termo de busca se fornecido
  if (termoBusca) {
    const termoBuscaLower = termoBusca.toLowerCase();
    return alunosSimulados.filter(
      aluno =>
        aluno.nome.toLowerCase().includes(termoBuscaLower) ||
        aluno.email.toLowerCase().includes(termoBuscaLower) ||
        aluno.cpf.includes(termoBusca)
    );
  }

  return alunosSimulados;
};

/**
 * Função para mapear alunos retornados da API para o formato da aplicação
 */
export const mapearAlunosDeAPI = (alunosAPI: any[]): Aluno[] => {
  return alunosAPI.map(aluno => ({
    id: aluno.id,
    nome: `${aluno.firstName || ""} ${aluno.lastName || ""}`.trim(),
    email: aluno.email || "",
    cpf: aluno.cpf || aluno.cpfCnpj || "",
    telefone: aluno.phoneNumber || aluno.phone || "",
    learnworlds_id: aluno.id,
    simulado: !!aluno.simulatedResponse, // Marca explicitamente como simulado se vier da API
    simulatedResponse: !!aluno.simulatedResponse
  }));
};

/**
 * Função para tratar erros de carregamento de alunos
 */
export const tratarErroCarregamento = (error: any) => {
  console.error("Erro ao carregar alunos:", error);
  
  // Exibir mensagem de erro para o usuário
  toast.error("Falha ao carregar alunos", {
    description: "Usando dados simulados. Tente novamente mais tarde."
  });
};
