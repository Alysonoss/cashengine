import { createFileRoute } from "@tanstack/react-router";
import { TeamPage } from "@/components/app/settings/TeamPage";

export const Route = createFileRoute("/app/configuracoes/equipe")({
  head: () => ({
    meta: [
      { title: "Equipe · Cash Engine PRO" },
      { name: "description", content: "Membros da equipe e convites." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TeamPage,
});
