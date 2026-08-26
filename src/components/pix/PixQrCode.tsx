import { useMemo } from "react";
import { createQrMatrix } from "@/lib/qr";

export function PixQrCode({ payload, size = 264 }: { payload: string; size?: number }) {
  const matrix = useMemo(() => createQrMatrix(payload), [payload]);
  const quiet = 4;
  const side = matrix.length + quiet * 2;

  return (
    <svg
      role="img"
      aria-label="QR Code Pix"
      width={size}
      height={size}
      viewBox={`0 0 ${side} ${side}`}
      className="block rounded-2xl bg-white p-2 shadow-sm"
      shapeRendering="crispEdges"
    >
      <rect width={side} height={side} fill="white" />
      {matrix.map((row, y) =>
        row.map((dark, x) =>
          dark ? (
            <rect key={`${x}-${y}`} x={x + quiet} y={y + quiet} width="1" height="1" fill="black" />
          ) : null,
        ),
      )}
    </svg>
  );
}
