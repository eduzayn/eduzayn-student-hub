
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Copy, ExternalLink, X, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface MatriculaStep4Props {
  alunoSelecionado: any;
  cursoSelecionado: any;
  matriculaConfig: any;
  pagamentoInfo: any;
  learnWorldsMatriculaInfo?: any;
  onVoltar: () => void;
  onNova: () => void;
}

const MatriculaStep4: React.FC<MatriculaStep4Props> = ({
  alunoSelecionado,
  cursoSelecionado,
  matriculaConfig,
  pagamentoInfo,
  learnWorldsMatriculaInfo,
  onVoltar,
  onNova,
}) => {
  const copiarLink = () => {
    if (pagamentoInfo?.link) {
      navigator.clipboard.writeText(pagamentoInfo.link);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Matrícula Concluída</h2>

      <Card className="bg-green-50 border-green-200">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-green-700">
            <CheckCircle className="mr-2 h-5 w-5" />
            Matrícula realizada com sucesso
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dados do Aluno</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Nome:</span> {alunoSelecionado?.nome}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {alunoSelecionado?.email}
              </p>
              {alunoSelecionado?.cpf && (
                <p>
                  <span className="font-semibold">CPF:</span> {alunoSelecionado.cpf}
                </p>
              )}
              {alunoSelecionado?.learnworlds_id && (
                <p>
                  <span className="font-semibold">ID LearnWorlds:</span>{" "}
                  {alunoSelecionado.learnworlds_id}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dados do Curso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Título:</span>{" "}
                {cursoSelecionado?.titulo}
              </p>
              <p>
                <span className="font-semibold">Modalidade:</span>{" "}
                {cursoSelecionado?.modalidade}
              </p>
              <p>
                <span className="font-semibold">Valor da Matrícula:</span> R${" "}
                {matriculaConfig?.valor_matricula}
              </p>
              {cursoSelecionado?.learning_worlds_id && (
                <p>
                  <span className="font-semibold">ID LearnWorlds:</span>{" "}
                  {cursoSelecionado.learning_worlds_id}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações da Matrícula no LearnWorlds */}
      {learnWorldsMatriculaInfo && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg text-blue-700">
              Matrícula no LearnWorlds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-semibold mr-2">Status:</span>
                <Badge variant={learnWorldsMatriculaInfo.status === "active" ? "success" : "secondary"}>
                  {learnWorldsMatriculaInfo.status === "active" ? "Ativo" : learnWorldsMatriculaInfo.status}
                </Badge>
              </div>
              {learnWorldsMatriculaInfo.id && (
                <p>
                  <span className="font-semibold">ID da Matrícula:</span>{" "}
                  {learnWorldsMatriculaInfo.id}
                </p>
              )}
              {learnWorldsMatriculaInfo.enrollmentDate && (
                <p>
                  <span className="font-semibold">Data da Matrícula:</span>{" "}
                  {new Date(learnWorldsMatriculaInfo.enrollmentDate).toLocaleDateString('pt-BR')}
                </p>
              )}
              {learnWorldsMatriculaInfo.simulatedResponse && (
                <Alert className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Modo Simulado</AlertTitle>
                  <AlertDescription>
                    Esta matrícula foi processada em modo offline/simulado.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {pagamentoInfo?.link && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-lg text-yellow-700">
              Link de Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <input
                type="text"
                readOnly
                value={pagamentoInfo.link}
                className="flex-1 bg-white p-2 border rounded-l"
              />
              <Button
                variant="outline"
                className="rounded-l-none"
                onClick={copiarLink}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copiar
              </Button>
            </div>

            {pagamentoInfo.enviado && (
              <Alert className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>E-mail enviado</AlertTitle>
                <AlertDescription>
                  O link de pagamento foi enviado para o email do aluno.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => window.open(pagamentoInfo.link, "_blank")}
              >
                <ExternalLink className="h-4 w-4" /> Abrir Link
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between pt-4">
        <Button onClick={onVoltar}>Voltar para Matrículas</Button>
        <Button onClick={onNova} variant="default">
          Nova Matrícula
        </Button>
      </div>
    </div>
  );
};

export default MatriculaStep4;
