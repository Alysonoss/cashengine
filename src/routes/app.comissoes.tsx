import { createFileRoute } from "@tanstack/react-router";
import { CommissionsPage } from "@/components/app/affiliates/CommissionsPage";

export const Route = createFileRoute("/app/comissoes")({
  head: () => ({
    meta: [
      { title: "Comissões · Cash Engine PRO" },
      { name: "description", content: "Comissões geradas, pagas e a pagar." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CommissionsPage,
});
