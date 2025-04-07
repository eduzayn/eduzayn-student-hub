
// Arquivo para ampliar as variantes do componente Badge
import { VariantProps } from "class-variance-authority";
import { badgeVariants } from "@/components/ui/badge";

// Adiciona a variante "success" ao tipo de variantes do Badge
export type BadgeVariantsWithSuccess = VariantProps<typeof badgeVariants> & {
  variant?: "default" | "destructive" | "outline" | "secondary" | "success";
};

// Função para obter a variante baseada no status da matrícula
export const getStatusVariant = (status: string): "default" | "destructive" | "outline" | "secondary" | "success" => {
  switch (status?.toLowerCase()) {
    case "ativo":
      return "success";
    case "pendente":
      return "secondary";
    case "cancelado":
    case "inativo":
      return "destructive";
    default:
      return "outline";
  }
};
