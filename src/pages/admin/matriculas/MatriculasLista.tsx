
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import MatriculasLayout from "@/components/layout/MatriculasLayout";
import { toast } from "sonner";
import { useMatricula } from "@/hooks/useMatricula";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

const MatriculasLista: React.FC = () => {
  const [matriculas, setMatriculas] = useState<any[]>([]);
  const { buscarMatriculas, loading, error } = useMatricula();
  
  useEffect(() => {
    const carregarMatriculas = async () => {
      try {
        const dados = await buscarMatriculas();
        console.log("Matrículas carregadas:", dados);
        setMatriculas(dados || []);
      } catch (err) {
        console.error("Erro ao carregar matrículas:", err);
        toast.error("Erro ao carregar matrículas");
      }
    };
    
    carregarMatriculas();
  }, [buscarMatriculas]);

  const colunas = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "aluno_id",
      header: "Aluno",
    },
    {
      accessorKey: "curso_id",
      header: "Curso",
    },
    {
      accessorKey: "data_inicio",
      header: "Data de Início",
      cell: ({ row }: any) => {
        const data = row.getValue("data_inicio");
        return data ? new Date(data).toLocaleDateString() : "-";
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status");
        return (
          <span className={`px-2 py-1 rounded-full text-xs text-white ${
            status === 'ativo' ? 'bg-green-500' : 
            status === 'inativo' ? 'bg-red-500' : 
            status === 'trancado' ? 'bg-yellow-500' : 
            'bg-blue-500'
          }`}>
            {status}
          </span>
        );
      },
    }
  ];

  return (
    <MatriculasLayout>
      <div className="container mx-auto py-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Lista de Matrículas</h1>
          <Button asChild>
            <Link to="/admin/matriculas/nova">
              <PlusCircle className="mr-2 h-4 w-4" /> Nova Matrícula
            </Link>
          </Button>
        </div>
        
        <Card className="p-4">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <p>Carregando matrículas...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
              <p>Erro ao carregar matrículas. Tente novamente mais tarde.</p>
            </div>
          ) : matriculas.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-muted-foreground">Nenhuma matrícula encontrada.</p>
              <Button 
                variant="outline" 
                asChild 
                className="mt-4"
              >
                <Link to="/admin/matriculas/nova">
                  Criar Nova Matrícula
                </Link>
              </Button>
            </div>
          ) : (
            <DataTable
              columns={colunas}
              data={matriculas}
            />
          )}
        </Card>
      </div>
    </MatriculasLayout>
  );
};

export default MatriculasLista;
