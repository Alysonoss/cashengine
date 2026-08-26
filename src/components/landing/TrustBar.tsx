import { BarChart3, CreditCard, Landmark, ShoppingCart, Users } from "lucide-react";
import { Reveal } from "./primitives";

const items = [
  { label: "Pagamentos", icon: CreditCard },
  { label: "Checkout", icon: ShoppingCart },
  { label: "Afiliados", icon: Users },
  { label: "Financeiro", icon: Landmark },
  { label: "Analytics", icon: BarChart3 },
];

export function TrustBar() {
  return (
    <div className="border-y border-border bg-surface-strong/60 px-5 py-8 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 text-center">
        <Reveal>
          <p className="text-sm text-muted-foreground sm:text-base">
            Tudo o que sua operação precisa para vender, processar e acompanhar suas vendas.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="w-full">
          <ul className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {items.map(({ label, icon: Icon }) => (
              <li
                key={label}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface/50 px-3 py-3 text-sm text-muted-foreground"
              >
                <Icon className="h-4 w-4 shrink-0 text-primary-soft" />
                <span className="truncate">{label}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  );
}
