import { createFileRoute } from "@tanstack/react-router";
import { WebhooksPage } from "@/components/app/developers/WebhooksPage";

export const Route = createFileRoute("/app/webhooks")({
  head: () => ({
    meta: [
      { title: "Webhooks · Cash Engine PRO" },
      { name: "description", content: "Endpoints, eventos e tentativas de entrega." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <WebhooksPage />,
});
