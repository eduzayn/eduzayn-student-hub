
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Contrato, Aditivo } from "@/types/matricula";

interface ModeloContrato {
  id?: string;
  titulo: string;
  categoria?: string;
  versao: string;
  conteudo: string;
}

export const useContratos = () => {
  const [carregando, setCarregando] = useState(false);
  
  // Buscar todos os contratos do aluno
  const buscarContratosAluno = async (alunoId: string) => {
    setCarregando(true);
    try {
      // Em uma implementação real, buscaríamos da API/banco de dados
      // Aqui vamos simular com dados estáticos para demonstração
      
      // Simulando dados de contrato
      const contrato: Contrato = {
        id: "c1",
        aluno_id: alunoId,
        matricula_id: "m1",
        aluno: {
          nome: "Nome do Aluno",
          email: "aluno@exemplo.com"
        },
        matricula: {
          id: "m1",
          curso: "Nome do Curso"
        },
        titulo: "Contrato de Prestação de Serviços Educacionais",
        codigo: "CONT-20230001",
        data_geracao: new Date().toISOString(),
        assinado: false,
        versao: "1.0",
        conteudo: `
          CONTRATO DE PRESTAÇÃO DE SERVIÇOS EDUCACIONAIS

          Pelo presente instrumento particular de Contrato de Prestação de Serviços Educacionais, de um lado, a INSTITUIÇÃO DE ENSINO XYZ, inscrita no CNPJ sob n° 00.000.000/0001-00, com sede na Rua Exemplo, n° 123, neste ato representada por seu representante legal, doravante denominada simplesmente CONTRATADA, e de outro lado, o(a) ALUNO(A), doravante denominado(a) CONTRATANTE, têm entre si justo e contratado o seguinte:

          1. DO OBJETO
          1.1 O presente contrato tem por objeto a prestação de serviços educacionais pela CONTRATADA ao CONTRATANTE, no curso de Nome do Curso, na modalidade EAD, com duração de 12 meses.

          2. DO PRAZO
          2.1 O presente contrato vigorará pelo período de duração do curso, conforme estabelecido no item 1.1.
          
          3. DO VALOR E FORMA DE PAGAMENTO
          3.1 O valor total do curso é de R$ 1.200,00 (mil e duzentos reais), que poderá ser pago à vista ou parcelado em até 12 (doze) vezes de R$ 100,00 (cem reais).
          
          E por estarem justos e contratados, assinam o presente instrumento em duas vias de igual teor e forma.
        `
      };
      
      return [contrato];
    } catch (error) {
      console.error("Erro ao buscar contratos:", error);
      throw new Error("Não foi possível buscar os contratos");
    } finally {
      setCarregando(false);
    }
  };
  
  // Assinar contrato
  const assinarContrato = async (contratoId: string) => {
    setCarregando(true);
    try {
      // Simulação de assinatura do contrato
      // Em uma implementação real, este código seria substituído por uma chamada à API
      
      // Simular um atraso para representar processamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log(`Contrato ${contratoId} assinado com sucesso`);
      return true;
    } catch (error) {
      console.error("Erro ao assinar contrato:", error);
      throw new Error("Não foi possível assinar o contrato");
    } finally {
      setCarregando(false);
    }
  };
  
  // Listar modelos de contrato
  const listarModelos = async () => {
    setCarregando(true);
    try {
      // Implementação simulada para demonstração
      return [
        {
          id: "m1",
          titulo: "Contrato de Prestação de Serviços Educacionais - Graduação",
          categoria: "graduacao",
          versao: "1.0",
          data_criacao: "2023-01-15T10:30:00Z"
        },
        {
          id: "m2",
          titulo: "Contrato de Prestação de Serviços Educacionais - Pós-Graduação",
          categoria: "pos-graduacao",
          versao: "1.1",
          data_criacao: "2023-03-22T14:15:00Z"
        },
        {
          id: "m3",
          titulo: "Contrato de Prestação de Serviços Educacionais - Cursos Livres",
          categoria: "curso-livre",
          versao: "1.0",
          data_criacao: "2023-05-10T09:45:00Z"
        }
      ];
    } catch (error) {
      console.error("Erro ao listar modelos:", error);
      throw error;
    } finally {
      setCarregando(false);
    }
  };
  
  // Carregar modelo específico
  const carregarModelo = async (modeloId: string) => {
    setCarregando(true);
    try {
      // Implementação simulada
      return {
        id: modeloId,
        titulo: "Contrato de Prestação de Serviços Educacionais - Graduação",
        categoria: "graduacao",
        versao: "1.0",
        conteudo: `
          CONTRATO DE PRESTAÇÃO DE SERVIÇOS EDUCACIONAIS

          Pelo presente instrumento particular de Contrato de Prestação de Serviços Educacionais, de um lado, a INSTITUIÇÃO DE ENSINO XYZ, inscrita no CNPJ sob n° 00.000.000/0001-00, com sede na Rua Exemplo, n° 123, neste ato representada por seu representante legal, doravante denominada simplesmente CONTRATADA, e de outro lado, o(a) ALUNO(A) {{nome_aluno}}, doravante denominado(a) CONTRATANTE, têm entre si justo e contratado o seguinte:

          1. DO OBJETO
          1.1 O presente contrato tem por objeto a prestação de serviços educacionais pela CONTRATADA ao CONTRATANTE, no curso de {{nome_curso}}, na modalidade EAD, com duração de 12 meses.

          2. DO PRAZO
          2.1 O presente contrato vigorará pelo período de duração do curso, conforme estabelecido no item 1.1.
          
          3. DO VALOR E FORMA DE PAGAMENTO
          3.1 O valor total do curso é de R$ {{valor_curso}} (mil e duzentos reais), que poderá ser pago à vista ou parcelado em até 12 (doze) vezes de R$ {{valor_mensalidade}} (cem reais).
          
          E por estarem justos e contratados, assinam o presente instrumento em duas vias de igual teor e forma.
          
          Data: {{data_atual}}
        `
      };
    } catch (error) {
      console.error("Erro ao carregar modelo:", error);
      throw error;
    } finally {
      setCarregando(false);
    }
  };
  
  // Salvar modelo de contrato
  const salvarModelo = async (modelo: ModeloContrato) => {
    setCarregando(true);
    try {
      // Implementação simulada
      console.log("Modelo salvo:", modelo);
      return modelo.id || "novo-id";
    } catch (error) {
      console.error("Erro ao salvar modelo:", error);
      throw error;
    } finally {
      setCarregando(false);
    }
  };
  
  // Excluir modelo
  const excluirModelo = async (modeloId: string) => {
    setCarregando(true);
    try {
      // Implementação simulada
      console.log("Modelo excluído:", modeloId);
      return true;
    } catch (error) {
      console.error("Erro ao excluir modelo:", error);
      throw error;
    } finally {
      setCarregando(false);
    }
  };
  
  // Gerar contrato para matrícula
  const gerarContrato = async (matriculaId: string, modeloId: string) => {
    setCarregando(true);
    try {
      // Implementação simulada
      console.log(`Gerando contrato para matrícula ${matriculaId} usando modelo ${modeloId}`);
      return "id-do-novo-contrato";
    } catch (error) {
      console.error("Erro ao gerar contrato:", error);
      throw error;
    } finally {
      setCarregando(false);
    }
  };
  
  return {
    carregando,
    buscarContratosAluno,
    assinarContrato,
    listarModelos,
    carregarModelo,
    salvarModelo,
    excluirModelo,
    gerarContrato
  };
};
