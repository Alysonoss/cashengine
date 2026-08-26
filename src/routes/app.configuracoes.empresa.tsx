import { createFileRoute } from "@tanstack/react-router";
import { CompanyPage } from "@/components/app/settings/CompanyPage";

export const Route = createFileRoute("/app/configuracoes/empresa")({
  head: () => ({
    meta: [
      { title: "Empresa · Cash Engine PRO" },
      { name: "description", content: "Dados cadastrais e documentos da empresa." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CompanyPage,
});
