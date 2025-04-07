export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      aditivos_contrato: {
        Row: {
          assinado: boolean | null
          codigo: string | null
          conteudo: string
          contrato_id: string
          created_at: string
          data_aceite: string | null
          data_geracao: string
          hash_validacao: string | null
          id: string
          ip_aceite: string | null
          motivo: string
          titulo: string
          updated_at: string
          url_aditivo_assinado: string | null
          versao: string
        }
        Insert: {
          assinado?: boolean | null
          codigo?: string | null
          conteudo: string
          contrato_id: string
          created_at?: string
          data_aceite?: string | null
          data_geracao?: string
          hash_validacao?: string | null
          id?: string
          ip_aceite?: string | null
          motivo: string
          titulo: string
          updated_at?: string
          url_aditivo_assinado?: string | null
          versao: string
        }
        Update: {
          assinado?: boolean | null
          codigo?: string | null
          conteudo?: string
          contrato_id?: string
          created_at?: string
          data_aceite?: string | null
          data_geracao?: string
          hash_validacao?: string | null
          id?: string
          ip_aceite?: string | null
          motivo?: string
          titulo?: string
          updated_at?: string
          url_aditivo_assinado?: string | null
          versao?: string
        }
        Relationships: [
          {
            foreignKeyName: "aditivos_contrato_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          },
        ]
      }
      aulas: {
        Row: {
          data_atualizacao: string | null
          data_criacao: string | null
          descricao: string | null
          duracao: number | null
          id: string
          learning_worlds_id: string | null
          modulo_id: string
          ordem: number
          tipo: string | null
          titulo: string
          url: string | null
        }
        Insert: {
          data_atualizacao?: string | null
          data_criacao?: string | null
          descricao?: string | null
          duracao?: number | null
          id?: string
          learning_worlds_id?: string | null
          modulo_id: string
          ordem: number
          tipo?: string | null
          titulo: string
          url?: string | null
        }
        Update: {
          data_atualizacao?: string | null
          data_criacao?: string | null
          descricao?: string | null
          duracao?: number | null
          id?: string
          learning_worlds_id?: string | null
          modulo_id?: string
          ordem?: number
          tipo?: string | null
          titulo?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "aulas_modulo_id_fkey"
            columns: ["modulo_id"]
            isOneToOne: false
            referencedRelation: "modulos_curso"
            referencedColumns: ["id"]
          },
        ]
      }
      carteiras_estudante: {
        Row: {
          aluno_id: string
          codigo_verificacao: string
          data_atualizacao: string | null
          data_criacao: string | null
          data_emissao: string | null
          id: string
          qr_code_url: string | null
          validade: string
        }
        Insert: {
          aluno_id: string
          codigo_verificacao: string
          data_atualizacao?: string | null
          data_criacao?: string | null
          data_emissao?: string | null
          id?: string
          qr_code_url?: string | null
          validade: string
        }
        Update: {
          aluno_id?: string
          codigo_verificacao?: string
          data_atualizacao?: string | null
          data_criacao?: string | null
          data_emissao?: string | null
          id?: string
          qr_code_url?: string | null
          validade?: string
        }
        Relationships: [
          {
            foreignKeyName: "carteiras_estudante_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      contratos: {
        Row: {
          aluno_id: string
          assinado: boolean | null
          codigo: string | null
          conteudo: string
          created_at: string
          data_aceite: string | null
          data_geracao: string
          hash_validacao: string | null
          id: string
          ip_aceite: string | null
          matricula_id: string | null
          titulo: string
          updated_at: string
          url_contrato_assinado: string | null
          versao: string
        }
        Insert: {
          aluno_id: string
          assinado?: boolean | null
          codigo?: string | null
          conteudo: string
          created_at?: string
          data_aceite?: string | null
          data_geracao?: string
          hash_validacao?: string | null
          id?: string
          ip_aceite?: string | null
          matricula_id?: string | null
          titulo: string
          updated_at?: string
          url_contrato_assinado?: string | null
          versao: string
        }
        Update: {
          aluno_id?: string
          assinado?: boolean | null
          codigo?: string | null
          conteudo?: string
          created_at?: string
          data_aceite?: string | null
          data_geracao?: string
          hash_validacao?: string | null
          id?: string
          ip_aceite?: string | null
          matricula_id?: string | null
          titulo?: string
          updated_at?: string
          url_contrato_assinado?: string | null
          versao?: string
        }
        Relationships: [
          {
            foreignKeyName: "contratos_matricula_id_fkey"
            columns: ["matricula_id"]
            isOneToOne: false
            referencedRelation: "matriculas"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          discount_price: number | null
          duration: string | null
          id: string
          image_url: string | null
          is_active: boolean
          learning_worlds_id: string | null
          price: number
          short_description: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          discount_price?: number | null
          duration?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          learning_worlds_id?: string | null
          price: number
          short_description?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          discount_price?: number | null
          duration?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          learning_worlds_id?: string | null
          price?: number
          short_description?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      cursos: {
        Row: {
          ativo: boolean | null
          carga_horaria: number | null
          codigo: string
          data_atualizacao: string | null
          data_criacao: string | null
          descricao: string | null
          id: string
          imagem_url: string | null
          learning_worlds_id: string | null
          modalidade: Database["public"]["Enums"]["modalidade_curso"]
          titulo: string
          total_parcelas: number | null
          valor_mensalidade: number | null
          valor_total: number | null
        }
        Insert: {
          ativo?: boolean | null
          carga_horaria?: number | null
          codigo: string
          data_atualizacao?: string | null
          data_criacao?: string | null
          descricao?: string | null
          id?: string
          imagem_url?: string | null
          learning_worlds_id?: string | null
          modalidade?: Database["public"]["Enums"]["modalidade_curso"]
          titulo: string
          total_parcelas?: number | null
          valor_mensalidade?: number | null
          valor_total?: number | null
        }
        Update: {
          ativo?: boolean | null
          carga_horaria?: number | null
          codigo?: string
          data_atualizacao?: string | null
          data_criacao?: string | null
          descricao?: string | null
          id?: string
          imagem_url?: string | null
          learning_worlds_id?: string | null
          modalidade?: Database["public"]["Enums"]["modalidade_curso"]
          titulo?: string
          total_parcelas?: number | null
          valor_mensalidade?: number | null
          valor_total?: number | null
        }
        Relationships: []
      }
      documentos_alunos: {
        Row: {
          aluno_id: string
          arquivo_url: string | null
          data_analise: string | null
          data_atualizacao: string | null
          data_criacao: string | null
          data_envio: string | null
          id: string
          motivo_rejeicao: string | null
          status: Database["public"]["Enums"]["status_documento"] | null
          tipo_documento_id: string
        }
        Insert: {
          aluno_id: string
          arquivo_url?: string | null
          data_analise?: string | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          data_envio?: string | null
          id?: string
          motivo_rejeicao?: string | null
          status?: Database["public"]["Enums"]["status_documento"] | null
          tipo_documento_id: string
        }
        Update: {
          aluno_id?: string
          arquivo_url?: string | null
          data_analise?: string | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          data_envio?: string | null
          id?: string
          motivo_rejeicao?: string | null
          status?: Database["public"]["Enums"]["status_documento"] | null
          tipo_documento_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentos_alunos_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_alunos_tipo_documento_id_fkey"
            columns: ["tipo_documento_id"]
            isOneToOne: false
            referencedRelation: "tipos_documentos"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          asaas_subscription_id: string | null
          course_id: string
          created_at: string
          enrollment_date: string
          expiration_date: string | null
          id: string
          last_access_date: string | null
          learning_worlds_enrollment_id: string | null
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          asaas_subscription_id?: string | null
          course_id: string
          created_at?: string
          enrollment_date?: string
          expiration_date?: string | null
          id?: string
          last_access_date?: string | null
          learning_worlds_enrollment_id?: string | null
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          asaas_subscription_id?: string | null
          course_id?: string
          created_at?: string
          enrollment_date?: string
          expiration_date?: string | null
          id?: string
          last_access_date?: string | null
          learning_worlds_enrollment_id?: string | null
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      historico_matricula: {
        Row: {
          alterado_por: string | null
          created_at: string
          data_alteracao: string
          id: string
          matricula_id: string
          motivo: string | null
          observacoes: string | null
          status_anterior: string
          status_novo: string
        }
        Insert: {
          alterado_por?: string | null
          created_at?: string
          data_alteracao?: string
          id?: string
          matricula_id: string
          motivo?: string | null
          observacoes?: string | null
          status_anterior: string
          status_novo: string
        }
        Update: {
          alterado_por?: string | null
          created_at?: string
          data_alteracao?: string
          id?: string
          matricula_id?: string
          motivo?: string | null
          observacoes?: string | null
          status_anterior?: string
          status_novo?: string
        }
        Relationships: [
          {
            foreignKeyName: "historico_matricula_matricula_id_fkey"
            columns: ["matricula_id"]
            isOneToOne: false
            referencedRelation: "matriculas"
            referencedColumns: ["id"]
          },
        ]
      }
      matriculas: {
        Row: {
          aluno_id: string
          curso_id: string
          data_atualizacao: string | null
          data_conclusao: string | null
          data_criacao: string | null
          data_inicio: string | null
          forma_ingresso: string | null
          id: string
          learning_worlds_enrollment_id: string | null
          observacoes: string | null
          origem_matricula: string | null
          progresso: number | null
          status: Database["public"]["Enums"]["status_matricula"] | null
          turno: string | null
        }
        Insert: {
          aluno_id: string
          curso_id: string
          data_atualizacao?: string | null
          data_conclusao?: string | null
          data_criacao?: string | null
          data_inicio?: string | null
          forma_ingresso?: string | null
          id?: string
          learning_worlds_enrollment_id?: string | null
          observacoes?: string | null
          origem_matricula?: string | null
          progresso?: number | null
          status?: Database["public"]["Enums"]["status_matricula"] | null
          turno?: string | null
        }
        Update: {
          aluno_id?: string
          curso_id?: string
          data_atualizacao?: string | null
          data_conclusao?: string | null
          data_criacao?: string | null
          data_inicio?: string | null
          forma_ingresso?: string | null
          id?: string
          learning_worlds_enrollment_id?: string | null
          observacoes?: string | null
          origem_matricula?: string | null
          progresso?: number | null
          status?: Database["public"]["Enums"]["status_matricula"] | null
          turno?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matriculas_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matriculas_curso_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "cursos"
            referencedColumns: ["id"]
          },
        ]
      }
      modulos_curso: {
        Row: {
          curso_id: string
          data_atualizacao: string | null
          data_criacao: string | null
          descricao: string | null
          id: string
          ordem: number
          titulo: string
        }
        Insert: {
          curso_id: string
          data_atualizacao?: string | null
          data_criacao?: string | null
          descricao?: string | null
          id?: string
          ordem: number
          titulo: string
        }
        Update: {
          curso_id?: string
          data_atualizacao?: string | null
          data_criacao?: string | null
          descricao?: string | null
          id?: string
          ordem?: number
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "modulos_curso_curso_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "cursos"
            referencedColumns: ["id"]
          },
        ]
      }
      pagamentos_matricula: {
        Row: {
          comprovante_url: string | null
          created_at: string
          data_pagamento: string | null
          data_vencimento: string
          desconto: number | null
          forma_pagamento: string
          gateway: string
          gateway_payment_id: string | null
          id: string
          link_pagamento: string | null
          matricula_id: string
          status: Database["public"]["Enums"]["status_pagamento_matricula"]
          tipo: string
          updated_at: string
          valor: number
        }
        Insert: {
          comprovante_url?: string | null
          created_at?: string
          data_pagamento?: string | null
          data_vencimento: string
          desconto?: number | null
          forma_pagamento: string
          gateway: string
          gateway_payment_id?: string | null
          id?: string
          link_pagamento?: string | null
          matricula_id: string
          status?: Database["public"]["Enums"]["status_pagamento_matricula"]
          tipo: string
          updated_at?: string
          valor: number
        }
        Update: {
          comprovante_url?: string | null
          created_at?: string
          data_pagamento?: string | null
          data_vencimento?: string
          desconto?: number | null
          forma_pagamento?: string
          gateway?: string
          gateway_payment_id?: string | null
          id?: string
          link_pagamento?: string | null
          matricula_id?: string
          status?: Database["public"]["Enums"]["status_pagamento_matricula"]
          tipo?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_matricula_matricula_id_fkey"
            columns: ["matricula_id"]
            isOneToOne: false
            referencedRelation: "matriculas"
            referencedColumns: ["id"]
          },
        ]
      }
      parcelas: {
        Row: {
          aluno_id: string
          comprovante_url: string | null
          curso_id: string
          data_atualizacao: string | null
          data_criacao: string | null
          data_pagamento: string | null
          data_vencimento: string
          id: string
          link_boleto: string | null
          numero_parcela: number
          status: Database["public"]["Enums"]["status_pagamento"] | null
          valor: number
        }
        Insert: {
          aluno_id: string
          comprovante_url?: string | null
          curso_id: string
          data_atualizacao?: string | null
          data_criacao?: string | null
          data_pagamento?: string | null
          data_vencimento: string
          id?: string
          link_boleto?: string | null
          numero_parcela: number
          status?: Database["public"]["Enums"]["status_pagamento"] | null
          valor: number
        }
        Update: {
          aluno_id?: string
          comprovante_url?: string | null
          curso_id?: string
          data_atualizacao?: string | null
          data_criacao?: string | null
          data_pagamento?: string | null
          data_vencimento?: string
          id?: string
          link_boleto?: string | null
          numero_parcela?: number
          status?: Database["public"]["Enums"]["status_pagamento"] | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "parcelas_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parcelas_curso_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "cursos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          data_matricula: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          numero_matricula: string | null
          phone: string | null
          role: string
          status: Database["public"]["Enums"]["status_matricula"] | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          data_matricula?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          numero_matricula?: string | null
          phone?: string | null
          role?: string
          status?: Database["public"]["Enums"]["status_matricula"] | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          data_matricula?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          numero_matricula?: string | null
          phone?: string | null
          role?: string
          status?: Database["public"]["Enums"]["status_matricula"] | null
          updated_at?: string
        }
        Relationships: []
      }
      progresso_aulas: {
        Row: {
          aluno_id: string
          aula_id: string
          concluido: boolean | null
          data_atualizacao: string | null
          data_conclusao: string | null
          data_criacao: string | null
          data_inicio: string | null
          id: string
          tempo_assistido: number | null
        }
        Insert: {
          aluno_id: string
          aula_id: string
          concluido?: boolean | null
          data_atualizacao?: string | null
          data_conclusao?: string | null
          data_criacao?: string | null
          data_inicio?: string | null
          id?: string
          tempo_assistido?: number | null
        }
        Update: {
          aluno_id?: string
          aula_id?: string
          concluido?: boolean | null
          data_atualizacao?: string | null
          data_conclusao?: string | null
          data_criacao?: string | null
          data_inicio?: string | null
          id?: string
          tempo_assistido?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "progresso_aulas_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progresso_aulas_aula_id_fkey"
            columns: ["aula_id"]
            isOneToOne: false
            referencedRelation: "aulas"
            referencedColumns: ["id"]
          },
        ]
      }
      tipos_documentos: {
        Row: {
          data_atualizacao: string | null
          data_criacao: string | null
          descricao: string | null
          formatos_aceitos: string[] | null
          id: string
          nome: string
          obrigatorio: boolean | null
          tamanho_maximo: number | null
        }
        Insert: {
          data_atualizacao?: string | null
          data_criacao?: string | null
          descricao?: string | null
          formatos_aceitos?: string[] | null
          id?: string
          nome: string
          obrigatorio?: boolean | null
          tamanho_maximo?: number | null
        }
        Update: {
          data_atualizacao?: string | null
          data_criacao?: string | null
          descricao?: string | null
          formatos_aceitos?: string[] | null
          id?: string
          nome?: string
          obrigatorio?: boolean | null
          tamanho_maximo?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calcular_progresso_curso: {
        Args: { aluno_uuid: string; curso_uuid: string }
        Returns: number
      }
      gerar_codigo_verificacao: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      modalidade_curso: "EAD" | "Presencial" | "Hibrido"
      status_documento: "pendente" | "em_analise" | "aprovado" | "rejeitado"
      status_financeiro: "em_dia" | "pendente" | "atrasado" | "bloqueado"
      status_matricula: "ativo" | "inativo" | "trancado" | "formado"
      status_pagamento: "pendente" | "pago" | "atrasado" | "em_negociacao"
      status_pagamento_matricula:
        | "pendente"
        | "processando"
        | "pago"
        | "cancelado"
        | "atrasado"
        | "estornado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      modalidade_curso: ["EAD", "Presencial", "Hibrido"],
      status_documento: ["pendente", "em_analise", "aprovado", "rejeitado"],
      status_financeiro: ["em_dia", "pendente", "atrasado", "bloqueado"],
      status_matricula: ["ativo", "inativo", "trancado", "formado"],
      status_pagamento: ["pendente", "pago", "atrasado", "em_negociacao"],
      status_pagamento_matricula: [
        "pendente",
        "processando",
        "pago",
        "cancelado",
        "atrasado",
        "estornado",
      ],
    },
  },
} as const
