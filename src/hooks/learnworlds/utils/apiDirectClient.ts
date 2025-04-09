
import { LEARNWORLDS_SCHOOL_ID } from '@/config/apiConfig';
import { toast } from 'sonner';

/**
 * Cliente de API para chamadas diretas à API do LearnWorlds
 */
export const apiDirectClient = {
  // Credenciais da API (obtidas da tela de configuração do LearnWorlds)
  credentials: {
    clientId: '66abb5fdf8655b4b800c7278',
    clientSecret: '835mPsiAJ6jqdQJNdnBeyfggOd7VAAOavPFxluR86D48xXOAPp',
  },

  // URL base da API V2
  baseUrl: `https://grupozayneducacional.com.br/admin/api/v2`,

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
      console.log("📝 Enviando dados para API V2 direta da escola:", userData);
      
      // Preparar os dados no formato correto para a API V2
      const apiV2Data = {
        email: userData.email,
        username: `${userData.firstName} ${userData.lastName}`.trim(),
        send_registration_email: true,
        fields: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone_number: userData.phoneNumber || '',
          cpf: userData.customField1 || ''
        }
      };
      
      console.log("📝 Dados formatados para API V2:", apiV2Data);
      
      // Garantindo que temos todos os cabeçalhos necessários
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `OAuth ${this.credentials.clientId}:${this.credentials.clientSecret}`,
        'School-Id': LEARNWORLDS_SCHOOL_ID,
        'Lw-Client': LEARNWORLDS_SCHOOL_ID,
      };

      console.log("🔑 Cabeçalhos da requisição:", {
        ...headers,
        'Authorization': 'OAuth [CREDENCIAIS]' // Log sem expor credenciais completas
      });
      
      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'POST',
        headers,
        body: JSON.stringify(apiV2Data),
      });

      // Log detalhado da resposta para depuração
      console.log("📡 Status da resposta:", response.status);
      console.log("📡 Headers da resposta:", Object.fromEntries(response.headers.entries()));

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
