
import { useState } from "react";

/**
 * Hook simplificado para gerenciamento de matrículas - 
 * Versão temporária enquanto a integração com LearnWorlds é reformulada
 */
export const useMatricula = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Funções temporárias para simular o comportamento real
  const buscarMatriculas = async () => {
    setLoading(true);
    try {
      console.log("Simulando busca de matrículas");
      return [];
    } catch (error) {
      setError("Erro ao buscar matrículas");
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  const buscarMatricula = async () => {
    setLoading(true);
    try {
      console.log("Simulando busca de matrícula específica");
      return null;
    } catch (error) {
      setError("Erro ao buscar matrícula");
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const criarMatricula = async (dados: any) => {
    setLoading(true);
    try {
      console.log("Simulando criação de matrícula", dados);
      return { id: "temp-" + Date.now(), ...dados };
    } catch (error) {
      setError("Erro ao criar matrícula");
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const atualizarMatricula = async () => {
    setLoading(true);
    try {
      console.log("Simulando atualização de matrícula");
      return true;
    } catch (error) {
      setError("Erro ao atualizar matrícula");
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const atualizarStatusMatricula = async () => {
    setLoading(true);
    try {
      console.log("Simulando atualização de status de matrícula");
      return true;
    } catch (error) {
      setError("Erro ao atualizar status de matrícula");
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const buscarHistoricoMatricula = async () => {
    setLoading(true);
    try {
      console.log("Simulando busca de histórico de matrícula");
      return [];
    } catch (error) {
      setError("Erro ao buscar histórico de matrícula");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    buscarMatriculas,
    buscarMatricula,
    criarMatricula,
    atualizarMatricula,
    atualizarStatusMatricula,
    buscarHistoricoMatricula
  };
};
