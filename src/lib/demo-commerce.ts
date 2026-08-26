import { useSyncExternalStore } from "react";
import { buildStaticPixPayload } from "@/lib/pix";

const STORAGE_KEY = "cash-engine-test-commerce-v2";
const EVENT_KEY = "cash-engine-test-commerce-changed";

export type DemoLinkStatus = "ativo" | "pausado";
export type DemoPaymentStatus = "pendente" | "pago" | "cancelado";

export type PublicPaymentLink = {
  version: 1;
  shortCode: string;
  product: string;
  description: string;
  amount: number;
  seller: string;
  webhookUrl?: string;
};

export type DemoPaymentLink = PublicPaymentLink & {
  id: string;
  token: string;
  status: DemoLinkStatus;
  createdAt: string;
  views: number;
};

export type DemoPayment = {
  id: string;
  linkId: string | null;
  shortCode: string;
  product: string;
  customer: string;
  email: string;
  amount: number;
  status: DemoPaymentStatus;
  reference: string;
  pixPayload: string;
  createdAt: string;
  paidAt: string | null;
};

export type DemoWebhookDelivery = {
  id: string;
  paymentId: string;
  event: "payment.created" | "payment.paid";
  endpoint: string;
  status: "simulado" | "sem_endpoint";
  createdAt: string;
  payload: string;
};

export type DemoCommerceState = {
  links: DemoPaymentLink[];
  payments: DemoPayment[];
  webhookDeliveries: DemoWebhookDelivery[];
};

function utf8ToBase64Url(value: string): string {
  if (typeof Buffer !== "undefined") return Buffer.from(value, "utf8").toString("base64url");
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToUtf8(value: string): string {
  if (typeof Buffer !== "undefined") return Buffer.from(value, "base64url").toString("utf8");
  const base64 = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  return new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
}

export function encodePaymentLink(link: PublicPaymentLink): string {
  return `t_${utf8ToBase64Url(JSON.stringify(link))}`;
}

export function decodePaymentLink(token: string): PublicPaymentLink | null {
  if (!token.startsWith("t_")) return null;
  try {
    const parsed = JSON.parse(base64UrlToUtf8(token.slice(2))) as PublicPaymentLink;
    if (
      parsed?.version !== 1 ||
      !parsed.shortCode ||
      !parsed.product ||
      !Number.isFinite(parsed.amount) ||
      parsed.amount <= 0
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function seedState(): DemoCommerceState {
  const publicLink: PublicPaymentLink = {
    version: 1,
    shortCode: "TESTE-8F2K",
    product: "Produto TESTE",
    description: "Pagamento Pix de demonstração do Cash Engine.",
    amount: 49.9,
    seller: "Produtor TESTE",
  };
  const token = encodePaymentLink(publicLink);
  const paidPayload = buildStaticPixPayload({ amount: 49.9, reference: "TST8F2K1" });
  const pendingPayload = buildStaticPixPayload({ amount: 49.9, reference: "TST8F2K2" });

  return {
    links: [
      {
        ...publicLink,
        id: "lnk_teste_8f2k",
        token,
        status: "ativo",
        createdAt: "2026-08-24T12:30:00-03:00",
        views: 4,
      },
    ],
    payments: [
      {
        id: "pay_teste_001",
        linkId: "lnk_teste_8f2k",
        shortCode: publicLink.shortCode,
        product: publicLink.product,
        customer: "Cliente TESTE 01",
        email: "cliente01@teste.local",
        amount: 49.9,
        status: "pago",
        reference: "TST8F2K1",
        pixPayload: paidPayload,
        createdAt: "2026-08-24T12:42:00-03:00",
        paidAt: "2026-08-24T12:43:12-03:00",
      },
      {
        id: "pay_teste_002",
        linkId: "lnk_teste_8f2k",
        shortCode: publicLink.shortCode,
        product: publicLink.product,
        customer: "Cliente TESTE 02",
        email: "cliente02@teste.local",
        amount: 49.9,
        status: "pendente",
        reference: "TST8F2K2",
        pixPayload: pendingPayload,
        createdAt: "2026-08-24T13:02:00-03:00",
        paidAt: null,
      },
    ],
    webhookDeliveries: [],
  };
}

let serverSnapshot: DemoCommerceState = seedState();
let cachedRaw: string | null = null;
let cachedClientSnapshot: DemoCommerceState = serverSnapshot;

function getState(): DemoCommerceState {
  if (typeof window === "undefined") return serverSnapshot;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedClientSnapshot;

  if (!raw) {
    const seeded = seedState();
    const serialized = JSON.stringify(seeded);
    window.localStorage.setItem(STORAGE_KEY, serialized);
    cachedRaw = serialized;
    cachedClientSnapshot = seeded;
    return seeded;
  }

  try {
    const parsed = JSON.parse(raw) as DemoCommerceState;
    cachedRaw = raw;
    cachedClientSnapshot = parsed;
    return parsed;
  } catch {
    const seeded = seedState();
    const serialized = JSON.stringify(seeded);
    window.localStorage.setItem(STORAGE_KEY, serialized);
    cachedRaw = serialized;
    cachedClientSnapshot = seeded;
    return seeded;
  }
}

function saveState(next: DemoCommerceState) {
  if (typeof window === "undefined") {
    serverSnapshot = next;
    return;
  }
  const serialized = JSON.stringify(next);
  cachedRaw = serialized;
  cachedClientSnapshot = next;
  window.localStorage.setItem(STORAGE_KEY, serialized);
  window.dispatchEvent(new Event(EVENT_KEY));
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) callback();
  };
  window.addEventListener(EVENT_KEY, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT_KEY, callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function useDemoCommerce(): DemoCommerceState {
  return useSyncExternalStore(subscribe, getState, () => serverSnapshot);
}

function randomChunk(length = 6): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(length);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(bytes);
  else for (let i = 0; i < length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export function createDemoPaymentLink(input: {
  product: string;
  description?: string;
  amount: number;
  seller?: string;
  webhookUrl?: string;
}): DemoPaymentLink {
  const state = getState();
  const shortCode = `TESTE-${randomChunk(5)}`;
  const publicLink: PublicPaymentLink = {
    version: 1,
    shortCode,
    product: input.product.trim() || "Produto TESTE",
    description: input.description?.trim() || "Pagamento Pix via Cash Engine TESTE.",
    amount: Number(input.amount.toFixed(2)),
    seller: input.seller?.trim() || "Produtor TESTE",
    ...(input.webhookUrl?.trim() ? { webhookUrl: input.webhookUrl.trim() } : {}),
  };
  const link: DemoPaymentLink = {
    ...publicLink,
    id: `lnk_${randomChunk(10).toLowerCase()}`,
    token: encodePaymentLink(publicLink),
    status: "ativo",
    createdAt: new Date().toISOString(),
    views: 0,
  };
  saveState({ ...state, links: [link, ...state.links] });
  return link;
}

export function toggleDemoPaymentLink(id: string) {
  const state = getState();
  saveState({
    ...state,
    links: state.links.map((link) =>
      link.id === id ? { ...link, status: link.status === "ativo" ? "pausado" : "ativo" } : link,
    ),
  });
}

export function registerLinkView(shortCode: string) {
  const state = getState();
  const next = state.links.map((link) =>
    link.shortCode === shortCode ? { ...link, views: link.views + 1 } : link,
  );
  saveState({ ...state, links: next });
}

export function createDemoPixPayment(
  link: PublicPaymentLink,
  customer: { name: string; email: string },
): DemoPayment {
  const state = getState();
  const reference = randomChunk(10).slice(0, 10);
  const payment: DemoPayment = {
    id: `pay_${randomChunk(12).toLowerCase()}`,
    linkId: state.links.find((item) => item.shortCode === link.shortCode)?.id ?? null,
    shortCode: link.shortCode,
    product: link.product,
    customer: customer.name.trim() || "Cliente TESTE",
    email: customer.email.trim(),
    amount: link.amount,
    status: "pendente",
    reference,
    pixPayload: buildStaticPixPayload({ amount: link.amount, reference }),
    createdAt: new Date().toISOString(),
    paidAt: null,
  };
  const endpoint = link.webhookUrl || "";
  const delivery: DemoWebhookDelivery = {
    id: `evt_${randomChunk(10).toLowerCase()}`,
    paymentId: payment.id,
    event: "payment.created",
    endpoint,
    status: endpoint ? "simulado" : "sem_endpoint",
    createdAt: new Date().toISOString(),
    payload: JSON.stringify(
      {
        event: "payment.created",
        paymentId: payment.id,
        externalId: payment.shortCode,
        amount: payment.amount,
        status: "pending",
      },
      null,
      2,
    ),
  };
  saveState({
    ...state,
    payments: [payment, ...state.payments],
    webhookDeliveries: [delivery, ...state.webhookDeliveries].slice(0, 100),
  });
  return payment;
}

export function confirmDemoPayment(paymentId: string) {
  const state = getState();
  const payment = state.payments.find((item) => item.id === paymentId);
  if (!payment || payment.status === "pago") return;
  const link = state.links.find((item) => item.id === payment.linkId);
  const paidAt = new Date().toISOString();
  const updated = state.payments.map((item) =>
    item.id === paymentId ? { ...item, status: "pago" as const, paidAt } : item,
  );
  const endpoint = link?.webhookUrl || "";
  const delivery: DemoWebhookDelivery = {
    id: `evt_${randomChunk(10).toLowerCase()}`,
    paymentId,
    event: "payment.paid",
    endpoint,
    status: endpoint ? "simulado" : "sem_endpoint",
    createdAt: paidAt,
    payload: JSON.stringify(
      {
        event: "payment.paid",
        paymentId,
        externalId: payment.shortCode,
        amount: payment.amount,
        status: "paid",
        paidAt,
      },
      null,
      2,
    ),
  };
  saveState({
    ...state,
    payments: updated,
    webhookDeliveries: [delivery, ...state.webhookDeliveries].slice(0, 100),
  });
}

export function resetDemoCommerce() {
  saveState(seedState());
}

export function paymentLinkHref(token: string): string {
  const path = `/pay/${encodeURIComponent(token)}`;
  return typeof window === "undefined" ? path : `${window.location.origin}${path}`;
}
