import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Edit3, Eye, EyeOff, Pause, Play, Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { webhookDeliveries, webhookEndpoints, type WebhookEndpoint } from "@/lib/mock/data";
import { formatDateTime, formatInt } from "@/lib/format";
import { cn } from "@/lib/utils";

type EndpointStatus = WebhookEndpoint["status"];

const endpointStatusStyles: Record<
  EndpointStatus,
  { label: string; className: string; dot: string }
> = {
  ativo: {
    label: "Ativo",
    className: "bg-success/12 text-success",
    dot: "bg-success",
  },
  com_erro: {
    label: "Com erro",
    className: "bg-destructive/12 text-destructive",
    dot: "bg-destructive",
  },
  pausado: {
    label: "Pausado",
    className: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
  },
};

function EndpointStatusBadge({ status }: { status: EndpointStatus }) {
  const s = endpointStatusStyles[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        s.className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

function EndpointCard({ endpoint }: { endpoint: WebhookEndpoint }) {
  const [revealed, setRevealed] = useState(false);
  const [paused, setPaused] = useState(endpoint.status === "pausado");

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <EndpointStatusBadge status={paused ? "pausado" : endpoint.status} />
            <span className="text-xs font-mono text-muted-foreground">{endpoint.id}</span>
          </div>
          <p className="mt-2 truncate font-mono text-sm text-foreground" title={endpoint.url}>
            {endpoint.url}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {endpoint.events.map((e) => (
          <span
            key={e}
            className="inline-flex items-center rounded-md border border-border bg-muted/50 px-2 py-1 font-mono text-[11px] text-muted-foreground"
          >
            {e}
          </span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs">
        <div>
          <p className="text-muted-foreground">Total entregas</p>
          <p className="mt-0.5 font-semibold tabular-nums text-foreground">
            {formatInt(endpoint.deliveries)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Último evento</p>
          <p className="mt-0.5 font-medium tabular-nums text-foreground">
            {endpoint.lastEvent ? formatDateTime(endpoint.lastEvent) : "—"}
          </p>
        </div>
      </div>

      {revealed && (
        <div className="mt-4 rounded-lg border border-border bg-muted/40 p-3">
          <p className="text-[11px] font-medium text-muted-foreground">Assinatura (segredo)</p>
          <code className="mt-1 block break-all font-mono text-xs text-foreground">
            {endpoint.secret}
          </code>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            setRevealed((v) => !v);
            if (!revealed) toast.success("Assinatura revelada");
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted"
        >
          {revealed ? (
            <>
              <EyeOff className="h-3.5 w-3.5" /> Ocultar assinatura
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5" /> Revelar assinatura
            </>
          )}
        </button>
        <button
          onClick={() => {
            setPaused((v) => !v);
            toast.success(paused ? "Endpoint reativado" : "Endpoint pausado");
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted"
        >
          {paused ? (
            <>
              <Play className="h-3.5 w-3.5" /> Reativar
            </>
          ) : (
            <>
              <Pause className="h-3.5 w-3.5" /> Pausar
            </>
          )}
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted">
          <Edit3 className="h-3.5 w-3.5" /> Editar
        </button>
      </div>
    </div>
  );
}

function DeliveryStatus({ status }: { status: number | null }) {
  if (status === null) {
    return (
      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
        —
      </span>
    );
  }
  if (status >= 200 && status < 300) {
    return (
      <span className="inline-flex items-center rounded-full bg-success/12 px-2 py-0.5 text-[11px] font-semibold text-success tabular-nums">
        {status}
      </span>
    );
  }
  if (status >= 400 && status < 500) {
    return (
      <span className="inline-flex items-center rounded-full bg-[oklch(0.78_0.15_80_/_18%)] px-2 py-0.5 text-[11px] font-semibold text-[oklch(0.52_0.13_75)] tabular-nums">
        {status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-destructive/12 px-2 py-0.5 text-[11px] font-semibold text-destructive tabular-nums">
      {status}
    </span>
  );
}

export function WebhooksPage() {
  const endpointById = Object.fromEntries(webhookEndpoints.map((e) => [e.id, e]));

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-4">
        <Link
          to="/app/api"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar para API
        </Link>
      </div>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Webhooks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Endpoints, eventos e tentativas de entrega.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Novo endpoint
        </button>
      </header>

      <section className="mt-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">Endpoints</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              URLs configuradas para receber eventos em tempo real
            </p>
          </div>
        </div>

        <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {webhookEndpoints.map((e) => (
            <EndpointCard key={e.id} endpoint={e} />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Entregas recentes
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Últimas tentativas de envio para os endpoints
            </p>
          </div>
        </div>

        <div className="mt-3 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  <th className="px-5 py-3 font-medium">ID do evento</th>
                  <th className="px-5 py-3 font-medium">Endpoint</th>
                  <th className="px-5 py-3 font-medium">Evento</th>
                  <th className="px-5 py-3 text-right font-medium">Tentativa</th>
                  <th className="px-5 py-3 text-right font-medium">HTTP status</th>
                  <th className="px-5 py-3 text-right font-medium">Duração</th>
                  <th className="px-5 py-3 text-right font-medium">Horário</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {webhookDeliveries.map((d) => {
                  const endpoint = endpointById[d.endpointId];
                  return (
                    <tr key={d.id} className="transition hover:bg-muted/60">
                      <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{d.id}</td>
                      <td className="px-5 py-3">
                        <span
                          className="max-w-[260px] truncate font-mono text-xs text-muted-foreground"
                          title={endpoint?.url}
                        >
                          {endpoint?.url ?? d.endpointId}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="rounded-md border border-border bg-muted/50 px-2 py-1 font-mono text-[11px] text-foreground">
                          {d.event}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                        #{d.attempt}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <DeliveryStatus status={d.status} />
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                        {d.durationMs} ms
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                        {formatDateTime(d.at)}
                      </td>
                    </tr>
                  );
                })}
                {webhookDeliveries.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-sm text-muted-foreground"
                    >
                      Nenhuma entrega registrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
