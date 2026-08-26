import { createFileRoute } from "@tanstack/react-router";
import { ChargebacksPage } from "@/components/app/finance/ChargebacksPage";

export const Route = createFileRoute("/app/chargebacks")({
  head: () => ({
    meta: [
      { title: "Chargebacks · Cash Engine PRO" },
      { name: "description", content: "Contestações do emissor, defesa e recuperação de receita." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <ChargebacksPage />,
});
