
import { Aluno } from "./types";
import { toast } from "sonner";

/**
 * Mapeia dados da API em formato Aluno
 */
export const mapearAlunosDeAPI = (dados: any[]): Aluno[] => {
  if (!Array.isArray(dados)) {
    console.log("Dados inválidos recebidos para mapear alunos", dados);
    return [];
  }
  
  try {
    return dados.map((item: any) => {
      // Campos padrão para todos os tipos de resposta
      const aluno: Aluno = {
        id: item.id || `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        nome: getNomeAluno(item),
        email: getEmailAluno(item),
        learnworlds_id: item.id || undefined,
      };
      
      // Adicionar campos opcionais se disponíveis
      if (item.fields) {
        if (item.fields.phone_number) {
          aluno.telefone = item.fields.phone_number;
        }
        if (item.fields.cpf) {
          aluno.cpf = item.fields.cpf;
        }
      }

      return aluno;
    });
  } catch (error) {
    console.error("Erro ao mapear alunos:", error);
    return [];
  }
};

/**
 * Extrai o nome de um aluno da resposta da API
 */
const getNomeAluno = (item: any): string => {
  // LearnWorlds v2 API - campos first_name e last_name dentro do objeto "fields"
  if (item.fields && (item.fields.first_name || item.fields.last_name)) {
    const firstName = item.fields.first_name || '';
    const lastName = item.fields.last_name || '';
    return `${firstName} ${lastName}`.trim();
  }
  
  // LearnWorlds v2 API - username direto no objeto
  if (item.username) {
    return item.username;
  }
  
  // Formato genérico ou local
  if (item.nome) {
    return item.nome;
  }
  
  // Fallback para email se nome não disponível
  if (item.email) {
    return item.email.split('@')[0];
  }
  
  return "Aluno sem nome";
};

/**
 * Extrai o email de um aluno da resposta da API
 */
const getEmailAluno = (item: any): string => {
  return item.email || "sem.email@exemplo.com";
};

/**
 * Trata erros ao carregar alunos
 */
export const tratarErroCarregamento = (error: any) => {
  console.error("Erro ao carregar alunos:", error);
  
  const mensagem = error.message || 'Erro ao carregar alunos';
  
  if (mensagem.includes('Failed to fetch') || 
      mensagem.includes('Network Error') || 
      mensagem.includes('HTML')) {
    toast.error('Erro de conexão com a API', {
      description: "Não foi possível conectar à API do LearnWorlds"
    });
    return;
  }
  
  if (mensagem.includes('401') || mensagem.includes('403')) {
    toast.error('Erro de autenticação', {
      description: "Verifique as credenciais de API"
    });
    return;
  }
  
  toast.error('Erro ao carregar alunos', {
    description: mensagem.substring(0, 100)
  });
};
