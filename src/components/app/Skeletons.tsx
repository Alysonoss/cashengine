import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Shimmer({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}

export function CardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <Shimmer className="h-3 w-24" />
          <Shimmer className="mt-4 h-7 w-36" />
          <Shimmer className="mt-4 h-2 w-full" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 px-5 py-4">
          {Array.from({ length: cols }).map((_, c) => (
            <Shimmer
              key={c}
              className={cn("h-3", c === 0 ? "w-28" : c === cols - 1 ? "ml-auto w-20" : "w-24")}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Simula um carregamento curto para exibir skeletons na montagem. */
export function useFakeLoading(ms = 550) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(id);
  }, [ms]);
  return loading;
}
