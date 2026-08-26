import { createFileRoute } from "@tanstack/react-router";
import { ProductReportPage } from "@/components/app/reports/ProductReportPage";

export const Route = createFileRoute("/app/relatorios/produtos")({
  head: () => ({
    meta: [
      { title: "Relatório de produtos · Cash Engine PRO" },
      { name: "description", content: "Produtos mais vendidos e ticket médio." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProductReportPage,
});
