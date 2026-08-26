import { createFileRoute } from "@tanstack/react-router";
import { AffiliatesPage } from "@/components/app/affiliates/AffiliatesPage";

export const Route = createFileRoute("/app/afiliados")({
  head: () => ({
    meta: [
      { title: "Afiliados · Cash Engine PRO" },
      { name: "description", content: "Gestão da rede de afiliados e aprovações." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AffiliatesPage,
});
