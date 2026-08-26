import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Edit3,
  Mail,
  MoreHorizontal,
  PauseCircle,
  RefreshCw,
  Search,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { formatDateTime, formatInt } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  inviteDemoTeamMember,
  readDemoTeam,
  removeDemoTeamMember,
  resendDemoTeamInvite,
  setDemoTeamMemberStatus,
  TEAM_ROLE_OPTIONS,
  updateDemoTeamRole,
  type DemoTeamMember,
} from "@/lib/demo-team";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const statusMap: Record<DemoTeamMember["status"], string> = {
  ativo: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  convite_pendente: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  inativo: "bg-muted text-muted-foreground",
};

const emptyInvite = {
  name: "",
  email: "",
  role: "Visualizador",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function statusLabel(status: DemoTeamMember["status"]) {
  if (status === "convite_pendente") return "Convite pendente";
  return status === "ativo" ? "Ativo" : "Inativo";
}

export function TeamPage() {
  const [members, setMembers] = useState<DemoTeamMember[]>(() => readDemoTeam());
  const [query, setQuery] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState(emptyInvite);
  const [editMember, setEditMember] = useState<DemoTeamMember | null>(null);
  const [editRole, setEditRole] = useState("Visualizador");
  const [removeTarget, setRemoveTarget] = useState<DemoTeamMember | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(q) ||
        member.email.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q),
    );
  }, [members, query]);

  const stats = useMemo(
    () => ({
      total: members.length,
      active: members.filter((member) => member.status === "ativo").length,
      pending: members.filter((member) => member.status === "convite_pendente").length,
      inactive: members.filter((member) => member.status === "inativo").length,
    }),
    [members],
  );

  function refresh() {
    setMembers(readDemoTeam());
    setOpenMenu(null);
  }

  function submitInvite() {
    try {
      const created = inviteDemoTeamMember(inviteForm);
      refresh();
      setInviteOpen(false);
      setInviteForm(emptyInvite);
      toast.success("Convite criado", {
        description: `${created.email} foi adicionado como convite pendente no modo TESTE.`,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível criar o convite.");
    }
  }

  function openEdit(member: DemoTeamMember) {
    setOpenMenu(null);
    setEditMember(member);
    setEditRole(member.role);
  }

  function submitEdit() {
    if (!editMember) return;
    try {
      updateDemoTeamRole(editMember.id, editRole);
      refresh();
      setEditMember(null);
      toast.success("Função atualizada");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível atualizar a função.");
    }
  }

  function resendInvite(member: DemoTeamMember) {
    try {
      resendDemoTeamInvite(member.id);
      refresh();
      toast.success("Convite reenviado no modo TESTE", {
        description: `A data de envio de ${member.email} foi atualizada.`,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível reenviar o convite.");
    }
  }

  function toggleStatus(member: DemoTeamMember) {
    try {
      const nextStatus = member.status === "ativo" ? "inativo" : "ativo";
      setDemoTeamMemberStatus(member.id, nextStatus);
      refresh();
      toast.success(nextStatus === "ativo" ? "Membro reativado" : "Membro desativado");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível alterar o status.");
    }
  }

  function confirmRemove() {
    if (!removeTarget) return;
    try {
      removeDemoTeamMember(removeTarget.id);
      refresh();
      toast.success(
        removeTarget.status === "convite_pendente" ? "Convite removido" : "Membro removido",
      );
      setRemoveTarget(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível remover o membro.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Equipe</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Convide colaboradores, altere funções e controle quem permanece ativo.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setInviteOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
        >
          <UserPlus className="h-4 w-4" />
          Convidar membro
        </button>
      </header>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total", value: stats.total, icon: Users },
          { label: "Ativos", value: stats.active, icon: CheckCircle2 },
          { label: "Convites pendentes", value: stats.pending, icon: Mail },
          { label: "Inativos", value: stats.inactive, icon: PauseCircle },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className="h-4 w-4" />
                <span className="text-xs font-medium">{stat.label}</span>
              </div>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
                {formatInt(stat.value)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome, e-mail ou função"
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
          />
        </div>
      </div>

      <section className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="px-5 py-3 font-medium">Membro</th>
                <th className="px-5 py-3 font-medium">Função</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Último acesso</th>
                <th className="px-5 py-3 font-medium">Convite / cadastro</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((member) => {
                const isOwner = member.role === "Owner / Fundador";
                return (
                  <tr key={member.id} className="transition-colors hover:bg-muted/40">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                            isOwner
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {initials(member.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{member.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{member.role}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[11px] font-medium",
                          statusMap[member.status],
                        )}
                      >
                        {statusLabel(member.status)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 tabular-nums text-muted-foreground">
                      {member.lastAccess ? formatDateTime(member.lastAccess) : "—"}
                    </td>
                    <td className="px-5 py-3.5 tabular-nums text-muted-foreground">
                      {formatDateTime(member.inviteSentAt ?? member.createdAt)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="relative inline-block">
                        <button
                          type="button"
                          onClick={() => setOpenMenu(openMenu === member.id ? null : member.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition hover:bg-muted"
                          aria-label={`Ações de ${member.name}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        {openMenu === member.id ? (
                          <div className="absolute right-0 z-20 mt-1 w-52 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                            <button
                              type="button"
                              disabled={isOwner}
                              onClick={() => openEdit(member)}
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
                              Editar função
                            </button>
                            {member.status === "convite_pendente" ? (
                              <button
                                type="button"
                                onClick={() => resendInvite(member)}
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-foreground hover:bg-muted"
                              >
                                <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                                Reenviar convite
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={isOwner}
                                onClick={() => toggleStatus(member)}
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                {member.status === "ativo" ? (
                                  <PauseCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                ) : (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                                )}
                                {member.status === "ativo" ? "Desativar membro" : "Reativar membro"}
                              </button>
                            )}
                            <button
                              type="button"
                              disabled={isOwner}
                              onClick={() => {
                                setOpenMenu(null);
                                setRemoveTarget(member);
                              }}
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-rose-600 hover:bg-rose-500/5 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              {member.status === "convite_pendente"
                                ? "Cancelar convite"
                                : "Remover membro"}
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-5 py-3 text-xs text-muted-foreground">
          <span>
            {formatInt(rows.length)} de {formatInt(members.length)} registros
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            Persistência local no modo TESTE
          </span>
        </div>
      </section>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="border-border bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Convidar membro</DialogTitle>
            <DialogDescription>
              O convite será salvo na equipe com status pendente. O envio externo de e-mail fica
              para a futura integração.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-1">
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-foreground">Nome</span>
              <input
                value={inviteForm.name}
                onChange={(event) =>
                  setInviteForm((form) => ({ ...form, name: event.target.value }))
                }
                placeholder="Nome do colaborador"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-foreground">E-mail</span>
              <input
                type="email"
                value={inviteForm.email}
                onChange={(event) =>
                  setInviteForm((form) => ({ ...form, email: event.target.value }))
                }
                placeholder="colaborador@empresa.com"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-foreground">Função</span>
              <select
                value={inviteForm.role}
                onChange={(event) =>
                  setInviteForm((form) => ({ ...form, role: event.target.value }))
                }
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary/60"
              >
                {TEAM_ROLE_OPTIONS.filter((role) => role !== "Owner / Fundador").map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setInviteOpen(false)}
              className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={submitInvite}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Criar convite
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editMember)} onOpenChange={(open) => !open && setEditMember(null)}>
        <DialogContent className="border-border bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar função</DialogTitle>
            <DialogDescription>
              {editMember ? `Altere o nível de acesso de ${editMember.name}.` : ""}
            </DialogDescription>
          </DialogHeader>
          <label className="block space-y-1.5 py-1">
            <span className="text-xs font-medium text-foreground">Função</span>
            <select
              value={editRole}
              onChange={(event) => setEditRole(event.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary/60"
            >
              {TEAM_ROLE_OPTIONS.filter((role) => role !== "Owner / Fundador").map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setEditMember(null)}
              className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={submitEdit}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Salvar função
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(removeTarget)}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
      >
        <AlertDialogContent className="border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {removeTarget?.status === "convite_pendente"
                ? "Cancelar convite?"
                : "Remover membro?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {removeTarget
                ? `${removeTarget.name} será removido da lista de equipe do modo TESTE. Esta ação não pode ser desfeita.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemove}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirmar remoção
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
