import { createFileRoute } from "@tanstack/react-router";
import { VendasPage } from "@/components/app/vendas/VendasPage";

export const Route = createFileRoute("/app/vendas")({
  head: () => ({
    meta: [
      { title: "Vendas · Cash Engine PRO" },
      { name: "description", content: "Acompanhe pedidos, receita e status de cada venda." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VendasPage,
});
