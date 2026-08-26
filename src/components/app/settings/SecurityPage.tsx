import { useState } from "react";
import { KeyRound, Smartphone, Monitor, ShieldAlert, Lock, LogOut, Check, X } from "lucide-react";
import { securityEvents, type SecurityEvent } from "@/lib/mock/data";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const typeLabels: Record<SecurityEvent["type"], string> = {
  login: "Login",
  senha_alterada: "Senha alterada",
  chave_rotacionada: "Chave rotacionada",
  saque_aprovado: "Saque aprovado",
  permissao_alterada: "Permissão alterada",
  "2fa": "2FA",
};

const sessions = [
  {
    id: "cur",
    device: "Chrome · Windows 11",
    location: "São Paulo, SP",
    ip: "189.42.18.77",
    lastActivity: "2026-08-14T18:30:00Z",
    current: true,
  },
  {
    id: "s2",
    device: "Safari · macOS 14",
    location: "São Paulo, SP",
    ip: "189.42.18.80",
    lastActivity: "2026-08-14T09:12:00Z",
    current: false,
  },
  {
    id: "s3",
    device: "Chrome · Android 14",
    location: "Rio de Janeiro, RJ",
    ip: "201.12.44.102",
    lastActivity: "2026-08-13T20:55:00Z",
    current: false,
  },
];

export function SecurityPage() {
  const [twoFa, setTwoFa] = useState(false);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Segurança</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Senha, autenticação de dois fatores, sessões e histórico.
          </p>
        </div>
      </header>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <KeyRound className="h-4 w-4" />
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold tracking-tight text-foreground">Senha</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Última alteração há 42 dias
                  </p>
                </div>
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted">
                  <Lock className="h-3.5 w-3.5" />
                  Alterar senha
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700">
              <Smartphone className="h-4 w-4" />
            </span>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold tracking-tight text-foreground">
                    Autenticação de dois fatores (2FA)
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Use apps como Authy, Google Authenticator ou 1Password.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-medium",
                      twoFa
                        ? "bg-emerald-500/10 text-emerald-700"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {twoFa ? "Ativado" : "Desativado"}
                  </span>
                  <button
                    onClick={() => setTwoFa((v) => !v)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted"
                  >
                    {twoFa ? "Desativar 2FA" : "Ativar 2FA"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-5 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <header className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-muted-foreground" />
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                Sessões ativas
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Dispositivos conectados à sua conta agora
              </p>
            </div>
          </div>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="px-5 py-3 font-medium">Dispositivo</th>
                <th className="px-5 py-3 font-medium">Localização</th>
                <th className="px-5 py-3 font-medium">IP</th>
                <th className="px-5 py-3 font-medium">Última atividade</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sessions.map((s) => (
                <tr key={s.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-5 py-3.5 text-foreground">{s.device}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{s.location}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{s.ip}</td>
                  <td className="px-5 py-3.5 tabular-nums text-muted-foreground">
                    {formatDateTime(s.lastActivity)}
                  </td>
                  <td className="px-5 py-3.5">
                    {s.current ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Sessão atual
                      </span>
                    ) : (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        Ativa
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {!s.current ? (
                      <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-500/5">
                        <LogOut className="h-3.5 w-3.5" />
                        Encerrar sessão
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-5 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <header className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                Eventos de segurança recentes
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Histórico de ações relevantes na sua conta
              </p>
            </div>
          </div>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="px-5 py-3 font-medium">Tipo</th>
                <th className="px-5 py-3 font-medium">Ator</th>
                <th className="px-5 py-3 font-medium">IP</th>
                <th className="px-5 py-3 font-medium">Dispositivo</th>
                <th className="px-5 py-3 font-medium">Localização</th>
                <th className="px-5 py-3 font-medium">Data</th>
                <th className="px-5 py-3 font-medium">Resultado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {securityEvents.slice(0, 12).map((e) => (
                <tr key={e.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-5 py-3.5">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {typeLabels[e.type]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-foreground">{e.actor}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{e.ip}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{e.device}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{e.location}</td>
                  <td className="px-5 py-3.5 tabular-nums text-xs text-muted-foreground">
                    {formatDateTime(e.at)}
                  </td>
                  <td className="px-5 py-3.5">
                    {e.result === "sucesso" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                        <Check className="h-3 w-3" strokeWidth={3} />
                        Sucesso
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-700">
                        <X className="h-3 w-3" strokeWidth={3} />
                        Falha
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
