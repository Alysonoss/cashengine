/**
 * QR Code mínimo para payloads Pix.
 * Usa QR Version 8, ECC L, byte mode e máscara 0.
 * Capacidade útil: 192 bytes, suficiente para o BR Code Pix estático deste projeto.
 */

const VERSION = 8;
const SIZE = 21 + (VERSION - 1) * 4; // 49
const DATA_CODEWORDS = 194;
const BLOCK_DATA = 97;
const ECC_PER_BLOCK = 24;
const TOTAL_CODEWORDS = 242;

const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
let gfReady = false;

function initGf() {
  if (gfReady) return;
  let x = 1;
  for (let i = 0; i < 255; i += 1) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < EXP.length; i += 1) EXP[i] = EXP[i - 255]!;
  gfReady = true;
}

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return EXP[LOG[a]! + LOG[b]!]!;
}

function rsGenerator(degree: number): number[] {
  initGf();
  let poly = [1];
  for (let i = 0; i < degree; i += 1) {
    const next = new Array(poly.length + 1).fill(0) as number[];
    for (let j = 0; j < poly.length; j += 1) {
      next[j] = (next[j] ?? 0) ^ poly[j]!;
      next[j + 1] = (next[j + 1] ?? 0) ^ gfMul(poly[j]!, EXP[i]!);
    }
    poly = next;
  }
  return poly;
}

function rsRemainder(data: number[], degree: number): number[] {
  const generator = rsGenerator(degree);
  const rem = new Array(degree).fill(0) as number[];
  for (const value of data) {
    const factor = value ^ rem[0]!;
    rem.shift();
    rem.push(0);
    for (let i = 0; i < degree; i += 1) {
      rem[i] = (rem[i] ?? 0) ^ gfMul(generator[i + 1]!, factor);
    }
  }
  return rem;
}

function appendBits(bits: number[], value: number, length: number) {
  for (let i = length - 1; i >= 0; i -= 1) bits.push((value >>> i) & 1);
}

function makeCodewords(text: string): number[] {
  const bytes = Array.from(new TextEncoder().encode(text));
  if (bytes.length > 192) throw new Error("Payload grande demais para o QR Code interno.");

  const bits: number[] = [];
  appendBits(bits, 0b0100, 4); // byte mode
  appendBits(bits, bytes.length, 8); // versões 1-9
  for (const b of bytes) appendBits(bits, b, 8);

  const capacityBits = DATA_CODEWORDS * 8;
  const terminator = Math.min(4, capacityBits - bits.length);
  for (let i = 0; i < terminator; i += 1) bits.push(0);
  while (bits.length % 8 !== 0) bits.push(0);

  const data: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let value = 0;
    for (let j = 0; j < 8; j += 1) value = (value << 1) | bits[i + j]!;
    data.push(value);
  }

  let pad = 0;
  while (data.length < DATA_CODEWORDS) {
    data.push(pad % 2 === 0 ? 0xec : 0x11);
    pad += 1;
  }

  const blocks = [data.slice(0, BLOCK_DATA), data.slice(BLOCK_DATA, BLOCK_DATA * 2)];
  const ecc = blocks.map((block) => rsRemainder(block, ECC_PER_BLOCK));
  const result: number[] = [];

  for (let i = 0; i < BLOCK_DATA; i += 1) {
    for (const block of blocks) result.push(block[i]!);
  }
  for (let i = 0; i < ECC_PER_BLOCK; i += 1) {
    for (const block of ecc) result.push(block[i]!);
  }

  if (result.length !== TOTAL_CODEWORDS) throw new Error("Falha ao montar QR Code.");
  return result;
}

function bchDigit(value: number): number {
  let d = 0;
  let v = value;
  while (v !== 0) {
    d += 1;
    v >>>= 1;
  }
  return d;
}

function bchTypeInfo(data: number): number {
  const G15 = 0x537;
  const MASK = 0x5412;
  let d = data << 10;
  while (bchDigit(d) - bchDigit(G15) >= 0) d ^= G15 << (bchDigit(d) - bchDigit(G15));
  return ((data << 10) | d) ^ MASK;
}

function bchTypeNumber(version: number): number {
  const G18 = 0x1f25;
  let d = version << 12;
  while (bchDigit(d) - bchDigit(G18) >= 0) d ^= G18 << (bchDigit(d) - bchDigit(G18));
  return (version << 12) | d;
}

function makeBaseMatrix(): (boolean | null)[][] {
  const m = Array.from({ length: SIZE }, () => Array<boolean | null>(SIZE).fill(null));

  function finder(row: number, col: number) {
    for (let r = -1; r <= 7; r += 1) {
      for (let c = -1; c <= 7; c += 1) {
        const rr = row + r;
        const cc = col + c;
        if (rr < 0 || rr >= SIZE || cc < 0 || cc >= SIZE) continue;
        const inCore = r >= 0 && r <= 6 && c >= 0 && c <= 6;
        const dark =
          inCore &&
          (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
        m[rr]![cc] = dark;
      }
    }
  }

  finder(0, 0);
  finder(0, SIZE - 7);
  finder(SIZE - 7, 0);

  const centers = [6, 24, 42];
  for (const row of centers) {
    for (const col of centers) {
      if (m[row]![col] !== null) continue;
      for (let r = -2; r <= 2; r += 1) {
        for (let c = -2; c <= 2; c += 1) {
          m[row + r]![col + c] = Math.max(Math.abs(r), Math.abs(c)) !== 1;
        }
      }
    }
  }

  for (let i = 8; i < SIZE - 8; i += 1) {
    if (m[6]![i] === null) m[6]![i] = i % 2 === 0;
    if (m[i]![6] === null) m[i]![6] = i % 2 === 0;
  }

  // Reserva format info (os valores serão escritos depois)
  for (let i = 0; i < 15; i += 1) {
    const vr = i < 6 ? i : i < 8 ? i + 1 : SIZE - 15 + i;
    m[vr]![8] = false;

    const hc = i < 8 ? SIZE - i - 1 : i < 9 ? 15 - i : 14 - i;
    m[8]![hc] = false;
  }
  m[SIZE - 8]![8] = true;

  // Version info, obrigatório a partir da versão 7
  const versionBits = bchTypeNumber(VERSION);
  for (let i = 0; i < 18; i += 1) {
    const dark = ((versionBits >>> i) & 1) === 1;
    m[Math.floor(i / 3)]![(i % 3) + SIZE - 11] = dark;
    m[(i % 3) + SIZE - 11]![Math.floor(i / 3)] = dark;
  }

  return m;
}

function mask0(row: number, col: number): boolean {
  return (row + col) % 2 === 0;
}

function writeFormatInfo(m: (boolean | null)[][]) {
  // ECC L = 01, mask = 000 => data = 0b01000
  const bits = bchTypeInfo((1 << 3) | 0);
  for (let i = 0; i < 15; i += 1) {
    const dark = ((bits >>> i) & 1) === 1;
    const vr = i < 6 ? i : i < 8 ? i + 1 : SIZE - 15 + i;
    m[vr]![8] = dark;

    const hc = i < 8 ? SIZE - i - 1 : i < 9 ? 15 - i : 14 - i;
    m[8]![hc] = dark;
  }
  m[SIZE - 8]![8] = true;
}

export function createQrMatrix(text: string): boolean[][] {
  const codewords = makeCodewords(text);
  const m = makeBaseMatrix();

  let row = SIZE - 1;
  let direction = -1;
  let byteIndex = 0;
  let bitIndex = 7;

  for (let col = SIZE - 1; col > 0; col -= 2) {
    if (col === 6) col -= 1;
    while (true) {
      for (const c of [col, col - 1]) {
        if (m[row]![c] !== null) continue;
        let dark = false;
        if (byteIndex < codewords.length) dark = ((codewords[byteIndex]! >>> bitIndex) & 1) === 1;
        if (mask0(row, c)) dark = !dark;
        m[row]![c] = dark;
        bitIndex -= 1;
        if (bitIndex < 0) {
          byteIndex += 1;
          bitIndex = 7;
        }
      }
      row += direction;
      if (row < 0 || row >= SIZE) {
        row -= direction;
        direction = -direction;
        break;
      }
    }
  }

  writeFormatInfo(m);
  return m.map((r) => r.map((v) => v === true));
}

export function createQrSvg(text: string, scale = 6, quiet = 4): string {
  const matrix = createQrMatrix(text);
  const side = matrix.length + quiet * 2;
  const rects: string[] = [];
  matrix.forEach((row, y) => {
    row.forEach((dark, x) => {
      if (dark) rects.push(`<rect x="${x + quiet}" y="${y + quiet}" width="1" height="1"/>`);
    });
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${side * scale}" height="${side * scale}" viewBox="0 0 ${side} ${side}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="white"/><g fill="black">${rects.join("")}</g></svg>`;
}
