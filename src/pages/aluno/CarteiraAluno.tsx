
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Download, Printer, Share2, QrCode } from "lucide-react";

const CarteiraAluno: React.FC = () => {
  // Dados mock do aluno
  const adminBypassEmail = localStorage.getItem('adminBypassEmail');
  const aluno = {
    nome: adminBypassEmail ? adminBypassEmail.split('@')[0].replace('.', ' ').split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ') : "Carlos Silva",
    matricula: "202501234",
    curso: "Desenvolvimento Web Frontend",
    validade: "31/12/2025",
    avatar: "/placeholder.svg"
  };

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
        <Card className="overflow-hidden">
          <div className="h-12 bg-gradient-to-r from-primary to-accent"></div>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarImage src={aluno.avatar} />
                  <AvatarFallback className="text-3xl">
                    {aluno.nome.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-primary text-white p-1 rounded-full">
                  <QrCode className="h-5 w-5" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mt-2">{aluno.nome}</h2>
              <p className="text-muted-foreground">Aluno(a)</p>
              
              <div className="grid grid-cols-2 gap-4 w-full my-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Nº de Matrícula</p>
                  <p className="font-medium">{aluno.matricula}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Validade</p>
                  <p className="font-medium">{aluno.validade}</p>
                </div>
              </div>
              
              <div className="w-full mt-2">
                <p className="text-sm text-muted-foreground">Curso</p>
                <p className="font-medium">{aluno.curso}</p>
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
              <button className="flex items-center justify-center w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 px-4 rounded-md font-medium gap-2">
                <Download className="h-5 w-5" />
                Baixar Carteira (PDF)
              </button>
              
              <button className="flex items-center justify-center w-full bg-muted hover:bg-muted/80 py-3 px-4 rounded-md font-medium gap-2">
                <Printer className="h-5 w-5" />
                Imprimir Carteira
              </button>
              
              <button className="flex items-center justify-center w-full bg-muted hover:bg-muted/80 py-3 px-4 rounded-md font-medium gap-2">
                <Share2 className="h-5 w-5" />
                Compartilhar
              </button>
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
                  do documento. Institucões podem escanear o código para confirmar sua 
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
    </div>
  );
};

export default CarteiraAluno;
