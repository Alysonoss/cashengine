import { createFileRoute } from "@tanstack/react-router";
import { StatementPage } from "@/components/app/finance/StatementPage";

export const Route = createFileRoute("/app/extrato")({
  head: () => ({
    meta: [
      { title: "Extrato · Cash Engine PRO" },
      {
        name: "description",
        content: "Entradas, saídas, taxas e saldo acumulado da sua carteira.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: StatementPage,
});
