import { createFileRoute } from "@tanstack/react-router";
import { FeesPage } from "@/components/app/finance/FeesPage";

export const Route = createFileRoute("/app/taxas")({
  head: () => ({
    meta: [
      { title: "Taxas · Cash Engine PRO" },
      { name: "description", content: "Taxas por método de pagamento e antecipação." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <FeesPage />,
});
