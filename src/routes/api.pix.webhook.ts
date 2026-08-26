import { createFileRoute } from "@tanstack/react-router";

async function hmacSha256(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

export const Route = createFileRoute("/api/pix/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const inboundSecret = process.env["CASH_ENGINE_INBOUND_WEBHOOK_SECRET"];
        if (!inboundSecret) {
          return Response.json(
            {
              error: "webhook_not_configured",
              message: "Configure CASH_ENGINE_INBOUND_WEBHOOK_SECRET no servidor.",
            },
            { status: 503 },
          );
        }

        const suppliedSecret = request.headers.get("x-cash-engine-secret");
        if (!suppliedSecret || suppliedSecret !== inboundSecret) {
          return Response.json({ error: "unauthorized" }, { status: 401 });
        }

        let input: {
          paymentId?: unknown;
          externalId?: unknown;
          amount?: unknown;
          status?: unknown;
          paidAt?: unknown;
        };
        try {
          input = (await request.json()) as typeof input;
        } catch {
          return Response.json({ error: "invalid_json" }, { status: 400 });
        }

        if (input.status !== "paid" || typeof input.paymentId !== "string") {
          return Response.json({ error: "invalid_event" }, { status: 400 });
        }

        const event = {
          event: "payment.paid",
          paymentId: input.paymentId,
          externalId: typeof input.externalId === "string" ? input.externalId : null,
          amount: Number(input.amount || 0),
          status: "paid",
          paidAt: typeof input.paidAt === "string" ? input.paidAt : new Date().toISOString(),
        };

        const destination = process.env["CASH_ENGINE_OUTBOUND_WEBHOOK_URL"];
        const outboundSecret = process.env["CASH_ENGINE_OUTBOUND_WEBHOOK_SECRET"];
        if (!destination || !outboundSecret) {
          return Response.json({
            accepted: true,
            delivered: false,
            event,
            reason: "outbound_webhook_not_configured",
          });
        }

        const body = JSON.stringify(event);
        const signature = await hmacSha256(outboundSecret, body);

        try {
          const response = await fetch(destination, {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "x-cash-engine-event": "payment.paid",
              "x-cash-engine-signature": `sha256=${signature}`,
            },
            body,
            signal: AbortSignal.timeout(8000),
          });
          return Response.json({
            accepted: true,
            delivered: response.ok,
            destinationStatus: response.status,
            event,
          });
        } catch {
          return Response.json(
            { accepted: true, delivered: false, reason: "delivery_failed", event },
            { status: 202 },
          );
        }
      },
    },
  },
});
