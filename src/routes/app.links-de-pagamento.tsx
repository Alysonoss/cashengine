import { createFileRoute } from "@tanstack/react-router";
import { PaymentLinksPage } from "@/components/app/vendas/PaymentLinksPage";

export const Route = createFileRoute("/app/links-de-pagamento")({
  head: () => ({
    meta: [
      { title: "Links de pagamento · Cash Engine PRO" },
      { name: "description", content: "Links avulsos para cobrar em qualquer canal." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PaymentLinksPage,
});
