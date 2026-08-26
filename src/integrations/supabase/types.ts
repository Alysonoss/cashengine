export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      admin_banimentos: {
        Row: {
          acoes_disparadas: Json | null
          apelacao_aceita: boolean | null
          aplicado_por: string | null
          created_at: string
          data_desfeito: string | null
          data_fim: string | null
          data_inicio: string
          desfeito: boolean | null
          desfeito_por: string | null
          detalhamento: string | null
          empresa_id: string | null
          evidencias_urls: string[] | null
          id: string
          identificador: string
          motivo_desfeito: string | null
          motivo_principal: string
          nivel_gravidade: string
          permanente: boolean | null
          profile_id: string | null
          revisado_em: string | null
          revisado_por: string | null
          tipo: string
          updated_at: string
        }
        Insert: {
          acoes_disparadas?: Json | null
          apelacao_aceita?: boolean | null
          aplicado_por?: string | null
          created_at?: string
          data_desfeito?: string | null
          data_fim?: string | null
          data_inicio?: string
          desfeito?: boolean | null
          desfeito_por?: string | null
          detalhamento?: string | null
          empresa_id?: string | null
          evidencias_urls?: string[] | null
          id?: string
          identificador: string
          motivo_desfeito?: string | null
          motivo_principal: string
          nivel_gravidade?: string
          permanente?: boolean | null
          profile_id?: string | null
          revisado_em?: string | null
          revisado_por?: string | null
          tipo: string
          updated_at?: string
        }
        Update: {
          acoes_disparadas?: Json | null
          apelacao_aceita?: boolean | null
          aplicado_por?: string | null
          created_at?: string
          data_desfeito?: string | null
          data_fim?: string | null
          data_inicio?: string
          desfeito?: boolean | null
          desfeito_por?: string | null
          detalhamento?: string | null
          empresa_id?: string | null
          evidencias_urls?: string[] | null
          id?: string
          identificador?: string
          motivo_desfeito?: string | null
          motivo_principal?: string
          nivel_gravidade?: string
          permanente?: boolean | null
          profile_id?: string | null
          revisado_em?: string | null
          revisado_por?: string | null
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_banimentos_aplicado_por_fkey"
            columns: ["aplicado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_banimentos_desfeito_por_fkey"
            columns: ["desfeito_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_banimentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_banimentos_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_banimentos_revisado_por_fkey"
            columns: ["revisado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_comunicados: {
        Row: {
          banner_cor: string | null
          created_at: string
          dados_popup: Json | null
          data_fim: string | null
          data_inicio: string
          data_publicacao: string | null
          deleted_at: string | null
          empresas_destino_ids: string[] | null
          id: string
          mensagem: string
          mostrar_banner_dashboard: boolean | null
          mostrar_email: boolean | null
          mostrar_popup: boolean | null
          nivel_importancia: number | null
          perfis_destino_ids: string[] | null
          publicado: boolean | null
          publicado_por: string | null
          publico_alvo: string | null
          requer_confirmacao: boolean | null
          tipo: string
          titulo: string
          total_confirmacoes: number | null
          total_visualizacoes: number | null
          updated_at: string
        }
        Insert: {
          banner_cor?: string | null
          created_at?: string
          dados_popup?: Json | null
          data_fim?: string | null
          data_inicio?: string
          data_publicacao?: string | null
          deleted_at?: string | null
          empresas_destino_ids?: string[] | null
          id?: string
          mensagem: string
          mostrar_banner_dashboard?: boolean | null
          mostrar_email?: boolean | null
          mostrar_popup?: boolean | null
          nivel_importancia?: number | null
          perfis_destino_ids?: string[] | null
          publicado?: boolean | null
          publicado_por?: string | null
          publico_alvo?: string | null
          requer_confirmacao?: boolean | null
          tipo?: string
          titulo: string
          total_confirmacoes?: number | null
          total_visualizacoes?: number | null
          updated_at?: string
        }
        Update: {
          banner_cor?: string | null
          created_at?: string
          dados_popup?: Json | null
          data_fim?: string | null
          data_inicio?: string
          data_publicacao?: string | null
          deleted_at?: string | null
          empresas_destino_ids?: string[] | null
          id?: string
          mensagem?: string
          mostrar_banner_dashboard?: boolean | null
          mostrar_email?: boolean | null
          mostrar_popup?: boolean | null
          nivel_importancia?: number | null
          perfis_destino_ids?: string[] | null
          publicado?: boolean | null
          publicado_por?: string | null
          publico_alvo?: string | null
          requer_confirmacao?: boolean | null
          tipo?: string
          titulo?: string
          total_confirmacoes?: number | null
          total_visualizacoes?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_comunicados_publicado_por_fkey"
            columns: ["publicado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_empresas_gestao: {
        Row: {
          bloqueado_funcionalidades: string[] | null
          categoria_cliente: string | null
          contrato_assinado_url: string | null
          created_at: string
          dados_kpi_extras: Json | null
          data_ultima_revisao: string | null
          desconto_plano_percentual: number | null
          empresa_id: string
          id: string
          limites_customizados: Json | null
          observacoes_admin: string | null
          revisado_por: string | null
          risco_nivel: string | null
          risco_score: number | null
          tags_admin: string[] | null
          termo_adesao_assinado: string | null
          updated_at: string
          vip: boolean | null
        }
        Insert: {
          bloqueado_funcionalidades?: string[] | null
          categoria_cliente?: string | null
          contrato_assinado_url?: string | null
          created_at?: string
          dados_kpi_extras?: Json | null
          data_ultima_revisao?: string | null
          desconto_plano_percentual?: number | null
          empresa_id: string
          id?: string
          limites_customizados?: Json | null
          observacoes_admin?: string | null
          revisado_por?: string | null
          risco_nivel?: string | null
          risco_score?: number | null
          tags_admin?: string[] | null
          termo_adesao_assinado?: string | null
          updated_at?: string
          vip?: boolean | null
        }
        Update: {
          bloqueado_funcionalidades?: string[] | null
          categoria_cliente?: string | null
          contrato_assinado_url?: string | null
          created_at?: string
          dados_kpi_extras?: Json | null
          data_ultima_revisao?: string | null
          desconto_plano_percentual?: number | null
          empresa_id?: string
          id?: string
          limites_customizados?: Json | null
          observacoes_admin?: string | null
          revisado_por?: string | null
          risco_nivel?: string | null
          risco_score?: number | null
          tags_admin?: string[] | null
          termo_adesao_assinado?: string | null
          updated_at?: string
          vip?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_empresas_gestao_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: true
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_empresas_gestao_revisado_por_fkey"
            columns: ["revisado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_global_config: {
        Row: {
          categoria: string | null
          chave: string
          created_at: string
          descricao: string | null
          id: string
          modulo: string | null
          publico: boolean | null
          sensivel: boolean | null
          somente_leitura: boolean | null
          tipo_valor: string
          updated_at: string
          updated_by: string | null
          valor: Json
        }
        Insert: {
          categoria?: string | null
          chave: string
          created_at?: string
          descricao?: string | null
          id?: string
          modulo?: string | null
          publico?: boolean | null
          sensivel?: boolean | null
          somente_leitura?: boolean | null
          tipo_valor?: string
          updated_at?: string
          updated_by?: string | null
          valor: Json
        }
        Update: {
          categoria?: string | null
          chave?: string
          created_at?: string
          descricao?: string | null
          id?: string
          modulo?: string | null
          publico?: boolean | null
          sensivel?: boolean | null
          somente_leitura?: boolean | null
          tipo_valor?: string
          updated_at?: string
          updated_by?: string | null
          valor?: Json
        }
        Relationships: [
          {
            foreignKeyName: "admin_global_config_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_moderacao: {
        Row: {
          acoes_tomadas: Json | null
          analisado_em: string | null
          analisado_por: string | null
          atribuido_em: string | null
          atribuido_para: string | null
          categoria_risco: string | null
          checkout_reportado_id: string | null
          created_at: string
          decisao: string | null
          detalhe_decisao: string | null
          detalhe_motivo: string | null
          empresa_reportada_id: string | null
          evidencias: string[] | null
          id: string
          item_reportado_id: string | null
          marketplace_reportado_id: string | null
          motivo: string
          produto_reportado_id: string | null
          profile_reportado_id: string | null
          reportado_por: string | null
          sinalizacoes_count: number | null
          status: string
          tipo_item_reportado: string
          updated_at: string
        }
        Insert: {
          acoes_tomadas?: Json | null
          analisado_em?: string | null
          analisado_por?: string | null
          atribuido_em?: string | null
          atribuido_para?: string | null
          categoria_risco?: string | null
          checkout_reportado_id?: string | null
          created_at?: string
          decisao?: string | null
          detalhe_decisao?: string | null
          detalhe_motivo?: string | null
          empresa_reportada_id?: string | null
          evidencias?: string[] | null
          id?: string
          item_reportado_id?: string | null
          marketplace_reportado_id?: string | null
          motivo: string
          produto_reportado_id?: string | null
          profile_reportado_id?: string | null
          reportado_por?: string | null
          sinalizacoes_count?: number | null
          status?: string
          tipo_item_reportado: string
          updated_at?: string
        }
        Update: {
          acoes_tomadas?: Json | null
          analisado_em?: string | null
          analisado_por?: string | null
          atribuido_em?: string | null
          atribuido_para?: string | null
          categoria_risco?: string | null
          checkout_reportado_id?: string | null
          created_at?: string
          decisao?: string | null
          detalhe_decisao?: string | null
          detalhe_motivo?: string | null
          empresa_reportada_id?: string | null
          evidencias?: string[] | null
          id?: string
          item_reportado_id?: string | null
          marketplace_reportado_id?: string | null
          motivo?: string
          produto_reportado_id?: string | null
          profile_reportado_id?: string | null
          reportado_por?: string | null
          sinalizacoes_count?: number | null
          status?: string
          tipo_item_reportado?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_moderacao_analisado_por_fkey"
            columns: ["analisado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_moderacao_atribuido_para_fkey"
            columns: ["atribuido_para"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_moderacao_checkout_reportado_id_fkey"
            columns: ["checkout_reportado_id"]
            isOneToOne: false
            referencedRelation: "checkouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_moderacao_empresa_reportada_id_fkey"
            columns: ["empresa_reportada_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_moderacao_marketplace_reportado_id_fkey"
            columns: ["marketplace_reportado_id"]
            isOneToOne: false
            referencedRelation: "marketplace_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_moderacao_produto_reportado_id_fkey"
            columns: ["produto_reportado_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_moderacao_profile_reportado_id_fkey"
            columns: ["profile_reportado_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_moderacao_reportado_por_fkey"
            columns: ["reportado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      afiliados: {
        Row: {
          aprovado_por: string | null
          biografia: string | null
          chave_pix: string | null
          codigo_afiliado: string
          convite_id: string | null
          created_at: string
          dados_bancarios: Json | null
          data_aprovacao: string | null
          deleted_at: string | null
          documentacao_enviada: boolean | null
          documento_titular: string | null
          documentos_verificados: boolean | null
          empresa_id: string
          id: string
          indicado_por_afiliado_id: string | null
          limite_diario_geracao_link: number | null
          link_personalizado: string | null
          metadata: Json | null
          midia_kit_url: string | null
          minimo_saque: number | null
          motivo_rejeicao: string | null
          nivel_rede: number | null
          pontos_desempenho: number | null
          preferencias_comunicacao: Json | null
          profile_id: string | null
          ranking_posicao: number | null
          redes_sociais: Json | null
          regras_especiais: Json | null
          saldo_aprovado: number | null
          saldo_disponivel: number | null
          saldo_pendente: number | null
          status: Database["public"]["Enums"]["status_afiliado"]
          subdominio: string | null
          taxa_comissao_padrao: number | null
          taxa_comissao_recorrente: number | null
          taxa_conversao: number | null
          ticket_medio_vendas: number | null
          tier: string | null
          tipo_chave_pix: string | null
          titular_conta: string | null
          total_cliques: number | null
          total_comissao_bruta: number | null
          total_comissao_liquida: number | null
          total_leads: number | null
          total_sacado: number | null
          total_vendas: number | null
          total_vendas_confirmadas: number | null
          total_visualizacoes: number | null
          ultimo_acesso: string | null
          updated_at: string
        }
        Insert: {
          aprovado_por?: string | null
          biografia?: string | null
          chave_pix?: string | null
          codigo_afiliado: string
          convite_id?: string | null
          created_at?: string
          dados_bancarios?: Json | null
          data_aprovacao?: string | null
          deleted_at?: string | null
          documentacao_enviada?: boolean | null
          documento_titular?: string | null
          documentos_verificados?: boolean | null
          empresa_id: string
          id?: string
          indicado_por_afiliado_id?: string | null
          limite_diario_geracao_link?: number | null
          link_personalizado?: string | null
          metadata?: Json | null
          midia_kit_url?: string | null
          minimo_saque?: number | null
          motivo_rejeicao?: string | null
          nivel_rede?: number | null
          pontos_desempenho?: number | null
          preferencias_comunicacao?: Json | null
          profile_id?: string | null
          ranking_posicao?: number | null
          redes_sociais?: Json | null
          regras_especiais?: Json | null
          saldo_aprovado?: number | null
          saldo_disponivel?: number | null
          saldo_pendente?: number | null
          status?: Database["public"]["Enums"]["status_afiliado"]
          subdominio?: string | null
          taxa_comissao_padrao?: number | null
          taxa_comissao_recorrente?: number | null
          taxa_conversao?: number | null
          ticket_medio_vendas?: number | null
          tier?: string | null
          tipo_chave_pix?: string | null
          titular_conta?: string | null
          total_cliques?: number | null
          total_comissao_bruta?: number | null
          total_comissao_liquida?: number | null
          total_leads?: number | null
          total_sacado?: number | null
          total_vendas?: number | null
          total_vendas_confirmadas?: number | null
          total_visualizacoes?: number | null
          ultimo_acesso?: string | null
          updated_at?: string
        }
        Update: {
          aprovado_por?: string | null
          biografia?: string | null
          chave_pix?: string | null
          codigo_afiliado?: string
          convite_id?: string | null
          created_at?: string
          dados_bancarios?: Json | null
          data_aprovacao?: string | null
          deleted_at?: string | null
          documentacao_enviada?: boolean | null
          documento_titular?: string | null
          documentos_verificados?: boolean | null
          empresa_id?: string
          id?: string
          indicado_por_afiliado_id?: string | null
          limite_diario_geracao_link?: number | null
          link_personalizado?: string | null
          metadata?: Json | null
          midia_kit_url?: string | null
          minimo_saque?: number | null
          motivo_rejeicao?: string | null
          nivel_rede?: number | null
          pontos_desempenho?: number | null
          preferencias_comunicacao?: Json | null
          profile_id?: string | null
          ranking_posicao?: number | null
          redes_sociais?: Json | null
          regras_especiais?: Json | null
          saldo_aprovado?: number | null
          saldo_disponivel?: number | null
          saldo_pendente?: number | null
          status?: Database["public"]["Enums"]["status_afiliado"]
          subdominio?: string | null
          taxa_comissao_padrao?: number | null
          taxa_comissao_recorrente?: number | null
          taxa_conversao?: number | null
          ticket_medio_vendas?: number | null
          tier?: string | null
          tipo_chave_pix?: string | null
          titular_conta?: string | null
          total_cliques?: number | null
          total_comissao_bruta?: number | null
          total_comissao_liquida?: number | null
          total_leads?: number | null
          total_sacado?: number | null
          total_vendas?: number | null
          total_vendas_confirmadas?: number | null
          total_visualizacoes?: number | null
          ultimo_acesso?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "afiliados_aprovado_por_fkey"
            columns: ["aprovado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "afiliados_convite_id_fkey"
            columns: ["convite_id"]
            isOneToOne: false
            referencedRelation: "invites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "afiliados_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "afiliados_indicado_por_afiliado_id_fkey"
            columns: ["indicado_por_afiliado_id"]
            isOneToOne: false
            referencedRelation: "afiliados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "afiliados_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      afiliados_produtos: {
        Row: {
          afiliado_id: string
          ativo: boolean | null
          autorizado_em: string | null
          autorizado_por: string | null
          comissao_valor_fixo: number | null
          created_at: string
          data_fim: string | null
          data_inicio: string | null
          empresa_id: string
          id: string
          maximo_comissao_periodo: number | null
          produto_id: string
          taxa_comissao_personalizada: number | null
          total_comissao_gerada: number | null
          total_vendas: number | null
          updated_at: string
        }
        Insert: {
          afiliado_id: string
          ativo?: boolean | null
          autorizado_em?: string | null
          autorizado_por?: string | null
          comissao_valor_fixo?: number | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          empresa_id: string
          id?: string
          maximo_comissao_periodo?: number | null
          produto_id: string
          taxa_comissao_personalizada?: number | null
          total_comissao_gerada?: number | null
          total_vendas?: number | null
          updated_at?: string
        }
        Update: {
          afiliado_id?: string
          ativo?: boolean | null
          autorizado_em?: string | null
          autorizado_por?: string | null
          comissao_valor_fixo?: number | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          empresa_id?: string
          id?: string
          maximo_comissao_periodo?: number | null
          produto_id?: string
          taxa_comissao_personalizada?: number | null
          total_comissao_gerada?: number | null
          total_vendas?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "afiliados_produtos_afiliado_id_fkey"
            columns: ["afiliado_id"]
            isOneToOne: false
            referencedRelation: "afiliados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "afiliados_produtos_autorizado_por_fkey"
            columns: ["autorizado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "afiliados_produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "afiliados_produtos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      ajuda_artigos: {
        Row: {
          anexos_urls: string[] | null
          atualizado_por: string | null
          avaliacao_media: number | null
          categoria_id: string | null
          conteudo: string
          conteudo_html: string | null
          created_at: string
          criado_por: string | null
          data_publicacao: string | null
          deleted_at: string | null
          destaque: boolean | null
          empresa_id: string | null
          id: string
          meta_descricao: string | null
          meta_titulo: string | null
          nivel_acesso_minimo: number | null
          ordem: number | null
          palavras_chave: string[] | null
          publico: boolean | null
          requer_autenticacao: boolean | null
          resumo: string | null
          slug: string
          status: string | null
          tags: string[] | null
          tempo_leitura_minutos: number | null
          titulo: string
          total_avaliacoes: number | null
          total_comentarios: number | null
          total_curtidas: number | null
          total_nao_curtidas: number | null
          total_visualizacoes: number | null
          total_visualizacoes_unicas: number | null
          updated_at: string
          versao: number | null
          video_url: string | null
        }
        Insert: {
          anexos_urls?: string[] | null
          atualizado_por?: string | null
          avaliacao_media?: number | null
          categoria_id?: string | null
          conteudo: string
          conteudo_html?: string | null
          created_at?: string
          criado_por?: string | null
          data_publicacao?: string | null
          deleted_at?: string | null
          destaque?: boolean | null
          empresa_id?: string | null
          id?: string
          meta_descricao?: string | null
          meta_titulo?: string | null
          nivel_acesso_minimo?: number | null
          ordem?: number | null
          palavras_chave?: string[] | null
          publico?: boolean | null
          requer_autenticacao?: boolean | null
          resumo?: string | null
          slug: string
          status?: string | null
          tags?: string[] | null
          tempo_leitura_minutos?: number | null
          titulo: string
          total_avaliacoes?: number | null
          total_comentarios?: number | null
          total_curtidas?: number | null
          total_nao_curtidas?: number | null
          total_visualizacoes?: number | null
          total_visualizacoes_unicas?: number | null
          updated_at?: string
          versao?: number | null
          video_url?: string | null
        }
        Update: {
          anexos_urls?: string[] | null
          atualizado_por?: string | null
          avaliacao_media?: number | null
          categoria_id?: string | null
          conteudo?: string
          conteudo_html?: string | null
          created_at?: string
          criado_por?: string | null
          data_publicacao?: string | null
          deleted_at?: string | null
          destaque?: boolean | null
          empresa_id?: string | null
          id?: string
          meta_descricao?: string | null
          meta_titulo?: string | null
          nivel_acesso_minimo?: number | null
          ordem?: number | null
          palavras_chave?: string[] | null
          publico?: boolean | null
          requer_autenticacao?: boolean | null
          resumo?: string | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          tempo_leitura_minutos?: number | null
          titulo?: string
          total_avaliacoes?: number | null
          total_comentarios?: number | null
          total_curtidas?: number | null
          total_nao_curtidas?: number | null
          total_visualizacoes?: number | null
          total_visualizacoes_unicas?: number | null
          updated_at?: string
          versao?: number | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ajuda_artigos_atualizado_por_fkey"
            columns: ["atualizado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ajuda_artigos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "ajuda_categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ajuda_artigos_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ajuda_artigos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      ajuda_categorias: {
        Row: {
          categoria_pai_id: string | null
          cor: string | null
          created_at: string
          deleted_at: string | null
          descricao: string | null
          empresa_id: string | null
          icone: string | null
          id: string
          nome: string
          ordem: number | null
          publica: boolean | null
          slug: string
          total_artigos: number | null
          updated_at: string
        }
        Insert: {
          categoria_pai_id?: string | null
          cor?: string | null
          created_at?: string
          deleted_at?: string | null
          descricao?: string | null
          empresa_id?: string | null
          icone?: string | null
          id?: string
          nome: string
          ordem?: number | null
          publica?: boolean | null
          slug: string
          total_artigos?: number | null
          updated_at?: string
        }
        Update: {
          categoria_pai_id?: string | null
          cor?: string | null
          created_at?: string
          deleted_at?: string | null
          descricao?: string | null
          empresa_id?: string | null
          icone?: string | null
          id?: string
          nome?: string
          ordem?: number | null
          publica?: boolean | null
          slug?: string
          total_artigos?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ajuda_categorias_categoria_pai_id_fkey"
            columns: ["categoria_pai_id"]
            isOneToOne: false
            referencedRelation: "ajuda_categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ajuda_categorias_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      ajuda_feedback: {
        Row: {
          artigo_id: string | null
          avaliacao: number | null
          cliente_id: string | null
          comentario: string | null
          created_at: string
          data_resposta: string | null
          foi_util: boolean | null
          id: string
          ip_address: string | null
          motivo_insatisfacao: string | null
          profile_id: string | null
          resolvido: boolean | null
          respondido_por: string | null
          resposta_equipe: string | null
          sugestao_melhoria: string | null
          ticket_id: string | null
          user_agent: string | null
        }
        Insert: {
          artigo_id?: string | null
          avaliacao?: number | null
          cliente_id?: string | null
          comentario?: string | null
          created_at?: string
          data_resposta?: string | null
          foi_util?: boolean | null
          id?: string
          ip_address?: string | null
          motivo_insatisfacao?: string | null
          profile_id?: string | null
          resolvido?: boolean | null
          respondido_por?: string | null
          resposta_equipe?: string | null
          sugestao_melhoria?: string | null
          ticket_id?: string | null
          user_agent?: string | null
        }
        Update: {
          artigo_id?: string | null
          avaliacao?: number | null
          cliente_id?: string | null
          comentario?: string | null
          created_at?: string
          data_resposta?: string | null
          foi_util?: boolean | null
          id?: string
          ip_address?: string | null
          motivo_insatisfacao?: string | null
          profile_id?: string | null
          resolvido?: boolean | null
          respondido_por?: string | null
          resposta_equipe?: string | null
          sugestao_melhoria?: string | null
          ticket_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ajuda_feedback_artigo_id_fkey"
            columns: ["artigo_id"]
            isOneToOne: false
            referencedRelation: "ajuda_artigos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ajuda_feedback_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ajuda_feedback_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ajuda_feedback_respondido_por_fkey"
            columns: ["respondido_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias_produtos: {
        Row: {
          ativa: boolean | null
          banner_url: string | null
          categoria_pai_id: string | null
          created_at: string
          deleted_at: string | null
          descricao: string | null
          destaque: boolean | null
          empresa_id: string
          id: string
          imagem_url: string | null
          meta_descricao: string | null
          meta_titulo: string | null
          nome: string
          ordem: number | null
          slug: string
          updated_at: string
        }
        Insert: {
          ativa?: boolean | null
          banner_url?: string | null
          categoria_pai_id?: string | null
          created_at?: string
          deleted_at?: string | null
          descricao?: string | null
          destaque?: boolean | null
          empresa_id: string
          id?: string
          imagem_url?: string | null
          meta_descricao?: string | null
          meta_titulo?: string | null
          nome: string
          ordem?: number | null
          slug: string
          updated_at?: string
        }
        Update: {
          ativa?: boolean | null
          banner_url?: string | null
          categoria_pai_id?: string | null
          created_at?: string
          deleted_at?: string | null
          descricao?: string | null
          destaque?: boolean | null
          empresa_id?: string
          id?: string
          imagem_url?: string | null
          meta_descricao?: string | null
          meta_titulo?: string | null
          nome?: string
          ordem?: number | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categorias_produtos_categoria_pai_id_fkey"
            columns: ["categoria_pai_id"]
            isOneToOne: false
            referencedRelation: "categorias_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categorias_produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      chargebacks: {
        Row: {
          arquivos_defesa: string[] | null
          cliente_id: string | null
          codigo_chargeback_banco: string | null
          created_at: string
          data_decisao: string | null
          data_limite_resposta: string | null
          data_notificacao: string
          data_ocorrencia: string | null
          data_resposta_enviada: string | null
          decisao_final: string | null
          empresa_id: string
          fase_processo: number | null
          id: string
          metadata: Json | null
          moeda: string | null
          motivo_banco: string | null
          observacoes: string | null
          protocolo: string
          responsavel_defesa: string | null
          resposta_banco: string | null
          status: string
          texto_defesa: string | null
          transacao_id: string
          updated_at: string
          valor_chargeback: number
          valor_multa_banco: number | null
          valor_total_prejuizo: number
        }
        Insert: {
          arquivos_defesa?: string[] | null
          cliente_id?: string | null
          codigo_chargeback_banco?: string | null
          created_at?: string
          data_decisao?: string | null
          data_limite_resposta?: string | null
          data_notificacao?: string
          data_ocorrencia?: string | null
          data_resposta_enviada?: string | null
          decisao_final?: string | null
          empresa_id: string
          fase_processo?: number | null
          id?: string
          metadata?: Json | null
          moeda?: string | null
          motivo_banco?: string | null
          observacoes?: string | null
          protocolo: string
          responsavel_defesa?: string | null
          resposta_banco?: string | null
          status?: string
          texto_defesa?: string | null
          transacao_id: string
          updated_at?: string
          valor_chargeback: number
          valor_multa_banco?: number | null
          valor_total_prejuizo: number
        }
        Update: {
          arquivos_defesa?: string[] | null
          cliente_id?: string | null
          codigo_chargeback_banco?: string | null
          created_at?: string
          data_decisao?: string | null
          data_limite_resposta?: string | null
          data_notificacao?: string
          data_ocorrencia?: string | null
          data_resposta_enviada?: string | null
          decisao_final?: string | null
          empresa_id?: string
          fase_processo?: number | null
          id?: string
          metadata?: Json | null
          moeda?: string | null
          motivo_banco?: string | null
          observacoes?: string | null
          protocolo?: string
          responsavel_defesa?: string | null
          resposta_banco?: string | null
          status?: string
          texto_defesa?: string | null
          transacao_id?: string
          updated_at?: string
          valor_chargeback?: number
          valor_multa_banco?: number | null
          valor_total_prejuizo?: number
        }
        Relationships: [
          {
            foreignKeyName: "chargebacks_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chargebacks_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chargebacks_responsavel_defesa_fkey"
            columns: ["responsavel_defesa"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chargebacks_transacao_id_fkey"
            columns: ["transacao_id"]
            isOneToOne: false
            referencedRelation: "transacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      checkouts: {
        Row: {
          afiliado_requerido: boolean | null
          banner_url: string | null
          created_at: string
          criado_por: string | null
          cupom_id: string | null
          cupons_aceitos: string[] | null
          customizacao_override: Json | null
          deleted_at: string | null
          descricao: string | null
          empresa_id: string
          frete_tipo: string | null
          frete_valor_gratis_minimo: number | null
          ga4_id: string | null
          gtm_id: string | null
          id: string
          imagem_url: string | null
          maximo_por_cliente: number | null
          maximo_total_vendas: number | null
          nome: string
          obrigar_cadastro: boolean | null
          permite_convidado: boolean | null
          permite_multiplos_cupons: boolean | null
          permitir_valor_personalizado: boolean | null
          pixel_facebook_id: string | null
          pixel_google_id: string | null
          politica_privacidade: string | null
          prazo_expiracao: number | null
          produto_id: string | null
          produtos_config: Json
          publicacao_data: string | null
          slug: string
          status: Database["public"]["Enums"]["status_checkout"]
          taxa_afiliado_padrao: number | null
          template_id: string | null
          termos_servico: string | null
          total_arrecadado: number | null
          total_vendido: number | null
          unidade_expiracao: string | null
          updated_at: string
          url_cancelamento: string | null
          url_falha: string | null
          url_sucesso: string | null
          valor_maximo: number | null
          valor_minimo: number | null
          valor_sugerido: number | null
          webhook_url: string | null
        }
        Insert: {
          afiliado_requerido?: boolean | null
          banner_url?: string | null
          created_at?: string
          criado_por?: string | null
          cupom_id?: string | null
          cupons_aceitos?: string[] | null
          customizacao_override?: Json | null
          deleted_at?: string | null
          descricao?: string | null
          empresa_id: string
          frete_tipo?: string | null
          frete_valor_gratis_minimo?: number | null
          ga4_id?: string | null
          gtm_id?: string | null
          id?: string
          imagem_url?: string | null
          maximo_por_cliente?: number | null
          maximo_total_vendas?: number | null
          nome: string
          obrigar_cadastro?: boolean | null
          permite_convidado?: boolean | null
          permite_multiplos_cupons?: boolean | null
          permitir_valor_personalizado?: boolean | null
          pixel_facebook_id?: string | null
          pixel_google_id?: string | null
          politica_privacidade?: string | null
          prazo_expiracao?: number | null
          produto_id?: string | null
          produtos_config?: Json
          publicacao_data?: string | null
          slug: string
          status?: Database["public"]["Enums"]["status_checkout"]
          taxa_afiliado_padrao?: number | null
          template_id?: string | null
          termos_servico?: string | null
          total_arrecadado?: number | null
          total_vendido?: number | null
          unidade_expiracao?: string | null
          updated_at?: string
          url_cancelamento?: string | null
          url_falha?: string | null
          url_sucesso?: string | null
          valor_maximo?: number | null
          valor_minimo?: number | null
          valor_sugerido?: number | null
          webhook_url?: string | null
        }
        Update: {
          afiliado_requerido?: boolean | null
          banner_url?: string | null
          created_at?: string
          criado_por?: string | null
          cupom_id?: string | null
          cupons_aceitos?: string[] | null
          customizacao_override?: Json | null
          deleted_at?: string | null
          descricao?: string | null
          empresa_id?: string
          frete_tipo?: string | null
          frete_valor_gratis_minimo?: number | null
          ga4_id?: string | null
          gtm_id?: string | null
          id?: string
          imagem_url?: string | null
          maximo_por_cliente?: number | null
          maximo_total_vendas?: number | null
          nome?: string
          obrigar_cadastro?: boolean | null
          permite_convidado?: boolean | null
          permite_multiplos_cupons?: boolean | null
          permitir_valor_personalizado?: boolean | null
          pixel_facebook_id?: string | null
          pixel_google_id?: string | null
          politica_privacidade?: string | null
          prazo_expiracao?: number | null
          produto_id?: string | null
          produtos_config?: Json
          publicacao_data?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["status_checkout"]
          taxa_afiliado_padrao?: number | null
          template_id?: string | null
          termos_servico?: string | null
          total_arrecadado?: number | null
          total_vendido?: number | null
          unidade_expiracao?: string | null
          updated_at?: string
          url_cancelamento?: string | null
          url_falha?: string | null
          url_sucesso?: string | null
          valor_maximo?: number | null
          valor_minimo?: number | null
          valor_sugerido?: number | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checkouts_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checkouts_cupom_id_fkey"
            columns: ["cupom_id"]
            isOneToOne: false
            referencedRelation: "cupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checkouts_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checkouts_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checkouts_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates_checkout"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          aceita_marketing: boolean | null
          aceita_termos: boolean | null
          bairro: string | null
          celular: string | null
          cep: string | null
          cidade: string | null
          cnpj: string | null
          complemento: string | null
          cpf: string | null
          created_at: string
          data_nascimento: string | null
          data_primeira_compra: string | null
          data_ultima_compra: string | null
          deleted_at: string | null
          email: string
          empresa_id: string
          estado: string | null
          id: string
          integrado_hotmart_id: string | null
          integrado_kiwify_id: string | null
          integrado_monetizze_id: string | null
          logradouro: string | null
          metadata: Json | null
          nivel_cliente: string | null
          nome_completo: string
          nome_social: string | null
          numero: string | null
          observacoes: string | null
          origem_captacao: string | null
          pais: string | null
          pontos_fidelidade: number | null
          rg: string | null
          sexo: string | null
          status: Database["public"]["Enums"]["status_ativo"]
          tags: string[] | null
          telefone: string | null
          ticket_medio: number | null
          tipo_pessoa: string | null
          total_gasto: number | null
          total_pedidos: number | null
          updated_at: string
        }
        Insert: {
          aceita_marketing?: boolean | null
          aceita_termos?: boolean | null
          bairro?: string | null
          celular?: string | null
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          complemento?: string | null
          cpf?: string | null
          created_at?: string
          data_nascimento?: string | null
          data_primeira_compra?: string | null
          data_ultima_compra?: string | null
          deleted_at?: string | null
          email: string
          empresa_id: string
          estado?: string | null
          id?: string
          integrado_hotmart_id?: string | null
          integrado_kiwify_id?: string | null
          integrado_monetizze_id?: string | null
          logradouro?: string | null
          metadata?: Json | null
          nivel_cliente?: string | null
          nome_completo: string
          nome_social?: string | null
          numero?: string | null
          observacoes?: string | null
          origem_captacao?: string | null
          pais?: string | null
          pontos_fidelidade?: number | null
          rg?: string | null
          sexo?: string | null
          status?: Database["public"]["Enums"]["status_ativo"]
          tags?: string[] | null
          telefone?: string | null
          ticket_medio?: number | null
          tipo_pessoa?: string | null
          total_gasto?: number | null
          total_pedidos?: number | null
          updated_at?: string
        }
        Update: {
          aceita_marketing?: boolean | null
          aceita_termos?: boolean | null
          bairro?: string | null
          celular?: string | null
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          complemento?: string | null
          cpf?: string | null
          created_at?: string
          data_nascimento?: string | null
          data_primeira_compra?: string | null
          data_ultima_compra?: string | null
          deleted_at?: string | null
          email?: string
          empresa_id?: string
          estado?: string | null
          id?: string
          integrado_hotmart_id?: string | null
          integrado_kiwify_id?: string | null
          integrado_monetizze_id?: string | null
          logradouro?: string | null
          metadata?: Json | null
          nivel_cliente?: string | null
          nome_completo?: string
          nome_social?: string | null
          numero?: string | null
          observacoes?: string | null
          origem_captacao?: string | null
          pais?: string | null
          pontos_fidelidade?: number | null
          rg?: string | null
          sexo?: string | null
          status?: Database["public"]["Enums"]["status_ativo"]
          tags?: string[] | null
          telefone?: string | null
          ticket_medio?: number | null
          tipo_pessoa?: string | null
          total_gasto?: number | null
          total_pedidos?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clientes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      comissoes: {
        Row: {
          afiliado_id: string
          aprovado_por: string | null
          cancelado_por: string | null
          cliente_id: string | null
          created_at: string
          data_aprovacao: string | null
          data_cancelamento: string | null
          data_pagamento: string | null
          data_prevista_liberacao: string | null
          deleted_at: string | null
          descontos_aplicados: number | null
          empresa_id: string
          id: string
          id_transacao_externo: string | null
          indicado_por_afiliado_id: string | null
          link_afiliado_id: string | null
          metadata: Json | null
          moeda: string | null
          motivo_cancelamento: string | null
          nota_interna: string | null
          origem_trafego: string | null
          parcela_numero: number | null
          periodo_recorrencia: number | null
          produto_id: string | null
          saque_id: string | null
          status: Database["public"]["Enums"]["status_comissao"]
          taxa_comissao_percentual: number
          taxa_plataforma: number | null
          taxa_processamento: number | null
          tipo_venda: string | null
          total_parcelas: number | null
          transacao_id: string | null
          updated_at: string
          valor_comissao_bruta: number
          valor_comissao_liquida: number
          valor_venda: number
        }
        Insert: {
          afiliado_id: string
          aprovado_por?: string | null
          cancelado_por?: string | null
          cliente_id?: string | null
          created_at?: string
          data_aprovacao?: string | null
          data_cancelamento?: string | null
          data_pagamento?: string | null
          data_prevista_liberacao?: string | null
          deleted_at?: string | null
          descontos_aplicados?: number | null
          empresa_id: string
          id?: string
          id_transacao_externo?: string | null
          indicado_por_afiliado_id?: string | null
          link_afiliado_id?: string | null
          metadata?: Json | null
          moeda?: string | null
          motivo_cancelamento?: string | null
          nota_interna?: string | null
          origem_trafego?: string | null
          parcela_numero?: number | null
          periodo_recorrencia?: number | null
          produto_id?: string | null
          saque_id?: string | null
          status?: Database["public"]["Enums"]["status_comissao"]
          taxa_comissao_percentual: number
          taxa_plataforma?: number | null
          taxa_processamento?: number | null
          tipo_venda?: string | null
          total_parcelas?: number | null
          transacao_id?: string | null
          updated_at?: string
          valor_comissao_bruta: number
          valor_comissao_liquida: number
          valor_venda: number
        }
        Update: {
          afiliado_id?: string
          aprovado_por?: string | null
          cancelado_por?: string | null
          cliente_id?: string | null
          created_at?: string
          data_aprovacao?: string | null
          data_cancelamento?: string | null
          data_pagamento?: string | null
          data_prevista_liberacao?: string | null
          deleted_at?: string | null
          descontos_aplicados?: number | null
          empresa_id?: string
          id?: string
          id_transacao_externo?: string | null
          indicado_por_afiliado_id?: string | null
          link_afiliado_id?: string | null
          metadata?: Json | null
          moeda?: string | null
          motivo_cancelamento?: string | null
          nota_interna?: string | null
          origem_trafego?: string | null
          parcela_numero?: number | null
          periodo_recorrencia?: number | null
          produto_id?: string | null
          saque_id?: string | null
          status?: Database["public"]["Enums"]["status_comissao"]
          taxa_comissao_percentual?: number
          taxa_plataforma?: number | null
          taxa_processamento?: number | null
          tipo_venda?: string | null
          total_parcelas?: number | null
          transacao_id?: string | null
          updated_at?: string
          valor_comissao_bruta?: number
          valor_comissao_liquida?: number
          valor_venda?: number
        }
        Relationships: [
          {
            foreignKeyName: "comissoes_afiliado_id_fkey"
            columns: ["afiliado_id"]
            isOneToOne: false
            referencedRelation: "afiliados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comissoes_aprovado_por_fkey"
            columns: ["aprovado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comissoes_cancelado_por_fkey"
            columns: ["cancelado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comissoes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comissoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comissoes_indicado_por_afiliado_id_fkey"
            columns: ["indicado_por_afiliado_id"]
            isOneToOne: false
            referencedRelation: "afiliados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comissoes_link_afiliado_id_fkey"
            columns: ["link_afiliado_id"]
            isOneToOne: false
            referencedRelation: "links_afiliados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comissoes_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      comunidade_posts: {
        Row: {
          afiliado_id: string | null
          categoria: string | null
          corpo: string
          corpo_html: string | null
          created_at: string
          deleted_at: string | null
          destaque: boolean | null
          empresa_id: string | null
          fechado: boolean | null
          fixado: boolean | null
          id: string
          imagem_destaque: string | null
          melhor_resposta_id: string | null
          post_pai_id: string | null
          profile_id: string | null
          slug: string | null
          status: string | null
          tags: string[] | null
          tipo_post: string | null
          titulo: string
          total_comentarios: number | null
          total_compartilhamentos: number | null
          total_curtidas: number | null
          total_visualizacoes: number | null
          updated_at: string
        }
        Insert: {
          afiliado_id?: string | null
          categoria?: string | null
          corpo: string
          corpo_html?: string | null
          created_at?: string
          deleted_at?: string | null
          destaque?: boolean | null
          empresa_id?: string | null
          fechado?: boolean | null
          fixado?: boolean | null
          id?: string
          imagem_destaque?: string | null
          melhor_resposta_id?: string | null
          post_pai_id?: string | null
          profile_id?: string | null
          slug?: string | null
          status?: string | null
          tags?: string[] | null
          tipo_post?: string | null
          titulo: string
          total_comentarios?: number | null
          total_compartilhamentos?: number | null
          total_curtidas?: number | null
          total_visualizacoes?: number | null
          updated_at?: string
        }
        Update: {
          afiliado_id?: string | null
          categoria?: string | null
          corpo?: string
          corpo_html?: string | null
          created_at?: string
          deleted_at?: string | null
          destaque?: boolean | null
          empresa_id?: string | null
          fechado?: boolean | null
          fixado?: boolean | null
          id?: string
          imagem_destaque?: string | null
          melhor_resposta_id?: string | null
          post_pai_id?: string | null
          profile_id?: string | null
          slug?: string | null
          status?: string | null
          tags?: string[] | null
          tipo_post?: string | null
          titulo?: string
          total_comentarios?: number | null
          total_compartilhamentos?: number | null
          total_curtidas?: number | null
          total_visualizacoes?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comunidade_posts_afiliado_id_fkey"
            columns: ["afiliado_id"]
            isOneToOne: false
            referencedRelation: "afiliados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comunidade_posts_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comunidade_posts_melhor_resposta_id_fkey"
            columns: ["melhor_resposta_id"]
            isOneToOne: false
            referencedRelation: "comunidade_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comunidade_posts_post_pai_id_fkey"
            columns: ["post_pai_id"]
            isOneToOne: false
            referencedRelation: "comunidade_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comunidade_posts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contas_bancarias: {
        Row: {
          afiliado_id: string | null
          agencia: string
          agencia_dv: string | null
          banco_codigo: string
          banco_nome: string
          chave_pix: string | null
          conta: string
          conta_dv: string | null
          created_at: string
          data_verificacao: string | null
          deleted_at: string | null
          documento_titular: string
          documento_verificacao_url: string | null
          empresa_id: string | null
          id: string
          is_verificada: boolean | null
          metadata: Json | null
          principal: boolean | null
          profile_id: string | null
          tipo_chave_pix: string | null
          tipo_conta: Database["public"]["Enums"]["tipo_conta"]
          titular: string
          updated_at: string
        }
        Insert: {
          afiliado_id?: string | null
          agencia: string
          agencia_dv?: string | null
          banco_codigo: string
          banco_nome: string
          chave_pix?: string | null
          conta: string
          conta_dv?: string | null
          created_at?: string
          data_verificacao?: string | null
          deleted_at?: string | null
          documento_titular: string
          documento_verificacao_url?: string | null
          empresa_id?: string | null
          id?: string
          is_verificada?: boolean | null
          metadata?: Json | null
          principal?: boolean | null
          profile_id?: string | null
          tipo_chave_pix?: string | null
          tipo_conta?: Database["public"]["Enums"]["tipo_conta"]
          titular: string
          updated_at?: string
        }
        Update: {
          afiliado_id?: string | null
          agencia?: string
          agencia_dv?: string | null
          banco_codigo?: string
          banco_nome?: string
          chave_pix?: string | null
          conta?: string
          conta_dv?: string | null
          created_at?: string
          data_verificacao?: string | null
          deleted_at?: string | null
          documento_titular?: string
          documento_verificacao_url?: string | null
          empresa_id?: string | null
          id?: string
          is_verificada?: boolean | null
          metadata?: Json | null
          principal?: boolean | null
          profile_id?: string | null
          tipo_chave_pix?: string | null
          tipo_conta?: Database["public"]["Enums"]["tipo_conta"]
          titular?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contas_bancarias_afiliado_id_fkey"
            columns: ["afiliado_id"]
            isOneToOne: false
            referencedRelation: "afiliados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_bancarias_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_bancarias_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cupons: {
        Row: {
          categoria_ids: string[] | null
          codigo: string
          created_at: string
          criado_por: string | null
          data_fim: string | null
          data_inicio: string | null
          deleted_at: string | null
          desconto_maximo: number | null
          descricao: string | null
          empresa_id: string
          exclusivo_primeira_compra: boolean | null
          id: string
          max_usos: number | null
          permite_empilhamento: boolean | null
          produto_ids: string[] | null
          status: Database["public"]["Enums"]["status_cupom"]
          tipo: Database["public"]["Enums"]["tipo_cupom"]
          updated_at: string
          usos_count: number | null
          usos_por_cliente: number | null
          valor: number
          valor_minimo_pedido: number | null
        }
        Insert: {
          categoria_ids?: string[] | null
          codigo: string
          created_at?: string
          criado_por?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          deleted_at?: string | null
          desconto_maximo?: number | null
          descricao?: string | null
          empresa_id: string
          exclusivo_primeira_compra?: boolean | null
          id?: string
          max_usos?: number | null
          permite_empilhamento?: boolean | null
          produto_ids?: string[] | null
          status?: Database["public"]["Enums"]["status_cupom"]
          tipo?: Database["public"]["Enums"]["tipo_cupom"]
          updated_at?: string
          usos_count?: number | null
          usos_por_cliente?: number | null
          valor: number
          valor_minimo_pedido?: number | null
        }
        Update: {
          categoria_ids?: string[] | null
          codigo?: string
          created_at?: string
          criado_por?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          deleted_at?: string | null
          desconto_maximo?: number | null
          descricao?: string | null
          empresa_id?: string
          exclusivo_primeira_compra?: boolean | null
          id?: string
          max_usos?: number | null
          permite_empilhamento?: boolean | null
          produto_ids?: string[] | null
          status?: Database["public"]["Enums"]["status_cupom"]
          tipo?: Database["public"]["Enums"]["tipo_cupom"]
          updated_at?: string
          usos_count?: number | null
          usos_por_cliente?: number | null
          valor?: number
          valor_minimo_pedido?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cupons_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cupons_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          bairro: string | null
          celular: string | null
          cep: string | null
          cidade: string | null
          cnpj: string | null
          complemento: string | null
          configuracoes: Json | null
          created_at: string
          deleted_at: string | null
          email: string | null
          estado: string | null
          id: string
          ie: string | null
          im: string | null
          logotipo_url: string | null
          logradouro: string | null
          nome_fantasia: string
          numero: string | null
          pais: string | null
          plano: string | null
          razao_social: string | null
          segmento: string | null
          site: string | null
          status: Database["public"]["Enums"]["status_ativo"]
          telefone: string | null
          updated_at: string
        }
        Insert: {
          bairro?: string | null
          celular?: string | null
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          complemento?: string | null
          configuracoes?: Json | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          estado?: string | null
          id?: string
          ie?: string | null
          im?: string | null
          logotipo_url?: string | null
          logradouro?: string | null
          nome_fantasia: string
          numero?: string | null
          pais?: string | null
          plano?: string | null
          razao_social?: string | null
          segmento?: string | null
          site?: string | null
          status?: Database["public"]["Enums"]["status_ativo"]
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          bairro?: string | null
          celular?: string | null
          cep?: string | null
          cidade?: string | null
          cnpj?: string | null
          complemento?: string | null
          configuracoes?: Json | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          estado?: string | null
          id?: string
          ie?: string | null
          im?: string | null
          logotipo_url?: string | null
          logradouro?: string | null
          nome_fantasia?: string
          numero?: string | null
          pais?: string | null
          plano?: string | null
          razao_social?: string | null
          segmento?: string | null
          site?: string | null
          status?: Database["public"]["Enums"]["status_ativo"]
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      equipe_membros: {
        Row: {
          adicionado_por: string | null
          carga_horaria_semanal: number | null
          cargo: string
          convite_id: string | null
          created_at: string
          data_admissao: string | null
          data_desligamento: string | null
          deleted_at: string | null
          departamento: string | null
          empresa_id: string
          id: string
          limite_aprovacao_valor: number | null
          metadata: Json | null
          numero_registro: string | null
          observacoes: string | null
          pode_assinar_documentos: boolean | null
          profile_id: string
          salario: number | null
          status: Database["public"]["Enums"]["status_ativo"]
          supervisor_direto: string | null
          updated_at: string
        }
        Insert: {
          adicionado_por?: string | null
          carga_horaria_semanal?: number | null
          cargo: string
          convite_id?: string | null
          created_at?: string
          data_admissao?: string | null
          data_desligamento?: string | null
          deleted_at?: string | null
          departamento?: string | null
          empresa_id: string
          id?: string
          limite_aprovacao_valor?: number | null
          metadata?: Json | null
          numero_registro?: string | null
          observacoes?: string | null
          pode_assinar_documentos?: boolean | null
          profile_id: string
          salario?: number | null
          status?: Database["public"]["Enums"]["status_ativo"]
          supervisor_direto?: string | null
          updated_at?: string
        }
        Update: {
          adicionado_por?: string | null
          carga_horaria_semanal?: number | null
          cargo?: string
          convite_id?: string | null
          created_at?: string
          data_admissao?: string | null
          data_desligamento?: string | null
          deleted_at?: string | null
          departamento?: string | null
          empresa_id?: string
          id?: string
          limite_aprovacao_valor?: number | null
          metadata?: Json | null
          numero_registro?: string | null
          observacoes?: string | null
          pode_assinar_documentos?: boolean | null
          profile_id?: string
          salario?: number | null
          status?: Database["public"]["Enums"]["status_ativo"]
          supervisor_direto?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipe_membros_adicionado_por_fkey"
            columns: ["adicionado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipe_membros_convite_id_fkey"
            columns: ["convite_id"]
            isOneToOne: false
            referencedRelation: "invites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipe_membros_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipe_membros_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipe_membros_supervisor_direto_fkey"
            columns: ["supervisor_direto"]
            isOneToOne: false
            referencedRelation: "equipe_membros"
            referencedColumns: ["id"]
          },
        ]
      }
      estornos: {
        Row: {
          analisado_por: string | null
          aprovado_por: string | null
          cliente_id: string | null
          comprovantes_urls: string[] | null
          created_at: string
          dados_estorno_alternativo: Json | null
          data_analise: string | null
          data_aprovacao: string | null
          data_cancelamento: string | null
          data_conclusao: string | null
          data_solicitacao: string
          detalhamento_motivo: string | null
          empresa_id: string
          id: string
          id_estorno_gateway: string | null
          metadata: Json | null
          metodo_estorno: string | null
          motivo: string
          observacoes_internas: string | null
          pedido_cliente_motivo: string | null
          protocolo: string
          rejeitado_por: string | null
          saque_relacionado_id: string | null
          solicitado_por: string | null
          status: Database["public"]["Enums"]["status_estorno"]
          taxa_estorno: number | null
          tipo_estorno: string
          transacao_id: string
          updated_at: string
          valor_aprovado_estorno: number | null
          valor_efetivamente_estornado: number | null
          valor_original: number
          valor_solicitado_estorno: number
        }
        Insert: {
          analisado_por?: string | null
          aprovado_por?: string | null
          cliente_id?: string | null
          comprovantes_urls?: string[] | null
          created_at?: string
          dados_estorno_alternativo?: Json | null
          data_analise?: string | null
          data_aprovacao?: string | null
          data_cancelamento?: string | null
          data_conclusao?: string | null
          data_solicitacao?: string
          detalhamento_motivo?: string | null
          empresa_id: string
          id?: string
          id_estorno_gateway?: string | null
          metadata?: Json | null
          metodo_estorno?: string | null
          motivo: string
          observacoes_internas?: string | null
          pedido_cliente_motivo?: string | null
          protocolo: string
          rejeitado_por?: string | null
          saque_relacionado_id?: string | null
          solicitado_por?: string | null
          status?: Database["public"]["Enums"]["status_estorno"]
          taxa_estorno?: number | null
          tipo_estorno?: string
          transacao_id: string
          updated_at?: string
          valor_aprovado_estorno?: number | null
          valor_efetivamente_estornado?: number | null
          valor_original: number
          valor_solicitado_estorno: number
        }
        Update: {
          analisado_por?: string | null
          aprovado_por?: string | null
          cliente_id?: string | null
          comprovantes_urls?: string[] | null
          created_at?: string
          dados_estorno_alternativo?: Json | null
          data_analise?: string | null
          data_aprovacao?: string | null
          data_cancelamento?: string | null
          data_conclusao?: string | null
          data_solicitacao?: string
          detalhamento_motivo?: string | null
          empresa_id?: string
          id?: string
          id_estorno_gateway?: string | null
          metadata?: Json | null
          metodo_estorno?: string | null
          motivo?: string
          observacoes_internas?: string | null
          pedido_cliente_motivo?: string | null
          protocolo?: string
          rejeitado_por?: string | null
          saque_relacionado_id?: string | null
          solicitado_por?: string | null
          status?: Database["public"]["Enums"]["status_estorno"]
          taxa_estorno?: number | null
          tipo_estorno?: string
          transacao_id?: string
          updated_at?: string
          valor_aprovado_estorno?: number | null
          valor_efetivamente_estornado?: number | null
          valor_original?: number
          valor_solicitado_estorno?: number
        }
        Relationships: [
          {
            foreignKeyName: "estornos_analisado_por_fkey"
            columns: ["analisado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estornos_aprovado_por_fkey"
            columns: ["aprovado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estornos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estornos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estornos_rejeitado_por_fkey"
            columns: ["rejeitado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estornos_saque_relacionado_id_fkey"
            columns: ["saque_relacionado_id"]
            isOneToOne: false
            referencedRelation: "saques"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estornos_solicitado_por_fkey"
            columns: ["solicitado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estornos_transacao_id_fkey"
            columns: ["transacao_id"]
            isOneToOne: false
            referencedRelation: "transacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      integracoes: {
        Row: {
          categoria: string | null
          conectado_por: string | null
          config: Json | null
          connected_at: string | null
          created_at: string
          credenciais_criptografadas: Json | null
          deleted_at: string | null
          desconectado_por: string | null
          descricao: string | null
          disconnected_at: string | null
          empresa_id: string
          id: string
          last_error: string | null
          last_error_at: string | null
          last_sync_at: string | null
          logo_url: string | null
          metadata: Json | null
          nome_integracao: string
          provider: string
          rate_limit_por_dia: number | null
          rate_limit_por_minuto: number | null
          status: Database["public"]["Enums"]["status_integracao"]
          total_requisicoes: number | null
          updated_at: string
          webhook_secret: string | null
          webhook_url: string | null
        }
        Insert: {
          categoria?: string | null
          conectado_por?: string | null
          config?: Json | null
          connected_at?: string | null
          created_at?: string
          credenciais_criptografadas?: Json | null
          deleted_at?: string | null
          desconectado_por?: string | null
          descricao?: string | null
          disconnected_at?: string | null
          empresa_id: string
          id?: string
          last_error?: string | null
          last_error_at?: string | null
          last_sync_at?: string | null
          logo_url?: string | null
          metadata?: Json | null
          nome_integracao: string
          provider: string
          rate_limit_por_dia?: number | null
          rate_limit_por_minuto?: number | null
          status?: Database["public"]["Enums"]["status_integracao"]
          total_requisicoes?: number | null
          updated_at?: string
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Update: {
          categoria?: string | null
          conectado_por?: string | null
          config?: Json | null
          connected_at?: string | null
          created_at?: string
          credenciais_criptografadas?: Json | null
          deleted_at?: string | null
          desconectado_por?: string | null
          descricao?: string | null
          disconnected_at?: string | null
          empresa_id?: string
          id?: string
          last_error?: string | null
          last_error_at?: string | null
          last_sync_at?: string | null
          logo_url?: string | null
          metadata?: Json | null
          nome_integracao?: string
          provider?: string
          rate_limit_por_dia?: number | null
          rate_limit_por_minuto?: number | null
          status?: Database["public"]["Enums"]["status_integracao"]
          total_requisicoes?: number | null
          updated_at?: string
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integracoes_conectado_por_fkey"
            columns: ["conectado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "integracoes_desconectado_por_fkey"
            columns: ["desconectado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "integracoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      integracoes_logs: {
        Row: {
          acao: string
          cabecalhos_requisicao: Json | null
          cabecalhos_resposta: Json | null
          corpo_requisicao: Json | null
          corpo_resposta: string | null
          created_at: string
          duracao_ms: number | null
          empresa_id: string
          endpoint_url: string | null
          id: string
          idempotency_key: string | null
          integracao_id: string
          mensagem_erro: string | null
          metodo_http: string | null
          status_resposta: number | null
          sucesso: boolean | null
          tentativa_numero: number | null
        }
        Insert: {
          acao: string
          cabecalhos_requisicao?: Json | null
          cabecalhos_resposta?: Json | null
          corpo_requisicao?: Json | null
          corpo_resposta?: string | null
          created_at?: string
          duracao_ms?: number | null
          empresa_id: string
          endpoint_url?: string | null
          id?: string
          idempotency_key?: string | null
          integracao_id: string
          mensagem_erro?: string | null
          metodo_http?: string | null
          status_resposta?: number | null
          sucesso?: boolean | null
          tentativa_numero?: number | null
        }
        Update: {
          acao?: string
          cabecalhos_requisicao?: Json | null
          cabecalhos_resposta?: Json | null
          corpo_requisicao?: Json | null
          corpo_resposta?: string | null
          created_at?: string
          duracao_ms?: number | null
          empresa_id?: string
          endpoint_url?: string | null
          id?: string
          idempotency_key?: string | null
          integracao_id?: string
          mensagem_erro?: string | null
          metodo_http?: string | null
          status_resposta?: number | null
          sucesso?: boolean | null
          tentativa_numero?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "integracoes_logs_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "integracoes_logs_integracao_id_fkey"
            columns: ["integracao_id"]
            isOneToOne: false
            referencedRelation: "integracoes"
            referencedColumns: ["id"]
          },
        ]
      }
      invites: {
        Row: {
          aceito_em: string | null
          aceito_por: string | null
          cargo: string | null
          codigo_convite: string
          convidado_por: string
          created_at: string
          email: string
          empresa_id: string
          expira_em: string
          id: string
          link_afiliado_base: string | null
          mensagem: string | null
          nome: string | null
          role_id: string | null
          status: string
          taxa_comissao_padrao: number | null
          tipo: string
          token_hash: string
          updated_at: string
        }
        Insert: {
          aceito_em?: string | null
          aceito_por?: string | null
          cargo?: string | null
          codigo_convite: string
          convidado_por: string
          created_at?: string
          email: string
          empresa_id: string
          expira_em?: string
          id?: string
          link_afiliado_base?: string | null
          mensagem?: string | null
          nome?: string | null
          role_id?: string | null
          status?: string
          taxa_comissao_padrao?: number | null
          tipo: string
          token_hash: string
          updated_at?: string
        }
        Update: {
          aceito_em?: string | null
          aceito_por?: string | null
          cargo?: string | null
          codigo_convite?: string
          convidado_por?: string
          created_at?: string
          email?: string
          empresa_id?: string
          expira_em?: string
          id?: string
          link_afiliado_base?: string | null
          mensagem?: string | null
          nome?: string | null
          role_id?: string | null
          status?: string
          taxa_comissao_padrao?: number | null
          tipo?: string
          token_hash?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invites_convidado_por_fkey"
            columns: ["convidado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invites_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invites_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      lancamentos_contabeis: {
        Row: {
          afiliado_id: string | null
          automatico: boolean | null
          comissao_id: string | null
          competencia: string
          conta_contabil: string
          created_at: string
          criado_por: string | null
          data_lancamento: string
          descricao: string
          documento_referencia: string | null
          empresa_id: string | null
          estorno_id: string | null
          id: string
          moeda: string | null
          motivo_manual: string | null
          profile_id: string | null
          repasse_id: string | null
          saldo_anterior: number | null
          saldo_atual: number | null
          saque_id: string | null
          tipo_lancamento: string
          transacao_id: string | null
          valor: number
        }
        Insert: {
          afiliado_id?: string | null
          automatico?: boolean | null
          comissao_id?: string | null
          competencia: string
          conta_contabil: string
          created_at?: string
          criado_por?: string | null
          data_lancamento?: string
          descricao: string
          documento_referencia?: string | null
          empresa_id?: string | null
          estorno_id?: string | null
          id?: string
          moeda?: string | null
          motivo_manual?: string | null
          profile_id?: string | null
          repasse_id?: string | null
          saldo_anterior?: number | null
          saldo_atual?: number | null
          saque_id?: string | null
          tipo_lancamento: string
          transacao_id?: string | null
          valor: number
        }
        Update: {
          afiliado_id?: string | null
          automatico?: boolean | null
          comissao_id?: string | null
          competencia?: string
          conta_contabil?: string
          created_at?: string
          criado_por?: string | null
          data_lancamento?: string
          descricao?: string
          documento_referencia?: string | null
          empresa_id?: string | null
          estorno_id?: string | null
          id?: string
          moeda?: string | null
          motivo_manual?: string | null
          profile_id?: string | null
          repasse_id?: string | null
          saldo_anterior?: number | null
          saldo_atual?: number | null
          saque_id?: string | null
          tipo_lancamento?: string
          transacao_id?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "lancamentos_contabeis_afiliado_id_fkey"
            columns: ["afiliado_id"]
            isOneToOne: false
            referencedRelation: "afiliados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_contabeis_comissao_id_fkey"
            columns: ["comissao_id"]
            isOneToOne: false
            referencedRelation: "comissoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_contabeis_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_contabeis_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_contabeis_estorno_id_fkey"
            columns: ["estorno_id"]
            isOneToOne: false
            referencedRelation: "estornos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_contabeis_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_contabeis_repasse_id_fkey"
            columns: ["repasse_id"]
            isOneToOne: false
            referencedRelation: "repasses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_contabeis_saque_id_fkey"
            columns: ["saque_id"]
            isOneToOne: false
            referencedRelation: "saques"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_contabeis_transacao_id_fkey"
            columns: ["transacao_id"]
            isOneToOne: false
            referencedRelation: "transacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      links_afiliados: {
        Row: {
          afiliado_id: string
          checkout_id: string | null
          codigo_rastreio: string
          created_at: string
          criado_por: string | null
          data_fim: string | null
          data_inicio: string | null
          deleted_at: string | null
          empresa_id: string
          id: string
          link_pagamento_id: string | null
          nome_campanha: string | null
          parametros_extra: Json | null
          produto_id: string | null
          slug_personalizado: string | null
          status: Database["public"]["Enums"]["status_link_pagamento"]
          taxa_conversao: number | null
          total_cliques: number | null
          total_conversoes: number | null
          total_vendas: number | null
          total_visualizacoes: number | null
          updated_at: string
          url_curta: string | null
          url_destino: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          afiliado_id: string
          checkout_id?: string | null
          codigo_rastreio: string
          created_at?: string
          criado_por?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          deleted_at?: string | null
          empresa_id: string
          id?: string
          link_pagamento_id?: string | null
          nome_campanha?: string | null
          parametros_extra?: Json | null
          produto_id?: string | null
          slug_personalizado?: string | null
          status?: Database["public"]["Enums"]["status_link_pagamento"]
          taxa_conversao?: number | null
          total_cliques?: number | null
          total_conversoes?: number | null
          total_vendas?: number | null
          total_visualizacoes?: number | null
          updated_at?: string
          url_curta?: string | null
          url_destino: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          afiliado_id?: string
          checkout_id?: string | null
          codigo_rastreio?: string
          created_at?: string
          criado_por?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          deleted_at?: string | null
          empresa_id?: string
          id?: string
          link_pagamento_id?: string | null
          nome_campanha?: string | null
          parametros_extra?: Json | null
          produto_id?: string | null
          slug_personalizado?: string | null
          status?: Database["public"]["Enums"]["status_link_pagamento"]
          taxa_conversao?: number | null
          total_cliques?: number | null
          total_conversoes?: number | null
          total_vendas?: number | null
          total_visualizacoes?: number | null
          updated_at?: string
          url_curta?: string | null
          url_destino?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "links_afiliados_afiliado_id_fkey"
            columns: ["afiliado_id"]
            isOneToOne: false
            referencedRelation: "afiliados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_afiliados_checkout_id_fkey"
            columns: ["checkout_id"]
            isOneToOne: false
            referencedRelation: "checkouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_afiliados_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_afiliados_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_afiliados_link_pagamento_id_fkey"
            columns: ["link_pagamento_id"]
            isOneToOne: false
            referencedRelation: "links_pagamento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_afiliados_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      links_pagamento: {
        Row: {
          afiliado_id: string | null
          campanha_nome: string | null
          checkout_id: string | null
          codigo_unico: string
          contador_usos: number | null
          cpf_cliente_obrigatorio: boolean | null
          created_at: string
          criado_por: string | null
          cupom_id: string | null
          data_expiracao: string | null
          deleted_at: string | null
          descricao: string | null
          email_cliente_obrigatorio: boolean | null
          empresa_id: string
          endereco_cliente_obrigatorio: boolean | null
          fonte_trafego: string | null
          id: string
          max_usos: number | null
          mensagem_sucesso_personalizada: string | null
          metadata: Json | null
          moeda: string | null
          nome_cliente_obrigatorio: boolean | null
          notificar_email_criador: boolean | null
          notificar_whatsapp_criador: boolean | null
          permite_editar_valor: boolean | null
          produto_id: string | null
          status: Database["public"]["Enums"]["status_link_pagamento"]
          telefone_cliente_obrigatorio: boolean | null
          termo_utm: string | null
          tipo: Database["public"]["Enums"]["tipo_link_pagamento"]
          titulo: string
          updated_at: string
          url_redirecionamento_sucesso: string | null
          valor: number
          valor_original: number | null
          webhook_url: string | null
        }
        Insert: {
          afiliado_id?: string | null
          campanha_nome?: string | null
          checkout_id?: string | null
          codigo_unico: string
          contador_usos?: number | null
          cpf_cliente_obrigatorio?: boolean | null
          created_at?: string
          criado_por?: string | null
          cupom_id?: string | null
          data_expiracao?: string | null
          deleted_at?: string | null
          descricao?: string | null
          email_cliente_obrigatorio?: boolean | null
          empresa_id: string
          endereco_cliente_obrigatorio?: boolean | null
          fonte_trafego?: string | null
          id?: string
          max_usos?: number | null
          mensagem_sucesso_personalizada?: string | null
          metadata?: Json | null
          moeda?: string | null
          nome_cliente_obrigatorio?: boolean | null
          notificar_email_criador?: boolean | null
          notificar_whatsapp_criador?: boolean | null
          permite_editar_valor?: boolean | null
          produto_id?: string | null
          status?: Database["public"]["Enums"]["status_link_pagamento"]
          telefone_cliente_obrigatorio?: boolean | null
          termo_utm?: string | null
          tipo?: Database["public"]["Enums"]["tipo_link_pagamento"]
          titulo: string
          updated_at?: string
          url_redirecionamento_sucesso?: string | null
          valor?: number
          valor_original?: number | null
          webhook_url?: string | null
        }
        Update: {
          afiliado_id?: string | null
          campanha_nome?: string | null
          checkout_id?: string | null
          codigo_unico?: string
          contador_usos?: number | null
          cpf_cliente_obrigatorio?: boolean | null
          created_at?: string
          criado_por?: string | null
          cupom_id?: string | null
          data_expiracao?: string | null
          deleted_at?: string | null
          descricao?: string | null
          email_cliente_obrigatorio?: boolean | null
          empresa_id?: string
          endereco_cliente_obrigatorio?: boolean | null
          fonte_trafego?: string | null
          id?: string
          max_usos?: number | null
          mensagem_sucesso_personalizada?: string | null
          metadata?: Json | null
          moeda?: string | null
          nome_cliente_obrigatorio?: boolean | null
          notificar_email_criador?: boolean | null
          notificar_whatsapp_criador?: boolean | null
          permite_editar_valor?: boolean | null
          produto_id?: string | null
          status?: Database["public"]["Enums"]["status_link_pagamento"]
          telefone_cliente_obrigatorio?: boolean | null
          termo_utm?: string | null
          tipo?: Database["public"]["Enums"]["tipo_link_pagamento"]
          titulo?: string
          updated_at?: string
          url_redirecionamento_sucesso?: string | null
          valor?: number
          valor_original?: number | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "links_pagamento_afiliado_id_fkey"
            columns: ["afiliado_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_pagamento_checkout_id_fkey"
            columns: ["checkout_id"]
            isOneToOne: false
            referencedRelation: "checkouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_pagamento_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_pagamento_cupom_id_fkey"
            columns: ["cupom_id"]
            isOneToOne: false
            referencedRelation: "cupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_pagamento_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_pagamento_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_inscricoes: {
        Row: {
          afiliado_id: string
          aprovada_em: string | null
          aprovada_por: string | null
          ativa: boolean | null
          created_at: string
          data_inscricao: string
          data_ultima_venda: string | null
          empresa_id: string
          id: string
          marketplace_produto_id: string
          metadata: Json | null
          motivo_rejeicao: string | null
          produto_id: string | null
          rejeitada_em: string | null
          status: string
          taxa_comissao_aplicada: number | null
          total_comissao_gerada: number | null
          total_vendas: number | null
          updated_at: string
        }
        Insert: {
          afiliado_id: string
          aprovada_em?: string | null
          aprovada_por?: string | null
          ativa?: boolean | null
          created_at?: string
          data_inscricao?: string
          data_ultima_venda?: string | null
          empresa_id: string
          id?: string
          marketplace_produto_id: string
          metadata?: Json | null
          motivo_rejeicao?: string | null
          produto_id?: string | null
          rejeitada_em?: string | null
          status?: string
          taxa_comissao_aplicada?: number | null
          total_comissao_gerada?: number | null
          total_vendas?: number | null
          updated_at?: string
        }
        Update: {
          afiliado_id?: string
          aprovada_em?: string | null
          aprovada_por?: string | null
          ativa?: boolean | null
          created_at?: string
          data_inscricao?: string
          data_ultima_venda?: string | null
          empresa_id?: string
          id?: string
          marketplace_produto_id?: string
          metadata?: Json | null
          motivo_rejeicao?: string | null
          produto_id?: string | null
          rejeitada_em?: string | null
          status?: string
          taxa_comissao_aplicada?: number | null
          total_comissao_gerada?: number | null
          total_vendas?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_inscricoes_afiliado_id_fkey"
            columns: ["afiliado_id"]
            isOneToOne: false
            referencedRelation: "afiliados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_inscricoes_aprovada_por_fkey"
            columns: ["aprovada_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_inscricoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_inscricoes_marketplace_produto_id_fkey"
            columns: ["marketplace_produto_id"]
            isOneToOne: false
            referencedRelation: "marketplace_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_inscricoes_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_produtos: {
        Row: {
          avaliacao_media: number | null
          categoria_marketplace: string | null
          comissao_valor_fixo_oferecida: number | null
          created_at: string
          data_destaque: string | null
          data_publicacao: string | null
          deleted_at: string | null
          descricao_marketplace: string
          destaque_marketplace: boolean | null
          empresa_vendedora_id: string
          enviado_por: string | null
          faixa_etaria: string | null
          galeria_marketplace: string[] | null
          id: string
          imagem_destaque: string
          material_apoio_disponivel: string[] | null
          metadata: Json | null
          motivo_rejeicao: string | null
          nivel_qualidade: number | null
          ordem_destaque: number | null
          palavras_chave: string | null
          politica_reembolso_marketplace: string | null
          preco_marketplace: number
          produto_id: string
          publico_alvo: string | null
          recorrencia_ativa: boolean | null
          revisado_em: string | null
          revisado_por: string | null
          status: Database["public"]["Enums"]["status_marketplace_produto"]
          subcategoria_marketplace: string | null
          subtitulo_marketplace: string | null
          tags_marketplace: string[] | null
          taxa_comissao_oferecida: number
          taxa_comissao_recorrente: number | null
          termos_condicoes_marketplace: string | null
          titulo_marketplace: string
          total_afiliados_ativos: number | null
          total_avaliacoes: number | null
          total_vendas_total: number | null
          updated_at: string
          url_pagina_obrigacoes: string | null
          url_pagina_vendas: string | null
          video_promocional_url: string | null
        }
        Insert: {
          avaliacao_media?: number | null
          categoria_marketplace?: string | null
          comissao_valor_fixo_oferecida?: number | null
          created_at?: string
          data_destaque?: string | null
          data_publicacao?: string | null
          deleted_at?: string | null
          descricao_marketplace: string
          destaque_marketplace?: boolean | null
          empresa_vendedora_id: string
          enviado_por?: string | null
          faixa_etaria?: string | null
          galeria_marketplace?: string[] | null
          id?: string
          imagem_destaque: string
          material_apoio_disponivel?: string[] | null
          metadata?: Json | null
          motivo_rejeicao?: string | null
          nivel_qualidade?: number | null
          ordem_destaque?: number | null
          palavras_chave?: string | null
          politica_reembolso_marketplace?: string | null
          preco_marketplace: number
          produto_id: string
          publico_alvo?: string | null
          recorrencia_ativa?: boolean | null
          revisado_em?: string | null
          revisado_por?: string | null
          status?: Database["public"]["Enums"]["status_marketplace_produto"]
          subcategoria_marketplace?: string | null
          subtitulo_marketplace?: string | null
          tags_marketplace?: string[] | null
          taxa_comissao_oferecida?: number
          taxa_comissao_recorrente?: number | null
          termos_condicoes_marketplace?: string | null
          titulo_marketplace: string
          total_afiliados_ativos?: number | null
          total_avaliacoes?: number | null
          total_vendas_total?: number | null
          updated_at?: string
          url_pagina_obrigacoes?: string | null
          url_pagina_vendas?: string | null
          video_promocional_url?: string | null
        }
        Update: {
          avaliacao_media?: number | null
          categoria_marketplace?: string | null
          comissao_valor_fixo_oferecida?: number | null
          created_at?: string
          data_destaque?: string | null
          data_publicacao?: string | null
          deleted_at?: string | null
          descricao_marketplace?: string
          destaque_marketplace?: boolean | null
          empresa_vendedora_id?: string
          enviado_por?: string | null
          faixa_etaria?: string | null
          galeria_marketplace?: string[] | null
          id?: string
          imagem_destaque?: string
          material_apoio_disponivel?: string[] | null
          metadata?: Json | null
          motivo_rejeicao?: string | null
          nivel_qualidade?: number | null
          ordem_destaque?: number | null
          palavras_chave?: string | null
          politica_reembolso_marketplace?: string | null
          preco_marketplace?: number
          produto_id?: string
          publico_alvo?: string | null
          recorrencia_ativa?: boolean | null
          revisado_em?: string | null
          revisado_por?: string | null
          status?: Database["public"]["Enums"]["status_marketplace_produto"]
          subcategoria_marketplace?: string | null
          subtitulo_marketplace?: string | null
          tags_marketplace?: string[] | null
          taxa_comissao_oferecida?: number
          taxa_comissao_recorrente?: number | null
          termos_condicoes_marketplace?: string | null
          titulo_marketplace?: string
          total_afiliados_ativos?: number | null
          total_avaliacoes?: number | null
          total_vendas_total?: number | null
          updated_at?: string
          url_pagina_obrigacoes?: string | null
          url_pagina_vendas?: string | null
          video_promocional_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_produtos_empresa_vendedora_id_fkey"
            columns: ["empresa_vendedora_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_produtos_enviado_por_fkey"
            columns: ["enviado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_produtos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      notificacoes: {
        Row: {
          afiliado_id: string | null
          agrupamento_chave: string | null
          arquivada: boolean | null
          canal_email: boolean | null
          canal_inapp: boolean | null
          canal_push: boolean | null
          canal_sms: boolean | null
          canal_whatsapp: boolean | null
          cliente_id: string | null
          cor: string | null
          created_at: string
          criada_por: string | null
          criada_sistema: boolean | null
          dados_relacionados: Json | null
          data_arquivamento: string | null
          data_envio_email: string | null
          data_envio_push: string | null
          data_envio_sms: string | null
          data_envio_whatsapp: string | null
          data_leitura: string | null
          deleted_at: string | null
          disparar_email_em: string | null
          email_enviado: boolean | null
          empresa_id: string | null
          entidade_id: string | null
          entidade_tipo: string | null
          expira_em: string | null
          fixada: boolean | null
          icone: string | null
          id: string
          id_email_provedor: string | null
          imagem_url: string | null
          lida: boolean | null
          mensagem: string
          metadata: Json | null
          prioridade: number | null
          profile_id: string | null
          push_enviado: boolean | null
          resumo_curto: string | null
          sms_enviado: boolean | null
          tipo: Database["public"]["Enums"]["tipo_notificacao"]
          titulo: string
          updated_at: string
          url_destino: string | null
          whatsapp_enviado: boolean | null
        }
        Insert: {
          afiliado_id?: string | null
          agrupamento_chave?: string | null
          arquivada?: boolean | null
          canal_email?: boolean | null
          canal_inapp?: boolean | null
          canal_push?: boolean | null
          canal_sms?: boolean | null
          canal_whatsapp?: boolean | null
          cliente_id?: string | null
          cor?: string | null
          created_at?: string
          criada_por?: string | null
          criada_sistema?: boolean | null
          dados_relacionados?: Json | null
          data_arquivamento?: string | null
          data_envio_email?: string | null
          data_envio_push?: string | null
          data_envio_sms?: string | null
          data_envio_whatsapp?: string | null
          data_leitura?: string | null
          deleted_at?: string | null
          disparar_email_em?: string | null
          email_enviado?: boolean | null
          empresa_id?: string | null
          entidade_id?: string | null
          entidade_tipo?: string | null
          expira_em?: string | null
          fixada?: boolean | null
          icone?: string | null
          id?: string
          id_email_provedor?: string | null
          imagem_url?: string | null
          lida?: boolean | null
          mensagem: string
          metadata?: Json | null
          prioridade?: number | null
          profile_id?: string | null
          push_enviado?: boolean | null
          resumo_curto?: string | null
          sms_enviado?: boolean | null
          tipo: Database["public"]["Enums"]["tipo_notificacao"]
          titulo: string
          updated_at?: string
          url_destino?: string | null
          whatsapp_enviado?: boolean | null
        }
        Update: {
          afiliado_id?: string | null
          agrupamento_chave?: string | null
          arquivada?: boolean | null
          canal_email?: boolean | null
          canal_inapp?: boolean | null
          canal_push?: boolean | null
          canal_sms?: boolean | null
          canal_whatsapp?: boolean | null
          cliente_id?: string | null
          cor?: string | null
          created_at?: string
          criada_por?: string | null
          criada_sistema?: boolean | null
          dados_relacionados?: Json | null
          data_arquivamento?: string | null
          data_envio_email?: string | null
          data_envio_push?: string | null
          data_envio_sms?: string | null
          data_envio_whatsapp?: string | null
          data_leitura?: string | null
          deleted_at?: string | null
          disparar_email_em?: string | null
          email_enviado?: boolean | null
          empresa_id?: string | null
          entidade_id?: string | null
          entidade_tipo?: string | null
          expira_em?: string | null
          fixada?: boolean | null
          icone?: string | null
          id?: string
          id_email_provedor?: string | null
          imagem_url?: string | null
          lida?: boolean | null
          mensagem?: string
          metadata?: Json | null
          prioridade?: number | null
          profile_id?: string | null
          push_enviado?: boolean | null
          resumo_curto?: string | null
          sms_enviado?: boolean | null
          tipo?: Database["public"]["Enums"]["tipo_notificacao"]
          titulo?: string
          updated_at?: string
          url_destino?: string | null
          whatsapp_enviado?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "notificacoes_afiliado_id_fkey"
            columns: ["afiliado_id"]
            isOneToOne: false
            referencedRelation: "afiliados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notificacoes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notificacoes_criada_por_fkey"
            columns: ["criada_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notificacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notificacoes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notificacoes_preferencias: {
        Row: {
          afiliado_id: string | null
          created_at: string
          dias_silenciosos: number[] | null
          horario_fim_silencioso: string | null
          horario_inicio_silencioso: string | null
          id: string
          profile_id: string
          receber_email: boolean | null
          receber_inapp: boolean | null
          receber_push: boolean | null
          receber_sms: boolean | null
          receber_whatsapp: boolean | null
          tipo_notificacao: string
          updated_at: string
        }
        Insert: {
          afiliado_id?: string | null
          created_at?: string
          dias_silenciosos?: number[] | null
          horario_fim_silencioso?: string | null
          horario_inicio_silencioso?: string | null
          id?: string
          profile_id: string
          receber_email?: boolean | null
          receber_inapp?: boolean | null
          receber_push?: boolean | null
          receber_sms?: boolean | null
          receber_whatsapp?: boolean | null
          tipo_notificacao: string
          updated_at?: string
        }
        Update: {
          afiliado_id?: string | null
          created_at?: string
          dias_silenciosos?: number[] | null
          horario_fim_silencioso?: string | null
          horario_inicio_silencioso?: string | null
          id?: string
          profile_id?: string
          receber_email?: boolean | null
          receber_inapp?: boolean | null
          receber_push?: boolean | null
          receber_sms?: boolean | null
          receber_whatsapp?: boolean | null
          tipo_notificacao?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notificacoes_preferencias_afiliado_id_fkey"
            columns: ["afiliado_id"]
            isOneToOne: false
            referencedRelation: "afiliados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notificacoes_preferencias_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          acao: Database["public"]["Enums"]["tipo_operacao"]
          created_at: string
          descricao: string | null
          id: string
          modulo: string
          nome_exibicao: string
          recurso: string
        }
        Insert: {
          acao: Database["public"]["Enums"]["tipo_operacao"]
          created_at?: string
          descricao?: string | null
          id?: string
          modulo: string
          nome_exibicao: string
          recurso: string
        }
        Update: {
          acao?: Database["public"]["Enums"]["tipo_operacao"]
          created_at?: string
          descricao?: string | null
          id?: string
          modulo?: string
          nome_exibicao?: string
          recurso?: string
        }
        Relationships: []
      }
      produtos: {
        Row: {
          altura: number | null
          arquivos_download: string[] | null
          atributos: Json | null
          avaliacao_media: number | null
          categoria_id: string | null
          comissao_valor_fixo: number | null
          comprimento: number | null
          configuracoes: Json | null
          created_at: string
          criado_por: string | null
          custo: number | null
          deleted_at: string | null
          descricao_curta: string | null
          descricao_longa: string | null
          destaque: boolean | null
          empresa_id: string
          especificacoes: Json | null
          estoque: number | null
          estoque_minimo: number | null
          galeria_urls: string[] | null
          gerencia_estoque: boolean | null
          id: string
          imagem_principal_url: string | null
          integracao_id_externo: string | null
          juros_ao_dia: number | null
          juros_parcelamento: number | null
          lancamento: boolean | null
          largura: number | null
          mais_vendido: boolean | null
          max_parcelas: number | null
          meta_descricao: string | null
          meta_palavras_chave: string | null
          meta_titulo: string | null
          moeda: string | null
          multa_atraso: number | null
          ncm: string | null
          nome: string
          origem_mercadoria: string | null
          parcela_minima: number | null
          periodo_assinatura: number | null
          permite_cancelar: boolean | null
          permite_parcelamento: boolean | null
          peso: number | null
          politica_reembolso: string | null
          preco: number
          preco_promocional: number | null
          promocao_fim: string | null
          promocao_inicio: string | null
          publicacao_data: string | null
          published_at: string | null
          receita_total: number | null
          seo_json: Json | null
          sku: string | null
          slug: string
          status: Database["public"]["Enums"]["status_produto"]
          subtitulo: string | null
          tags: string[] | null
          taxa_comissao_afiliado: number | null
          termos_uso: string | null
          tipo: Database["public"]["Enums"]["tipo_produto"]
          total_avaliacoes: number | null
          total_vendido: number | null
          trial_dias: number | null
          unidade_periodo: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          altura?: number | null
          arquivos_download?: string[] | null
          atributos?: Json | null
          avaliacao_media?: number | null
          categoria_id?: string | null
          comissao_valor_fixo?: number | null
          comprimento?: number | null
          configuracoes?: Json | null
          created_at?: string
          criado_por?: string | null
          custo?: number | null
          deleted_at?: string | null
          descricao_curta?: string | null
          descricao_longa?: string | null
          destaque?: boolean | null
          empresa_id: string
          especificacoes?: Json | null
          estoque?: number | null
          estoque_minimo?: number | null
          galeria_urls?: string[] | null
          gerencia_estoque?: boolean | null
          id?: string
          imagem_principal_url?: string | null
          integracao_id_externo?: string | null
          juros_ao_dia?: number | null
          juros_parcelamento?: number | null
          lancamento?: boolean | null
          largura?: number | null
          mais_vendido?: boolean | null
          max_parcelas?: number | null
          meta_descricao?: string | null
          meta_palavras_chave?: string | null
          meta_titulo?: string | null
          moeda?: string | null
          multa_atraso?: number | null
          ncm?: string | null
          nome: string
          origem_mercadoria?: string | null
          parcela_minima?: number | null
          periodo_assinatura?: number | null
          permite_cancelar?: boolean | null
          permite_parcelamento?: boolean | null
          peso?: number | null
          politica_reembolso?: string | null
          preco?: number
          preco_promocional?: number | null
          promocao_fim?: string | null
          promocao_inicio?: string | null
          publicacao_data?: string | null
          published_at?: string | null
          receita_total?: number | null
          seo_json?: Json | null
          sku?: string | null
          slug: string
          status?: Database["public"]["Enums"]["status_produto"]
          subtitulo?: string | null
          tags?: string[] | null
          taxa_comissao_afiliado?: number | null
          termos_uso?: string | null
          tipo?: Database["public"]["Enums"]["tipo_produto"]
          total_avaliacoes?: number | null
          total_vendido?: number | null
          trial_dias?: number | null
          unidade_periodo?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          altura?: number | null
          arquivos_download?: string[] | null
          atributos?: Json | null
          avaliacao_media?: number | null
          categoria_id?: string | null
          comissao_valor_fixo?: number | null
          comprimento?: number | null
          configuracoes?: Json | null
          created_at?: string
          criado_por?: string | null
          custo?: number | null
          deleted_at?: string | null
          descricao_curta?: string | null
          descricao_longa?: string | null
          destaque?: boolean | null
          empresa_id?: string
          especificacoes?: Json | null
          estoque?: number | null
          estoque_minimo?: number | null
          galeria_urls?: string[] | null
          gerencia_estoque?: boolean | null
          id?: string
          imagem_principal_url?: string | null
          integracao_id_externo?: string | null
          juros_ao_dia?: number | null
          juros_parcelamento?: number | null
          lancamento?: boolean | null
          largura?: number | null
          mais_vendido?: boolean | null
          max_parcelas?: number | null
          meta_descricao?: string | null
          meta_palavras_chave?: string | null
          meta_titulo?: string | null
          moeda?: string | null
          multa_atraso?: number | null
          ncm?: string | null
          nome?: string
          origem_mercadoria?: string | null
          parcela_minima?: number | null
          periodo_assinatura?: number | null
          permite_cancelar?: boolean | null
          permite_parcelamento?: boolean | null
          peso?: number | null
          politica_reembolso?: string | null
          preco?: number
          preco_promocional?: number | null
          promocao_fim?: string | null
          promocao_inicio?: string | null
          publicacao_data?: string | null
          published_at?: string | null
          receita_total?: number | null
          seo_json?: Json | null
          sku?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["status_produto"]
          subtitulo?: string | null
          tags?: string[] | null
          taxa_comissao_afiliado?: number | null
          termos_uso?: string | null
          tipo?: Database["public"]["Enums"]["tipo_produto"]
          total_avaliacoes?: number | null
          total_vendido?: number | null
          trial_dias?: number | null
          unidade_periodo?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "produtos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_roles: {
        Row: {
          concedido_por: string | null
          created_at: string
          data_concessao: string
          empresa_id: string
          expira_em: string | null
          id: string
          profile_id: string
          role_id: string
        }
        Insert: {
          concedido_por?: string | null
          created_at?: string
          data_concessao?: string
          empresa_id: string
          expira_em?: string | null
          id?: string
          profile_id: string
          role_id: string
        }
        Update: {
          concedido_por?: string | null
          created_at?: string
          data_concessao?: string
          empresa_id?: string
          expira_em?: string | null
          id?: string
          profile_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_roles_concedido_por_fkey"
            columns: ["concedido_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_roles_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_roles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bairro: string | null
          bio: string | null
          cargo: string | null
          celular: string | null
          cep: string | null
          cidade: string | null
          complemento: string | null
          cpf: string | null
          created_at: string
          data_nascimento: string | null
          deleted_at: string | null
          departamento: string | null
          email: string
          empresa_id: string | null
          estado: string | null
          id: string
          is_admin_global: boolean
          is_owner: boolean
          logradouro: string | null
          nome_completo: string
          numero: string | null
          pais: string | null
          preferencias: Json | null
          sexo: string | null
          status: Database["public"]["Enums"]["status_ativo"]
          telefone: string | null
          ultimo_ip: string | null
          ultimo_login: string | null
          ultimo_user_agent: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bairro?: string | null
          bio?: string | null
          cargo?: string | null
          celular?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          cpf?: string | null
          created_at?: string
          data_nascimento?: string | null
          deleted_at?: string | null
          departamento?: string | null
          email: string
          empresa_id?: string | null
          estado?: string | null
          id: string
          is_admin_global?: boolean
          is_owner?: boolean
          logradouro?: string | null
          nome_completo: string
          numero?: string | null
          pais?: string | null
          preferencias?: Json | null
          sexo?: string | null
          status?: Database["public"]["Enums"]["status_ativo"]
          telefone?: string | null
          ultimo_ip?: string | null
          ultimo_login?: string | null
          ultimo_user_agent?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bairro?: string | null
          bio?: string | null
          cargo?: string | null
          celular?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          cpf?: string | null
          created_at?: string
          data_nascimento?: string | null
          deleted_at?: string | null
          departamento?: string | null
          email?: string
          empresa_id?: string | null
          estado?: string | null
          id?: string
          is_admin_global?: boolean
          is_owner?: boolean
          logradouro?: string | null
          nome_completo?: string
          numero?: string | null
          pais?: string | null
          preferencias?: Json | null
          sexo?: string | null
          status?: Database["public"]["Enums"]["status_ativo"]
          telefone?: string | null
          ultimo_ip?: string | null
          ultimo_login?: string | null
          ultimo_user_agent?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      rede_afiliados_hierarquia: {
        Row: {
          afiliado_filho_id: string
          afiliado_pai_id: string
          ativa: boolean | null
          created_at: string
          data_associacao: string
          empresa_id: string
          id: string
          lado: string | null
          nivel: number
          posicao: number | null
        }
        Insert: {
          afiliado_filho_id: string
          afiliado_pai_id: string
          ativa?: boolean | null
          created_at?: string
          data_associacao?: string
          empresa_id: string
          id?: string
          lado?: string | null
          nivel?: number
          posicao?: number | null
        }
        Update: {
          afiliado_filho_id?: string
          afiliado_pai_id?: string
          ativa?: boolean | null
          created_at?: string
          data_associacao?: string
          empresa_id?: string
          id?: string
          lado?: string | null
          nivel?: number
          posicao?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rede_afiliados_hierarquia_afiliado_filho_id_fkey"
            columns: ["afiliado_filho_id"]
            isOneToOne: false
            referencedRelation: "afiliados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rede_afiliados_hierarquia_afiliado_pai_id_fkey"
            columns: ["afiliado_pai_id"]
            isOneToOne: false
            referencedRelation: "afiliados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rede_afiliados_hierarquia_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      relatorios_agendados: {
        Row: {
          assunto_email: string | null
          ativo: boolean | null
          colunas_exibidas: string[] | null
          compactar_arquivo: boolean | null
          corpo_email: string | null
          created_at: string
          criado_por: string | null
          deleted_at: string | null
          destinatarios_emails: string[]
          destinatarios_profiles: string[] | null
          dia_mes: number | null
          dia_semana: number | null
          empresa_id: string
          enviar_se_sem_dados: boolean | null
          erro_ultimo: string | null
          filtros: Json | null
          formato: string | null
          frequencia: Database["public"]["Enums"]["frequencia_relatorio"]
          hora: string
          id: string
          nome_relatorio: string
          proximo_envio: string | null
          status: string | null
          tipo_relatorio: string
          total_enviados: number | null
          total_falhas: number | null
          ultimo_envio: string | null
          updated_at: string
          webhook_notificacao: string | null
          zip_senha_protegida: boolean | null
        }
        Insert: {
          assunto_email?: string | null
          ativo?: boolean | null
          colunas_exibidas?: string[] | null
          compactar_arquivo?: boolean | null
          corpo_email?: string | null
          created_at?: string
          criado_por?: string | null
          deleted_at?: string | null
          destinatarios_emails?: string[]
          destinatarios_profiles?: string[] | null
          dia_mes?: number | null
          dia_semana?: number | null
          empresa_id: string
          enviar_se_sem_dados?: boolean | null
          erro_ultimo?: string | null
          filtros?: Json | null
          formato?: string | null
          frequencia: Database["public"]["Enums"]["frequencia_relatorio"]
          hora: string
          id?: string
          nome_relatorio: string
          proximo_envio?: string | null
          status?: string | null
          tipo_relatorio: string
          total_enviados?: number | null
          total_falhas?: number | null
          ultimo_envio?: string | null
          updated_at?: string
          webhook_notificacao?: string | null
          zip_senha_protegida?: boolean | null
        }
        Update: {
          assunto_email?: string | null
          ativo?: boolean | null
          colunas_exibidas?: string[] | null
          compactar_arquivo?: boolean | null
          corpo_email?: string | null
          created_at?: string
          criado_por?: string | null
          deleted_at?: string | null
          destinatarios_emails?: string[]
          destinatarios_profiles?: string[] | null
          dia_mes?: number | null
          dia_semana?: number | null
          empresa_id?: string
          enviar_se_sem_dados?: boolean | null
          erro_ultimo?: string | null
          filtros?: Json | null
          formato?: string | null
          frequencia?: Database["public"]["Enums"]["frequencia_relatorio"]
          hora?: string
          id?: string
          nome_relatorio?: string
          proximo_envio?: string | null
          status?: string | null
          tipo_relatorio?: string
          total_enviados?: number | null
          total_falhas?: number | null
          ultimo_envio?: string | null
          updated_at?: string
          webhook_notificacao?: string | null
          zip_senha_protegida?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "relatorios_agendados_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relatorios_agendados_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      relatorios_historico: {
        Row: {
          agendamento_id: string | null
          created_at: string
          empresa_id: string | null
          error_message: string | null
          expira_em: string | null
          filtros_aplicados: Json | null
          formato: string
          gerado_por: string | null
          id: string
          nome_arquivo: string
          periodo_fim: string | null
          periodo_inicio: string | null
          profile_id: string | null
          status: string
          tamanho_bytes: number | null
          tempo_geracao_ms: number | null
          tipo_relatorio: string
          total_downloads: number | null
          total_registros: number | null
          total_visualizacoes: number | null
          url_arquivo: string | null
        }
        Insert: {
          agendamento_id?: string | null
          created_at?: string
          empresa_id?: string | null
          error_message?: string | null
          expira_em?: string | null
          filtros_aplicados?: Json | null
          formato: string
          gerado_por?: string | null
          id?: string
          nome_arquivo: string
          periodo_fim?: string | null
          periodo_inicio?: string | null
          profile_id?: string | null
          status?: string
          tamanho_bytes?: number | null
          tempo_geracao_ms?: number | null
          tipo_relatorio: string
          total_downloads?: number | null
          total_registros?: number | null
          total_visualizacoes?: number | null
          url_arquivo?: string | null
        }
        Update: {
          agendamento_id?: string | null
          created_at?: string
          empresa_id?: string | null
          error_message?: string | null
          expira_em?: string | null
          filtros_aplicados?: Json | null
          formato?: string
          gerado_por?: string | null
          id?: string
          nome_arquivo?: string
          periodo_fim?: string | null
          periodo_inicio?: string | null
          profile_id?: string | null
          status?: string
          tamanho_bytes?: number | null
          tempo_geracao_ms?: number | null
          tipo_relatorio?: string
          total_downloads?: number | null
          total_registros?: number | null
          total_visualizacoes?: number | null
          url_arquivo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "relatorios_historico_agendamento_id_fkey"
            columns: ["agendamento_id"]
            isOneToOne: false
            referencedRelation: "relatorios_agendados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relatorios_historico_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relatorios_historico_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      repasses: {
        Row: {
          comprovante_url: string | null
          conta_bancaria_id: string | null
          created_at: string
          data_agendada: string | null
          data_confirmacao: string | null
          data_envio: string | null
          data_recebimento: string | null
          destinatario_documento: string
          destinatario_nome: string
          empresa_id: string
          enviado_por: string | null
          id: string
          id_repasse_externo: string | null
          metadata: Json | null
          metodo_repasse: string | null
          moeda: string | null
          observacoes: string | null
          parcela_id: string | null
          percentual_acordado: number | null
          status: Database["public"]["Enums"]["status_repasse"]
          taxa_administrativa: number | null
          transacao_id: string | null
          updated_at: string
          valor_bruto: number
          valor_liquido: number
        }
        Insert: {
          comprovante_url?: string | null
          conta_bancaria_id?: string | null
          created_at?: string
          data_agendada?: string | null
          data_confirmacao?: string | null
          data_envio?: string | null
          data_recebimento?: string | null
          destinatario_documento: string
          destinatario_nome: string
          empresa_id: string
          enviado_por?: string | null
          id?: string
          id_repasse_externo?: string | null
          metadata?: Json | null
          metodo_repasse?: string | null
          moeda?: string | null
          observacoes?: string | null
          parcela_id?: string | null
          percentual_acordado?: number | null
          status?: Database["public"]["Enums"]["status_repasse"]
          taxa_administrativa?: number | null
          transacao_id?: string | null
          updated_at?: string
          valor_bruto: number
          valor_liquido: number
        }
        Update: {
          comprovante_url?: string | null
          conta_bancaria_id?: string | null
          created_at?: string
          data_agendada?: string | null
          data_confirmacao?: string | null
          data_envio?: string | null
          data_recebimento?: string | null
          destinatario_documento?: string
          destinatario_nome?: string
          empresa_id?: string
          enviado_por?: string | null
          id?: string
          id_repasse_externo?: string | null
          metadata?: Json | null
          metodo_repasse?: string | null
          moeda?: string | null
          observacoes?: string | null
          parcela_id?: string | null
          percentual_acordado?: number | null
          status?: Database["public"]["Enums"]["status_repasse"]
          taxa_administrativa?: number | null
          transacao_id?: string | null
          updated_at?: string
          valor_bruto?: number
          valor_liquido?: number
        }
        Relationships: [
          {
            foreignKeyName: "repasses_conta_bancaria_id_fkey"
            columns: ["conta_bancaria_id"]
            isOneToOne: false
            referencedRelation: "contas_bancarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repasses_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repasses_enviado_por_fkey"
            columns: ["enviado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repasses_parcela_id_fkey"
            columns: ["parcela_id"]
            isOneToOne: false
            referencedRelation: "transacoes_parcelas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repasses_transacao_id_fkey"
            columns: ["transacao_id"]
            isOneToOne: false
            referencedRelation: "transacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          cor: string | null
          created_at: string
          deleted_at: string | null
          descricao: string | null
          empresa_id: string | null
          id: string
          is_admin: boolean
          is_sistema: boolean
          nivel: number | null
          nome: string
          updated_at: string
        }
        Insert: {
          cor?: string | null
          created_at?: string
          deleted_at?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          is_admin?: boolean
          is_sistema?: boolean
          nivel?: number | null
          nome: string
          updated_at?: string
        }
        Update: {
          cor?: string | null
          created_at?: string
          deleted_at?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          is_admin?: boolean
          is_sistema?: boolean
          nivel?: number | null
          nome?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      saldos: {
        Row: {
          afiliado_id: string | null
          atualizado_em: string
          created_at: string
          empresa_id: string | null
          id: string
          moeda: string | null
          profile_id: string | null
          saldo_bloqueado: number
          saldo_bruto: number
          saldo_disponivel: number
          saldo_em_analise: number
          saldo_estornado: number
          saldo_previsao_liberar: number
          total_com_impostos: number | null
          total_entrado_historico: number
          total_sacado: number
          total_saido_historico: number
          ultimo_movimento: string | null
        }
        Insert: {
          afiliado_id?: string | null
          atualizado_em?: string
          created_at?: string
          empresa_id?: string | null
          id?: string
          moeda?: string | null
          profile_id?: string | null
          saldo_bloqueado?: number
          saldo_bruto?: number
          saldo_disponivel?: number
          saldo_em_analise?: number
          saldo_estornado?: number
          saldo_previsao_liberar?: number
          total_com_impostos?: number | null
          total_entrado_historico?: number
          total_sacado?: number
          total_saido_historico?: number
          ultimo_movimento?: string | null
        }
        Update: {
          afiliado_id?: string | null
          atualizado_em?: string
          created_at?: string
          empresa_id?: string | null
          id?: string
          moeda?: string | null
          profile_id?: string | null
          saldo_bloqueado?: number
          saldo_bruto?: number
          saldo_disponivel?: number
          saldo_em_analise?: number
          saldo_estornado?: number
          saldo_previsao_liberar?: number
          total_com_impostos?: number | null
          total_entrado_historico?: number
          total_sacado?: number
          total_saido_historico?: number
          ultimo_movimento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saldos_afiliado_id_fkey"
            columns: ["afiliado_id"]
            isOneToOne: false
            referencedRelation: "afiliados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saldos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saldos_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saques: {
        Row: {
          afiliado_id: string | null
          analisado_por: string | null
          aprovado_por: string | null
          autenticacao_bancaria: string | null
          cancelado_por: string | null
          comissoes_ids: string[] | null
          comprovante_url: string | null
          conta_bancaria_id: string | null
          created_at: string
          data_analise: string | null
          data_aprovacao: string | null
          data_cancelamento: string | null
          data_envio: string | null
          data_pagamento: string | null
          data_rejeicao: string | null
          data_solicitacao: string
          empresa_id: string | null
          id: string
          id_transferencia_externa: string | null
          metadata: Json | null
          metodo_saque: string
          moeda: string | null
          motivo_cancelamento: string | null
          motivo_rejeicao: string | null
          observacoes: string | null
          profile_id: string | null
          protocolo: string
          rejeitado_por: string | null
          status: Database["public"]["Enums"]["status_saque"]
          taxa_saque: number | null
          transacoes_ids: string[] | null
          updated_at: string
          valor_liquido: number
          valor_solicitado: number
        }
        Insert: {
          afiliado_id?: string | null
          analisado_por?: string | null
          aprovado_por?: string | null
          autenticacao_bancaria?: string | null
          cancelado_por?: string | null
          comissoes_ids?: string[] | null
          comprovante_url?: string | null
          conta_bancaria_id?: string | null
          created_at?: string
          data_analise?: string | null
          data_aprovacao?: string | null
          data_cancelamento?: string | null
          data_envio?: string | null
          data_pagamento?: string | null
          data_rejeicao?: string | null
          data_solicitacao?: string
          empresa_id?: string | null
          id?: string
          id_transferencia_externa?: string | null
          metadata?: Json | null
          metodo_saque?: string
          moeda?: string | null
          motivo_cancelamento?: string | null
          motivo_rejeicao?: string | null
          observacoes?: string | null
          profile_id?: string | null
          protocolo: string
          rejeitado_por?: string | null
          status?: Database["public"]["Enums"]["status_saque"]
          taxa_saque?: number | null
          transacoes_ids?: string[] | null
          updated_at?: string
          valor_liquido: number
          valor_solicitado: number
        }
        Update: {
          afiliado_id?: string | null
          analisado_por?: string | null
          aprovado_por?: string | null
          autenticacao_bancaria?: string | null
          cancelado_por?: string | null
          comissoes_ids?: string[] | null
          comprovante_url?: string | null
          conta_bancaria_id?: string | null
          created_at?: string
          data_analise?: string | null
          data_aprovacao?: string | null
          data_cancelamento?: string | null
          data_envio?: string | null
          data_pagamento?: string | null
          data_rejeicao?: string | null
          data_solicitacao?: string
          empresa_id?: string | null
          id?: string
          id_transferencia_externa?: string | null
          metadata?: Json | null
          metodo_saque?: string
          moeda?: string | null
          motivo_cancelamento?: string | null
          motivo_rejeicao?: string | null
          observacoes?: string | null
          profile_id?: string | null
          protocolo?: string
          rejeitado_por?: string | null
          status?: Database["public"]["Enums"]["status_saque"]
          taxa_saque?: number | null
          transacoes_ids?: string[] | null
          updated_at?: string
          valor_liquido?: number
          valor_solicitado?: number
        }
        Relationships: [
          {
            foreignKeyName: "saques_afiliado_id_fkey"
            columns: ["afiliado_id"]
            isOneToOne: false
            referencedRelation: "afiliados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saques_analisado_por_fkey"
            columns: ["analisado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saques_aprovado_por_fkey"
            columns: ["aprovado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saques_cancelado_por_fkey"
            columns: ["cancelado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saques_conta_bancaria_id_fkey"
            columns: ["conta_bancaria_id"]
            isOneToOne: false
            referencedRelation: "contas_bancarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saques_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saques_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saques_rejeitado_por_fkey"
            columns: ["rejeitado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seguranca_2fa: {
        Row: {
          ativado_por: string | null
          chave_secreta_criptografada: string
          codigos_recuperacao: string[] | null
          confiavel: boolean | null
          created_at: string
          data_ativacao: string | null
          data_desativacao: string | null
          desativado_por: string | null
          email_registrado: string | null
          id: string
          is_primario: boolean | null
          metadata: Json | null
          metodo: string
          motivo_desativacao: string | null
          profile_id: string
          qrcode_url: string | null
          telefone_registrado: string | null
          total_falhas: number | null
          total_usos: number | null
          ultimo_uso: string | null
          updated_at: string
        }
        Insert: {
          ativado_por?: string | null
          chave_secreta_criptografada: string
          codigos_recuperacao?: string[] | null
          confiavel?: boolean | null
          created_at?: string
          data_ativacao?: string | null
          data_desativacao?: string | null
          desativado_por?: string | null
          email_registrado?: string | null
          id?: string
          is_primario?: boolean | null
          metadata?: Json | null
          metodo: string
          motivo_desativacao?: string | null
          profile_id: string
          qrcode_url?: string | null
          telefone_registrado?: string | null
          total_falhas?: number | null
          total_usos?: number | null
          ultimo_uso?: string | null
          updated_at?: string
        }
        Update: {
          ativado_por?: string | null
          chave_secreta_criptografada?: string
          codigos_recuperacao?: string[] | null
          confiavel?: boolean | null
          created_at?: string
          data_ativacao?: string | null
          data_desativacao?: string | null
          desativado_por?: string | null
          email_registrado?: string | null
          id?: string
          is_primario?: boolean | null
          metadata?: Json | null
          metodo?: string
          motivo_desativacao?: string | null
          profile_id?: string
          qrcode_url?: string | null
          telefone_registrado?: string | null
          total_falhas?: number | null
          total_usos?: number | null
          ultimo_uso?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seguranca_2fa_ativado_por_fkey"
            columns: ["ativado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seguranca_2fa_desativado_por_fkey"
            columns: ["desativado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seguranca_2fa_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seguranca_audit_log: {
        Row: {
          acao: Database["public"]["Enums"]["tipo_audit_log"]
          afiliado_id: string | null
          alerta_disparado: boolean | null
          cidade: string | null
          cliente_id: string | null
          created_at: string
          dados_antes: Json | null
          dados_depois: Json | null
          descricao: string
          detalhes: Json | null
          empresa_id: string | null
          endpoint_url: string | null
          entidade: string | null
          entidade_id: string | null
          fk_registro_id: string | null
          fk_tabela_nome: string | null
          id: string
          ip_address: string | null
          latitude: number | null
          longitude: number | null
          metodo_http: string | null
          modulo: string | null
          pais: string | null
          profile_id: string | null
          risco_nivel: string | null
          risco_score: number | null
          sessao_id: string | null
          status_resposta: number | null
          user_agent: string | null
        }
        Insert: {
          acao: Database["public"]["Enums"]["tipo_audit_log"]
          afiliado_id?: string | null
          alerta_disparado?: boolean | null
          cidade?: string | null
          cliente_id?: string | null
          created_at?: string
          dados_antes?: Json | null
          dados_depois?: Json | null
          descricao: string
          detalhes?: Json | null
          empresa_id?: string | null
          endpoint_url?: string | null
          entidade?: string | null
          entidade_id?: string | null
          fk_registro_id?: string | null
          fk_tabela_nome?: string | null
          id?: string
          ip_address?: string | null
          latitude?: number | null
          longitude?: number | null
          metodo_http?: string | null
          modulo?: string | null
          pais?: string | null
          profile_id?: string | null
          risco_nivel?: string | null
          risco_score?: number | null
          sessao_id?: string | null
          status_resposta?: number | null
          user_agent?: string | null
        }
        Update: {
          acao?: Database["public"]["Enums"]["tipo_audit_log"]
          afiliado_id?: string | null
          alerta_disparado?: boolean | null
          cidade?: string | null
          cliente_id?: string | null
          created_at?: string
          dados_antes?: Json | null
          dados_depois?: Json | null
          descricao?: string
          detalhes?: Json | null
          empresa_id?: string | null
          endpoint_url?: string | null
          entidade?: string | null
          entidade_id?: string | null
          fk_registro_id?: string | null
          fk_tabela_nome?: string | null
          id?: string
          ip_address?: string | null
          latitude?: number | null
          longitude?: number | null
          metodo_http?: string | null
          modulo?: string | null
          pais?: string | null
          profile_id?: string | null
          risco_nivel?: string | null
          risco_score?: number | null
          sessao_id?: string | null
          status_resposta?: number | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seguranca_audit_log_afiliado_id_fkey"
            columns: ["afiliado_id"]
            isOneToOne: false
            referencedRelation: "afiliados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seguranca_audit_log_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seguranca_audit_log_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seguranca_audit_log_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seguranca_audit_log_sessao_id_fkey"
            columns: ["sessao_id"]
            isOneToOne: false
            referencedRelation: "seguranca_sessoes"
            referencedColumns: ["id"]
          },
        ]
      }
      seguranca_bloqueios: {
        Row: {
          alerta_enviado: boolean | null
          cidade: string | null
          contador_falhas: number | null
          created_at: string
          data_desbloqueio: string | null
          data_fim: string | null
          data_inicio: string
          desbloqueado: boolean | null
          desbloqueado_por: string | null
          id: string
          identificador: string
          ip_address: string | null
          motivo: string
          motivo_desbloqueio: string | null
          pais: string | null
          permanente: boolean | null
          profile_id: string | null
          tipo: string
        }
        Insert: {
          alerta_enviado?: boolean | null
          cidade?: string | null
          contador_falhas?: number | null
          created_at?: string
          data_desbloqueio?: string | null
          data_fim?: string | null
          data_inicio?: string
          desbloqueado?: boolean | null
          desbloqueado_por?: string | null
          id?: string
          identificador: string
          ip_address?: string | null
          motivo: string
          motivo_desbloqueio?: string | null
          pais?: string | null
          permanente?: boolean | null
          profile_id?: string | null
          tipo: string
        }
        Update: {
          alerta_enviado?: boolean | null
          cidade?: string | null
          contador_falhas?: number | null
          created_at?: string
          data_desbloqueio?: string | null
          data_fim?: string | null
          data_inicio?: string
          desbloqueado?: boolean | null
          desbloqueado_por?: string | null
          id?: string
          identificador?: string
          ip_address?: string | null
          motivo?: string
          motivo_desbloqueio?: string | null
          pais?: string | null
          permanente?: boolean | null
          profile_id?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "seguranca_bloqueios_desbloqueado_por_fkey"
            columns: ["desbloqueado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seguranca_bloqueios_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seguranca_chaves_api: {
        Row: {
          ativa: boolean | null
          chave_hash: string
          chave_prefixo: string
          created_at: string
          criado_por: string | null
          data_criacao: string
          data_expiracao: string | null
          data_renovacao: string | null
          data_ultima_rotacao: string | null
          data_ultimo_uso: string | null
          deleted_at: string | null
          descricao: string | null
          empresa_id: string
          enderecos_ip_bloqueados: string[] | null
          enderecos_ip_permitidos: string[] | null
          escopos: string[] | null
          id: string
          metadata: Json | null
          nome: string
          permissoes: Json | null
          profile_id: string | null
          taxa_limite_por_dia: number | null
          taxa_limite_por_minuto: number | null
          tipo_chave: string
          total_requisicoes: number | null
          total_requisicoes_falha: number | null
          total_requisicoes_sucesso: number | null
          ultimo_ip_uso: string | null
          updated_at: string
        }
        Insert: {
          ativa?: boolean | null
          chave_hash: string
          chave_prefixo: string
          created_at?: string
          criado_por?: string | null
          data_criacao?: string
          data_expiracao?: string | null
          data_renovacao?: string | null
          data_ultima_rotacao?: string | null
          data_ultimo_uso?: string | null
          deleted_at?: string | null
          descricao?: string | null
          empresa_id: string
          enderecos_ip_bloqueados?: string[] | null
          enderecos_ip_permitidos?: string[] | null
          escopos?: string[] | null
          id?: string
          metadata?: Json | null
          nome: string
          permissoes?: Json | null
          profile_id?: string | null
          taxa_limite_por_dia?: number | null
          taxa_limite_por_minuto?: number | null
          tipo_chave?: string
          total_requisicoes?: number | null
          total_requisicoes_falha?: number | null
          total_requisicoes_sucesso?: number | null
          ultimo_ip_uso?: string | null
          updated_at?: string
        }
        Update: {
          ativa?: boolean | null
          chave_hash?: string
          chave_prefixo?: string
          created_at?: string
          criado_por?: string | null
          data_criacao?: string
          data_expiracao?: string | null
          data_renovacao?: string | null
          data_ultima_rotacao?: string | null
          data_ultimo_uso?: string | null
          deleted_at?: string | null
          descricao?: string | null
          empresa_id?: string
          enderecos_ip_bloqueados?: string[] | null
          enderecos_ip_permitidos?: string[] | null
          escopos?: string[] | null
          id?: string
          metadata?: Json | null
          nome?: string
          permissoes?: Json | null
          profile_id?: string | null
          taxa_limite_por_dia?: number | null
          taxa_limite_por_minuto?: number | null
          tipo_chave?: string
          total_requisicoes?: number | null
          total_requisicoes_falha?: number | null
          total_requisicoes_sucesso?: number | null
          ultimo_ip_uso?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seguranca_chaves_api_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seguranca_chaves_api_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seguranca_chaves_api_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seguranca_dispositivos: {
        Row: {
          ativo: boolean | null
          bloqueado: boolean | null
          confirmado_por: string | null
          created_at: string
          data_confirmacao: string | null
          data_primeiro_acesso: string
          data_ultimo_acesso: string
          expira_em: string | null
          fingerprint: string
          id: string
          ip_primeiro_acesso: string | null
          marca: string | null
          metadata: Json | null
          modelo: string | null
          motivo_bloqueio: string | null
          navegador: string | null
          nome_dispositivo: string | null
          pais_primeiro_acesso: string | null
          profile_id: string
          sistema_operacional: string | null
          tipo_dispositivo: string | null
          user_agent: string | null
        }
        Insert: {
          ativo?: boolean | null
          bloqueado?: boolean | null
          confirmado_por?: string | null
          created_at?: string
          data_confirmacao?: string | null
          data_primeiro_acesso?: string
          data_ultimo_acesso?: string
          expira_em?: string | null
          fingerprint: string
          id?: string
          ip_primeiro_acesso?: string | null
          marca?: string | null
          metadata?: Json | null
          modelo?: string | null
          motivo_bloqueio?: string | null
          navegador?: string | null
          nome_dispositivo?: string | null
          pais_primeiro_acesso?: string | null
          profile_id: string
          sistema_operacional?: string | null
          tipo_dispositivo?: string | null
          user_agent?: string | null
        }
        Update: {
          ativo?: boolean | null
          bloqueado?: boolean | null
          confirmado_por?: string | null
          created_at?: string
          data_confirmacao?: string | null
          data_primeiro_acesso?: string
          data_ultimo_acesso?: string
          expira_em?: string | null
          fingerprint?: string
          id?: string
          ip_primeiro_acesso?: string | null
          marca?: string | null
          metadata?: Json | null
          modelo?: string | null
          motivo_bloqueio?: string | null
          navegador?: string | null
          nome_dispositivo?: string | null
          pais_primeiro_acesso?: string | null
          profile_id?: string
          sistema_operacional?: string | null
          tipo_dispositivo?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seguranca_dispositivos_confirmado_por_fkey"
            columns: ["confirmado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seguranca_dispositivos_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seguranca_senhas_historico: {
        Row: {
          algoritmo: string | null
          created_at: string
          data_criacao: string
          data_ultimo_uso: string | null
          expirada: boolean | null
          id: string
          profile_id: string
          salt: string | null
          senha_hash: string
        }
        Insert: {
          algoritmo?: string | null
          created_at?: string
          data_criacao?: string
          data_ultimo_uso?: string | null
          expirada?: boolean | null
          id?: string
          profile_id: string
          salt?: string | null
          senha_hash: string
        }
        Update: {
          algoritmo?: string | null
          created_at?: string
          data_criacao?: string
          data_ultimo_uso?: string | null
          expirada?: boolean | null
          id?: string
          profile_id?: string
          salt?: string | null
          senha_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "seguranca_senhas_historico_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seguranca_sessoes: {
        Row: {
          cep: string | null
          cidade: string | null
          coordenadas_geograficas: unknown
          created_at: string
          data_expiracao: string
          data_login: string
          data_logout: string | null
          data_ultima_atividade: string
          dispositivo: string | null
          dispositivo_tipo: string | null
          eh_dispositivo_confiavel: boolean | null
          empresa_id: string | null
          id: string
          ip_address: string
          metodo_2fa_usado: string | null
          navegador: string | null
          navegador_versao: string | null
          pais: string | null
          profile_id: string
          provedor_internet: string | null
          regiao: string | null
          session_id_auth: string | null
          sistema_operacional: string | null
          so_versao: string | null
          status: Database["public"]["Enums"]["status_sessao"]
          token_fingerprint: string | null
          user_agent: string
          verificacao_2fa_feita: boolean | null
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          coordenadas_geograficas?: unknown
          created_at?: string
          data_expiracao: string
          data_login?: string
          data_logout?: string | null
          data_ultima_atividade?: string
          dispositivo?: string | null
          dispositivo_tipo?: string | null
          eh_dispositivo_confiavel?: boolean | null
          empresa_id?: string | null
          id?: string
          ip_address: string
          metodo_2fa_usado?: string | null
          navegador?: string | null
          navegador_versao?: string | null
          pais?: string | null
          profile_id: string
          provedor_internet?: string | null
          regiao?: string | null
          session_id_auth?: string | null
          sistema_operacional?: string | null
          so_versao?: string | null
          status?: Database["public"]["Enums"]["status_sessao"]
          token_fingerprint?: string | null
          user_agent: string
          verificacao_2fa_feita?: boolean | null
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          coordenadas_geograficas?: unknown
          created_at?: string
          data_expiracao?: string
          data_login?: string
          data_logout?: string | null
          data_ultima_atividade?: string
          dispositivo?: string | null
          dispositivo_tipo?: string | null
          eh_dispositivo_confiavel?: boolean | null
          empresa_id?: string | null
          id?: string
          ip_address?: string
          metodo_2fa_usado?: string | null
          navegador?: string | null
          navegador_versao?: string | null
          pais?: string | null
          profile_id?: string
          provedor_internet?: string | null
          regiao?: string | null
          session_id_auth?: string | null
          sistema_operacional?: string | null
          so_versao?: string | null
          status?: Database["public"]["Enums"]["status_sessao"]
          token_fingerprint?: string | null
          user_agent?: string
          verificacao_2fa_feita?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "seguranca_sessoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seguranca_sessoes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seguranca_webhooks: {
        Row: {
          algoritmo_assinatura: string | null
          ativo: boolean | null
          created_at: string
          data_ultimo_disparo: string | null
          deleted_at: string | null
          descricao: string | null
          empresa_id: string
          eventos_ouvidos: string[]
          headers_personalizados: Json | null
          id: string
          intervalo_entre_tentativas: number | null
          metodo_http: string | null
          nome: string
          profile_id: string | null
          segredo_assinatura: string
          tempo_limite_ms: number | null
          tentativas_max: number | null
          total_disparos: number | null
          total_falhas: number | null
          total_sucessos: number | null
          ultima_resposta_corpo: string | null
          ultima_resposta_status: number | null
          updated_at: string
          url_endpoint: string
          verificar_ssl: boolean | null
        }
        Insert: {
          algoritmo_assinatura?: string | null
          ativo?: boolean | null
          created_at?: string
          data_ultimo_disparo?: string | null
          deleted_at?: string | null
          descricao?: string | null
          empresa_id: string
          eventos_ouvidos?: string[]
          headers_personalizados?: Json | null
          id?: string
          intervalo_entre_tentativas?: number | null
          metodo_http?: string | null
          nome: string
          profile_id?: string | null
          segredo_assinatura: string
          tempo_limite_ms?: number | null
          tentativas_max?: number | null
          total_disparos?: number | null
          total_falhas?: number | null
          total_sucessos?: number | null
          ultima_resposta_corpo?: string | null
          ultima_resposta_status?: number | null
          updated_at?: string
          url_endpoint: string
          verificar_ssl?: boolean | null
        }
        Update: {
          algoritmo_assinatura?: string | null
          ativo?: boolean | null
          created_at?: string
          data_ultimo_disparo?: string | null
          deleted_at?: string | null
          descricao?: string | null
          empresa_id?: string
          eventos_ouvidos?: string[]
          headers_personalizados?: Json | null
          id?: string
          intervalo_entre_tentativas?: number | null
          metodo_http?: string | null
          nome?: string
          profile_id?: string | null
          segredo_assinatura?: string
          tempo_limite_ms?: number | null
          tentativas_max?: number | null
          total_disparos?: number | null
          total_falhas?: number | null
          total_sucessos?: number | null
          ultima_resposta_corpo?: string | null
          ultima_resposta_status?: number | null
          updated_at?: string
          url_endpoint?: string
          verificar_ssl?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "seguranca_webhooks_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seguranca_webhooks_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seguranca_webhooks_log: {
        Row: {
          assinatura_enviada: string | null
          corpo_requisicao: Json
          corpo_resposta: string | null
          created_at: string
          evento: string
          headers_resposta: Json | null
          id: string
          idempotency_key: string | null
          max_tentativas: number | null
          mensagem_erro: string | null
          status_resposta: number | null
          sucesso: boolean | null
          tempo_resposta_ms: number | null
          tentativa_numero: number | null
          webhook_id: string
        }
        Insert: {
          assinatura_enviada?: string | null
          corpo_requisicao: Json
          corpo_resposta?: string | null
          created_at?: string
          evento: string
          headers_resposta?: Json | null
          id?: string
          idempotency_key?: string | null
          max_tentativas?: number | null
          mensagem_erro?: string | null
          status_resposta?: number | null
          sucesso?: boolean | null
          tempo_resposta_ms?: number | null
          tentativa_numero?: number | null
          webhook_id: string
        }
        Update: {
          assinatura_enviada?: string | null
          corpo_requisicao?: Json
          corpo_resposta?: string | null
          created_at?: string
          evento?: string
          headers_resposta?: Json | null
          id?: string
          idempotency_key?: string | null
          max_tentativas?: number | null
          mensagem_erro?: string | null
          status_resposta?: number | null
          sucesso?: boolean | null
          tempo_resposta_ms?: number | null
          tentativa_numero?: number | null
          webhook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seguranca_webhooks_log_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "seguranca_webhooks"
            referencedColumns: ["id"]
          },
        ]
      }
      taxas_plataforma: {
        Row: {
          ativo: boolean | null
          created_at: string
          data_fim_vigencia: string | null
          data_inicio_vigencia: string
          dias_liquidacao: number | null
          empresa_id: string | null
          id: string
          is_padrao: boolean | null
          max_parcelas_sem_juros: number | null
          metodo_pagamento: Database["public"]["Enums"]["metodo_pagamento"]
          plano: string
          taxa_antecipacao_percentual: number | null
          taxa_boleto: number | null
          taxa_fixa: number
          taxa_maxima: number | null
          taxa_minima: number | null
          taxa_minima_saque: number | null
          taxa_parcelamento_por_parcela: number | null
          taxa_percentual: number
          taxa_pix_fixa: number | null
          taxa_pix_percentual: number | null
          taxa_saque_fixa: number | null
          taxa_saque_percentual: number | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string
          data_fim_vigencia?: string | null
          data_inicio_vigencia?: string
          dias_liquidacao?: number | null
          empresa_id?: string | null
          id?: string
          is_padrao?: boolean | null
          max_parcelas_sem_juros?: number | null
          metodo_pagamento: Database["public"]["Enums"]["metodo_pagamento"]
          plano?: string
          taxa_antecipacao_percentual?: number | null
          taxa_boleto?: number | null
          taxa_fixa?: number
          taxa_maxima?: number | null
          taxa_minima?: number | null
          taxa_minima_saque?: number | null
          taxa_parcelamento_por_parcela?: number | null
          taxa_percentual?: number
          taxa_pix_fixa?: number | null
          taxa_pix_percentual?: number | null
          taxa_saque_fixa?: number | null
          taxa_saque_percentual?: number | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string
          data_fim_vigencia?: string | null
          data_inicio_vigencia?: string
          dias_liquidacao?: number | null
          empresa_id?: string | null
          id?: string
          is_padrao?: boolean | null
          max_parcelas_sem_juros?: number | null
          metodo_pagamento?: Database["public"]["Enums"]["metodo_pagamento"]
          plano?: string
          taxa_antecipacao_percentual?: number | null
          taxa_boleto?: number | null
          taxa_fixa?: number
          taxa_maxima?: number | null
          taxa_minima?: number | null
          taxa_minima_saque?: number | null
          taxa_parcelamento_por_parcela?: number | null
          taxa_percentual?: number
          taxa_pix_fixa?: number | null
          taxa_pix_percentual?: number | null
          taxa_saque_fixa?: number | null
          taxa_saque_percentual?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "taxas_plataforma_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      templates_checkout: {
        Row: {
          ativo: boolean | null
          banner_url: string | null
          campos_personalizados: Json | null
          cor_fundo: string | null
          cor_primaria: string | null
          cor_secundaria: string | null
          cor_texto: string | null
          created_at: string
          css_customizado: string | null
          deleted_at: string | null
          empresa_id: string | null
          fonte: string | null
          ga4_id: string | null
          gtm_id: string | null
          hotmart_id: string | null
          id: string
          imagem_fundo_url: string | null
          is_padrao: boolean | null
          layout: string | null
          logo_url: string | null
          mensagem_sucesso: string | null
          mostrar_bandeiras_cartao: boolean | null
          mostrar_desconto_pix: number | null
          mostrar_pagamento_boleto: boolean | null
          mostrar_pagamento_cartao: boolean | null
          mostrar_pagamento_pix: boolean | null
          nome: string
          parcelamento_juros: number | null
          parcelamento_maximo: number | null
          parcelamento_sem_juros: number | null
          pedir_cpf: boolean | null
          pedir_endereco: boolean | null
          pedir_genero: boolean | null
          pedir_nascimento: boolean | null
          pedir_rg: boolean | null
          pedir_telefone: boolean | null
          pixel_facebook_id: string | null
          pixel_google_id: string | null
          scripts_customizados: string | null
          secoes_visiveis: Json | null
          slug: string
          subtitulo_checkout: string | null
          tag_manager_id: string | null
          termo_compromisso: string | null
          titulo_checkout: string | null
          updated_at: string
          url_redirecionamento_sucesso: string | null
          valor_minimo_parcela: number | null
          video_fundo_url: string | null
        }
        Insert: {
          ativo?: boolean | null
          banner_url?: string | null
          campos_personalizados?: Json | null
          cor_fundo?: string | null
          cor_primaria?: string | null
          cor_secundaria?: string | null
          cor_texto?: string | null
          created_at?: string
          css_customizado?: string | null
          deleted_at?: string | null
          empresa_id?: string | null
          fonte?: string | null
          ga4_id?: string | null
          gtm_id?: string | null
          hotmart_id?: string | null
          id?: string
          imagem_fundo_url?: string | null
          is_padrao?: boolean | null
          layout?: string | null
          logo_url?: string | null
          mensagem_sucesso?: string | null
          mostrar_bandeiras_cartao?: boolean | null
          mostrar_desconto_pix?: number | null
          mostrar_pagamento_boleto?: boolean | null
          mostrar_pagamento_cartao?: boolean | null
          mostrar_pagamento_pix?: boolean | null
          nome: string
          parcelamento_juros?: number | null
          parcelamento_maximo?: number | null
          parcelamento_sem_juros?: number | null
          pedir_cpf?: boolean | null
          pedir_endereco?: boolean | null
          pedir_genero?: boolean | null
          pedir_nascimento?: boolean | null
          pedir_rg?: boolean | null
          pedir_telefone?: boolean | null
          pixel_facebook_id?: string | null
          pixel_google_id?: string | null
          scripts_customizados?: string | null
          secoes_visiveis?: Json | null
          slug: string
          subtitulo_checkout?: string | null
          tag_manager_id?: string | null
          termo_compromisso?: string | null
          titulo_checkout?: string | null
          updated_at?: string
          url_redirecionamento_sucesso?: string | null
          valor_minimo_parcela?: number | null
          video_fundo_url?: string | null
        }
        Update: {
          ativo?: boolean | null
          banner_url?: string | null
          campos_personalizados?: Json | null
          cor_fundo?: string | null
          cor_primaria?: string | null
          cor_secundaria?: string | null
          cor_texto?: string | null
          created_at?: string
          css_customizado?: string | null
          deleted_at?: string | null
          empresa_id?: string | null
          fonte?: string | null
          ga4_id?: string | null
          gtm_id?: string | null
          hotmart_id?: string | null
          id?: string
          imagem_fundo_url?: string | null
          is_padrao?: boolean | null
          layout?: string | null
          logo_url?: string | null
          mensagem_sucesso?: string | null
          mostrar_bandeiras_cartao?: boolean | null
          mostrar_desconto_pix?: number | null
          mostrar_pagamento_boleto?: boolean | null
          mostrar_pagamento_cartao?: boolean | null
          mostrar_pagamento_pix?: boolean | null
          nome?: string
          parcelamento_juros?: number | null
          parcelamento_maximo?: number | null
          parcelamento_sem_juros?: number | null
          pedir_cpf?: boolean | null
          pedir_endereco?: boolean | null
          pedir_genero?: boolean | null
          pedir_nascimento?: boolean | null
          pedir_rg?: boolean | null
          pedir_telefone?: boolean | null
          pixel_facebook_id?: string | null
          pixel_google_id?: string | null
          scripts_customizados?: string | null
          secoes_visiveis?: Json | null
          slug?: string
          subtitulo_checkout?: string | null
          tag_manager_id?: string | null
          termo_compromisso?: string | null
          titulo_checkout?: string | null
          updated_at?: string
          url_redirecionamento_sucesso?: string | null
          valor_minimo_parcela?: number | null
          video_fundo_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "templates_checkout_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          aberto_por_email: string | null
          aberto_por_nome: string | null
          aberto_por_telefone: string | null
          afiliado_id: string | null
          anexos_urls: string[] | null
          assunto: string
          atribuido_em: string | null
          atribuido_para: string | null
          avaliacao_atendimento: number | null
          canal_origem: string | null
          categoria: string | null
          cliente_id: string | null
          comentario_avaliacao: string | null
          created_at: string
          data_fechamento: string | null
          data_primeira_resposta: string | null
          data_resolucao: string | null
          data_ultima_interacao: string
          deleted_at: string | null
          departamento_responsavel: string | null
          descricao: string
          empresa_id: string
          fechado_por: string | null
          fechado_satisfatorio: boolean | null
          id: string
          ip_origem: string | null
          metadata: Json | null
          numero_protocolo: string
          origem: string | null
          prioridade: Database["public"]["Enums"]["prioridade_ticket"]
          produto_relacionado_id: string | null
          profile_id: string | null
          reaberto_contador: number | null
          resolucao_descricao: string | null
          resolucao_tipo: string | null
          resolvido_por: string | null
          sla_data_maxima: string | null
          sla_tempo_resposta: number | null
          sla_violado: boolean | null
          status: Database["public"]["Enums"]["status_ticket"]
          tags: string[] | null
          tempo_total_resolucao_minutos: number | null
          tipo: Database["public"]["Enums"]["tipo_ticket"]
          transacao_relacionada_id: string | null
          updated_at: string
        }
        Insert: {
          aberto_por_email?: string | null
          aberto_por_nome?: string | null
          aberto_por_telefone?: string | null
          afiliado_id?: string | null
          anexos_urls?: string[] | null
          assunto: string
          atribuido_em?: string | null
          atribuido_para?: string | null
          avaliacao_atendimento?: number | null
          canal_origem?: string | null
          categoria?: string | null
          cliente_id?: string | null
          comentario_avaliacao?: string | null
          created_at?: string
          data_fechamento?: string | null
          data_primeira_resposta?: string | null
          data_resolucao?: string | null
          data_ultima_interacao?: string
          deleted_at?: string | null
          departamento_responsavel?: string | null
          descricao: string
          empresa_id: string
          fechado_por?: string | null
          fechado_satisfatorio?: boolean | null
          id?: string
          ip_origem?: string | null
          metadata?: Json | null
          numero_protocolo: string
          origem?: string | null
          prioridade?: Database["public"]["Enums"]["prioridade_ticket"]
          produto_relacionado_id?: string | null
          profile_id?: string | null
          reaberto_contador?: number | null
          resolucao_descricao?: string | null
          resolucao_tipo?: string | null
          resolvido_por?: string | null
          sla_data_maxima?: string | null
          sla_tempo_resposta?: number | null
          sla_violado?: boolean | null
          status?: Database["public"]["Enums"]["status_ticket"]
          tags?: string[] | null
          tempo_total_resolucao_minutos?: number | null
          tipo?: Database["public"]["Enums"]["tipo_ticket"]
          transacao_relacionada_id?: string | null
          updated_at?: string
        }
        Update: {
          aberto_por_email?: string | null
          aberto_por_nome?: string | null
          aberto_por_telefone?: string | null
          afiliado_id?: string | null
          anexos_urls?: string[] | null
          assunto?: string
          atribuido_em?: string | null
          atribuido_para?: string | null
          avaliacao_atendimento?: number | null
          canal_origem?: string | null
          categoria?: string | null
          cliente_id?: string | null
          comentario_avaliacao?: string | null
          created_at?: string
          data_fechamento?: string | null
          data_primeira_resposta?: string | null
          data_resolucao?: string | null
          data_ultima_interacao?: string
          deleted_at?: string | null
          departamento_responsavel?: string | null
          descricao?: string
          empresa_id?: string
          fechado_por?: string | null
          fechado_satisfatorio?: boolean | null
          id?: string
          ip_origem?: string | null
          metadata?: Json | null
          numero_protocolo?: string
          origem?: string | null
          prioridade?: Database["public"]["Enums"]["prioridade_ticket"]
          produto_relacionado_id?: string | null
          profile_id?: string | null
          reaberto_contador?: number | null
          resolucao_descricao?: string | null
          resolucao_tipo?: string | null
          resolvido_por?: string | null
          sla_data_maxima?: string | null
          sla_tempo_resposta?: number | null
          sla_violado?: boolean | null
          status?: Database["public"]["Enums"]["status_ticket"]
          tags?: string[] | null
          tempo_total_resolucao_minutos?: number | null
          tipo?: Database["public"]["Enums"]["tipo_ticket"]
          transacao_relacionada_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_afiliado_id_fkey"
            columns: ["afiliado_id"]
            isOneToOne: false
            referencedRelation: "afiliados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_atribuido_para_fkey"
            columns: ["atribuido_para"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_fechado_por_fkey"
            columns: ["fechado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_produto_relacionado_id_fkey"
            columns: ["produto_relacionado_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_resolvido_por_fkey"
            columns: ["resolvido_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_transacao_relacionada_id_fkey"
            columns: ["transacao_relacionada_id"]
            isOneToOne: false
            referencedRelation: "transacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets_mensagens: {
        Row: {
          afiliado_id: string | null
          anexos_urls: string[] | null
          citada_mensagem_id: string | null
          cliente_id: string | null
          corpo_html: string | null
          corpo_mensagem: string
          created_at: string
          eh_nota_interna: boolean | null
          eh_resposta_automatica: boolean | null
          email_remetente: string | null
          empresa_id: string
          formato_mensagem: string | null
          id: string
          ip_address: string | null
          nome_remetente: string
          profile_id: string | null
          template_usado: string | null
          ticket_id: string
          tipo_remetente: string
          user_agent: string | null
          variaveis_template: Json | null
        }
        Insert: {
          afiliado_id?: string | null
          anexos_urls?: string[] | null
          citada_mensagem_id?: string | null
          cliente_id?: string | null
          corpo_html?: string | null
          corpo_mensagem: string
          created_at?: string
          eh_nota_interna?: boolean | null
          eh_resposta_automatica?: boolean | null
          email_remetente?: string | null
          empresa_id: string
          formato_mensagem?: string | null
          id?: string
          ip_address?: string | null
          nome_remetente: string
          profile_id?: string | null
          template_usado?: string | null
          ticket_id: string
          tipo_remetente: string
          user_agent?: string | null
          variaveis_template?: Json | null
        }
        Update: {
          afiliado_id?: string | null
          anexos_urls?: string[] | null
          citada_mensagem_id?: string | null
          cliente_id?: string | null
          corpo_html?: string | null
          corpo_mensagem?: string
          created_at?: string
          eh_nota_interna?: boolean | null
          eh_resposta_automatica?: boolean | null
          email_remetente?: string | null
          empresa_id?: string
          formato_mensagem?: string | null
          id?: string
          ip_address?: string | null
          nome_remetente?: string
          profile_id?: string | null
          template_usado?: string | null
          ticket_id?: string
          tipo_remetente?: string
          user_agent?: string | null
          variaveis_template?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_mensagens_afiliado_id_fkey"
            columns: ["afiliado_id"]
            isOneToOne: false
            referencedRelation: "afiliados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_mensagens_citada_mensagem_id_fkey"
            columns: ["citada_mensagem_id"]
            isOneToOne: false
            referencedRelation: "tickets_mensagens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_mensagens_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_mensagens_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_mensagens_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_mensagens_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      transacoes: {
        Row: {
          afiliado_id: string | null
          assinatura_id: string | null
          autorizacao_codigo: string | null
          cartao_bandeira: string | null
          cartao_final: string | null
          cartao_parcelado_mercado: boolean | null
          cartao_titular: string | null
          checkout_id: string | null
          cliente_id: string | null
          codigo_boleto_barras: string | null
          codigo_boleto_linha: string | null
          codigo_externo: string | null
          created_at: string
          criado_por: string | null
          cupom_id: string | null
          dados_entrega: Json | null
          data_disponivel: string | null
          data_estorno: string | null
          data_expiracao: string | null
          data_pagamento: string | null
          data_vencimento: string | null
          empresa_id: string
          endereco_cobranca: Json | null
          id: string
          id_transacao_gateway: string | null
          ip_cliente: string | null
          link_pagamento_id: string | null
          metadata: Json | null
          metodo_pagamento:
            | Database["public"]["Enums"]["metodo_pagamento"]
            | null
          moeda: string | null
          moeda_original: string | null
          notas_internas: string | null
          nsu: string | null
          origem_dispositivo: string | null
          parcela_atual: number | null
          parcelas: number | null
          pedido_numero: string | null
          pix_copia_cola: string | null
          pix_expiracao: string | null
          pix_qrcode: string | null
          produto_id: string | null
          profile_id: string | null
          regras_antifraude: Json | null
          risco_nivel: string | null
          risco_score: number | null
          split_pagamento: Json | null
          status: Database["public"]["Enums"]["status_transacao"]
          taxa_cambio: number | null
          tid: string | null
          tipo: Database["public"]["Enums"]["tipo_transacao"]
          updated_at: string
          url_callback: string | null
          valor_bruto: number
          valor_descontos: number | null
          valor_impostos: number | null
          valor_juros: number | null
          valor_liquido: number
          valor_multa: number | null
          valor_original_moeda: number | null
          valor_parcela: number | null
          valor_taxa_antecipacao: number | null
          valor_taxa_plataforma: number | null
          valor_taxa_processamento: number | null
        }
        Insert: {
          afiliado_id?: string | null
          assinatura_id?: string | null
          autorizacao_codigo?: string | null
          cartao_bandeira?: string | null
          cartao_final?: string | null
          cartao_parcelado_mercado?: boolean | null
          cartao_titular?: string | null
          checkout_id?: string | null
          cliente_id?: string | null
          codigo_boleto_barras?: string | null
          codigo_boleto_linha?: string | null
          codigo_externo?: string | null
          created_at?: string
          criado_por?: string | null
          cupom_id?: string | null
          dados_entrega?: Json | null
          data_disponivel?: string | null
          data_estorno?: string | null
          data_expiracao?: string | null
          data_pagamento?: string | null
          data_vencimento?: string | null
          empresa_id: string
          endereco_cobranca?: Json | null
          id?: string
          id_transacao_gateway?: string | null
          ip_cliente?: string | null
          link_pagamento_id?: string | null
          metadata?: Json | null
          metodo_pagamento?:
            | Database["public"]["Enums"]["metodo_pagamento"]
            | null
          moeda?: string | null
          moeda_original?: string | null
          notas_internas?: string | null
          nsu?: string | null
          origem_dispositivo?: string | null
          parcela_atual?: number | null
          parcelas?: number | null
          pedido_numero?: string | null
          pix_copia_cola?: string | null
          pix_expiracao?: string | null
          pix_qrcode?: string | null
          produto_id?: string | null
          profile_id?: string | null
          regras_antifraude?: Json | null
          risco_nivel?: string | null
          risco_score?: number | null
          split_pagamento?: Json | null
          status?: Database["public"]["Enums"]["status_transacao"]
          taxa_cambio?: number | null
          tid?: string | null
          tipo: Database["public"]["Enums"]["tipo_transacao"]
          updated_at?: string
          url_callback?: string | null
          valor_bruto: number
          valor_descontos?: number | null
          valor_impostos?: number | null
          valor_juros?: number | null
          valor_liquido: number
          valor_multa?: number | null
          valor_original_moeda?: number | null
          valor_parcela?: number | null
          valor_taxa_antecipacao?: number | null
          valor_taxa_plataforma?: number | null
          valor_taxa_processamento?: number | null
        }
        Update: {
          afiliado_id?: string | null
          assinatura_id?: string | null
          autorizacao_codigo?: string | null
          cartao_bandeira?: string | null
          cartao_final?: string | null
          cartao_parcelado_mercado?: boolean | null
          cartao_titular?: string | null
          checkout_id?: string | null
          cliente_id?: string | null
          codigo_boleto_barras?: string | null
          codigo_boleto_linha?: string | null
          codigo_externo?: string | null
          created_at?: string
          criado_por?: string | null
          cupom_id?: string | null
          dados_entrega?: Json | null
          data_disponivel?: string | null
          data_estorno?: string | null
          data_expiracao?: string | null
          data_pagamento?: string | null
          data_vencimento?: string | null
          empresa_id?: string
          endereco_cobranca?: Json | null
          id?: string
          id_transacao_gateway?: string | null
          ip_cliente?: string | null
          link_pagamento_id?: string | null
          metadata?: Json | null
          metodo_pagamento?:
            | Database["public"]["Enums"]["metodo_pagamento"]
            | null
          moeda?: string | null
          moeda_original?: string | null
          notas_internas?: string | null
          nsu?: string | null
          origem_dispositivo?: string | null
          parcela_atual?: number | null
          parcelas?: number | null
          pedido_numero?: string | null
          pix_copia_cola?: string | null
          pix_expiracao?: string | null
          pix_qrcode?: string | null
          produto_id?: string | null
          profile_id?: string | null
          regras_antifraude?: Json | null
          risco_nivel?: string | null
          risco_score?: number | null
          split_pagamento?: Json | null
          status?: Database["public"]["Enums"]["status_transacao"]
          taxa_cambio?: number | null
          tid?: string | null
          tipo?: Database["public"]["Enums"]["tipo_transacao"]
          updated_at?: string
          url_callback?: string | null
          valor_bruto?: number
          valor_descontos?: number | null
          valor_impostos?: number | null
          valor_juros?: number | null
          valor_liquido?: number
          valor_multa?: number | null
          valor_original_moeda?: number | null
          valor_parcela?: number | null
          valor_taxa_antecipacao?: number | null
          valor_taxa_plataforma?: number | null
          valor_taxa_processamento?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transacoes_afiliado_id_fkey"
            columns: ["afiliado_id"]
            isOneToOne: false
            referencedRelation: "afiliados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_checkout_id_fkey"
            columns: ["checkout_id"]
            isOneToOne: false
            referencedRelation: "checkouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_cupom_id_fkey"
            columns: ["cupom_id"]
            isOneToOne: false
            referencedRelation: "cupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_link_pagamento_id_fkey"
            columns: ["link_pagamento_id"]
            isOneToOne: false
            referencedRelation: "links_pagamento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transacoes_parcelas: {
        Row: {
          created_at: string
          data_disponivel: string | null
          data_pagamento: string | null
          data_vencimento: string
          empresa_id: string
          id: string
          id_parcela_gateway: string | null
          numero_parcela: number
          saldo_devedor: number | null
          status: Database["public"]["Enums"]["status_transacao"]
          taxa_antecipacao: number | null
          total_parcelas: number
          transacao_id: string
          updated_at: string
          valor_amortizado: number | null
          valor_juros: number | null
          valor_liquido_parcela: number | null
          valor_parcela: number
          valor_taxa_processamento: number | null
        }
        Insert: {
          created_at?: string
          data_disponivel?: string | null
          data_pagamento?: string | null
          data_vencimento: string
          empresa_id: string
          id?: string
          id_parcela_gateway?: string | null
          numero_parcela: number
          saldo_devedor?: number | null
          status?: Database["public"]["Enums"]["status_transacao"]
          taxa_antecipacao?: number | null
          total_parcelas: number
          transacao_id: string
          updated_at?: string
          valor_amortizado?: number | null
          valor_juros?: number | null
          valor_liquido_parcela?: number | null
          valor_parcela: number
          valor_taxa_processamento?: number | null
        }
        Update: {
          created_at?: string
          data_disponivel?: string | null
          data_pagamento?: string | null
          data_vencimento?: string
          empresa_id?: string
          id?: string
          id_parcela_gateway?: string | null
          numero_parcela?: number
          saldo_devedor?: number | null
          status?: Database["public"]["Enums"]["status_transacao"]
          taxa_antecipacao?: number | null
          total_parcelas?: number
          transacao_id?: string
          updated_at?: string
          valor_amortizado?: number | null
          valor_juros?: number | null
          valor_liquido_parcela?: number | null
          valor_parcela?: number
          valor_taxa_processamento?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transacoes_parcelas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_parcelas_transacao_id_fkey"
            columns: ["transacao_id"]
            isOneToOne: false
            referencedRelation: "transacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      treinamentos_aulas: {
        Row: {
          arquivo_nome: string | null
          arquivo_tamanho: number | null
          arquivo_url: string | null
          attachments: string[] | null
          conteudo_html: string | null
          conteudo_texto: string | null
          created_at: string
          curso_id: string
          descricao: string | null
          duracao_estimada_min: number | null
          empresa_id: string | null
          gratuito_previzualizacao: boolean | null
          id: string
          max_downloads: number | null
          min_tempo_segundos: number | null
          min_visualizacoes: number | null
          modulo_id: string
          nota_minima_aprovacao: number | null
          ordem: number
          perguntas_quiz: Json | null
          recursos_links: Json | null
          require_download: boolean | null
          tipo: Database["public"]["Enums"]["tipo_curso"]
          titulo: string
          total_comentarios: number | null
          updated_at: string
          url_externa: string | null
          video_duracao_segundos: number | null
          video_resolucoes: Json | null
          video_tipo: string | null
          video_url: string | null
        }
        Insert: {
          arquivo_nome?: string | null
          arquivo_tamanho?: number | null
          arquivo_url?: string | null
          attachments?: string[] | null
          conteudo_html?: string | null
          conteudo_texto?: string | null
          created_at?: string
          curso_id: string
          descricao?: string | null
          duracao_estimada_min?: number | null
          empresa_id?: string | null
          gratuito_previzualizacao?: boolean | null
          id?: string
          max_downloads?: number | null
          min_tempo_segundos?: number | null
          min_visualizacoes?: number | null
          modulo_id: string
          nota_minima_aprovacao?: number | null
          ordem?: number
          perguntas_quiz?: Json | null
          recursos_links?: Json | null
          require_download?: boolean | null
          tipo?: Database["public"]["Enums"]["tipo_curso"]
          titulo: string
          total_comentarios?: number | null
          updated_at?: string
          url_externa?: string | null
          video_duracao_segundos?: number | null
          video_resolucoes?: Json | null
          video_tipo?: string | null
          video_url?: string | null
        }
        Update: {
          arquivo_nome?: string | null
          arquivo_tamanho?: number | null
          arquivo_url?: string | null
          attachments?: string[] | null
          conteudo_html?: string | null
          conteudo_texto?: string | null
          created_at?: string
          curso_id?: string
          descricao?: string | null
          duracao_estimada_min?: number | null
          empresa_id?: string | null
          gratuito_previzualizacao?: boolean | null
          id?: string
          max_downloads?: number | null
          min_tempo_segundos?: number | null
          min_visualizacoes?: number | null
          modulo_id?: string
          nota_minima_aprovacao?: number | null
          ordem?: number
          perguntas_quiz?: Json | null
          recursos_links?: Json | null
          require_download?: boolean | null
          tipo?: Database["public"]["Enums"]["tipo_curso"]
          titulo?: string
          total_comentarios?: number | null
          updated_at?: string
          url_externa?: string | null
          video_duracao_segundos?: number | null
          video_resolucoes?: Json | null
          video_tipo?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "treinamentos_aulas_curso_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "treinamentos_cursos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treinamentos_aulas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treinamentos_aulas_modulo_id_fkey"
            columns: ["modulo_id"]
            isOneToOne: false
            referencedRelation: "treinamentos_modulos"
            referencedColumns: ["id"]
          },
        ]
      }
      treinamentos_cursos: {
        Row: {
          acesso_vitalicio: boolean | null
          aprendizados: string[] | null
          atualizado_por: string | null
          avaliacao_media: number | null
          capa_url: string | null
          carga_horaria_horas: number | null
          categoria: string | null
          certificado_disponivel: boolean | null
          created_at: string
          criado_por: string | null
          data_publicacao: string | null
          deleted_at: string | null
          descricao_curta: string | null
          descricao_longa: string | null
          destaque: boolean | null
          dias_validade: number | null
          duracao_total_minutos: number | null
          empresa_id: string | null
          gratuito: boolean | null
          id: string
          instrutor_avatar: string | null
          instrutor_bio: string | null
          instrutor_nome: string | null
          libera_afiliados: boolean | null
          modelo_certificado: string | null
          nivel: string | null
          permite_parcelamento: boolean | null
          preco: number | null
          publicado: boolean | null
          publico_alvo: string | null
          requisitos: string[] | null
          slug: string
          status: string | null
          subtitulo: string | null
          tags: string[] | null
          taxa_comissao_afiliado: number | null
          taxa_conclusao: number | null
          tipo: Database["public"]["Enums"]["tipo_curso"]
          titulo: string
          total_aulas: number | null
          total_avaliacoes: number | null
          total_concluidos: number | null
          total_matriculas: number | null
          total_modulos: number | null
          updated_at: string
          video_demo_url: string | null
        }
        Insert: {
          acesso_vitalicio?: boolean | null
          aprendizados?: string[] | null
          atualizado_por?: string | null
          avaliacao_media?: number | null
          capa_url?: string | null
          carga_horaria_horas?: number | null
          categoria?: string | null
          certificado_disponivel?: boolean | null
          created_at?: string
          criado_por?: string | null
          data_publicacao?: string | null
          deleted_at?: string | null
          descricao_curta?: string | null
          descricao_longa?: string | null
          destaque?: boolean | null
          dias_validade?: number | null
          duracao_total_minutos?: number | null
          empresa_id?: string | null
          gratuito?: boolean | null
          id?: string
          instrutor_avatar?: string | null
          instrutor_bio?: string | null
          instrutor_nome?: string | null
          libera_afiliados?: boolean | null
          modelo_certificado?: string | null
          nivel?: string | null
          permite_parcelamento?: boolean | null
          preco?: number | null
          publicado?: boolean | null
          publico_alvo?: string | null
          requisitos?: string[] | null
          slug: string
          status?: string | null
          subtitulo?: string | null
          tags?: string[] | null
          taxa_comissao_afiliado?: number | null
          taxa_conclusao?: number | null
          tipo?: Database["public"]["Enums"]["tipo_curso"]
          titulo: string
          total_aulas?: number | null
          total_avaliacoes?: number | null
          total_concluidos?: number | null
          total_matriculas?: number | null
          total_modulos?: number | null
          updated_at?: string
          video_demo_url?: string | null
        }
        Update: {
          acesso_vitalicio?: boolean | null
          aprendizados?: string[] | null
          atualizado_por?: string | null
          avaliacao_media?: number | null
          capa_url?: string | null
          carga_horaria_horas?: number | null
          categoria?: string | null
          certificado_disponivel?: boolean | null
          created_at?: string
          criado_por?: string | null
          data_publicacao?: string | null
          deleted_at?: string | null
          descricao_curta?: string | null
          descricao_longa?: string | null
          destaque?: boolean | null
          dias_validade?: number | null
          duracao_total_minutos?: number | null
          empresa_id?: string | null
          gratuito?: boolean | null
          id?: string
          instrutor_avatar?: string | null
          instrutor_bio?: string | null
          instrutor_nome?: string | null
          libera_afiliados?: boolean | null
          modelo_certificado?: string | null
          nivel?: string | null
          permite_parcelamento?: boolean | null
          preco?: number | null
          publicado?: boolean | null
          publico_alvo?: string | null
          requisitos?: string[] | null
          slug?: string
          status?: string | null
          subtitulo?: string | null
          tags?: string[] | null
          taxa_comissao_afiliado?: number | null
          taxa_conclusao?: number | null
          tipo?: Database["public"]["Enums"]["tipo_curso"]
          titulo?: string
          total_aulas?: number | null
          total_avaliacoes?: number | null
          total_concluidos?: number | null
          total_matriculas?: number | null
          total_modulos?: number | null
          updated_at?: string
          video_demo_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "treinamentos_cursos_atualizado_por_fkey"
            columns: ["atualizado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treinamentos_cursos_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treinamentos_cursos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      treinamentos_matriculas: {
        Row: {
          afiliado_id: string | null
          aprovado: boolean | null
          certificado_emitido: boolean | null
          certificado_url: string | null
          cliente_id: string | null
          created_at: string
          curso_id: string
          data_certificado: string | null
          data_conclusao: string | null
          data_expiracao: string | null
          data_matricula: string
          empresa_id: string | null
          id: string
          metadata: Json | null
          motivo_cancelamento: string | null
          nota_final: number | null
          numero_certificado: string | null
          originou_de: string | null
          pausado_em: string | null
          profile_id: string
          progresso_percentual: number | null
          reativado_em: string | null
          status: Database["public"]["Enums"]["status_matricula"]
          tempo_total_estudado_seg: number | null
          total_aulas_concluidas: number | null
          transacao_id: string | null
          ultimo_acesso: string | null
          updated_at: string
          valor_pago: number | null
        }
        Insert: {
          afiliado_id?: string | null
          aprovado?: boolean | null
          certificado_emitido?: boolean | null
          certificado_url?: string | null
          cliente_id?: string | null
          created_at?: string
          curso_id: string
          data_certificado?: string | null
          data_conclusao?: string | null
          data_expiracao?: string | null
          data_matricula?: string
          empresa_id?: string | null
          id?: string
          metadata?: Json | null
          motivo_cancelamento?: string | null
          nota_final?: number | null
          numero_certificado?: string | null
          originou_de?: string | null
          pausado_em?: string | null
          profile_id: string
          progresso_percentual?: number | null
          reativado_em?: string | null
          status?: Database["public"]["Enums"]["status_matricula"]
          tempo_total_estudado_seg?: number | null
          total_aulas_concluidas?: number | null
          transacao_id?: string | null
          ultimo_acesso?: string | null
          updated_at?: string
          valor_pago?: number | null
        }
        Update: {
          afiliado_id?: string | null
          aprovado?: boolean | null
          certificado_emitido?: boolean | null
          certificado_url?: string | null
          cliente_id?: string | null
          created_at?: string
          curso_id?: string
          data_certificado?: string | null
          data_conclusao?: string | null
          data_expiracao?: string | null
          data_matricula?: string
          empresa_id?: string | null
          id?: string
          metadata?: Json | null
          motivo_cancelamento?: string | null
          nota_final?: number | null
          numero_certificado?: string | null
          originou_de?: string | null
          pausado_em?: string | null
          profile_id?: string
          progresso_percentual?: number | null
          reativado_em?: string | null
          status?: Database["public"]["Enums"]["status_matricula"]
          tempo_total_estudado_seg?: number | null
          total_aulas_concluidas?: number | null
          transacao_id?: string | null
          ultimo_acesso?: string | null
          updated_at?: string
          valor_pago?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "treinamentos_matriculas_afiliado_id_fkey"
            columns: ["afiliado_id"]
            isOneToOne: false
            referencedRelation: "afiliados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treinamentos_matriculas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treinamentos_matriculas_curso_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "treinamentos_cursos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treinamentos_matriculas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treinamentos_matriculas_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treinamentos_matriculas_transacao_id_fkey"
            columns: ["transacao_id"]
            isOneToOne: false
            referencedRelation: "transacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      treinamentos_modulos: {
        Row: {
          aula_requisito_id: string | null
          created_at: string
          curso_id: string
          data_desbloqueio: string | null
          desbloqueio_automatico: boolean | null
          descricao: string | null
          duracao_total_minutos: number | null
          empresa_id: string | null
          id: string
          ordem: number
          titulo: string
          total_aulas: number | null
          updated_at: string
        }
        Insert: {
          aula_requisito_id?: string | null
          created_at?: string
          curso_id: string
          data_desbloqueio?: string | null
          desbloqueio_automatico?: boolean | null
          descricao?: string | null
          duracao_total_minutos?: number | null
          empresa_id?: string | null
          id?: string
          ordem?: number
          titulo: string
          total_aulas?: number | null
          updated_at?: string
        }
        Update: {
          aula_requisito_id?: string | null
          created_at?: string
          curso_id?: string
          data_desbloqueio?: string | null
          desbloqueio_automatico?: boolean | null
          descricao?: string | null
          duracao_total_minutos?: number | null
          empresa_id?: string | null
          id?: string
          ordem?: number
          titulo?: string
          total_aulas?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "treinamentos_modulos_curso_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "treinamentos_cursos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treinamentos_modulos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      treinamentos_progresso: {
        Row: {
          aula_id: string
          concluida: boolean | null
          created_at: string
          data_conclusao: string | null
          downloads_feitos: number | null
          id: string
          matricula_id: string
          nota_quiz: number | null
          primeiro_acesso: string | null
          profile_id: string
          quiz_tentativas: number | null
          tempo_assistido_seg: number | null
          total_acessos: number | null
          ultima_posicao_video_seg: number | null
          ultimo_acesso: string | null
          updated_at: string
        }
        Insert: {
          aula_id: string
          concluida?: boolean | null
          created_at?: string
          data_conclusao?: string | null
          downloads_feitos?: number | null
          id?: string
          matricula_id: string
          nota_quiz?: number | null
          primeiro_acesso?: string | null
          profile_id: string
          quiz_tentativas?: number | null
          tempo_assistido_seg?: number | null
          total_acessos?: number | null
          ultima_posicao_video_seg?: number | null
          ultimo_acesso?: string | null
          updated_at?: string
        }
        Update: {
          aula_id?: string
          concluida?: boolean | null
          created_at?: string
          data_conclusao?: string | null
          downloads_feitos?: number | null
          id?: string
          matricula_id?: string
          nota_quiz?: number | null
          primeiro_acesso?: string | null
          profile_id?: string
          quiz_tentativas?: number | null
          tempo_assistido_seg?: number | null
          total_acessos?: number | null
          ultima_posicao_video_seg?: number | null
          ultimo_acesso?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "treinamentos_progresso_aula_id_fkey"
            columns: ["aula_id"]
            isOneToOne: false
            referencedRelation: "treinamentos_aulas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treinamentos_progresso_matricula_id_fkey"
            columns: ["matricula_id"]
            isOneToOne: false
            referencedRelation: "treinamentos_matriculas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treinamentos_progresso_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_empresa_id: { Args: never; Returns: string }
      is_admin_global: { Args: never; Returns: boolean }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      frequencia_relatorio:
        | "diario"
        | "semanal"
        | "quinzenal"
        | "mensal"
        | "trimestral"
        | "anual"
      metodo_pagamento:
        | "pix"
        | "cartao_credito"
        | "cartao_debito"
        | "boleto"
        | "ted"
        | "doc"
        | "picpay"
        | "mercadopago"
        | "paypal"
        | "transferencia"
        | "saldo_conta"
        | "outro"
      prioridade_ticket: "baixa" | "media" | "alta" | "critica" | "urgente"
      status_afiliado: "pendente" | "ativo" | "inativo" | "suspenso" | "banido"
      status_ativo: "ativo" | "inativo" | "suspenso" | "bloqueado"
      status_checkout: "rascunho" | "publicado" | "arquivado"
      status_comissao:
        | "pendente"
        | "aprovada"
        | "liberada"
        | "paga"
        | "cancelada"
        | "estornada"
      status_cupom: "ativo" | "inativo" | "expirado"
      status_estorno:
        | "solicitado"
        | "processando"
        | "aprovado_parcial"
        | "aprovado_total"
        | "concluido"
        | "rejeitado"
        | "cancelado"
        | "em_disputa"
      status_integracao:
        | "nao_configurado"
        | "conectado"
        | "erro"
        | "expirado"
        | "revogado"
      status_link_pagamento: "ativo" | "expirado" | "usado" | "desativado"
      status_marketplace_produto:
        | "pendente_aprovacao"
        | "publicado"
        | "rejeitado"
        | "arquivado"
      status_matricula:
        | "ativa"
        | "pausada"
        | "cancelada"
        | "concluida"
        | "expirada"
      status_produto: "rascunho" | "publicado" | "arquivado" | "indisponivel"
      status_repasse:
        | "agendado"
        | "processando"
        | "enviado"
        | "recebido"
        | "confirmado"
        | "cancelado"
        | "falhou"
      status_saque:
        | "solicitado"
        | "em_analise"
        | "aprovado"
        | "processando"
        | "enviado"
        | "pago"
        | "cancelado"
        | "rejeitado"
        | "falhou"
      status_sessao: "ativa" | "expirada" | "revogada" | "bloqueada"
      status_ticket:
        | "aberto"
        | "respondido_cliente"
        | "respondido_suporte"
        | "em_analise"
        | "pendente_terceiro"
        | "resolvido"
        | "fechado"
        | "reaberto"
      status_transacao:
        | "pendente"
        | "processando"
        | "aprovada"
        | "autorizada"
        | "capturada"
        | "paga"
        | "disponivel"
        | "atrasada"
        | "cancelada"
        | "rejeitada"
        | "estornada_parcial"
        | "estornada_total"
        | "reembolsada"
        | "chargeback"
        | "em_disputa"
        | "falhou"
        | "expirada"
      tipo_audit_log:
        | "create"
        | "read"
        | "update"
        | "delete"
        | "login"
        | "logout"
        | "login_falha"
        | "troca_senha"
        | "email_verificado"
        | "acesso_negado"
        | "permissao_concedida"
        | "permissao_revogada"
        | "troca_email"
        | "2fa_ativada"
        | "2fa_desativada"
        | "saque_solicitado"
        | "saque_aprovado"
        | "saque_rejeitado"
        | "transacao_aprovada"
        | "transacao_estornada"
        | "convite_enviado"
        | "convite_aceito"
        | "produto_publicado"
        | "checkout_publicado"
      tipo_conta: "corrente" | "poupanca" | "pagamento" | "juridica"
      tipo_cupom: "percentual" | "valor_fixo" | "frete_gratis"
      tipo_curso: "video" | "texto" | "quiz" | "live" | "arquivo" | "webinar"
      tipo_desconto: "percentual" | "valor_fixo"
      tipo_link_pagamento:
        | "simples"
        | "produto"
        | "assinatura"
        | "doacao"
        | "personalizado"
      tipo_notificacao:
        | "sistema"
        | "transacao"
        | "venda"
        | "saque"
        | "comissao"
        | "afiliado"
        | "seguranca"
        | "atualizacao"
        | "promocao"
        | "tarefa"
        | "lembrete"
        | "suporte"
        | "financeiro"
      tipo_operacao:
        | "create"
        | "read"
        | "update"
        | "delete"
        | "approve"
        | "manage"
      tipo_produto: "fisico" | "digital" | "assinatura" | "servico" | "ingresso"
      tipo_rede_afiliado: "uninivel" | "binario" | "matriz"
      tipo_ticket:
        | "suporte"
        | "duvida"
        | "reclamacao"
        | "sugestao"
        | "bug"
        | "financeiro"
      tipo_transacao:
        | "venda"
        | "assinatura"
        | "saque"
        | "transferencia_entrada"
        | "transferencia_saida"
        | "estorno"
        | "reembolso"
        | "chargeback"
        | "taxa_plataforma"
        | "ajuste_credito"
        | "ajuste_debito"
        | "pagamento_comissao"
        | "recolhimento_imposto"
        | "boleto_gerado"
        | "link_pagamento"
        | "recarga_saldo"
        | "cancelamento"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      frequencia_relatorio: [
        "diario",
        "semanal",
        "quinzenal",
        "mensal",
        "trimestral",
        "anual",
      ],
      metodo_pagamento: [
        "pix",
        "cartao_credito",
        "cartao_debito",
        "boleto",
        "ted",
        "doc",
        "picpay",
        "mercadopago",
        "paypal",
        "transferencia",
        "saldo_conta",
        "outro",
      ],
      prioridade_ticket: ["baixa", "media", "alta", "critica", "urgente"],
      status_afiliado: ["pendente", "ativo", "inativo", "suspenso", "banido"],
      status_ativo: ["ativo", "inativo", "suspenso", "bloqueado"],
      status_checkout: ["rascunho", "publicado", "arquivado"],
      status_comissao: [
        "pendente",
        "aprovada",
        "liberada",
        "paga",
        "cancelada",
        "estornada",
      ],
      status_cupom: ["ativo", "inativo", "expirado"],
      status_estorno: [
        "solicitado",
        "processando",
        "aprovado_parcial",
        "aprovado_total",
        "concluido",
        "rejeitado",
        "cancelado",
        "em_disputa",
      ],
      status_integracao: [
        "nao_configurado",
        "conectado",
        "erro",
        "expirado",
        "revogado",
      ],
      status_link_pagamento: ["ativo", "expirado", "usado", "desativado"],
      status_marketplace_produto: [
        "pendente_aprovacao",
        "publicado",
        "rejeitado",
        "arquivado",
      ],
      status_matricula: [
        "ativa",
        "pausada",
        "cancelada",
        "concluida",
        "expirada",
      ],
      status_produto: ["rascunho", "publicado", "arquivado", "indisponivel"],
      status_repasse: [
        "agendado",
        "processando",
        "enviado",
        "recebido",
        "confirmado",
        "cancelado",
        "falhou",
      ],
      status_saque: [
        "solicitado",
        "em_analise",
        "aprovado",
        "processando",
        "enviado",
        "pago",
        "cancelado",
        "rejeitado",
        "falhou",
      ],
      status_sessao: ["ativa", "expirada", "revogada", "bloqueada"],
      status_ticket: [
        "aberto",
        "respondido_cliente",
        "respondido_suporte",
        "em_analise",
        "pendente_terceiro",
        "resolvido",
        "fechado",
        "reaberto",
      ],
      status_transacao: [
        "pendente",
        "processando",
        "aprovada",
        "autorizada",
        "capturada",
        "paga",
        "disponivel",
        "atrasada",
        "cancelada",
        "rejeitada",
        "estornada_parcial",
        "estornada_total",
        "reembolsada",
        "chargeback",
        "em_disputa",
        "falhou",
        "expirada",
      ],
      tipo_audit_log: [
        "create",
        "read",
        "update",
        "delete",
        "login",
        "logout",
        "login_falha",
        "troca_senha",
        "email_verificado",
        "acesso_negado",
        "permissao_concedida",
        "permissao_revogada",
        "troca_email",
        "2fa_ativada",
        "2fa_desativada",
        "saque_solicitado",
        "saque_aprovado",
        "saque_rejeitado",
        "transacao_aprovada",
        "transacao_estornada",
        "convite_enviado",
        "convite_aceito",
        "produto_publicado",
        "checkout_publicado",
      ],
      tipo_conta: ["corrente", "poupanca", "pagamento", "juridica"],
      tipo_cupom: ["percentual", "valor_fixo", "frete_gratis"],
      tipo_curso: ["video", "texto", "quiz", "live", "arquivo", "webinar"],
      tipo_desconto: ["percentual", "valor_fixo"],
      tipo_link_pagamento: [
        "simples",
        "produto",
        "assinatura",
        "doacao",
        "personalizado",
      ],
      tipo_notificacao: [
        "sistema",
        "transacao",
        "venda",
        "saque",
        "comissao",
        "afiliado",
        "seguranca",
        "atualizacao",
        "promocao",
        "tarefa",
        "lembrete",
        "suporte",
        "financeiro",
      ],
      tipo_operacao: [
        "create",
        "read",
        "update",
        "delete",
        "approve",
        "manage",
      ],
      tipo_produto: ["fisico", "digital", "assinatura", "servico", "ingresso"],
      tipo_rede_afiliado: ["uninivel", "binario", "matriz"],
      tipo_ticket: [
        "suporte",
        "duvida",
        "reclamacao",
        "sugestao",
        "bug",
        "financeiro",
      ],
      tipo_transacao: [
        "venda",
        "assinatura",
        "saque",
        "transferencia_entrada",
        "transferencia_saida",
        "estorno",
        "reembolso",
        "chargeback",
        "taxa_plataforma",
        "ajuste_credito",
        "ajuste_debito",
        "pagamento_comissao",
        "recolhimento_imposto",
        "boleto_gerado",
        "link_pagamento",
        "recarga_saldo",
        "cancelamento",
      ],
    },
  },
} as const
