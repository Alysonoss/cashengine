import { createFileRoute } from "@tanstack/react-router";
import { ApiPage } from "@/components/app/developers/ApiPage";

export const Route = createFileRoute("/app/api")({
  head: () => ({
    meta: [
      { title: "API · Cash Engine PRO" },
      {
        name: "description",
        content: "Chaves de API por ambiente, rotação e exemplos de integração.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ApiPage,
});
