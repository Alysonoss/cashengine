import { createFileRoute } from "@tanstack/react-router";
import { MarketplacePage } from "@/components/app/affiliates/MarketplacePage";

export const Route = createFileRoute("/app/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace · Cash Engine PRO" },
      { name: "description", content: "Vitrine de produtos disponíveis para afiliação." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MarketplacePage,
});
