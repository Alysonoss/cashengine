import { createFileRoute } from "@tanstack/react-router";
import { FinanceReportPage } from "@/components/app/reports/FinanceReportPage";

export const Route = createFileRoute("/app/relatorios/financeiro")({
  head: () => ({
    meta: [
      { title: "Relatório financeiro · Cash Engine PRO" },
      { name: "description", content: "Receita, taxas e liquidações consolidadas." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FinanceReportPage,
});
