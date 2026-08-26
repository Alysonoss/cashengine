import { createFileRoute } from "@tanstack/react-router";
import { SalesReportPage } from "@/components/app/reports/SalesReportPage";

export const Route = createFileRoute("/app/relatorios/vendas")({
  head: () => ({
    meta: [
      { title: "Relatório de vendas · Cash Engine PRO" },
      { name: "description", content: "Desempenho de vendas por período, produto e canal." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SalesReportPage,
});
