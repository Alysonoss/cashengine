# Cash Engine PRO - Banco de Dados Supabase

Arquitetura de banco de dados PostgreSQL 15+ (Supabase) para o **Cash Engine PRO** — plataforma completa de vendas digitais, afiliados, marketplace, financeiro, treinamentos, CRM e administração.

---

## 📁 Estrutura de Arquivos

```
supabase/
├── migrations/
│   ├── 001_schema_base.sql                          ← Tabelas básicas: empresas, profiles, roles, permissions
│   ├── 002_produtos_checkouts_links.sql             ← Produtos, categorias, cupons, checkouts, links de pagamento, clientes
│   ├── 003_afiliados_marketplace.sql                ← Afiliados, comissões, marketplace, rede de indicação
│   ├── 004_financeiro.sql                           ← Transações, parcelas, saldos, saques, estornos, chargebacks, repasses, taxas, livro razão
│   ├── 005_equipe_seguranca_notificacoes.sql        ← Equipe, audit log, 2FA, sessões, bloqueios, chaves API, webhooks, notificações, central de ajuda, tickets, comunidade
│   ├── 006_admin_treinamentos_integracoes.sql       ← Admin global, moderação, integrações, treinamentos, relatórios agendados
│   ├── 007_rls_functions_triggers.sql               ← RLS em TODAS tabelas, functions, triggers de auditoria e updated_at
│   └── 008_seed_permissoes.sql                      ← Seed OBRIGATÓRIO: roles + permissões + taxas padrão + config + artigos ajuda
└── seed/
    └── demo_data.sql                                ← OPCIONAL: dados de DEMO (homologação apenas)
```

---

## 🔒 Recursos de Segurança (RLS)

- **Row Level Security** habilitado em **100% das tabelas públicas**
- **Políticas isolam por empresa_id** — cada tenant só enxerga seus próprios dados
- **Admin Global** (flag `is_admin_global`) tem acesso irrestrito
- **Owner** (flag `is_owner`) → acesso total à sua empresa
- **Permissões granulares** via `permissions` + `role_permissions` + `profile_roles`
- **Triggers de auditoria automáticos** em todas tabelas críticas
- **Funções de validação** que checam permissões em nível de DB

---

## 🗄️ Diagrama Resumido de Tabelas Principais

| Categoria         | Tabelas Principais                                                                                                 |
|-------------------|-------------------------------------------------------------------------------------------------------------------|
| **Core**          | `empresas`, `profiles`, `roles`, `permissions`, `role_permissions`, `profile_roles`, `invites`                  |
| **Vendas**        | `produtos`, `categorias_produtos`, `cupons`, `checkouts`, `templates_checkout`, `links_pagamento`, `clientes`   |
| **Afiliados**     | `afiliados`, `afiliados_produtos`, `links_afiliados`, `comissoes`, `marketplace_produtos`, `marketplace_inscricoes`, `rede_afiliados_hierarquia` |
| **Financeiro**    | `transacoes`, `transacoes_parcelas`, `saldos`, `saques`, `estornos`, `chargebacks`, `repasses`, `contas_bancarias`, `taxas_plataforma`, `lancamentos_contabeis` |
| **Segurança**     | `seguranca_sessoes`, `seguranca_audit_log`, `seguranca_2fa`, `seguranca_dispositivos`, `seguranca_bloqueios`, `seguranca_senhas_historico`, `seguranca_chaves_api`, `seguranca_webhooks`, `seguranca_webhooks_log` |
| **Notificações**  | `notificacoes`, `notificacoes_preferencias`                                                                      |
| **Ajuda/Suporte** | `ajuda_categorias`, `ajuda_artigos`, `ajuda_feedback`, `tickets`, `tickets_mensagens`, `comunidade_posts`       |
| **Admin Global**  | `admin_global_config`, `admin_empresas_gestao`, `admin_banimentos`, `admin_moderacao`, `admin_comunicados`       |
| **Treinamentos**  | `treinamentos_cursos`, `treinamentos_modulos`, `treinamentos_aulas`, `treinamentos_matriculas`, `treinamentos_progresso` |
| **Integrações**   | `integracoes`, `integracoes_logs`                                                                                |
| **Relatórios**    | `relatorios_agendados`, `relatorios_historico`                                                                   |

---

## 🚀 Como Executar as Migrações

### Opção A — Painel do Supabase (Recomendado para começar)

1. Acesse **https://app.supabase.com/project/SEU_PROJECT_ID/sql/new**
2. **Execute os arquivos na ORDEM NUMÉRICA**, um por vez:
   ```
   001 → 002 → 003 → 004 → 005 → 006 → 007 → 008
   ```
3. Execute `008_seed_permissoes.sql` **OBRIGATORIAMENTE** (cria roles e permissões)
4. (Opcional) Execute `seed/demo_data.sql` — **SOMENTE EM HOMOLOGAÇÃO**

### Opção B — CLI do Supabase

```bash
# Instale o CLI
npm i -g supabase

# Inicialize se for o primeiro uso
supabase link --project-ref SEU_PROJECT_REF

# Rode as migrations
supabase db push
```

### Opção C — Terminal psql direto

```bash
psql -h db.xxx.supabase.co -U postgres -d postgres -c "\i supabase/migrations/001_schema_base.sql"
# ... repita para os outros arquivos em ordem
```

---

## 🧩 Pós-Configuração Recomendada

Após rodar as migrações, ative estes recursos no dashboard do Supabase:

### 1. Auth → Providers
- Ative **Email**
- (Opcional) **Google**, **Apple**, **WhatsApp OTP**, **Magic Link**
- Desative "Confirm email" temporariamente se quiser fluxo mais rápido de teste

### 2. Auth → URL Configuration
- **Site URL**: `http://localhost:5173` (dev) ou sua URL real
- **Redirect URLs**: adicione `http://localhost:5173/app/**` e produção

### 3. Database → Replication
- Ligue a replicação nas tabelas que você quer usar Realtime: `produtos`, `transacoes`, `comissoes`, `notificacoes`, `tickets`, `seguranca_sessoes`

### 4. Storage → Buckets (Crie manualmente)
Crie os buckets abaixo com **"Public" = OFF** (exceto publicos):

| Bucket            | Público? | Tamanho Máx Arquivo | Objetivo                              |
|-------------------|----------|---------------------|---------------------------------------|
| `produtos`        | Não      | 20 MB               | Imagens de produtos                  |
| `profiles`        | Não      | 5 MB                | Avatares                              |
| `empresas`        | Não      | 10 MB               | Logo/documentos empresa              |
| `checkouts`       | Não      | 50 MB               | Vídeos/banners de checkout           |
| `documentos`      | Não      | 30 MB               | Documentos de identificação (KYC)    |
| `tickets`         | Não      | 25 MB               | Anexos de tickets de suporte         |
| `treinamentos`    | Não      | 2 GB                | Vídeos/aulas/materiais treinamento   |
| `publicos`        | Sim      | 10 MB               | Arquivos públicos (banners, assets)  |

### 5. Edge Functions
Implemente futuramente webhooks de pagamento e rotas sensíveis em Edge Functions:
- `stripe-webhook`, `asaas-webhook`, `pagarme-webhook`, `mercado-pago-webhook`
- `solicitar-saque` (processamento)
- `processar-comissoes` (job agendado)
- `gerar-boleto-pix`

---

## 🔗 Variáveis de Ambiente (.env)

Crie um arquivo `.env.local` com as credenciais:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi... (SOMENTE BACKEND, NÃO COMMITE)
```

---

## 👤 Criando o Primeiro Admin Global

1. Crie um usuário em **Authentication → Users** com email `admin@suaempresa.com`
2. Pegue o `id` dele na lista (UUID)
3. Rode no SQL Editor:

```sql
-- Atualiza o profile do primeiro usuário como admin global e owner
UPDATE public.profiles
SET
    is_admin_global = TRUE,
    is_owner = TRUE,
    nome_completo = 'Administrador Geral',
    status = 'ativo'
WHERE id = 'UUID_DO_USUARIO_AQUI';

-- Cria a empresa master
INSERT INTO public.empresas (
    nome_fantasia, razao_social, cnpj, email,
    plano, status
) VALUES (
    'Cash Engine PRO',
    'Cash Engine Soluções LTDA',
    '00.000.000/0001-00',
    'admin@cashengine.pro',
    'enterprise', 'ativo'
) RETURNING id;
-- Guarde o ID da empresa retornada (UUID)

-- Atrela o usuário a essa empresa
UPDATE public.profiles
SET empresa_id = 'UUID_DA_EMPRESA_AQUI'
WHERE id = 'UUID_DO_USUARIO_AQUI';
```

Pronto. Login com o email e senha desse usuário → Dashboard completo.

---

## ✅ Checklist de Produção

- [ ] Migrations 001→008 rodadas sem erros
- [ ] Seed 008 rodado para roles padrão
- [ ] Storage buckets criados e policies
- [ ] Auth providers configurados
- [ ] Replication/Realtime ligado nas tabelas principais
- [ ] Primeiro Admin Global criado
- [ ] Variáveis de ambiente publicadas no frontend
- [ ] Secrets de pagamento guardadas em Vault (NÃO em tabelas!)
- [ ] Webhooks de payment provider configurados
- [ ] Cron jobs de liquidação/comissão ativos

---

## 🔧 Funções Úteis Já Disponíveis

Todas estas **functions** existem após rodar a migration 007:

| Nome                                   | Objetivo                                                            |
|----------------------------------------|---------------------------------------------------------------------|
| `fn_get_empresa_usuario()`             | Retorna UUID da empresa do usuário logado                           |
| `fn_is_admin_global()`                 | TRUE se usuário tem flag `is_admin_global = true`                  |
| `fn_is_empresa_owner(UUID?)`           | TRUE se é dono da empresa                                          |
| `fn_tem_permissao(modulo,recurso,acao)`| TRUE se usuário tem permissão granular (role-permission)           |
| `fn_criar_empresa_usuario_logado(txt)` | Cria empresa automaticamente no primeiro login                     |
| `fn_criar_convite(...)`                | Cria convite equipe/afiliado com checagem de permissão            |
| `fn_gerar_codigo_unico(prefix,tam)`    | Gera códigos aleatórios únicos para links, cupons e protocolos     |

---

## 📝 Support

Dúvidas ou correções nas migrations? Abra um chamado em `tickets` de dentro do próprio painel Cash Engine PRO.
