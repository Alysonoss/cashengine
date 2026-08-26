import { createFileRoute } from "@tanstack/react-router";
import { ClientesPage } from "@/components/app/vendas/ClientesPage";

export const Route = createFileRoute("/app/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes · Cash Engine PRO" },
      { name: "description", content: "Base de clientes, histórico de compras e contatos." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ClientesPage,
});
