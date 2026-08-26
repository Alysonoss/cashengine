import { Download } from "lucide-react";
import { statement } from "@/lib/mock/finance";
import { formatBRL } from "@/lib/format";
import { StatementTable } from "@/components/app/finance/StatementTable";
import { useFakeLoading } from "@/components/app/Skeletons";
import { BalanceStatementTabs } from "@/components/app/finance/BalanceStatementTabs";

export function StatementPage() {
  const loading = useFakeLoading();

  const credits = statement.filter((r) => r.type === "credito").reduce((a, r) => a + r.amount, 0);
  const debits = statement.filter((r) => r.type === "debito").reduce((a, r) => a + r.amount, 0);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <BalanceStatementTabs />
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Extrato</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatBRL(credits)} em entradas · {formatBRL(debits)} em saídas e taxas
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted">
          <Download className="h-4 w-4" />
          Exportar CSV
        </button>
      </header>

      <div className="mt-6">
        <StatementTable loading={loading} pageSize={14} />
      </div>
    </div>
  );
}
