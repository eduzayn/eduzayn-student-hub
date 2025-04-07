
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const resetSchema = z.object({
  email: z.string()
    .email("Digite um email válido")
    .min(1, "O email é obrigatório"),
});

type ResetFormValues = z.infer<typeof resetSchema>;

const EsqueciSenha: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const navigate = useNavigate();

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ResetFormValues) => {
    setIsLoading(true);
    setStatusMessage(null);
    
    try {
      // Primeiro, usar a API do Supabase para iniciar o fluxo de redefinição de senha
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      });
      
      if (error) {
        throw error;
      }
      
      // Em seguida, enviar um e-mail personalizado
      try {
        const resetUrl = `${window.location.origin}/redefinir-senha?email=${encodeURIComponent(values.email)}`;
        
        const response = await supabase.functions.invoke('send-reset-password', {
          body: {
            email: values.email,
            resetUrl: resetUrl
          }
        });
        
        if (response.error) {
          console.warn("Erro ao enviar e-mail personalizado:", response.error);
          // Não falhar completamente, pois o Supabase já enviou o e-mail padrão
        }
      } catch (emailError) {
        console.warn("Erro ao enviar e-mail personalizado:", emailError);
        // Não falhar completamente, pois o Supabase já enviou o e-mail padrão
      }
      
      setStatusMessage({
        type: "success",
        message: "Enviamos um link para redefinição de senha no seu email. Verifique sua caixa de entrada.",
      });
      
      toast.success("Email enviado com sucesso!", {
        description: "Verifique sua caixa de entrada para redefinir sua senha."
      });
      
      form.reset();
    } catch (error: any) {
      console.error("Erro ao solicitar redefinição de senha:", error);
      setStatusMessage({
        type: "error",
        message: error.message || "Ocorreu um erro ao processar sua solicitação. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Recuperar Senha</CardTitle>
          <CardDescription>
            Digite seu e-mail para receber um link de redefinição de senha.
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar link de recuperação"}
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

export default EsqueciSenha;
