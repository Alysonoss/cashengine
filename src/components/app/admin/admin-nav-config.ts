import {
  ArrowLeftToLine,
  Ban,
  Banknote,
  Bell,
  Building2,
  CircleDollarSign,
  CreditCard,
  Gauge,
  GraduationCap,
  Plug,
  ScrollText,
  Settings,
  ShieldAlert,
  Ticket,
  Users,
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
    label: "Geral",
    items: [{ label: "Dashboard", to: "/admin", icon: Gauge }],
  },
  {
    label: "Gestão",
    items: [
      { label: "Empresas", to: "/admin/empresas", icon: Building2 },
      { label: "Usuários", to: "/admin/usuarios", icon: Users },
      { label: "Banimentos", to: "/admin/banimentos", icon: Ban },
      { label: "Moderação", to: "/admin/moderacao", icon: ShieldAlert },
    ],
  },
  {
    label: "Financeiro Global",
    items: [
      { label: "Saques pendentes", to: "/admin/saques-pendentes", icon: Banknote },
      { label: "Transações globais", to: "/admin/transacoes", icon: CreditCard },
      { label: "Repasses", to: "/admin/repasses", icon: CircleDollarSign },
    ],
  },
  {
    label: "Operações",
    items: [
      { label: "Configurações globais", to: "/admin/configuracoes", icon: Settings },
      { label: "Auditoria", to: "/admin/auditoria", icon: ScrollText },
      { label: "Suporte tickets", to: "/admin/tickets", icon: Ticket },
      { label: "Comunicados", to: "/admin/comunicados", icon: Bell },
      { label: "Integrações plataforma", to: "/admin/integracoes", icon: Plug },
      { label: "Treinamentos LMS", to: "/admin/treinamentos", icon: GraduationCap },
    ],
  },
  {
    label: "Voltar",
    items: [{ label: "Voltar ao app", to: "/app", icon: ArrowLeftToLine }],
  },
];
