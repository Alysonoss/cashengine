import { createFileRoute } from "@tanstack/react-router";
import { SplitEnginePage } from "@/components/app/split/SplitEnginePage";

export const Route = createFileRoute("/app/split")({
  head: () => ({
    meta: [
      { title: "Split Engine · Cash Engine PRO" },
      {
        name: "description",
        content:
          "Visualize a distribuição automática de cada venda entre produtor, afiliado e plataforma.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SplitEnginePage,
});
