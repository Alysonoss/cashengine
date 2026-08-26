import { createFileRoute } from "@tanstack/react-router";
import { LogsPage } from "@/components/app/developers/LogsPage";

export const Route = createFileRoute("/app/logs")({
  head: () => ({
    meta: [
      { title: "Logs · Cash Engine PRO" },
      {
        name: "description",
        content: "Auditoria de ações: quem, o quê, quando e com qual resultado.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LogsPage,
});
