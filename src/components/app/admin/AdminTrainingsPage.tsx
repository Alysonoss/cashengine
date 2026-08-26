import { useMemo, useState } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  Eye,
  GripVertical,
  LayoutList,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  ShieldX,
  Trash2,
  Upload,
  Users2,
  Video,
} from "lucide-react";
import {
  trainings,
  trainingCategories,
  products,
  type Training,
  type TrainingCategoryKey,
} from "@/lib/mock/data";
import { formatBRL, formatDateTime, formatInt } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/app/EmptyState";
import { useFakeLoading, CardsSkeleton, TableSkeleton } from "@/components/app/Skeletons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

type StatusFilter = "todos" | "publicado" | "rascunho";

export function AdminTrainingsPage() {
  const loading = useFakeLoading();
  const [tab, setTab] = useState<"treinamentos" | "novo" | "progresso">("treinamentos");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("todos");
  const [category, setCategory] = useState<TrainingCategoryKey | "todas">("todas");

  const rows = useMemo(() => {
    return trainings.filter((t) => {
      if (status !== "todos" && t.status !== status) return false;
      if (category !== "todas" && t.category !== category) return false;
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    });
  }, [query, status, category]);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              Administração
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Gestão de Treinamentos
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Crie, edite, publique e organize treinamentos, módulos e aulas para sua equipe e
            afiliados.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="gap-1.5">
            <Upload className="h-4 w-4" />
            Importar
          </Button>
          <Button className="gap-1.5" onClick={() => setTab("novo")}>
            <Plus className="h-4 w-4" />
            Novo treinamento
          </Button>
        </div>
      </header>

      {!loading && (
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiTile
            label="Treinamentos publicados"
            value={formatInt(trainings.filter((t) => t.status === "publicado").length)}
            hint="visíveis aos alunos"
          />
          <KpiTile
            label="Rascunhos"
            value={formatInt(trainings.filter((t) => t.status === "rascunho").length)}
            hint="em produção"
            accent
          />
          <KpiTile
            label="Módulos"
            value={formatInt(trainings.reduce((a, t) => a + t.modules.length, 0))}
            hint="estruturados"
          />
          <KpiTile
            label="Aulas"
            value={formatInt(
              trainings.reduce(
                (a, t) => a + t.modules.reduce((x, m) => x + m.lessons.length, 0),
                0,
              ),
            )}
            hint="conteúdos cadastrados"
          />
        </section>
      )}

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mt-6 w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="treinamentos" className="gap-1.5">
            <LayoutList className="h-3.5 w-3.5" />
            Todos os treinamentos
          </TabsTrigger>
          <TabsTrigger value="novo" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Novo / editar
          </TabsTrigger>
          <TabsTrigger value="progresso" className="gap-1.5">
            <Users2 className="h-3.5 w-3.5" />
            Progresso de alunos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="treinamentos">
          <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[220px] flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9"
                  placeholder="Buscar por título ou descrição..."
                />
              </div>
              <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="publicado">Publicados</SelectItem>
                  <SelectItem value="rascunho">Rascunhos</SelectItem>
                </SelectContent>
              </Select>
              <Select value={category} onValueChange={(v) => setCategory(v as typeof category)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as categorias</SelectItem>
                  {trainingCategories.map((c) => (
                    <SelectItem key={c.key} value={c.key}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <section className="mt-4">
            {loading ? (
              <TableSkeleton rows={5} cols={6} />
            ) : rows.length === 0 ? (
              <EmptyState
                icon={LayoutList}
                title="Nenhum treinamento encontrado"
                description="Crie seu primeiro treinamento para começar a organizar o conteúdo da sua plataforma."
              />
            ) : (
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[960px] text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <th className="px-5 py-3 font-medium">Treinamento</th>
                        <th className="px-5 py-3 font-medium">Categoria</th>
                        <th className="px-5 py-3 text-right font-medium">Módulos / Aulas</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 font-medium">Publicado em</th>
                        <th className="px-5 py-3 text-right font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {rows.map((t) => (
                        <TrainingRow key={t.id} training={t} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </TabsContent>

        <TabsContent value="novo">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Formulário de treinamento</CardTitle>
              <CardDescription>
                Campos preparados para criação e edição completa. Integração futura com backend.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2 space-y-1.5">
                <Label className="text-xs uppercase tracking-wide">Título</Label>
                <Input placeholder="Ex: Primeiros passos no Cash Engine PRO" />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <Label className="text-xs uppercase tracking-wide">Subtítulo</Label>
                <Input placeholder="Chamada curta para o aluno" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wide">Categoria</Label>
                <Select defaultValue="comece-aqui">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {trainingCategories.map((c) => (
                      <SelectItem key={c.key} value={c.key}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wide">Status</Label>
                <Select defaultValue="rascunho">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rascunho">Rascunho</SelectItem>
                    <SelectItem value="publicado">Publicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wide">Permissões · Admin</Label>
                <div className="flex items-center justify-between rounded-lg border border-border bg-background/60 px-3 py-2">
                  <span className="text-sm">Criar, editar e publicar</span>
                  <BadgeCheck className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wide">Permissões · Produtor</Label>
                <div className="flex items-center justify-between rounded-lg border border-border bg-background/60 px-3 py-2">
                  <span className="text-sm">Visualizar conteúdos liberados</span>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wide">Permissões · Afiliado</Label>
                <div className="flex items-center justify-between rounded-lg border border-border bg-background/60 px-3 py-2">
                  <span className="text-sm">Visualizar treinamentos de afiliado</span>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="md:col-span-2 rounded-lg border border-dashed border-border p-5 text-center">
                <Video className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium">Adicionar vídeo, descrição e ordem</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Área preparada para upload, campos de descrição por aula e ordenação com drag &
                  drop.
                </p>
              </div>
              <div className="md:col-span-2 flex flex-wrap items-center justify-end gap-2">
                <Button variant="outline">Descartar</Button>
                <Button variant="outline" className="gap-1.5">
                  <GripVertical className="h-3.5 w-3.5" />
                  Ordenar aulas
                </Button>
                <Button className="gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  Salvar treinamento
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progresso">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Acompanhamento de alunos</CardTitle>
              <CardDescription>
                Estrutura preparada para exibir progresso, última aula assistida e módulos
                concluídos por usuário.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {!loading &&
                ["Kelvin", "Ana Prado", "Rafael Lima", "Bruno Reis", "Marina Prado", "Victor"].map(
                  (name, i) => (
                    <div
                      key={name}
                      className="rounded-xl border border-border bg-background/60 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {name[0]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {i % 3 === 0 ? "Produtor" : i % 3 === 1 ? "Afiliado" : "Admin"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 space-y-2 text-xs">
                        {trainings.slice(0, 2).map((t) => {
                          const progress = (i + 1 + (t.progressPercent % 50)) % 100;
                          return (
                            <div key={t.id}>
                              <div className="flex items-center justify-between">
                                <span className="truncate pr-2 text-muted-foreground">
                                  {t.title}
                                </span>
                                <span className="tabular-nums font-medium">{progress}%</span>
                              </div>
                              <Progress value={progress} className="mt-1 h-1.5" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ),
                )}
              {loading && <CardsSkeleton count={6} />}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function KpiTile({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-2 text-2xl font-semibold tracking-tight tabular-nums",
          accent ? "text-primary" : "text-foreground",
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function TrainingRow({ training }: { training: Training }) {
  const lessons = training.modules.reduce((a, m) => a + m.lessons.length, 0);
  return (
    <tr className="transition-colors hover:bg-muted/40">
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-14 shrink-0 rounded-md" style={{ background: training.cover }} />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">{training.title}</p>
            <p className="text-xs text-muted-foreground line-clamp-1">{training.subtitle}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3">
        <Badge variant="secondary">
          {trainingCategories.find((c) => c.key === training.category)?.label}
        </Badge>
      </td>
      <td className="px-5 py-3 text-right tabular-nums">
        <span className="font-medium">{formatInt(training.modules.length)}</span>
        <span className="text-muted-foreground"> / {formatInt(lessons)}</span>
      </td>
      <td className="px-5 py-3">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
            training.status === "publicado"
              ? "bg-emerald-500/10 text-emerald-700"
              : "bg-amber-500/10 text-amber-700",
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {training.status === "publicado" ? "Publicado" : "Rascunho"}
        </span>
      </td>
      <td className="px-5 py-3 text-xs tabular-nums text-muted-foreground">
        {formatDateTime(training.publishedAt).split(" ")[0]}
      </td>
      <td className="px-5 py-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="gap-2">
              <Eye className="h-3.5 w-3.5" />
              Visualizar
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Pencil className="h-3.5 w-3.5" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <GripVertical className="h-3.5 w-3.5" />
              Ordenar aulas
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2">
              {training.status === "publicado" ? (
                <>
                  <ShieldX className="h-3.5 w-3.5 text-amber-600" />
                  Despublicar
                </>
              ) : (
                <>
                  <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Publicar
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-rose-600">
              <Trash2 className="h-3.5 w-3.5" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
