import { useState } from "react";
import { Building2, Save } from "lucide-react";
import { toast } from "sonner";

export function CompanyPage() {
  const [form, setForm] = useState({
    razaoSocial: "Cash Engine PRO Operação Digital de Tecnologia Ltda.",
    nomeFantasia: "Cash Engine PRO",
    cnpj: "41.882.310/0001-09",
    inscricaoEstadual: "123.456.789.012",
    emailFiscal: "fiscal@cashengine.pro",
    telefone: "(11) 3000-0000",
    segmento: "Tecnologia",
    website: "https://cashengine.pro",
    rua: "Av. Paulista",
    numero: "1000",
    complemento: "Conjunto 1801",
    bairro: "Bela Vista",
    cidadeUF: "São Paulo/SP",
    cep: "01310-100",
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function save() {
    toast.success("Dados da empresa salvos", {
      description: "As informações comerciais foram atualizadas.",
    });
  }

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Empresa</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Dados da empresa, contratos e configurações comerciais.
          </p>
        </div>
      </header>

      <div className="mt-6 space-y-5">
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                Identificação da empresa
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Dados cadastrais usados em faturamento e notas fiscais.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-foreground">Razão social</label>
              <input
                value={form.razaoSocial}
                onChange={(e) => update("razaoSocial", e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Nome fantasia</label>
              <input
                value={form.nomeFantasia}
                onChange={(e) => update("nomeFantasia", e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">CNPJ</label>
              <input
                value={form.cnpj}
                onChange={(e) => update("cnpj", e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Inscrição estadual</label>
              <input
                value={form.inscricaoEstadual}
                onChange={(e) => update("inscricaoEstadual", e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">E-mail fiscal</label>
              <input
                type="email"
                value={form.emailFiscal}
                onChange={(e) => update("emailFiscal", e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Telefone</label>
              <input
                value={form.telefone}
                onChange={(e) => update("telefone", e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Segmento</label>
              <select
                value={form.segmento}
                onChange={(e) => update("segmento", e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary/60"
              >
                <option>Educação</option>
                <option>Digital</option>
                <option>Serviços</option>
                <option>Produtos físicos</option>
                <option>Tecnologia</option>
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-foreground">Website</label>
              <input
                value={form.website}
                onChange={(e) => update("website", e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
              />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">Endereço</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Endereço comercial e de cobrança.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-1">
              <label className="text-xs font-medium text-foreground">Rua</label>
              <input
                value={form.rua}
                onChange={(e) => update("rua", e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Número</label>
                <input
                  value={form.numero}
                  onChange={(e) => update("numero", e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Complemento</label>
                <input
                  value={form.complemento}
                  onChange={(e) => update("complemento", e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Bairro</label>
              <input
                value={form.bairro}
                onChange={(e) => update("bairro", e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Cidade/UF</label>
                <input
                  value={form.cidadeUF}
                  onChange={(e) => update("cidadeUF", e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">CEP</label>
                <input
                  value={form.cep}
                  onChange={(e) => update("cep", e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            onClick={save}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            <Save className="h-4 w-4" />
            Salvar dados da empresa
          </button>
        </div>
      </div>
    </div>
  );
}
