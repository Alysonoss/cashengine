import { useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Handshake,
  Lock,
  Play,
  PlayCircle,
  Plus,
  Rocket,
  Search,
  Settings2,
  ShoppingBag,
  Target,
  UserRound,
} from "lucide-react";
import {
  trainings,
  trainingCategories,
  type Training,
  type TrainingCategoryKey,
  type TrainingLesson,
  type TrainingModule,
} from "@/lib/mock/data";
import { formatDateTime, formatInt } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/app/EmptyState";
import { useFakeLoading } from "@/components/app/Skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppShell } from "@/components/app/app-shell-context";

function categoryIcon(key: TrainingCategoryKey) {
  switch (key) {
    case "comece-aqui":
      return Rocket;
    case "vendas":
      return ShoppingBag;
    case "afiliados":
      return Handshake;
    case "trafego":
      return Target;
    case "plataforma":
      return Settings2;
    default:
      return BookOpen;
  }
}

function totalLessons(t: Training) {
  return t.modules.reduce((acc, m) => acc + m.lessons.length, 0);
}

function completedLessons(t: Training) {
  return t.modules.reduce((acc, m) => acc + m.lessons.filter((l) => l.completed).length, 0);
}

function allLessons(t: Training) {
  const list: TrainingLesson[] = [];
  for (const m of t.modules) for (const l of m.lessons) list.push(l);
  return list;
}

export function TrainingsPage() {
  const loading = useFakeLoading();
  const { role } = useAppShell();
  const [category, setCategory] = useState<TrainingCategoryKey | "todas">("todas");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return trainings.filter((t) => {
      if (!t.allowedRoles.includes(role)) return false;
      if (category !== "todas" && t.category !== category) return false;
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    });
  }, [category, query, role]);

  const continueTraining = trainings.find((t) => t.progressPercent > 0 && t.progressPercent < 100);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Treinamentos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Aprenda a vender mais, utilizar a plataforma e desenvolver sua operação.
          </p>
        </div>
        <Button variant="outline" className="gap-1.5">
          <GraduationCap className="h-4 w-4" />
          Meu progresso
        </Button>
      </header>

      {continueTraining && (
        <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_minmax(0,360px)]">
          <Card
            className="overflow-hidden border-primary/30"
            style={{ background: continueTraining.cover }}
          >
            <CardContent className="relative p-6 text-white/95">
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative flex flex-wrap items-center gap-2">
                <Badge className="bg-white/15 text-white border-white/25 backdrop-blur">
                  Em andamento
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-white/10 text-white border-white/25 backdrop-blur"
                >
                  {trainingCategories.find((c) => c.key === continueTraining.category)?.label}
                </Badge>
              </div>
              <h2 className="relative mt-3 text-xl font-semibold sm:text-2xl">
                {continueTraining.title}
              </h2>
              <p className="relative mt-1 text-sm text-white/80">{continueTraining.subtitle}</p>
              <div className="relative mt-5 flex flex-wrap items-center gap-4 text-xs text-white/85">
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" />
                  {formatInt(completedLessons(continueTraining))} de{" "}
                  {formatInt(totalLessons(continueTraining))} aulas
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {continueTraining.progressPercent}% concluído
                </span>
              </div>
              <div className="relative mt-3 w-full">
                <Progress
                  value={continueTraining.progressPercent}
                  className="h-2 bg-white/20 [&>div]:bg-white"
                />
              </div>
              <div className="relative mt-5 flex flex-wrap items-center gap-2">
                <Button className="bg-white text-foreground hover:bg-white/90 gap-1.5">
                  <PlayCircle className="h-4 w-4" />
                  Continuar assistindo
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/10 text-white border-white/25 hover:bg-white/15"
                >
                  Ver conteúdo
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3 rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="text-sm font-semibold">Meu progresso</h3>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-primary to-blue-500 text-white">
                  K
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">Kelvin</p>
                <p className="text-xs text-muted-foreground">
                  {formatInt(trainings.filter((t) => t.progressPercent > 0).length)} treinamento(s)
                  iniciados
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-background/60 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Conclusão geral</span>
                <span className="tabular-nums font-semibold text-foreground">
                  {Math.round(
                    (trainings.reduce((a, t) => a + t.progressPercent, 0) /
                      Math.max(trainings.length, 1)) *
                      10,
                  ) / 10}
                  %
                </span>
              </div>
              <Progress
                value={
                  trainings.reduce((a, t) => a + t.progressPercent, 0) /
                  Math.max(trainings.length, 1)
                }
                className="mt-2"
              />
            </div>
          </div>
        </section>
      )}

      <section className="mt-6 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
              placeholder="Buscar treinamentos, módulos ou conteúdos..."
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Button
              type="button"
              variant={category === "todas" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCategory("todas")}
            >
              Todas
            </Button>
            {trainingCategories.map((c) => {
              const Icon = categoryIcon(c.key);
              return (
                <Button
                  key={c.key}
                  type="button"
                  variant={category === c.key ? "default" : "ghost"}
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setCategory(c.key)}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {c.label}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-36 w-full" />
              <CardContent className="space-y-2 p-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </CardContent>
            </Card>
          ))
        ) : filtered.length === 0 ? (
          <div className="sm:col-span-2 xl:col-span-3">
            <EmptyState
              icon={BookOpen}
              title="Nenhum treinamento encontrado"
              description="Tente outra busca ou troque a categoria. Novos conteúdos são lançados toda semana."
            />
          </div>
        ) : (
          filtered.map((t) => <TrainingCard key={t.id} training={t} />)
        )}
      </section>
    </div>
  );
}

function TrainingCard({ training }: { training: Training }) {
  const done = completedLessons(training);
  const total = totalLessons(training);
  return (
    <Card className="group overflow-hidden transition hover:shadow-md">
      <div className="relative h-36 w-full" style={{ background: training.cover }}>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg">
            <Play className="h-5 w-5 translate-x-0.5" />
          </div>
        </div>
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge className="bg-black/40 text-white border-white/20 backdrop-blur">
            {trainingCategories.find((c) => c.key === training.category)?.label}
          </Badge>
          {training.status === "rascunho" && (
            <Badge className="bg-amber-500/90 text-white border-white/20">Em breve</Badge>
          )}
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-base leading-snug">{training.title}</CardTitle>
        <CardDescription className="line-clamp-2">{training.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pb-5">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {formatInt(training.modules.length)} módulos
          </span>
          <span>·</span>
          <span className="tabular-nums">{formatInt(total)} aulas</span>
          <span>·</span>
          <span className="tabular-nums">
            {done}/{total}
          </span>
        </div>
        <div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground pb-1.5">
            <span>Progresso</span>
            <span className="tabular-nums font-semibold text-foreground">
              {training.progressPercent}%
            </span>
          </div>
          <Progress value={training.progressPercent} className="h-1.5" />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground tabular-nums">
            Publicado em {formatDateTime(training.publishedAt).split(" ")[0]}
          </p>
          <Button size="sm" variant="ghost" className="gap-1.5">
            <PlayCircle className="h-3.5 w-3.5" />
            Assistir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function TrainingDetailPage({ trainingId }: { trainingId?: string }) {
  const loading = useFakeLoading();
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const training = trainings.find((t) => t.id === trainingId) ?? trainings[0]!;

  const lessons = useMemo(() => allLessons(training), [training]);

  const currentLesson =
    lessons.find((l) => l.id === activeLesson) ??
    lessons.find((l) => l.id === training.lastLessonId) ??
    lessons[0];

  const moduleOfCurrent = training.modules.find((m) =>
    m.lessons.some((l) => l.id === currentLesson?.id),
  );

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1.5">
              {trainingCategories.find((c) => c.key === training.category)?.label}
            </Badge>
            {training.status === "rascunho" && (
              <Badge
                variant="outline"
                className="gap-1 text-amber-700 border-amber-500/30 bg-amber-500/10"
              >
                <Lock className="h-3 w-3" />
                Conteúdo em produção
              </Badge>
            )}
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {training.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">{training.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1.5">
            <GraduationCap className="h-4 w-4" />
            {training.progressPercent}%
          </Button>
        </div>
      </header>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
        <section className="space-y-5">
          {loading ? (
            <Card>
              <Skeleton className="aspect-video w-full rounded-t-xl" />
              <CardContent className="space-y-3 p-5">
                <Skeleton className="h-5 w-64" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-11/12" />
              </CardContent>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              <div
                className="relative aspect-video w-full flex items-center justify-center"
                style={{ background: training.cover }}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-primary shadow-2xl">
                  <Play className="h-7 w-7 translate-x-0.5" />
                </div>
                <div className="absolute bottom-3 left-4 rounded-full bg-black/50 px-2.5 py-1 text-[11px] text-white backdrop-blur">
                  Vídeo · {currentLesson?.duration ?? "--:--"}
                </div>
              </div>
              <CardContent className="p-5 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="gap-1 border-primary/20 text-primary bg-primary/5"
                  >
                    <BookOpen className="h-3 w-3" />
                    {moduleOfCurrent?.title}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Aula de {formatInt(lessons.findIndex((l) => l.id === currentLesson?.id) + 1)} de{" "}
                    {formatInt(lessons.length)}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  {currentLesson?.title ?? "Selecione uma aula"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Assista com atenção e, ao final, marque a aula como concluída para liberar o
                  próximo conteúdo. Esta tela está preparada para receber vídeo real, materiais
                  complementares e quiz.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <Button className="gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    Marcar como concluída
                  </Button>
                  <Button variant="outline" className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    Anotações
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <UserRound className="h-4 w-4 text-primary" />
                Instrutor e comunidade
              </CardTitle>
              <CardDescription>Interaja com o instrutor e demais alunos nas aulas.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-3">
                <Avatar className="h-11 w-11">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-blue-500 text-white">
                    K
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Kelvin</p>
                  <p className="text-xs text-muted-foreground">Instrutor · Cash Engine PRO</p>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-background/60 p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="tabular-nums font-semibold">
                    {training.progressPercent}% · {completedLessons(training)}/
                    {totalLessons(training)} aulas
                  </span>
                </div>
                <Progress value={training.progressPercent} className="mt-2 h-2" />
                <p className="mt-2 text-[11px] text-muted-foreground">
                  ████████░░ marcadores visuais de progresso prontos.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Conteúdo programático</CardTitle>
              <CardDescription>
                {formatInt(training.modules.length)} módulos · {formatInt(totalLessons(training))}{" "}
                aulas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {training.modules.map((m, i) => (
                <ModuleAccordion
                  key={m.id}
                  module={m}
                  index={i}
                  activeLesson={activeLesson}
                  onSelect={setActiveLesson}
                />
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function ModuleAccordion({
  module,
  index,
  activeLesson,
  onSelect,
}: {
  module: TrainingModule;
  index: number;
  activeLesson: string | null;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(
    index === 0 || module.lessons.some((l) => l.completed === false),
  );
  const done = module.lessons.filter((l) => l.completed).length;
  return (
    <div className="rounded-xl border border-border bg-background/60">
      <button
        className="flex w-full items-start gap-3 p-3 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground/5 text-xs font-semibold tabular-nums text-foreground">
          {String(index + 1).padStart(2, "0")}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">{module.title}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">
            {module.description}
          </p>
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>
              {formatInt(done)}/{formatInt(module.lessons.length)} aulas
            </span>
            <span className="tabular-nums">
              {Math.round((done / module.lessons.length) * 100)}%
            </span>
          </div>
        </div>
      </button>
      {open && (
        <ul className="border-t border-border divide-y divide-border">
          {module.lessons.map((l) => {
            const isActive = activeLesson === l.id;
            return (
              <li key={l.id}>
                <button
                  onClick={() => onSelect(l.id)}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2.5 text-left transition",
                    isActive && "bg-primary/5",
                    !isActive && "hover:bg-muted/50",
                  )}
                >
                  {l.completed ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <PlayCircle className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "truncate text-sm",
                        isActive ? "font-semibold text-foreground" : "text-foreground/90",
                      )}
                    >
                      {l.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {l.type === "video" ? "Vídeo" : l.type === "text" ? "Texto" : "Quiz"} ·{" "}
                      {l.duration}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
