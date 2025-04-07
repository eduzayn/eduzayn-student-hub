
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import useGatewayPagamento from "@/hooks/useGatewayPagamento";

// URL base correta para funções do Supabase
const SUPABASE_FUNCTION_BASE_URL = "https://bioarzkfmcobctblzztm.supabase.co/functions/v1";

export const useMatriculaPagamento = () => {
  const navigate = useNavigate();
  const { processarPagamento } = useGatewayPagamento();
  const [pagamentoInfo, setPagamentoInfo] = useState<{
    link?: string;
    copiado: boolean;
    enviado: boolean;
  }>({ copiado: false, enviado: false });
  
  const gerarLinkPagamento = async (
    matriculaId: string, 
    gateway: string, 
    params: any
  ) => {
    const pagamentoParams = {
      matricula_id: matriculaId,
      ...params
    };
    
    const resultadoPagamento = await processarPagamento(gateway, pagamentoParams);
    
    if (!resultadoPagamento.success) {
      toast.warning("Matrícula criada, mas houve um problema ao configurar o pagamento");
      return false;
    } 
    
    toast.success("Matrícula e pagamento configurados com sucesso!");
    
    if (resultadoPagamento.invoiceUrl) {
      setPagamentoInfo({
        link: resultadoPagamento.invoiceUrl,
        copiado: false,
        enviado: false
      });
      
      if (params.customerData?.email && resultadoPagamento.invoiceUrl) {
        setTimeout(() => {
          console.log(`E-mail enviado para ${params.customerData.email} com link de pagamento: ${resultadoPagamento.invoiceUrl}`);
          setPagamentoInfo(prev => ({...prev, enviado: true}));
          toast.success(`E-mail com link de pagamento enviado para ${params.customerData.email}`);
        }, 1500);
      }
    }
    
    return !!resultadoPagamento.invoiceUrl;
  };
  
  const copiarLinkPagamento = () => {
    if (pagamentoInfo.link) {
      navigator.clipboard.writeText(pagamentoInfo.link);
      setPagamentoInfo(prev => ({...prev, copiado: true}));
      toast.success("Link de pagamento copiado para a área de transferência");
      
      setTimeout(() => setPagamentoInfo(prev => ({...prev, copiado: false})), 3000);
    }
  };
  
  const redirecionarParaMatriculas = () => {
    navigate("/admin/matriculas");
  };
  
  const criarNovaMatricula = () => {
    navigate("/admin/matriculas/nova");
  };

  return {
    pagamentoInfo,
    gerarLinkPagamento,
    copiarLinkPagamento,
    redirecionarParaMatriculas,
    criarNovaMatricula
  };
};
