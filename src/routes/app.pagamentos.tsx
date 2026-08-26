import { createFileRoute } from "@tanstack/react-router";
import { PixPaymentsPage } from "@/components/app/payments/PixPaymentsPage";

export const Route = createFileRoute("/app/pagamentos")({
  head: () => ({
    meta: [
      { title: "Pagamentos Pix · Cash Engine TESTE" },
      {
        name: "description",
        content: "Pagamentos Pix criados pelos links de checkout do ambiente TESTE.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PixPaymentsPage,
});
