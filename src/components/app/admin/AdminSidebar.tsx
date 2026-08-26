import { Link, useRouterState } from "@tanstack/react-router";
import type { LinkProps } from "@tanstack/react-router";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { LogOut, Settings, X } from "lucide-react";
import { navGroups } from "./admin-nav-config";
import { cn } from "@/lib/utils";

function Brand() {
  return (
    <Link to="/admin" className="flex items-center gap-2.5 px-4 py-5">
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-destructive text-[13px] font-bold text-destructive-foreground">
        ADM
      </span>
      <span className="text-[13px] font-bold uppercase leading-tight tracking-[0.14em] text-foreground">
        Admin Global
        <span className="block text-[10px] font-semibold tracking-[0.28em] text-destructive">PRO</span>
      </span>
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">
      {navGroups.map((group) => {
        const items = group.items;
        if (items.length === 0) return null;

        return (
          <div key={group.label}>
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {items.map((item) => {
                const active =
                  item.to === "/admin" ? pathname === "/admin" : pathname.startsWith(item.to);
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to as NonNullable<LinkProps["to"]>}
                      onClick={onNavigate}
                      className={cn(
                        "group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
                        active
                          ? "bg-destructive/10 text-destructive"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-destructive" />
                      )}
                      <Icon className="h-4 w-4 shrink-0" strokeWidth={active ? 2.2 : 1.8} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

function UserFooter() {
  return (
    <div className="border-t border-border p-3">
      <div className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive text-xs font-semibold text-destructive-foreground">
          ADM
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-foreground">Admin Global</p>
          <p className="truncate text-[11px] text-muted-foreground">Admin Global · Acesso Total</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Configurações da conta"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Sair"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function DesktopSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-card lg:flex">
      <Brand />
      <NavLinks />
      <UserFooter />
    </aside>
  );
}

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <div className="lg:hidden">
          <motion.div
            className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed inset-y-0 left-0 z-50 flex w-[17rem] flex-col border-r border-border bg-card"
            initial={reduced ? false : { x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <div className="flex items-center justify-between pr-3">
              <Brand />
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar menu"
                className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <NavLinks onNavigate={onClose} />
            <UserFooter />
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
