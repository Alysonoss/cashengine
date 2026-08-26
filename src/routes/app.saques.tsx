import { createFileRoute } from "@tanstack/react-router";
import { WithdrawsPage } from "@/components/app/finance/WithdrawsPage";

export const Route = createFileRoute("/app/saques")({
  head: () => ({
    meta: [
      { title: "Saques · Cash Engine PRO" },
      { name: "description", content: "Solicitações de saque e status de liquidação." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <WithdrawsPage />,
});
