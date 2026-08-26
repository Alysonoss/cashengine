import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShellProvider, useAppShell } from "@/components/app/app-shell-context";
import {
  DesktopSidebar,
  MobileSidebar,
} from "@/components/app/admin/AdminSidebar";
import { Bell, HelpCircle, Lock, Menu, Search } from "lucide-react";
import { ArrowLeftToLine } from "lucide-react";
import { useTempAuth } from "@/lib/auth-temp";
import { Skeleton } from "@/components/ui/skeleton";

declare global {
  interface Window {
    is_admin_global?: boolean;
  }
}

function AdminTopbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-destructive/30 bg-destructive/5 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Abrir menu"
          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-destructive px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-destructive-foreground">
            <Lock className="h-3 w-3" />
            Admin Global
          </span>
        </div>

        <div className="relative hidden min-w-0 flex-1 md:block ml-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar empresa, usuário, transação..."
            className="h-9 w-full max-w-md rounded-md border border-border bg-card pl-9 pr-14 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-destructive focus:ring-2 focus:ring-destructive/15"
          />
          <kbd className="pointer-events-none absolute left-[23.5rem] top-1/2 hidden -translate-y-1/2 rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:block">
            ⌘K
          </kbd>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            aria-label="Notificações"
            className="relative rounded-md border border-border bg-card p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
              7
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

function AccessRestrictedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <Lock className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
          Acesso restrito
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Esta área é exclusiva para administradores globais da plataforma.
          Seu perfil não possui permissão para acessar este módulo.
        </p>
        <div className="mt-8">
          <Link
            to="/app"
            className="inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2.5 text-sm font-medium text-destructive-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            <ArrowLeftToLine className="h-4 w-4" />
            Voltar ao dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function AdminShellInner() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthed, isLoading, isAdminGlobal: tempIsAdminGlobal } = useTempAuth();
  const { role, setRole } = useAppShell();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthed) {
      navigate({ to: "/login", replace: true }).catch(() => {});
    }
  }, [isAuthed, isLoading, navigate]);

  useEffect(() => {
    if (user?.role) {
      setRole(user.role);
    }
  }, [user?.role, setRole]);

  const windowIsAdmin =
    typeof window !== "undefined" && window.is_admin_global === true;

  const isAdminGlobal =
    windowIsAdmin ||
    tempIsAdminGlobal ||
    user?.role === "admin_global" ||
    role === "admin_global";

  if (isLoading) {
    return (
      <div className="app-light min-h-screen bg-background text-foreground antialiased">
        <div className="hidden w-64 lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:flex-col lg:border-r lg:border-border lg:bg-card">
          <Skeleton className="mx-4 my-5 h-8 w-40" />
          <div className="flex-1 space-y-6 px-3 pb-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="mx-3 h-8" />
            ))}
          </div>
          <Skeleton className="m-3 h-16" />
        </div>
        <div className="lg:pl-64">
          <Skeleton className="h-16 w-full border-b border-border" />
          <main className="space-y-4 px-4 py-6 sm:px-6 lg:px-8">
            <Skeleton className="h-10 w-1/3" />
            <div className="grid gap-4 md:grid-cols-3">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
            <Skeleton className="h-80" />
          </main>
        </div>
      </div>
    );
  }

  if (!isAuthed) {
    return null;
  }

  if (!isAdminGlobal) {
    return <AccessRestrictedPage />;
  }

  return (
    <div className="app-light min-h-screen bg-background text-foreground antialiased">
      <DesktopSidebar />
      <MobileSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="lg:pl-64">
        <AdminTopbar onOpenMenu={() => setMenuOpen(true)} />
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function AdminShell() {
  return <AdminShellInner />;
}

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Global · Cash Engine PRO" },
      {
        name: "description",
        content: "Painel administrativo global da Cash Engine PRO.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AppShellProvider>
      <AdminShell />
    </AppShellProvider>
  );
}
