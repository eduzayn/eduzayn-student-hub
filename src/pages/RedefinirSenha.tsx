
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const resetSchema = z.object({
  senha: z.string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .max(100, "A senha é muito longa"),
  confirmarSenha: z.string()
    .min(1, "Confirme sua senha"),
}).refine(data => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

type ResetFormValues = z.infer<typeof resetSchema>;

const RedefinirSenha: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extrair parâmetros da URL
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location]);

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      senha: "",
      confirmarSenha: "",
    },
  });

  const onSubmit = async (values: ResetFormValues) => {
    setIsLoading(true);
    setStatusMessage(null);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.senha
      });
      
      if (error) {
        throw error;
      }
      
      setStatusMessage({
        type: "success",
        message: "Senha atualizada com sucesso!",
      });
      
      toast.success("Senha atualizada com sucesso!", {
        description: "Você será redirecionado para a página de login."
      });
      
      form.reset();
      
      // Após 3 segundos, redirecionar para a página de login
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      console.error("Erro ao redefinir senha:", error);
      setStatusMessage({
        type: "error",
        message: error.message || "Ocorreu um erro ao redefinir sua senha. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Redefinir Senha</CardTitle>
          <CardDescription>
            {email ? `Crie uma nova senha para ${email}` : "Crie uma nova senha para sua conta."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {statusMessage && (
            <Alert variant={statusMessage.type === "error" ? "destructive" : "default"} className="mb-4">
              {statusMessage.type === "error" ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              <AlertDescription>{statusMessage.message}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="senha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmarSenha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirme a Nova Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Atualizando..." : "Redefinir Senha"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => navigate("/login")}>
            Voltar para o login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RedefinirSenha;
