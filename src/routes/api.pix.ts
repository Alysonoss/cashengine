import { createFileRoute } from "@tanstack/react-router";
import { buildStaticPixPayload, DEFAULT_PIX_KEY, maskPixKey } from "@/lib/pix";
import { createQrSvg } from "@/lib/qr";

function newReference() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase();
}

export const Route = createFileRoute("/api/pix")({
  server: {
    handlers: {
      GET: async () =>
        Response.json({
          service: "TESTE Pix Generator",
          mode: "static-key",
          pixKey: maskPixKey(DEFAULT_PIX_KEY),
          automaticConfirmation: false,
        }),
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            amount?: unknown;
            reference?: unknown;
          };
          const amount = Number(body.amount);
          if (!Number.isFinite(amount) || amount < 0.01 || amount > 999999.99) {
            return Response.json({ error: "amount_invalid" }, { status: 400 });
          }

          const reference =
            typeof body.reference === "string" && body.reference.trim()
              ? body.reference.trim().slice(0, 25)
              : newReference();
          const pixCopyPaste = buildStaticPixPayload({ amount, reference });
          const qrSvg = createQrSvg(pixCopyPaste);

          return Response.json({
            id: `pix_${reference.toLowerCase()}`,
            status: "pending",
            amount: Number(amount.toFixed(2)),
            reference,
            pixKey: maskPixKey(DEFAULT_PIX_KEY),
            pixCopyPaste,
            qrSvg,
            note: "A chave Pix gera a cobrança, mas a confirmação real exige webhook/API do banco ou PSP.",
          });
        } catch {
          return Response.json({ error: "invalid_json" }, { status: 400 });
        }
      },
    },
  },
});
