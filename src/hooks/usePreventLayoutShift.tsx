
import { useEffect } from "react";

/**
 * Hook para prevenir tremulação da tela durante navegação
 * Adiciona classes e estilos ao body para evitar saltos de layout
 */
export const usePreventLayoutShift = () => {
  useEffect(() => {
    // Adiciona classe para prevenir mudanças de layout que causam tremor
    document.body.classList.add("overflow-y-scroll");
    
    // Adiciona padding-right para compensar a barra de rolagem e evitar saltos
    document.body.style.paddingRight = "0px";
    document.body.style.overscrollBehavior = "none";
    
    return () => {
      // Remove as classes e estilos ao desmontar o componente
      document.body.classList.remove("overflow-y-scroll");
      document.body.style.paddingRight = "";
      document.body.style.overscrollBehavior = "";
    };
  }, []);
};
