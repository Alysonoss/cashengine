import { Sparkles } from "lucide-react";

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center sm:py-24">
      <div className="w-full">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Em construção
        </span>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        <div className="mt-10 rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="space-y-3">
            {[100, 82, 64].map((w, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 shrink-0 rounded-md bg-muted" />
                <div className="h-2.5 rounded-full bg-muted" style={{ width: `${w}%` }} />
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Esta área será construída nas próximas etapas do projeto.
          </p>
        </div>
      </div>
    </div>
  );
}
