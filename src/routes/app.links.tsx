import { createFileRoute } from "@tanstack/react-router";
import { AffiliateLinksPage } from "@/components/app/affiliates/AffiliateLinksPage";

export const Route = createFileRoute("/app/links")({
  head: () => ({
    meta: [
      { title: "Links · Cash Engine PRO" },
      { name: "description", content: "Links de afiliação e rastreio de origem." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AffiliateLinksPage,
});
