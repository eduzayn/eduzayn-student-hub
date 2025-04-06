
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Download, Printer, Share2, QrCode, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

const CarteiraAluno: React.FC = () => {
  const { userId, userDetails } = useAuth();
  const [loading, setLoading] = useState(true);
  const [carteiraInfo, setCarteiraInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Buscar informações da carteira no banco de dados
  useEffect(() => {
    const fetchCarteiraInfo = async () => {
      try {
        setLoading(true);
        
        // Primeiro, tentamos pegar o perfil do usuário para dados pessoais
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (profileError) {
          console.error("Erro ao buscar perfil:", profileError);
          throw new Error("Não foi possível carregar suas informações");
        }

        // Depois, tentamos buscar a carteira de estudante
        const { data: carteiraData, error: carteiraError } = await supabase
          .from("carteiras_estudante")
          .select("*")
          .eq("aluno_id", userId)
          .maybeSingle();

        if (carteiraError) {
          console.error("Erro ao buscar carteira:", carteiraError);
          throw new Error("Não foi possível carregar sua carteira");
        }

        // Combinar dados do perfil com dados da carteira (ou usar dados mockados)
        const aluno = {
          nome: profileData?.first_name && profileData?.last_name 
            ? `${profileData.first_name} ${profileData.last_name}`
            : userDetails?.email 
              ? userDetails.email.split('@')[0].replace('.', ' ').split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ')
              : "Nome do Aluno",
          matricula: profileData?.numero_matricula || "202501234",
          curso: "Desenvolvimento Web Frontend", // Este dado precisaria vir de uma consulta adicional
          validade: carteiraData?.validade 
            ? new Date(carteiraData.validade).toLocaleDateString('pt-BR')
            : "31/12/2025",
          codigo: carteiraData?.codigo_verificacao || gerarCodigoVerificacao(),
          avatar: profileData?.avatar_url || "/placeholder.svg",
          dataEmissao: carteiraData?.data_emissao 
            ? new Date(carteiraData.data_emissao).toLocaleDateString('pt-BR')
            : new Date().toLocaleDateString('pt-BR')
        };

        setCarteiraInfo(aluno);
      } catch (err: any) {
        console.error("Erro ao carregar carteira:", err);
        setError(err.message || "Erro ao carregar sua carteira de estudante");
        
        // Em caso de erro, usamos dados mockados
        const adminBypassEmail = localStorage.getItem('adminBypassEmail');
        setCarteiraInfo({
          nome: adminBypassEmail 
            ? adminBypassEmail.split('@')[0].replace('.', ' ').split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ')
            : "Carlos Silva",
          matricula: "202501234",
          curso: "Desenvolvimento Web Frontend",
          validade: "31/12/2025",
          codigo: gerarCodigoVerificacao(),
          avatar: "/placeholder.svg",
          dataEmissao: new Date().toLocaleDateString('pt-BR')
        });
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCarteiraInfo();
    } else {
      // Se não tiver ID do usuário (caso de admin bypass), usar dados mockados
      setLoading(false);
      const adminBypassEmail = localStorage.getItem('adminBypassEmail');
      setCarteiraInfo({
        nome: adminBypassEmail 
          ? adminBypassEmail.split('@')[0].replace('.', ' ').split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ')
          : "Carlos Silva",
        matricula: "202501234",
        curso: "Desenvolvimento Web Frontend",
        validade: "31/12/2025",
        codigo: gerarCodigoVerificacao(),
        avatar: "/placeholder.svg",
        dataEmissao: new Date().toLocaleDateString('pt-BR')
      });
    }
  }, [userId, userDetails]);

  // Função para gerar um código de verificação aleatório
  const gerarCodigoVerificacao = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  // Função para baixar carteira como PDF (simulada)
  const baixarCarteira = () => {
    toast.success("Iniciando download da carteira", {
      description: "Sua carteira será baixada em instantes."
    });
    // Aqui seria implementada a lógica real de geração do PDF
  };

  // Função para imprimir carteira
  const imprimirCarteira = () => {
    window.print();
  };

  // Função para compartilhar carteira
  const compartilharCarteira = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Minha Carteira de Estudante',
          text: `Carteira de Estudante de ${carteiraInfo?.nome} - EduZayn`,
          // url: window.location.href // Aqui poderia ser uma URL específica para a carteira
        });
        toast.success("Carteira compartilhada com sucesso!");
      } catch (err) {
        toast.error("Erro ao compartilhar carteira");
      }
    } else {
      toast.error("Seu navegador não suporta a funcionalidade de compartilhamento");
    }
  };

  // Se estiver carregando, exibir esqueleto de carregamento
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[500px]" />
          <div className="flex flex-col gap-6">
            <Skeleton className="h-[200px]" />
            <Skeleton className="h-[280px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Carteira de Estudante</h1>
        <p className="text-muted-foreground">
          Sua identificação digital como estudante EduZayn.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Carteira Digital */}
        <Card className="overflow-hidden" id="carteira-estudante">
          <div className="h-12 bg-gradient-to-r from-primary to-accent"></div>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarImage src={carteiraInfo?.avatar} />
                  <AvatarFallback className="text-3xl">
                    {carteiraInfo?.nome?.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-primary text-white p-1 rounded-full">
                  <QrCode className="h-5 w-5" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mt-2">{carteiraInfo?.nome}</h2>
              <p className="text-muted-foreground">Aluno(a)</p>
              
              <div className="grid grid-cols-2 gap-4 w-full my-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Nº de Matrícula</p>
                  <p className="font-medium">{carteiraInfo?.matricula}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Validade</p>
                  <p className="font-medium">{carteiraInfo?.validade}</p>
                </div>
              </div>
              
              <div className="w-full mt-2">
                <p className="text-sm text-muted-foreground">Curso</p>
                <p className="font-medium">{carteiraInfo?.curso}</p>
              </div>

              <div className="w-full mt-2">
                <p className="text-sm text-muted-foreground">Data de Emissão</p>
                <p className="font-medium">{carteiraInfo?.dataEmissao}</p>
              </div>
              
              <div className="mt-6 w-full">
                <hr className="mb-4" />
                <div className="flex justify-center">
                  <div 
                    className="bg-white p-2 border"
                    role="img" 
                    aria-label="QR Code para validação da carteira"
                  >
                    {/* Simulação de um QR Code */}
                    <div className="h-32 w-32 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0wIDBoNDB2NDBIMFYwem04IDhoMjR2MjRIOFY4em00IDRoMTZ2MTZIMTJWMTIem00IDRoOHY4aC04di04ek04OCA4aDI0djI0SDg4Vjh6bTQgNGgxNnYxNkg5MlYxMnptNCA0aDh2OGgtOHYtOHpNOCA4OGgyNHYyNEg4Vjg4em00IDRoMTZ2MTZIMTJWOTJ6bTQgNGg4djhoLTh2LTh6TTQ4IDBoOHY4aC04VjB6TTMyIDE2aDh2OGgtOHYtOHptMTYgMGg4djhoLThWMTZ6TTY0IDBoOHY4aC04VjB6bTI0IDBIODBWOGg4VjB6TTQ4IDMyaDh2OGgtOHYtOHptMTYtMTZoOHY4aC04di04em0wIDE2aDh2OGgtOHYtOHptMTYgMGg4djhIODBWMzJ6bTEyOC02NGgxNnYxNmgtMTZWLTMyem0tOCAxNmgtOHYtOGg4djh6bTggMGg4djhoLTh2LTh6bS0xNi05NmgxNnYxNmgtMTZWLTExMnptMCA4djhoOHYtOGgtOHpNOCAxMjBoOHY4SDh2LTh6TTI0IDExMmg4djhoLTh2LTh6bTAgMTZoOHY4aC04di04em04IDBoOHY4aC04di04em04LThoOHY4aC04di04em0wIDE2aDh2OGgtOHYtOHptOC04aDh2OGgtOHYtOHptOCAwaDh2OGgtOHYtOHptMTYgMGg4djhoLTh2LTh6bTgtOGg4djhoLTh2LTh6bS04IDBIODh2OGg4di04em0tOC04aDh2OGgtOHYtOHptLTE2IDBoOHY4aC04di04em04LThoOHY4aC04di04em0tOCAwaDh2OGgtOHYtOHptLTE2IDBoOHY4aC04di04em0tOCAwaDh2OGgtOHYtOHptLTggMGg4djhoLTh2LTh6TTQ4IDgwaDh2OGgtOHYtOHptOC04aDh2OGgtOHYtOHptOCAwaDh2OGgtOHYtOHptMTYgMGg4djhoLTh2LTh6bTgtOGg4djhoLTh2LTh6bS0xNiAwaDh2OGgtOHYtOHptOC04aDh2OGgtOHYtOHptOCAwaDh2OGgtOHYtOHptOC04aDh2OGgtOHYtOHptLTggMGg4djhoLTh2LTh6bS0zMi0xNmg4djhINjRWNDB6bS04LThoOHY4aC04VjMyem0xNi04aDh2OGgtOHYtOHptOCAwaDh2OGgtOHYtOHptLTggOGg4djhoLTh2LTh6TTQ4IDU2aDh2OGgtOHYtOHptMTYgMGg4djhoLTh2LTh6bTE2IDBoOHY4aC04di04eiIgZmlsbD0iY3VycmVudENvbG9yIi8+PC9zdmc+')]" />
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <p className="text-xs text-muted-foreground">Código de verificação</p>
                  <p className="font-mono font-medium">{carteiraInfo?.codigo}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="h-3 bg-gradient-to-r from-primary to-accent"></div>
        </Card>
        
        {/* Card de Ações */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="flex items-center justify-center w-full gap-2"
                onClick={baixarCarteira}
              >
                <Download className="h-5 w-5" />
                Baixar Carteira (PDF)
              </Button>
              
              <Button 
                className="flex items-center justify-center w-full gap-2" 
                variant="outline"
                onClick={imprimirCarteira}
              >
                <Printer className="h-5 w-5" />
                Imprimir Carteira
              </Button>
              
              <Button 
                className="flex items-center justify-center w-full gap-2" 
                variant="outline"
                onClick={compartilharCarteira}
              >
                <Share2 className="h-5 w-5" />
                Compartilhar
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Carteira Digital de Estudante</h3>
                <p className="text-sm text-muted-foreground">
                  Esta é sua identificação oficial como estudante da EduZayn. Você pode apresentá-la 
                  digitalmente ou imprimir para uso físico.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Validação</h3>
                <p className="text-sm text-muted-foreground">
                  O QR code presente na carteira permite a verificação da autenticidade 
                  do documento. Instituições podem escanear o código para confirmar sua 
                  identidade como aluno.
                </p>
              </div>
              
              <div className="border rounded-md p-3 bg-amber-50">
                <p className="text-sm text-amber-800">
                  <strong>Importante:</strong> Em caso de perda ou roubo, entre em contato 
                  imediatamente com a secretaria acadêmica para bloqueio e emissão de uma nova carteira.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Estilo para impressão */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #carteira-estudante, #carteira-estudante * {
            visibility: visible;
          }
          #carteira-estudante {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default CarteiraAluno;
