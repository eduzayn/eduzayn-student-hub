
import { toast } from "sonner";
import { Aluno } from "./types";

/**
 * Carrega alunos simulados quando o sistema está offline
 */
export const carregarAlunosSimulados = (termoBusca = ""): Aluno[] => {
  const dadosSimulados = [
    {
      id: "a1",
      nome: "Ana Silva",
      email: "ana@exemplo.com",
      cpf: "12345678901",
      telefone: "(11) 91234-5678"
    },
    {
      id: "a2",
      nome: "Carlos Santos",
      email: "carlos@exemplo.com",
      cpf: "10987654321",
      telefone: "(11) 98765-4321"
    },
    {
      id: "a3",
      nome: "Patricia Oliveira",
      email: "patricia@exemplo.com",
      cpf: "45678912301",
      telefone: "(11) 97654-3210"
    }
  ];
  
  const filtrados = termoBusca ? 
    dadosSimulados.filter(a => 
      a.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      a.email.toLowerCase().includes(termoBusca.toLowerCase()) ||
      a.cpf?.includes(termoBusca)
    ) : dadosSimulados;
  
  return filtrados;
};

/**
 * Mapeia dados de alunos da API para o formato utilizado na aplicação
 */
export const mapearAlunosDeAPI = (alunosAPI: any[]): Aluno[] => {
  if (!alunosAPI || !Array.isArray(alunosAPI)) {
    return [];
  }
  
  return alunosAPI.map((aluno: any) => ({
    id: aluno.id,
    nome: `${aluno.firstName || ''} ${aluno.lastName || ''}`.trim(),
    email: aluno.email,
    cpf: aluno.customField1 || '',
    telefone: aluno.phoneNumber || '',
    learnworlds_id: aluno.id
  }));
};

/**
 * Trata erros ao carregar alunos
 */
export const tratarErroCarregamento = (error: any): void => {
  console.error("Erro ao carregar alunos:", error);
  toast.error("Erro ao carregar a lista de alunos", {
    description: "Usando dados em modo offline. Algumas funcionalidades podem estar limitadas."
  });
};
