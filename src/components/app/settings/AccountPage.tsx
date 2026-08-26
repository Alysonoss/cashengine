import { useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

export function AccountPage() {
  const [form, setForm] = useState({
    name: "Kelvin",
    email: "kelvin@cashengine.pro",
    phone: "(11) 90000-0000",
    language: "pt-BR",
    timezone: "America/Sao_Paulo",
    currency: "BRL",
  });
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updatePwd<K extends keyof typeof password>(key: K, value: (typeof password)[K]) {
    setPassword((p) => ({ ...p, [key]: value }));
  }

  function save() {
    toast.success("Alterações salvas", {
      description: "Seus dados pessoais foram atualizados.",
    });
  }

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Conta</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Seus dados pessoais e preferências de notificação.
          </p>
        </div>
      </header>

      <div className="mt-6 space-y-5">
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-semibold text-primary-foreground shadow-sm">
              K
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{form.name}</p>
              <p className="text-xs text-muted-foreground">{form.email}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Nome completo</label>
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">E-mail</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Telefone</label>
              <input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Idioma</label>
              <select
                value={form.language}
                onChange={(e) => update("language", e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary/60"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Timezone</label>
              <select
                value={form.timezone}
                onChange={(e) => update("timezone", e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary/60"
              >
                <option value="America/Sao_Paulo">America/Sao_Paulo (GMT-3)</option>
                <option value="America/New_York">America/New_York (GMT-5)</option>
                <option value="Europe/Lisbon">Europe/Lisbon (GMT+0)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Moeda</label>
              <select
                value={form.currency}
                onChange={(e) => update("currency", e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary/60"
              >
                <option value="BRL">BRL · Real brasileiro</option>
                <option value="USD">USD · Dólar</option>
                <option value="EUR">EUR · Euro</option>
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">Alterar senha</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Use uma senha forte com letras, números e símbolos.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Senha atual</label>
              <input
                type="password"
                value={password.current}
                onChange={(e) => updatePwd("current", e.target.value)}
                placeholder="••••••••"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Nova senha</label>
              <input
                type="password"
                value={password.new}
                onChange={(e) => updatePwd("new", e.target.value)}
                placeholder="••••••••"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Confirmar nova senha</label>
              <input
                type="password"
                value={password.confirm}
                onChange={(e) => updatePwd("confirm", e.target.value)}
                placeholder="••••••••"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            onClick={save}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            <Save className="h-4 w-4" />
            Salvar alterações
          </button>
        </div>
      </div>
    </div>
  );
}
