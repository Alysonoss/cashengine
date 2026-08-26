import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type PeriodKey = "hoje" | "7d" | "30d" | "90d" | "12m";
export type RoleKey = "admin_global" | "super-admin" | "produtor" | "afiliado";
export type ThemeKey = "light" | "dark";

export const periods: { key: PeriodKey; label: string }[] = [
  { key: "hoje", label: "Hoje" },
  { key: "7d", label: "7 dias" },
  { key: "30d", label: "30 dias" },
  { key: "90d", label: "90 dias" },
  { key: "12m", label: "12 meses" },
];

export const roles: { key: RoleKey; label: string; description: string }[] = [
  {
    key: "admin_global",
    label: "Admin Global",
    description: "Acesso total e irrestrito à plataforma",
  },
  { key: "super-admin", label: "Super Admin", description: "Visão global da plataforma" },
  { key: "produtor", label: "Produtor", description: "Vendas, produtos e carteira" },
  { key: "afiliado", label: "Afiliado", description: "Comissões e marketplace" },
];

type AppShellState = {
  period: PeriodKey;
  setPeriod: (p: PeriodKey) => void;
  role: RoleKey;
  setRole: (r: RoleKey) => void;
  theme: ThemeKey;
  setTheme: (theme: ThemeKey) => void;
  toggleTheme: () => void;
};

const AppShellContext = createContext<AppShellState | null>(null);

export function AppShellProvider({ children }: { children: ReactNode }) {
  const [period, setPeriod] = useState<PeriodKey>("30d");
  const [role, setRole] = useState<RoleKey>("super-admin");
  const [theme, setTheme] = useState<ThemeKey>("light");
  const themeDidMount = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("cash-engine-theme");
    if (saved === "dark" || saved === "light") setTheme(saved);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!themeDidMount.current) {
      themeDidMount.current = true;
      return;
    }
    window.localStorage.setItem("cash-engine-theme", theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      period,
      setPeriod,
      role,
      setRole,
      theme,
      setTheme,
      toggleTheme: () => setTheme((current) => (current === "dark" ? "light" : "dark")),
    }),
    [period, role, theme],
  );

  return <AppShellContext.Provider value={value}>{children}</AppShellContext.Provider>;
}

export function useAppShell() {
  const ctx = useContext(AppShellContext);
  if (!ctx) throw new Error("useAppShell precisa estar dentro de AppShellProvider");
  return ctx;
}

export function periodLabel(key: PeriodKey) {
  return periods.find((p) => p.key === key)?.label ?? "30 dias";
}
