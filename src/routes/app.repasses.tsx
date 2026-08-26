import { createFileRoute } from "@tanstack/react-router";
import { TransfersPage } from "@/components/app/finance/TransfersPage";

export const Route = createFileRoute("/app/repasses")({
  head: () => ({
    meta: [
      { title: "Repasses · Cash Engine PRO" },
      {
        name: "description",
        content: "Distribuição automática para afiliados, coprodutores e fornecedores.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <TransfersPage />,
});
