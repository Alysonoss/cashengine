import { createFileRoute } from "@tanstack/react-router";
import { AffiliateReportPage } from "@/components/app/reports/AffiliateReportPage";

export const Route = createFileRoute("/app/relatorios/afiliados")({
  head: () => ({
    meta: [
      { title: "Relatório de afiliados · Cash Engine PRO" },
      { name: "description", content: "Ranking de afiliados e comissões geradas." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AffiliateReportPage,
});
