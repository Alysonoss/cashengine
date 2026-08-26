import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Copy, CreditCard, LockKeyhole, QrCode, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { PixQrCode } from "@/components/pix/PixQrCode";
import {
  createDemoPixPayment,
  decodePaymentLink,
  registerLinkView,
  type DemoPayment,
} from "@/lib/demo-commerce";
import { formatBRL } from "@/lib/format";

export const Route = createFileRoute("/pay/$code")({
  head: () => ({
    meta: [
      { title: "Pagamento · Cash Engine" },
      { name: "description", content: "Checkout Pix seguro e simplificado." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PublicPixCheckout,
});

function PublicPixCheckout() {
  const { code } = Route.useParams();
  const link = useMemo(() => decodePaymentLink(code), [code]);
  const linkShortCode = link?.shortCode;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [document, setDocument] = useState("");
  const [payment, setPayment] = useState<DemoPayment | null>(null);

  useEffect(() => {
    if (linkShortCode) registerLinkView(linkShortCode);
  }, [linkShortCode]);

  if (!link) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f6f7] px-5 text-[#17202a]">
        <div className="w-full max-w-sm rounded-2xl border border-[#dfe5e8] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#08765d]/10 text-[#08765d]">
            <QrCode className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-xl font-semibold">Link de pagamento inválido</h1>
          <p className="mt-2 text-sm leading-6 text-[#6f7b84]">
            Não foi possível localizar uma cobrança válida neste endereço.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-lg bg-[#08765d] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Voltar
          </Link>
        </div>
      </main>
    );
  }

  function createPayment() {
    if (!link) return;
    if (!name.trim()) {
      toast.error("Preencha seu nome.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Preencha um e-mail válido.");
      return;
    }

    const created = createDemoPixPayment(link, { name, email });
    setPayment(created);
    toast.success("Pix gerado com sucesso.");
  }

  async function copyPix() {
    if (!payment) return;
    try {
      await navigator.clipboard.writeText(payment.pixPayload);
      toast.success("Código Pix copiado.");
    } catch {
      toast.error("Não foi possível copiar o código Pix.");
    }
  }

  const sellerName = link.seller?.trim() || "Cash Engine";

  return (
    <main className="min-h-screen bg-[#f4f6f7] px-3 py-5 text-[#151d24] sm:px-5 sm:py-8">
      <section className="mx-auto w-full max-w-[470px] overflow-hidden rounded-2xl border border-[#e1e6e9] bg-white shadow-[0_14px_45px_rgba(18,38,32,.08)]">
        <div className="px-5 pb-6 pt-6 sm:px-7 sm:pt-7">
          <div className="mb-7 flex items-start justify-between gap-4">
            <div>
              <p className="text-[15px] font-bold tracking-[-0.02em] text-[#101820]">
                {sellerName}
              </p>
              <p className="mt-1 text-[10px] text-[#849099]">Checkout seguro por Cash Engine</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#08765d]/8 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-[#08765d]">
              <LockKeyhole className="h-3 w-3" /> Seguro
            </span>
          </div>

          {!payment ? (
            <>
              <div className="space-y-4">
                <Field label="Nome completo">
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    placeholder="Preencha seu nome"
                    className="checkout-input"
                  />
                </Field>

                <Field label="Email">
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    placeholder="Preencha seu email"
                    className="checkout-input"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Celular">
                    <input
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="Preencha seu celular"
                      className="checkout-input"
                    />
                  </Field>
                  <Field label="CPF/CNPJ">
                    <input
                      value={document}
                      onChange={(event) => setDocument(event.target.value)}
                      inputMode="numeric"
                      placeholder="Preencha seu CPF/CNPJ"
                      className="checkout-input"
                    />
                  </Field>
                </div>
              </div>

              <div className="mt-7">
                <div className="flex items-center justify-between">
                  <h2 className="text-[11px] font-bold">Oferta</h2>
                  <span className="text-[9px] font-semibold text-[#55616a]">
                    {formatBRL(link.amount)} à vista
                  </span>
                </div>
              </div>

              <div className="mt-7">
                <h2 className="text-[11px] font-bold">Forma de Pagamento</h2>
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    disabled
                    title="Cartão de crédito ainda não disponível neste checkout"
                    className="relative flex h-[76px] cursor-not-allowed flex-col items-center justify-center gap-2 rounded-lg border border-[#cad3d8] bg-white text-[#65717a] opacity-60"
                  >
                    <CreditCard className="h-5 w-5" />
                    <span className="text-[10px] font-semibold">Cartão de Crédito</span>
                    <span className="absolute right-2 top-2 text-[7px] font-bold uppercase tracking-wider text-[#8b969d]">
                      Em breve
                    </span>
                  </button>
                  <button
                    type="button"
                    className="relative flex h-[76px] flex-col items-center justify-center gap-2 rounded-lg border border-[#08765d] bg-[#08765d] text-white shadow-sm"
                    aria-pressed="true"
                  >
                    <QrCode className="h-5 w-5" />
                    <span className="text-[10px] font-bold">PIX</span>
                    <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-white/15">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  </button>
                </div>
              </div>

              <OrderSummary product={link.product} amount={link.amount} />

              <button
                type="button"
                onClick={createPayment}
                className="mt-7 flex h-12 w-full items-center justify-center rounded-md bg-[#08765d] px-4 text-[12px] font-bold text-white shadow-sm transition-colors hover:bg-[#06634e] focus:outline-none focus:ring-4 focus:ring-[#08765d]/15"
              >
                Gerar Pix
              </button>
            </>
          ) : (
            <div className="pb-1">
              <div className="text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#08765d]/8 px-3 py-1.5 text-[10px] font-bold text-[#08765d]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#08765d]" />
                  Aguardando pagamento
                </span>
                <h1 className="mt-4 text-xl font-bold">Pague com Pix</h1>
                <p className="mt-1 text-[11px] leading-5 text-[#748089]">
                  Abra o app do seu banco e escaneie o QR Code abaixo.
                </p>

                <div className="mx-auto mt-5 w-fit rounded-xl border border-[#e0e5e7] bg-white p-3 shadow-sm">
                  <PixQrCode payload={payment.pixPayload} size={230} />
                </div>
                <p className="mt-4 text-2xl font-bold tracking-[-0.03em] text-[#101820]">
                  {formatBRL(payment.amount)}
                </p>
                <p className="mt-1 text-[9px] text-[#8a959d]">Referência {payment.reference}</p>
              </div>

              <button
                type="button"
                onClick={copyPix}
                className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-md border border-[#08765d] bg-white px-4 text-[11px] font-bold text-[#08765d] transition-colors hover:bg-[#08765d]/5"
              >
                <Copy className="h-4 w-4" />
                Copiar código Pix
              </button>

              <div className="mt-5 rounded-lg border border-[#e4e8ea] bg-[#f8faf9] p-3.5">
                <div className="flex gap-2.5">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#08765d]" />
                  <p className="text-[9px] leading-4 text-[#68747c]">
                    Confira o nome do recebedor, o valor e os demais dados no aplicativo do seu
                    banco antes de confirmar o pagamento.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 border-t border-[#edf0f1] pt-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[9px] font-semibold text-[#66737b]">
              <LockKeyhole className="h-3 w-3 text-[#08765d]" />
              Compra segura
            </div>
            <p className="mx-auto mt-3 max-w-[340px] text-[8px] leading-4 text-[#87929a]">
              Ao prosseguir, você concorda com os termos de uso e políticas aplicáveis da
              plataforma.
            </p>
            <p className="mt-2 text-[8px] font-medium text-[#9aa3a9]">Processado por Cash Engine</p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-semibold text-[#26323a]">{label}</span>
      {children}
    </label>
  );
}

function OrderSummary({ product, amount }: { product: string; amount: number }) {
  return (
    <div className="mt-7">
      <h2 className="text-[11px] font-bold">Resumo do pedido</h2>
      <div className="mt-3 overflow-hidden rounded-md border border-[#dbe1e4] bg-white">
        <div className="flex items-start justify-between gap-5 px-4 py-4">
          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold text-[#27323a]">{product}</p>
            <p className="mt-1 text-[8px] text-[#87929a]">Pagamento único</p>
          </div>
          <span className="shrink-0 text-[10px] font-semibold">{formatBRL(amount)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-[#edf0f1] px-4 py-3 text-[9px] text-[#68747c]">
          <span>Taxa de serviço</span>
          <span>R$ 0,00</span>
        </div>
        <div className="flex items-center justify-between border-t border-dashed border-[#dbe1e4] bg-[#fbfcfc] px-4 py-3 text-[10px] font-bold text-[#172129]">
          <span>Total</span>
          <span>{formatBRL(amount)}</span>
        </div>
      </div>
    </div>
  );
}
