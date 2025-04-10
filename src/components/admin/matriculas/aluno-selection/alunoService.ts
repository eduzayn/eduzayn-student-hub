
import { toast } from "sonner";
import { Aluno } from "./types";

/**
 * Mapeia alunos da API para o formato esperado pelo componente
 */
export const mapearAlunosDeAPI = (response: any[]): Aluno[] => {
  console.log("Dados obtidos da API:", response);
  
  if (!response || !Array.isArray(response)) {
    console.warn("Resposta da API não é um array ou está vazia");
    return [];
  }
  
  try {
    const alunosFormatados = response.map(aluno => ({
      id: aluno.id,
      nome: aluno.username || `${aluno.fields?.first_name || ''} ${aluno.fields?.last_name || ''}`.trim(),
      email: aluno.email,
      learnworlds_id: aluno.id, // Usando ID da API como learnworlds_id
      telefone: aluno.fields?.phone_number || aluno.phoneNumber || '',
      cpf: aluno.fields?.cpf || aluno.customField1 || ''
    }));

    console.log("Alunos formatados:", alunosFormatados);
    return alunosFormatados;
  } catch (error) {
    console.error("Erro ao mapear alunos:", error);
    return [];
  }
};

/**
 * Exibe mensagem de erro apropriada ao carregar alunos
 */
export const tratarErroCarregamento = (error: any): void => {
  console.error("Erro ao carregar alunos:", error);
  
  const mensagem = error.message || "Erro desconhecido ao carregar alunos";

  // Personalizar mensagens de erro comuns
  if (mensagem.includes('Failed to execute \'json\'')) {
    toast.error("Erro ao processar resposta da API", {
      description: "A resposta da API não está no formato esperado. Tente novamente mais tarde."
    });
    return;
  }
  
  if (mensagem.includes('HTML')) {
    toast.error("Erro na integração com LearnWorlds", {
      description: "A API retornou HTML em vez de dados. Verifique as credenciais ou contate o suporte."
    });
    return;
  }
  
  if (mensagem.includes('Failed to fetch')) {
    toast.error("Erro de conexão", {
      description: "Não foi possível conectar com o servidor. Verifique sua conexão com a internet."
    });
    return;
  }
  
  toast.error("Erro ao carregar alunos", {
    description: mensagem.slice(0, 100)
  });
};

/**
 * Formata um aluno para exibição na UI
 */
export const formatarAlunoParaExibicao = (aluno: any): Aluno => {
  return {
    id: aluno.id,
    nome: aluno.nome || aluno.username || `${aluno.firstName || ''} ${aluno.lastName || ''}`.trim(),
    email: aluno.email,
    cpf: aluno.cpf || aluno.customField1,
    telefone: aluno.telefone || aluno.phoneNumber,
    learnworlds_id: aluno.learnworlds_id || aluno.id
  };
};
