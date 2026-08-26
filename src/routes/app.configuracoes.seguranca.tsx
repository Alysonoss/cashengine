import { createFileRoute } from "@tanstack/react-router";
import { SecurityPage } from "@/components/app/settings/SecurityPage";

export const Route = createFileRoute("/app/configuracoes/seguranca")({
  head: () => ({
    meta: [
      { title: "Segurança · Cash Engine PRO" },
      { name: "description", content: "Autenticação em duas etapas e sessões." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SecurityPage,
});
