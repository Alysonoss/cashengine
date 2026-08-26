import {
  Activity,
  BadgePercent,
  Building2,
  Boxes,
  CircleDollarSign,
  CreditCard,
  FileBarChart,
  Gauge,
  Handshake,
  KeyRound,
  Link2,
  Lock,
  Package,
  Plug,
  ScrollText,
  Settings,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Store,
  UserCog,
  Users,
  Wallet,
  WalletCards,
  Webhook,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    label: "Visão geral",
    items: [{ label: "Dashboard", to: "/app", icon: Gauge }],
  },
  {
    label: "Vendas",
    items: [
      { label: "Pagamentos Pix", to: "/app/pagamentos", icon: WalletCards },
      { label: "Transações", to: "/app/transacoes", icon: CreditCard },
      { label: "Vendas", to: "/app/vendas", icon: ShoppingBag },
      { label: "Produtos", to: "/app/produtos", icon: Package },
      { label: "Links de pagamento", to: "/app/links-de-pagamento", icon: Link2 },
      { label: "Clientes", to: "/app/clientes", icon: Users },
    ],
  },
  {
    label: "Afiliados",
    items: [
      { label: "Afiliados", to: "/app/afiliados", icon: Handshake },
      { label: "Marketplace", to: "/app/marketplace", icon: Store },
      { label: "Comissões", to: "/app/comissoes", icon: BadgePercent },
      { label: "Links", to: "/app/links", icon: Link2 },
    ],
  },
  {
    label: "Financeiro",
    items: [
      { label: "Split Engine", to: "/app/split", icon: CircleDollarSign },
      { label: "Saldo", to: "/app/saldo", icon: Wallet },
      { label: "Repasses", to: "/app/repasses", icon: CircleDollarSign },
      { label: "Chargebacks", to: "/app/chargebacks", icon: ShieldCheck },
      { label: "Taxas", to: "/app/taxas", icon: Boxes },
    ],
  },
  {
    label: "Desenvolvedores",
    items: [
      { label: "API", to: "/app/api", icon: KeyRound },
      { label: "Webhooks", to: "/app/webhooks", icon: Webhook },
      { label: "Logs", to: "/app/logs", icon: ScrollText },
    ],
  },
  {
    label: "Relatórios",
    items: [
      { label: "Vendas", to: "/app/relatorios/vendas", icon: FileBarChart },
      { label: "Financeiro", to: "/app/relatorios/financeiro", icon: FileBarChart },
      { label: "Afiliados", to: "/app/relatorios/afiliados", icon: FileBarChart },
      { label: "Produtos", to: "/app/relatorios/produtos", icon: FileBarChart },
    ],
  },
  {
    label: "Configurações",
    items: [
      { label: "Conta", to: "/app/configuracoes/conta", icon: UserCog },
      { label: "Empresa", to: "/app/configuracoes/empresa", icon: Building2 },
      { label: "Equipe", to: "/app/configuracoes/equipe", icon: Users },
      { label: "Permissões", to: "/app/configuracoes/permissoes", icon: Settings },
      { label: "Segurança", to: "/app/configuracoes/seguranca", icon: Lock },
      { label: "Integrações", to: "/app/configuracoes/integracoes", icon: Plug },
    ],
  },
  {
    label: "Plataforma",
    items: [{ label: "Admin Global", to: "/admin", icon: ShieldAlert }],
  },
];

/** Itens ocultos por perfil de protótipo. */
export const hiddenForAffiliate = new Set([
  "/app/pagamentos",
  "/app/produtos",
  "/app/checkouts",
  "/app/links-de-pagamento",
  "/app/clientes",
  "/app/afiliados",
  "/app/repasses",
  "/app/estornos",
  "/app/chargebacks",
  "/app/taxas",
  "/app/api",
  "/app/webhooks",
  "/app/logs",
  "/app/relatorios/financeiro",
  "/app/relatorios/produtos",
  "/app/configuracoes/empresa",
  "/app/configuracoes/equipe",
  "/app/configuracoes/permissoes",
]);

export const activityIcon = Activity;
