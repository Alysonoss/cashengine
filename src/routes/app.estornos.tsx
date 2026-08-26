import { createFileRoute } from "@tanstack/react-router";
import { RefundsPage } from "@/components/app/finance/RefundsPage";

export const Route = createFileRoute("/app/estornos")({
  head: () => ({
    meta: [
      { title: "Estornos · Cash Engine PRO" },
      { name: "description", content: "Garantia, desistência e reembolso do cliente." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <RefundsPage />,
});
