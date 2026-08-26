import { useState } from "react";
import { Bell, ChevronDown, HelpCircle, Menu, Moon, Search, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { periods, roles, useAppShell, periodLabel } from "./app-shell-context";
import { cn } from "@/lib/utils";

function Dropdown({
  label,
  children,
  align = "right",
}: {
  label: React.ReactNode;
  children: (close: () => void) => React.ReactNode;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
      >
        {label}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "absolute z-40 mt-2 w-56 overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-sm",
                align === "right" ? "right-0" : "left-0",
              )}
            >
              {children(() => setOpen(false))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { period, setPeriod, role, setRole, theme, toggleTheme } = useAppShell();
  const activeRole = roles.find((r) => r.key === role)!;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Abrir menu"
          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative hidden min-w-0 flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar transação, cliente, produto..."
            className="h-9 w-full max-w-md rounded-md border border-border bg-card pl-9 pr-14 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
          <kbd className="pointer-events-none absolute left-[23.5rem] top-1/2 hidden -translate-y-1/2 rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:block">
            ⌘K
          </kbd>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
            title={theme === "dark" ? "Modo claro" : "Modo escuro"}
            className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-all hover:bg-muted hover:text-foreground"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 transition-transform group-hover:rotate-12" />
            ) : (
              <Moon className="h-4 w-4 -rotate-12 transition-transform group-hover:-rotate-6" />
            )}
          </button>

          <Dropdown label={<span className="hidden sm:inline">{activeRole.label}</span>}>
            {(close) => (
              <>
                <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Visão de permissão
                </p>
                {roles.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => {
                      setRole(r.key);
                      close();
                    }}
                    className={cn(
                      "flex w-full flex-col items-start rounded-md px-2 py-2 text-left transition-colors hover:bg-muted",
                      r.key === role && "bg-primary/8",
                    )}
                  >
                    <span
                      className={cn(
                        "text-[13px] font-medium",
                        r.key === role ? "text-primary" : "text-foreground",
                      )}
                    >
                      {r.label}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{r.description}</span>
                  </button>
                ))}
              </>
            )}
          </Dropdown>

          <Dropdown label={periodLabel(period)}>
            {(close) => (
              <>
                {periods.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => {
                      setPeriod(p.key);
                      close();
                    }}
                    className={cn(
                      "flex w-full items-center rounded-md px-2 py-2 text-left text-[13px] transition-colors hover:bg-muted",
                      p.key === period ? "font-medium text-primary" : "text-foreground",
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </>
            )}
          </Dropdown>

          <button
            type="button"
            aria-label="Notificações"
            className="relative rounded-md border border-border bg-card p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              3
            </span>
          </button>

          <button
            type="button"
            aria-label="Ajuda"
            className="rounded-md border border-border bg-card p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
