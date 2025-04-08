
export interface Aluno {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  learnworlds_id?: string;
  simulado?: boolean;
  simulatedResponse?: boolean;
}

// Outros tipos relacionados a alunos, se houver
export interface AlunoResponse {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  cpf?: string;
  cpfCnpj?: string;
  phoneNumber?: string;
  phone?: string;
  simulatedResponse?: boolean;
}
