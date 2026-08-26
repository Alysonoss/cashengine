import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { TrustBar } from "@/components/landing/TrustBar";
import { ProblemSolution } from "@/components/landing/ProblemSolution";
import { Features } from "@/components/landing/Features";
import { CheckoutSection } from "@/components/landing/CheckoutSection";
import { AffiliatesSection } from "@/components/landing/AffiliatesSection";
import { Marketplace } from "@/components/landing/Marketplace";
import { FinanceSection } from "@/components/landing/FinanceSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Infrastructure } from "@/components/landing/Infrastructure";
import { Comparison, PricingPlaceholder } from "@/components/landing/Comparison";
import { FinalCta } from "@/components/landing/FinalCta";
import { Faq } from "@/components/landing/Faq";
import { Footer } from "@/components/landing/Footer";

const title = "Cash Engine PRO — Infraestrutura de pagamentos para negócios digitais";
const description =
  "Pagamentos, checkout, vendas, afiliados e gestão financeira em uma única infraestrutura criada para negócios que vendem na internet.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <ProblemSolution />
        <Features />
        <CheckoutSection />
        <AffiliatesSection />
        <Marketplace />
        <FinanceSection />
        <HowItWorks />
        <Infrastructure />
        <Comparison />
        <PricingPlaceholder />
        <FinalCta />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
