
import { LEARNWORLDS_SCHOOL_ID } from '@/config/apiConfig';
import { toast } from 'sonner';

/**
 * Cliente de API para chamadas diretas à API do LearnWorlds da escola
 */
export const apiDirectClient = {
  // Credenciais da API (obtidas da tela de configuração do LearnWorlds)
  credentials: {
    clientId: '66abb5fdf8655b4b800c7278',
    clientSecret: '835mPsiAJ6jqdQJNdnBeyfggOd7VAAOavPFxluR86D48xXOAPp',
  },

  // URL base da API
  baseUrl: `https://grupozayneducacional.com.br/admin/api`,

  /**
   * Criar novo aluno diretamente na API da escola
   * 
   * @param userData Dados do usuário a ser criado
   * @returns Dados do usuário criado ou erro
   */
  async createUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    customField1?: string;
  }) {
    try {
      console.log("📝 Enviando dados para API da escola:", userData);
      
      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `OAuth ${this.credentials.clientId}:${this.credentials.clientSecret}`,
          'School-Id': LEARNWORLDS_SCHOOL_ID,
          'Lw-Client': LEARNWORLDS_SCHOOL_ID,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erro na resposta da API:", response.status, errorText);
        
        throw new Error(`Erro ao criar usuário: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Usuário criado com sucesso:", data);
      return data;
    } catch (error) {
      console.error("❌ Falha ao criar usuário na API direta:", error);
      throw error;
    }
  }
};
