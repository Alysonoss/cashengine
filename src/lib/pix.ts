const viteEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;

export const DEFAULT_PIX_KEY = viteEnv?.["VITE_PIX_KEY"] || "ea94d407-124e-4325-b5e2-f820713d2341";

export const DEFAULT_PIX_MERCHANT_NAME = viteEnv?.["VITE_PIX_MERCHANT_NAME"] || "TESTE";

export const DEFAULT_PIX_MERCHANT_CITY = viteEnv?.["VITE_PIX_MERCHANT_CITY"] || "SAO PAULO";

function tlv(id: string, value: string): string {
  return `${id}${String(value.length).padStart(2, "0")}${value}`;
}

function normalizePixText(value: string, max: number): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9 $%*+\-./:]/g, "")
    .trim()
    .toUpperCase()
    .slice(0, max);
}

function crc16Ccitt(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i += 1) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 0x8000) !== 0 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export type PixPayloadInput = {
  amount: number;
  pixKey?: string;
  merchantName?: string;
  merchantCity?: string;
  reference?: string;
};

/**
 * Gera um BR Code Pix estático (copia e cola) com valor definido.
 * A confirmação do pagamento não é inferida pelo QR: ela exige integração com banco/PSP.
 */
export function buildStaticPixPayload(input: PixPayloadInput): string {
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error("O valor do Pix deve ser maior que zero.");
  }

  const key = (input.pixKey || DEFAULT_PIX_KEY).trim();
  if (!key) throw new Error("Chave Pix não configurada.");

  const merchantName =
    normalizePixText(input.merchantName || DEFAULT_PIX_MERCHANT_NAME, 25) || "TESTE";
  const merchantCity =
    normalizePixText(input.merchantCity || DEFAULT_PIX_MERCHANT_CITY, 15) || "SAO PAULO";
  const reference = normalizePixText(input.reference || "***", 25) || "***";

  const merchantAccount = tlv("00", "BR.GOV.BCB.PIX") + tlv("01", key);
  const additionalData = tlv("05", reference);

  const withoutCrc =
    tlv("00", "01") +
    tlv("26", merchantAccount) +
    tlv("52", "0000") +
    tlv("53", "986") +
    tlv("54", input.amount.toFixed(2)) +
    tlv("58", "BR") +
    tlv("59", merchantName) +
    tlv("60", merchantCity) +
    tlv("62", additionalData) +
    "6304";

  return withoutCrc + crc16Ccitt(withoutCrc);
}

export function maskPixKey(key = DEFAULT_PIX_KEY): string {
  if (key.length <= 12) return key;
  return `${key.slice(0, 8)}••••${key.slice(-6)}`;
}
