
import { toast } from "sonner";
import { Aluno, NovoAlunoForm } from "./types";

/**
 * Processa resposta da API ao cadastrar novo aluno
 */
export const processarRespostaCadastro = (resultado: any): { id: string; sucesso: boolean } => {
  console.log("🔄 Processando resposta da API:", resultado);
  
  let novoAlunoId: string;
  
  if (resultado && resultado.id) {
    // Formato esperado da API
    novoAlunoId = resultado.id;
    console.log("✅ ID do usuário criado:", novoAlunoId);
    return { id: novoAlunoId, sucesso: true };
  } 
  
  if (resultado && typeof resultado === 'object' && 'text' in resultado) {
    // Formato alternativo (resposta HTML ou outro formato)
    novoAlunoId = `local-${Date.now()}`;
    console.log("⚠️ Resposta da API em formato não-padrão, usando ID local:", novoAlunoId);
    
    toast.info("Resposta da API em formato não-padrão, usando ID local", {
      description: "A sincronização completa pode ser necessária mais tarde."
    });
    return { id: novoAlunoId, sucesso: true };
  } 
  
  if (resultado && typeof resultado === 'object') {
    // Quando recebemos um objeto, mas sem o ID esperado
    novoAlunoId = `local-${Date.now()}`;
    console.log("⚠️ Resposta da API sem ID, usando ID local:", novoAlunoId, "Resposta:", resultado);
    
    toast.info("Resposta da API sem ID, usando ID local", {
      description: "A sincronização completa pode ser necessária mais tarde."
    });
    return { id: novoAlunoId, sucesso: true };
  } 
  
  if (resultado === null || resultado === undefined) {
    // Quando a resposta é nula, possível erro na API
    novoAlunoId = `local-${Date.now()}`;
    console.log("⚠️ Resposta nula da API, usando ID local:", novoAlunoId);
    
    toast.warning("Resposta nula da API, usando ID local", {
      description: "O cadastro pode não ter sido concluído no servidor."
    });
    return { id: novoAlunoId, sucesso: true };
  }
  
  // Quando a resposta não se enquadra em nenhum dos casos acima
  console.error("❌ Formato de resposta desconhecido:", resultado);
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
 * Cria objeto de aluno para modo offline
 */
export const criarAlunoOffline = (formulario: NovoAlunoForm): Aluno => {
  const offlineId = `offline-${Date.now()}`;
  
  return {
    id: offlineId,
    nome: `${formulario.nome} ${formulario.sobrenome}`.trim(),
    email: formulario.email,
    cpf: formulario.cpf,
    telefone: formulario.telefone,
    simulado: true,
    offline: true,
    learnworlds_id: offlineId
  };
};

/**
 * Prepara dados do aluno para envio à API
 * 
 * Formato exigido pela LearnWorlds:
 * - firstName e lastName: obrigatórios
 * - email: obrigatório
 * - phoneNumber: opcional
 * - customField1: usado para armazenar o CPF
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
      error.message.includes("Erro de conexão") ||
      error.message.includes("função edge") ||
      error.message.includes("API retornou conteúdo não-JSON") ||
      error.message.includes("HTML recebida")
  )) {
    toast.error("Erro de conexão com a API", {
      description: "A API está retornando dados no formato incorreto. Ativando modo offline."
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
