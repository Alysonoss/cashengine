import { createFileRoute } from "@tanstack/react-router";
import { AccountPage } from "@/components/app/settings/AccountPage";

export const Route = createFileRoute("/app/configuracoes/conta")({
  head: () => ({
    meta: [
      { title: "Conta · Cash Engine PRO" },
      { name: "description", content: "Dados pessoais, preferências e notificações." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});
