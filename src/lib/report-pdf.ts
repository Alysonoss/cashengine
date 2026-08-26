export type PdfKpi = {
  label: string;
  value: string;
  detail?: string;
};

export type PdfColumn = {
  label: string;
  width: number;
  align?: "left" | "right";
};

export type PdfReport = {
  title: string;
  subtitle?: string;
  period?: string;
  filters?: string[];
  kpis?: PdfKpi[];
  columns: PdfColumn[];
  rows: string[][];
  fileName: string;
};

const PAGE_WIDTH = 842;
const PAGE_HEIGHT = 595;
const MARGIN = 36;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

function cleanText(value: string): string {
  return String(value ?? "")
    .replace(/[–—]/g, "-")
    .replace(/→/g, "->")
    .replace(/•/g, "*")
    .replace(/…/g, "...")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\u00a0/g, " ")
    .replace(/\r?\n/g, " ");
}

function toPdfSafe(value: string): string {
  let output = "";
  for (const char of cleanText(value)) {
    const code = char.charCodeAt(0);
    if (code <= 255) {
      output += char;
      continue;
    }
    const fallback = char.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    output += [...fallback].filter((c) => c.charCodeAt(0) <= 255).join("") || "?";
  }
  return output;
}

function escapePdf(value: string): string {
  return toPdfSafe(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function truncate(value: string, width: number, fontSize = 8): string {
  const safe = toPdfSafe(value);
  const approxCharWidth = fontSize * 0.5;
  const maxChars = Math.max(3, Math.floor(width / approxCharWidth));
  if (safe.length <= maxChars) return safe;
  return `${safe.slice(0, Math.max(1, maxChars - 3))}...`;
}

function textCommand(
  value: string,
  x: number,
  y: number,
  options: { size?: number; bold?: boolean; align?: "left" | "right"; maxWidth?: number } = {},
): string {
  const size = options.size ?? 9;
  const maxWidth = options.maxWidth ?? 1000;
  const visible = truncate(value, maxWidth, size);
  let drawX = x;
  if (options.align === "right") {
    drawX = x - Math.min(maxWidth, visible.length * size * 0.48);
  }
  return `0 g BT /${options.bold ? "F2" : "F1"} ${size} Tf ${drawX.toFixed(2)} ${y.toFixed(2)} Td (${escapePdf(visible)}) Tj ET\n`;
}

function lineCommand(x1: number, y1: number, x2: number, y2: number, gray = 0.85): string {
  return `${gray} G 0.6 w ${x1} ${y1} m ${x2} ${y2} l S\n`;
}

function rectCommand(x: number, y: number, width: number, height: number, gray = 0.97): string {
  return `${gray} g ${x} ${y} ${width} ${height} re f\n`;
}

function normalizeColumns(columns: PdfColumn[]): PdfColumn[] {
  const sum = columns.reduce((acc, column) => acc + column.width, 0) || 1;
  return columns.map((column) => ({ ...column, width: (column.width / sum) * CONTENT_WIDTH }));
}

function createReportPages(report: PdfReport): string[] {
  const columns = normalizeColumns(report.columns);
  const pages: string[] = [];
  let commands = "";
  let y = PAGE_HEIGHT - MARGIN;

  const drawBrand = () => {
    commands += textCommand("CASH ENGINE PRO", PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 30, {
      size: 8,
      bold: true,
      align: "right",
      maxWidth: 120,
    });
  };

  const drawReportHeader = (compact = false) => {
    drawBrand();
    commands += textCommand(report.title, MARGIN, y, {
      size: compact ? 14 : 20,
      bold: true,
      maxWidth: 520,
    });
    y -= compact ? 18 : 24;
    if (!compact && report.subtitle) {
      commands += textCommand(report.subtitle, MARGIN, y, { size: 9, maxWidth: 580 });
      y -= 15;
    }
    const meta = [report.period ? `Período: ${report.period}` : "", ...(report.filters ?? [])]
      .filter(Boolean)
      .join("  |  ");
    if (meta) {
      commands += textCommand(meta, MARGIN, y, { size: 8, maxWidth: CONTENT_WIDTH });
      y -= 15;
    }
    commands += lineCommand(MARGIN, y, PAGE_WIDTH - MARGIN, y);
    y -= 14;
  };

  const drawKpis = () => {
    const kpis = report.kpis ?? [];
    if (kpis.length === 0) return;
    const perRow = Math.min(kpis.length, 5);
    const gap = 8;
    const boxWidth = (CONTENT_WIDTH - gap * (perRow - 1)) / perRow;
    const boxHeight = 48;
    kpis.forEach((kpi, index) => {
      const col = index % perRow;
      if (index > 0 && col === 0) y -= boxHeight + 8;
      const x = MARGIN + col * (boxWidth + gap);
      commands += rectCommand(x, y - boxHeight, boxWidth, boxHeight, 0.965);
      commands += textCommand(kpi.label.toUpperCase(), x + 8, y - 14, {
        size: 6.8,
        bold: true,
        maxWidth: boxWidth - 16,
      });
      commands += textCommand(kpi.value, x + 8, y - 29, {
        size: 11,
        bold: true,
        maxWidth: boxWidth - 16,
      });
      if (kpi.detail) {
        commands += textCommand(kpi.detail, x + 8, y - 41, { size: 6.2, maxWidth: boxWidth - 16 });
      }
    });
    y -= boxHeight + 18;
  };

  const drawTableHeader = () => {
    const headerHeight = 20;
    commands += rectCommand(MARGIN, y - headerHeight + 5, CONTENT_WIDTH, headerHeight, 0.93);
    let x = MARGIN;
    columns.forEach((column) => {
      const right = column.align === "right";
      commands += textCommand(
        column.label.toUpperCase(),
        right ? x + column.width - 5 : x + 5,
        y - 8,
        {
          size: 6.6,
          bold: true,
          align: right ? "right" : "left",
          maxWidth: column.width - 10,
        },
      );
      x += column.width;
    });
    y -= headerHeight;
  };

  const finishPage = () => {
    const footer = `Gerado em ${new Date().toLocaleString("pt-BR")}  |  Cash Engine PRO`;
    commands += lineCommand(MARGIN, 27, PAGE_WIDTH - MARGIN, 27, 0.9);
    commands += textCommand(footer, MARGIN, 16, { size: 6.5, maxWidth: 500 });
    commands += textCommand(`Página ${pages.length + 1}`, PAGE_WIDTH - MARGIN, 16, {
      size: 6.5,
      align: "right",
      maxWidth: 70,
    });
    pages.push(commands);
    commands = "";
    y = PAGE_HEIGHT - MARGIN;
  };

  drawReportHeader();
  drawKpis();
  drawTableHeader();

  const rowHeight = 18;
  report.rows.forEach((row, rowIndex) => {
    if (y - rowHeight < 38) {
      finishPage();
      drawReportHeader(true);
      drawTableHeader();
    }

    if (rowIndex % 2 === 1) {
      commands += rectCommand(MARGIN, y - rowHeight + 4, CONTENT_WIDTH, rowHeight, 0.985);
    }

    let x = MARGIN;
    columns.forEach((column, index) => {
      const right = column.align === "right";
      commands += textCommand(row[index] ?? "", right ? x + column.width - 5 : x + 5, y - 8, {
        size: 7.2,
        align: right ? "right" : "left",
        maxWidth: column.width - 10,
      });
      x += column.width;
    });
    commands += lineCommand(
      MARGIN,
      y - rowHeight + 4,
      PAGE_WIDTH - MARGIN,
      y - rowHeight + 4,
      0.94,
    );
    y -= rowHeight;
  });

  if (report.rows.length === 0) {
    commands += textCommand(
      "Nenhum dado disponível para os filtros selecionados.",
      MARGIN + 5,
      y - 10,
      {
        size: 9,
        maxWidth: CONTENT_WIDTH - 10,
      },
    );
  }

  finishPage();
  return pages;
}

function buildPdfBinary(pageContents: string[]): Uint8Array {
  const objects: string[] = [];
  const catalogId = 1;
  const pagesId = 2;
  const fontRegularId = 3;
  const fontBoldId = 4;

  objects[catalogId] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
  objects[fontRegularId] =
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>";
  objects[fontBoldId] =
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>";

  const pageIds: number[] = [];
  pageContents.forEach((content, index) => {
    const pageId = 5 + index * 2;
    const contentId = pageId + 1;
    pageIds.push(pageId);
    objects[contentId] =
      `<< /Length ${toPdfSafe(content).length} >>\nstream\n${toPdfSafe(content)}endstream`;
    objects[pageId] =
      `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >> /Contents ${contentId} 0 R >>`;
  });

  objects[pagesId] =
    `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

  const maxId = objects.length - 1;
  let pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const offsets = new Array(maxId + 1).fill(0);

  for (let id = 1; id <= maxId; id += 1) {
    if (!objects[id]) continue;
    offsets[id] = pdf.length;
    pdf += `${id} 0 obj\n${objects[id]}\nendobj\n`;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${maxId + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let id = 1; id <= maxId; id += 1) {
    if (objects[id]) {
      pdf += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
    } else {
      pdf += "0000000000 00000 f \n";
    }
  }
  pdf += `trailer\n<< /Size ${maxId + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const bytes = new Uint8Array(pdf.length);
  for (let i = 0; i < pdf.length; i += 1) bytes[i] = pdf.charCodeAt(i) & 0xff;
  return bytes;
}

export function createReportPdf(report: PdfReport): Uint8Array {
  return buildPdfBinary(createReportPages(report));
}

export function downloadReportPdf(report: PdfReport): void {
  if (typeof window === "undefined") return;
  const bytes = createReportPdf(report);
  const buffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
  const blob = new Blob([buffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = report.fileName.toLowerCase().endsWith(".pdf")
    ? report.fileName
    : `${report.fileName}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
