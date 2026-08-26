import { createFileRoute } from "@tanstack/react-router";
import { ProductsPage } from "@/components/app/products/ProductsPage";

export const Route = createFileRoute("/app/produtos")({
  head: () => ({
    meta: [
      { title: "Produtos · Cash Engine PRO" },
      {
        name: "description",
        content: "Catálogo de produtos, preços, comissões e checkout builder.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProductsPage,
});
