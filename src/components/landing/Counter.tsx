import { useEffect, useRef, useState } from "react";

type CounterProps = {
  end: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
};

function format(value: number, decimals: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function Counter({
  end,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 2200,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(end);
      return;
    }

    let frame = 0;
    let start = 0;

    const run = () => {
      start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(end * eased);
        if (p < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            cancelAnimationFrame(frame);
            run();
          }
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {format(value, decimals)}
      {suffix}
    </span>
  );
}
