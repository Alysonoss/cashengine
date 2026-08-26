import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy, KeyRound, QrCode, ShieldCheck, Webhook } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { DEFAULT_PIX_KEY, maskPixKey } from "@/lib/pix";

const createPixCurl = `curl -X POST "https://seu-dominio.com/api/pix" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 75.00,
    "reference": "PEDIDO123"
  }'`;

const pixResponse = `{
  "id": "pix_PEDIDO123",
  "status": "pending",
  "amount": 75,
  "reference": "PEDIDO123",
  "pixKey": "${maskPixKey(DEFAULT_PIX_KEY)}",
  "pixCopyPaste": "00020126...",
  "qrSvg": "<svg ...>...</svg>"
}`;

const webhookCurl = `curl -X POST "https://seu-dominio.com/api/pix/webhook" \\
  -H "Content-Type: application/json" \\
  -H "x-cash-engine-secret: SEU_SEGREDO_INTERNO" \\
  -d '{
    "paymentId": "pay_123",
    "externalId": "PEDIDO123",
    "amount": 75.00,
    "status": "paid"
  }'`;

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          toast.success(`${label} copiado`);
        } catch {
          toast.error("Não foi possível acessar a área de transferência.");
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition hover:bg-muted"
      aria-label={`Copiar ${label}`}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-600" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

export function ApiPage() {
  const [sample, setSample] = useState<"create" | "response" | "webhook">("create");
  const samples = {
    create: createPixCurl,
    response: pixResponse,
    webhook: webhookCurl,
  };

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <QrCode className="h-3.5 w-3.5" />
          Pix TESTE
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">API Pix</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          O projeto já expõe um gerador de BR Code Pix e uma ponte de webhook. A confirmação
          bancária automática entra depois, quando um banco/PSP ou adaptador confiável avisar que o
          pagamento foi liquidado.
        </p>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-4">
          <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Chave Pix configurada</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {maskPixKey(DEFAULT_PIX_KEY)}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                ativa no gerador
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Configure a chave definitiva em{" "}
              <code className="rounded bg-muted px-1 py-0.5">VITE_PIX_KEY</code>. O QR direciona o
              Pix para essa chave, mas a chave sozinha não confirma liquidação no sistema.
            </p>
          </section>

          <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <QrCode className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">POST /api/pix</p>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Recebe valor e referência, devolvendo Pix Copia e Cola e SVG do QR Code.
            </p>
          </section>

          <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Webhook className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">POST /api/pix/webhook</p>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Ponte server-side para transformar uma confirmação confiável em evento{" "}
              <code>payment.paid</code> e encaminhá-lo ao seu site com assinatura HMAC.
            </p>
            <Link
              to="/app/webhooks"
              className="mt-3 inline-flex text-xs font-medium text-primary hover:underline"
            >
              Ver eventos de teste
            </Link>
          </section>

          <section className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <div className="flex gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Não confie em um botão do navegador para marcar venda como paga em produção. O
                status final precisa vir do banco/PSP ou de outra fonte de confirmação autenticada.
              </p>
            </div>
          </section>
        </div>

        <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
            <div className="flex gap-1 rounded-lg bg-muted/60 p-1">
              {(
                [
                  ["create", "Criar Pix"],
                  ["response", "Resposta"],
                  ["webhook", "Webhook"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSample(key)}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                    sample === key
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <CopyButton value={samples[sample]} label="exemplo" />
          </header>
          <pre className="min-h-[420px] overflow-x-auto p-4 font-mono text-[11px] leading-relaxed text-muted-foreground">
            {samples[sample]}
          </pre>
        </section>
      </div>
    </div>
  );
}
