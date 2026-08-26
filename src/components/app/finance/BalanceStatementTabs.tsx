import { Link, useRouterState } from "@tanstack/react-router";
import { Banknote, Receipt, RefreshCcw, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Saldo", to: "/app/saldo", icon: Wallet },
  { label: "Extrato", to: "/app/extrato", icon: Receipt },
  { label: "Saques", to: "/app/saques", icon: Banknote },
  { label: "Estornos", to: "/app/estornos", icon: RefreshCcw },
] as const;

export function BalanceStatementTabs() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <div className="mb-6 flex w-full flex-wrap gap-1 rounded-xl border border-border bg-card p-1 shadow-sm sm:w-fit">
      {tabs.map((tab) => {
        const active = pathname === tab.to;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
