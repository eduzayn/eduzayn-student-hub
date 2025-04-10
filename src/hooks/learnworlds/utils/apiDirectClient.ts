
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
      
      console.log("🌐 URL completa para criação de usuário:", `${this.baseUrl}/users`);
      
      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'POST',
        headers,
        body: JSON.stringify(apiV2Data),
      });

      // Log detalhado da resposta para depuração
      console.log("📡 Status da resposta:", response.status);
      console.log("📡 Status text da resposta:", response.statusText);
      console.log("📡 Headers da resposta:", Object.fromEntries(response.headers.entries()));

      // Verificar tipo de conteúdo para tratamento adequado
      const contentType = response.headers.get("content-type") || "";
      console.log("📄 Content-Type da resposta:", contentType);
      
      // Capturar o corpo da resposta como texto primeiro
      const responseText = await response.text();
      console.log("📄 Corpo da resposta (texto):", responseText.slice(0, 500) + (responseText.length > 500 ? "..." : ""));
      
      const isJson = contentType.includes("application/json");
      console.log("🔍 A resposta é JSON?", isJson);
      
      if (!response.ok) {
        console.error("❌ Erro na resposta da API:", response.status, responseText);
        
        throw new Error(`Erro ao criar usuário: ${response.status} - ${responseText}`);
      }

      // Processar a resposta da API
      let responseData;
      
      // Tentar parsear como JSON se o Content-Type for JSON ou se o texto parecer JSON
      if (isJson || (responseText.trim().startsWith('{') && responseText.trim().endsWith('}'))) {
        try {
          responseData = responseText ? JSON.parse(responseText) : null;
          console.log("✅ Resposta parseada como JSON:", responseData);
        } catch (parseError) {
          console.error("❌ Falha ao parsear JSON:", parseError);
          console.log("⚠️ Texto que não pôde ser parseado:", responseText);
          
          // Em caso de erro de parsing, retorne um objeto simulado com sucesso
          responseData = { 
            success: true, 
            id: `temp-${Date.now()}`,
            message: "Usuário criado com sucesso (resposta não-JSON)"
          };
        }
      } else {
        // Se não for JSON, verificamos se foi bem sucedido pelo status code
        if (response.ok) {
          console.log("✅ Usuário criado com sucesso (resposta não-JSON)");
          // A API retornou sucesso, mas não em formato JSON
          responseData = { 
            success: true, 
            id: `temp-${Date.now()}`,
            message: "Usuário criado com sucesso (resposta não-JSON)",
            rawResponse: responseText.slice(0, 100) // Incluir parte da resposta para inspeção
          };
        } else {
          throw new Error(`Erro na resposta da API: ${response.status} ${responseText}`);
        }
      }
      
      console.log("✅ Resposta final processada:", responseData);
      return responseData;
    } catch (error) {
      console.error("❌ Falha ao criar usuário na API direta:", error);
      throw error;
    }
  },

  /**
   * Buscar usuários diretamente na API da escola
   * 
   * @param page Número da página
   * @param perPage Itens por página
   * @param searchTerm Termo de busca opcional
   * @returns Lista de usuários
   */
  async getUsers(page: number = 1, perPage: number = 20, searchTerm: string = '') {
    try {
      console.log("🔍 Buscando usuários diretamente da API V2 da escola");
      
      // Construir URL com parâmetros de consulta
      let url = `${this.baseUrl}/users?page=${page}&items_per_page=${perPage}`;
      
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      
      console.log("🌐 URL de requisição:", url);
      
      // Garantindo que temos todos os cabeçalhos necessários
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `OAuth ${this.credentials.clientId}:${this.credentials.clientSecret}`,
        'School-Id': LEARNWORLDS_SCHOOL_ID,
        'Lw-Client': LEARNWORLDS_SCHOOL_ID,
      };

      console.log("🔑 Cabeçalhos da requisição de busca:", {
        ...headers,
        'Authorization': 'OAuth [CREDENCIAIS]' // Log sem expor credenciais completas
      });
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      // Log detalhado da resposta para depuração
      console.log("📡 Status da resposta de busca:", response.status);
      console.log("📡 Status text da resposta:", response.statusText);
      console.log("📡 Headers da resposta:", Object.fromEntries(response.headers.entries()));
      
      // Verificar tipo de conteúdo para tratamento adequado
      const contentType = response.headers.get("content-type") || "";
      console.log("📄 Content-Type da resposta:", contentType);
      
      // Capturar o corpo da resposta como texto para análise
      const responseText = await response.text();
      console.log("📄 Corpo da resposta (texto):", responseText.slice(0, 500) + (responseText.length > 500 ? "..." : ""));
      
      const isJson = contentType.includes("application/json");
      console.log("🔍 A resposta é JSON?", isJson);
      
      if (!response.ok) {
        console.error("❌ Erro na resposta da API de busca:", response.status, responseText);
        throw new Error(`Erro ao buscar usuários: ${response.status} - ${responseText}`);
      }

      // Processar a resposta conforme o formato
      let responseData;
      
      // Verificar se o texto pode ser parseado como JSON
      if (isJson || (responseText.trim().startsWith('{') || responseText.trim().startsWith('['))) {
        try {
          responseData = responseText ? JSON.parse(responseText) : { data: [] };
          console.log("✅ Resposta parseada como JSON:", responseData);
        } catch (parseError) {
          console.error("❌ Falha ao parsear JSON:", parseError);
          console.log("⚠️ Texto que não pôde ser parseado:", responseText);
          
          // Em caso de erro de parsing, retornamos dados simulados
          responseData = { 
            data: [],
            message: "Falha ao parsear resposta JSON",
            rawResponse: responseText.slice(0, 100)
          };
        }
      } else {
        // Se a resposta não é JSON mas o status é 200, podemos estar recebendo HTML ou outro formato
        console.log("⚠️ A API retornou uma resposta não-JSON, avaliando conteúdo");
        
        // Verificando se parece HTML (tem tags)
        if (responseText.includes('<html') || responseText.includes('<body')) {
          console.log("⚠️ A resposta parece ser HTML, usando dados simulados");
          responseData = { 
            data: [],
            message: "API retornou HTML em vez de JSON",
            isHtml: true,
            rawResponse: responseText.slice(0, 100)
          };
        } else {
          // Talvez seja texto plano com outra estrutura
          console.log("⚠️ A resposta é texto plano, usando dados simulados");
          responseData = { 
            data: [],
            message: "API retornou texto plano",
            rawResponse: responseText.slice(0, 100)
          };
        }
      }

      // Garantir que temos uma estrutura de dados consistente para retorno
      if (!responseData.data && response.ok) {
        // Se a resposta foi bem-sucedida mas não tem o campo 'data', criamos um
        console.log("⚠️ Resposta sem campo 'data', criando estrutura padrão");
        
        // Verificar se a resposta parece ser um array
        if (Array.isArray(responseData)) {
          return { data: responseData };
        } else {
          // Se é um objeto único, envolve em um array
          return { data: [responseData] };
        }
      }
      
      console.log("✅ Dados de usuários recuperados:", responseData.data?.length || 0, "usuários");
      return responseData;
    } catch (error) {
      console.error("❌ Falha ao buscar usuários na API direta:", error);
      
      // Em caso de erro, retornar estrutura vazia para não quebrar a UI
      return { data: [] };
    }
  }
};
