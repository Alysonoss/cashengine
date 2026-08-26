import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShellProvider, useAppShell } from "@/components/app/app-shell-context";
import { DesktopSidebar, MobileSidebar } from "@/components/app/Sidebar";
import { Topbar } from "@/components/app/Topbar";
import { useTempAuth } from "@/lib/auth-temp";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Plataforma · Cash Engine PRO" },
      {
        name: "description",
        content: "Central operacional da sua infraestrutura de pagamentos.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AppLayout,
});

function AppShellInner() {
  const { user, isAuthed, isLoading } = useTempAuth();
  const { setRole, theme } = useAppShell();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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

  if (isLoading) {
    return (
      <div
        className={`${theme === "dark" ? "app-dark dark" : "app-light"} min-h-screen bg-background text-foreground antialiased`}
      >
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

  return (
    <div
      className={`${theme === "dark" ? "app-dark dark" : "app-light"} min-h-screen bg-background text-foreground antialiased`}
    >
      <DesktopSidebar />
      <MobileSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="lg:pl-64">
        <Topbar onOpenMenu={() => setMenuOpen(true)} />
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function AppLayout() {
  return (
    <AppShellProvider>
      <AppShellInner />
    </AppShellProvider>
  );
}
