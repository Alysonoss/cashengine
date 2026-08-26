import { createFileRoute } from "@tanstack/react-router";
import { IntegrationsPage } from "@/components/app/settings/IntegrationsPage";

export const Route = createFileRoute("/app/configuracoes/integracoes")({
  head: () => ({
    meta: [
      { title: "Integrações · Cash Engine PRO" },
      { name: "description", content: "Conecte ferramentas externas à sua operação." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: IntegrationsPage,
});
