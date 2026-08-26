import { createFileRoute } from "@tanstack/react-router";
import { CheckoutsPage } from "@/components/app/vendas/CheckoutsPage";

export const Route = createFileRoute("/app/checkouts")({
  head: () => ({
    meta: [
      { title: "Checkouts · Cash Engine PRO" },
      { name: "description", content: "Checkouts publicados, conversão e personalização." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutsPage,
});
