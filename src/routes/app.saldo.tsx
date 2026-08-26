import { createFileRoute } from "@tanstack/react-router";
import { BalancePage } from "@/components/app/finance/BalancePage";

export const Route = createFileRoute("/app/saldo")({
  head: () => ({
    meta: [
      { title: "Saldo · Cash Engine PRO" },
      {
        name: "description",
        content: "Saldo disponível, pendente e reservado, com solicitação de saque.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BalancePage,
});
