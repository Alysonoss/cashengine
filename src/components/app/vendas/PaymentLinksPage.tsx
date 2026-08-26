import { useMemo, useState } from "react";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Link2,
  PauseCircle,
  PlayCircle,
  Plus,
  Search,
  Send,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { products } from "@/lib/mock/data";
import { formatBRL, formatInt, formatPct } from "@/lib/format";
import {
  createDemoPaymentLink,
  paymentLinkHref,
  toggleDemoPaymentLink,
  useDemoCommerce,
  type DemoPaymentLink,
} from "@/lib/demo-commerce";
import { useTempAuth } from "@/lib/auth-temp";
import { cn } from "@/lib/utils";

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

async function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

export function PaymentLinksPage() {
  const commerce = useDemoCommerce();
  const { user } = useTempAuth();
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [createdLink, setCreatedLink] = useState<DemoPaymentLink | null>(null);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? "custom");
  const [product, setProduct] = useState(products[0]?.name ?? "Produto TESTE");
  const [description, setDescription] = useState("Pagamento Pix pelo Cash Engine TESTE.");
  const [amount, setAmount] = useState(String(products[0]?.price ?? 49.9));
  const [seller, setSeller] = useState(user?.name || "Produtor TESTE");
  const [webhookUrl, setWebhookUrl] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return commerce.links
      .map((link) => {
        const related = commerce.payments.filter((payment) => payment.shortCode === link.shortCode);
        const paid = related.filter((payment) => payment.status === "pago");
        const sales = paid.length;
        const revenue = paid.reduce((total, payment) => total + payment.amount, 0);
        const conversion = link.views > 0 ? (sales / link.views) * 100 : 0;
        return { ...link, sales, revenue, conversion };
      })
      .filter(
        (link) =>
          !q ||
          link.shortCode.toLowerCase().includes(q) ||
          link.product.toLowerCase().includes(q) ||
          link.id.toLowerCase().includes(q),
      );
  }, [commerce.links, commerce.payments, query]);

  function openCreate() {
    const first = products.find((item) => item.status === "ativo") ?? products[0];
    setSelectedProductId(first?.id ?? "custom");
    setProduct(first?.name ?? "Produto TESTE");
    setAmount(String(first?.price ?? 49.9));
    setDescription("Pagamento Pix pelo Cash Engine TESTE.");
    setSeller(user?.name || "Produtor TESTE");
    setWebhookUrl("");
    setCreateOpen(true);
  }

  function selectProduct(id: string) {
    setSelectedProductId(id);
    if (id === "custom") return;
    const selected = products.find((item) => item.id === id);
    if (!selected) return;
    setProduct(selected.name);
    setAmount(String(selected.price));
  }

  function handleCreate() {
    const parsedAmount = Number(String(amount).replace(",", "."));
    if (!product.trim()) {
      toast.error("Informe o nome do produto.");
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast.error("Informe um valor maior que zero.");
      return;
    }

    const link = createDemoPaymentLink({
      product,
      description,
      amount: parsedAmount,
      seller,
      webhookUrl,
    });
    setCreatedLink(link);
    setCreateOpen(false);
    toast.success("Link Pix criado.");
  }

  async function handleCopy(link: DemoPaymentLink) {
    const href = paymentLinkHref(link.token);
    await copyToClipboard(href);
    toast.success("Link copiado para a área de transferência.");
  }

  async function handleShare(link: DemoPaymentLink) {
    const href = paymentLinkHref(link.token);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${link.product} | TESTE`,
          text: `Pagamento de ${formatBRL(link.amount)} via Pix`,
          url: href,
        });
        return;
      } catch {
        // O usuário pode apenas ter fechado o compartilhamento.
      }
    }
    await copyToClipboard(href);
    toast.success("Link copiado. Agora é só enviar onde quiser.");
  }

  function handleExport(link: DemoPaymentLink) {
    const href = paymentLinkHref(link.token);
    downloadText(
      `${link.shortCode}.txt`,
      [`Produto: ${link.product}`, `Valor: ${formatBRL(link.amount)}`, `Link: ${href}`].join("\n"),
    );
    toast.success("Link exportado em arquivo .txt.");
  }

  const createdHref = createdLink ? paymentLinkHref(createdLink.token) : "";

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Links de pagamento Pix
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Crie um checkout para cada produto, copie o link e compartilhe com seus clientes.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Criar link Pix
        </button>
      </header>

      {createdLink && (
        <section className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-4 w-4" />
                </span>
                Link pronto para vender
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {createdLink.product} · {formatBRL(createdLink.amount)}
              </p>
              <div className="mt-3 flex min-w-0 items-center gap-2 rounded-lg border border-border bg-background p-2">
                <code className="min-w-0 flex-1 truncate text-xs text-foreground">
                  {createdHref}
                </code>
                <button
                  type="button"
                  onClick={() => handleCopy(createdLink)}
                  className="shrink-0 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Copiar link"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={createdHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                <ExternalLink className="h-4 w-4" />
                Abrir checkout
              </a>
              <button
                type="button"
                onClick={() => handleShare(createdLink)}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
                Compartilhar
              </button>
            </div>
          </div>
        </section>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por código ou produto"
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
          />
        </div>
        <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
          {formatInt(commerce.links.length)} links criados
        </div>
      </div>

      <section className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <Link2 className="h-5 w-5" />
            </span>
            <h2 className="mt-4 text-sm font-semibold text-foreground">Nenhum link encontrado</h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Crie seu primeiro link Pix para começar a compartilhar o checkout do produto.
            </p>
            <button
              type="button"
              onClick={openCreate}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Criar link Pix
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1120px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Link</th>
                  <th className="px-5 py-3 font-medium">Produto</th>
                  <th className="px-5 py-3 text-right font-medium">Valor</th>
                  <th className="px-5 py-3 text-right font-medium">Visitas</th>
                  <th className="px-5 py-3 text-right font-medium">Vendas</th>
                  <th className="px-5 py-3 text-right font-medium">Conversão</th>
                  <th className="px-5 py-3 text-right font-medium">Receita</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((link) => {
                  const href = paymentLinkHref(link.token);
                  return (
                    <tr key={link.id} className="transition-colors hover:bg-muted/50">
                      <td className="px-5 py-3.5">
                        <p className="font-mono text-xs font-medium text-primary">
                          {link.shortCode}
                        </p>
                        <p className="mt-0.5 max-w-[180px] truncate text-xs text-muted-foreground">
                          {href}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-foreground">{link.product}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{link.seller}</p>
                      </td>
                      <td className="px-5 py-3.5 text-right tabular-nums text-foreground">
                        {formatBRL(link.amount)}
                      </td>
                      <td className="px-5 py-3.5 text-right tabular-nums text-muted-foreground">
                        {formatInt(link.views)}
                      </td>
                      <td className="px-5 py-3.5 text-right tabular-nums text-muted-foreground">
                        {formatInt(link.sales)}
                      </td>
                      <td className="px-5 py-3.5 text-right tabular-nums text-muted-foreground">
                        {formatPct(link.conversion)}
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-foreground">
                        {formatBRL(link.revenue)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                            link.status === "ativo"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                          )}
                        >
                          {link.status === "ativo" ? "Ativo" : "Pausado"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleCopy(link)}
                            title="Copiar link"
                            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleShare(link)}
                            title="Compartilhar"
                            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                          <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            title="Abrir checkout"
                            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleExport(link)}
                            title="Exportar link"
                            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              toggleDemoPaymentLink(link.id);
                              toast.success(
                                link.status === "ativo" ? "Link pausado." : "Link ativado.",
                              );
                            }}
                            title={link.status === "ativo" ? "Pausar" : "Ativar"}
                            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                          >
                            {link.status === "ativo" ? (
                              <PauseCircle className="h-4 w-4" />
                            ) : (
                              <PlayCircle className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="mt-3 text-xs text-muted-foreground">
        Criado em modo TESTE. Um link copiado em localhost só funciona no seu computador ou rede
        local. Quando o sistema estiver publicado, o mesmo botão copia automaticamente o endereço do
        domínio público.
      </p>

      {createOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => setCreateOpen(false)}
            className="absolute inset-0 bg-foreground/45 backdrop-blur-sm"
          />
          <section className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-start justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Criar link Pix</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  O link abre o checkout TESTE e gera o QR Code Pix para o valor informado.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[70vh] space-y-4 overflow-y-auto p-5">
              <label className="block">
                <span className="text-xs font-medium text-muted-foreground">Produto existente</span>
                <select
                  value={selectedProductId}
                  onChange={(event) => selectProduct(event.target.value)}
                  className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary/60"
                >
                  {products
                    .filter((item) => item.status !== "rascunho")
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} · {formatBRL(item.price)}
                      </option>
                    ))}
                  <option value="custom">Outro produto</option>
                </select>
              </label>

              <div className="grid gap-4 sm:grid-cols-[1fr_150px]">
                <label className="block">
                  <span className="text-xs font-medium text-muted-foreground">Nome do produto</span>
                  <input
                    value={product}
                    onChange={(event) => {
                      setProduct(event.target.value);
                      setSelectedProductId("custom");
                    }}
                    className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary/60"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-muted-foreground">Valor</span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary/60"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-medium text-muted-foreground">Descrição</span>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={3}
                  className="mt-1.5 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60"
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium text-muted-foreground">Produtor</span>
                <input
                  value={seller}
                  onChange={(event) => setSeller(event.target.value)}
                  className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary/60"
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium text-muted-foreground">
                  Webhook do produto <span className="font-normal">(opcional no teste)</span>
                </span>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(event) => setWebhookUrl(event.target.value)}
                  placeholder="https://seusite.com/webhook/cash-engine"
                  className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/60"
                />
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCreate}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <Link2 className="h-4 w-4" />
                Gerar link
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
