import { createFileRoute } from "@tanstack/react-router";
import { PermissionsPage } from "@/components/app/settings/PermissionsPage";

export const Route = createFileRoute("/app/configuracoes/permissoes")({
  head: () => ({
    meta: [
      { title: "Permissões · Cash Engine PRO" },
      { name: "description", content: "Papéis e níveis de acesso." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PermissionsPage,
});
