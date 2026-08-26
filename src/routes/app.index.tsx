import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/components/app/dashboard/DashboardPage";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Dashboard · Cash Engine PRO" },
      {
        name: "description",
        content: "Visão geral do volume processado, vendas e aprovação da sua operação.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});
