function compactNumber(value: number) {
  const abs = Math.abs(value);
  const fmt = (v: number, suffix: string) => {
    const rounded = Math.round(v * 10) / 10;
    const text = rounded.toLocaleString("pt-BR", {
      minimumFractionDigits: rounded % 1 === 0 ? 0 : 1,
      maximumFractionDigits: 1,
    });
    return `${text}${suffix}`;
  };
  if (abs >= 1_000_000_000) return fmt(value / 1_000_000_000, " bi");
  if (abs >= 1_000_000) return fmt(value / 1_000_000, " mi");
  if (abs >= 1_000) return fmt(value / 1_000, " mil");
  return value.toLocaleString("pt-BR", { maximumFractionDigits: 0 });
}

export function formatBRL(value: number, opts?: { compact?: boolean }) {
  if (opts?.compact) {
    return `R$ ${compactNumber(value)}`;
  }

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatInt(value: number) {
  return value.toLocaleString("pt-BR", { maximumFractionDigits: 0 });
}

export function formatPct(value: number, digits = 1) {
  return `${value.toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}

export function formatDelta(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${Math.abs(value).toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
}
