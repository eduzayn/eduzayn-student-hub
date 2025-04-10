
import { toast } from "sonner";
import { Aluno, NovoAlunoForm } from "./types";

/**
 * Processa resposta da API ao cadastrar novo aluno
 */
export const processarRespostaCadastro = (resultado: any): { id: string; sucesso: boolean } => {
  console.log("🔄 Processando resposta da API V2:", resultado);
  
  // Se temos um ID e sucesso, usamos isso diretamente
  if (resultado && resultado.success === true && resultado.id) {
    console.log("✅ ID do usuário criado:", resultado.id);
    return { id: resultado.id, sucesso: true };
  }
  
  // Se não temos ID ou sucesso, provavelmente algo deu errado
  console.error("❌ Formato de resposta desconhecido ou erro:", resultado);
  return { id: '', sucesso: false };
};

/**
 * Cria objeto de aluno para a interface a partir dos dados do formulário
 */
export const criarObjetoAluno = (formulario: NovoAlunoForm, id: string): Aluno => {
  return {
    id,
    nome: `${formulario.nome} ${formulario.sobrenome}`.trim(),
    email: formulario.email,
    cpf: formulario.cpf,
    telefone: formulario.telefone,
    learnworlds_id: id
  };
};

/**
 * Prepara dados do aluno para envio à API
 * 
 * Formato exigido pela LearnWorlds V2:
 * - email: obrigatório
 * - username: opcional (usamos nome + sobrenome)
 * - fields: para armazenar first_name, last_name, cpf, etc.
 */
export const prepararDadosParaAPI = (formulario: NovoAlunoForm): any => {
  // Certifique-se de que firstName e lastName não são vazios
  const firstName = formulario.nome || "Sem nome";
  const lastName = formulario.sobrenome || " ";
  
  const dadosAluno = {
    firstName,
    lastName,
    email: formulario.email
  };
  
  // Adicionar campos opcionais apenas se estiverem preenchidos
  if (formulario.telefone) {
    Object.assign(dadosAluno, { phoneNumber: formulario.telefone });
  }
  
  if (formulario.cpf) {
    Object.assign(dadosAluno, { customField1: formulario.cpf });
  }
  
  console.log("📝 Dados formatados para API:", dadosAluno);
  return dadosAluno;
};

/**
 * Exibe mensagem de erro adequada ao cadastrar aluno
 */
export const exibirErroAoCadastrar = (error: any): void => {
  console.error("❌ Erro ao criar novo aluno:", error);
  
  if (error.message && (
      error.message.includes("Failed to fetch") || 
      error.message.includes("Erro de conexão")
  )) {
    toast.error("Erro de conexão com a API", {
      description: "Verifique sua conexão com a internet e tente novamente."
    });
    
    return;
  }
  
  if (error.message && error.message.includes("400")) {
    toast.error("Erro nos dados enviados", {
      description: "Verifique se o e-mail já está cadastrado ou se os dados estão corretos."
    });
    return;
  }
  
  if (error.message && error.message.includes("500")) {
    toast.error("Erro no servidor", {
      description: "Erro no servidor LearnWorlds. Verifique os dados enviados ou tente novamente mais tarde."
    });
    return;
  }
  
  if (error.message && error.message.includes("Lw-Client")) {
    toast.error("Erro de configuração", {
      description: "Cabeçalho Lw-Client ausente ou incorreto. Entre em contato com o suporte."
    });
    return;
  }
  
  toast.error(error.message || "Erro ao criar novo aluno");
};
