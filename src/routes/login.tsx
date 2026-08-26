import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, ArrowRight, Zap, TrendingUp, CreditCard, Users } from "lucide-react";
import { toast } from "sonner";
import { useTempAuth } from "@/lib/auth-temp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar · Cash Engine PRO" },
      {
        name: "description",
        content: "Acesse sua conta na Cash Engine PRO.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { user, isAuthed, isLoading, login } = useTempAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("nightmare");
  const [password, setPassword] = useState("Ke170707");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthed) {
      navigate({ to: "/app", replace: true }).catch(() => {});
    }
  }, [isAuthed, isLoading, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      const loggedUser = await login(username, password);
      if (loggedUser) {
        toast.success(`Bem-vindo, ${loggedUser.name}!`);
        navigate({ to: "/app" }).catch(() => {});
      } else {
        toast.error("Usuário ou senha incorretos");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-6xl grid gap-0 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl lg:grid-cols-2">
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <Card className="w-full max-w-sm border-0 shadow-none">
            <CardHeader className="space-y-2 px-0 pb-6">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Zap className="h-4.5 w-4.5" />
                </span>
                <span className="text-sm font-bold uppercase leading-tight tracking-[0.14em] text-foreground">
                  Cash Engine
                  <span className="block text-[10px] font-semibold tracking-[0.28em] text-primary">
                    PRO
                  </span>
                </span>
              </div>
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Acessar Cash Engine PRO
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Entre com suas credenciais
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-5 px-0">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Usuário
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="username"
                    placeholder="nightmare"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Senha
                    </Label>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Esqueci minha senha
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Checkbox
                    id="remember"
                    checked={remember}
                    onCheckedChange={(v) => setRemember(v === true)}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-normal text-muted-foreground cursor-pointer"
                  >
                    Lembrar-me
                  </Label>
                </div>
                <Button
                  type="submit"
                  disabled={submitting || isLoading}
                  className="w-full h-10 gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Entrando...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4" />
                      Entrar
                    </>
                  )}
                </Button>
              </CardContent>
            </form>
            <CardFooter className="px-0 pt-6 text-center">
              <p className="w-full text-xs text-muted-foreground">
                Primeiro acesso?{" "}
                <span className="text-foreground font-medium">Contate o administrador.</span>
              </p>
            </CardFooter>
          </Card>
        </div>

        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0a0a1a] via-[#12122a] to-[#0a0a1a] p-10 lg:flex">
          <div className="pointer-events-none absolute inset-0 tech-glow opacity-60" />
          <div className="pointer-events-none absolute inset-0 tech-grid opacity-20" />
          <div className="relative z-10">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <Zap className="h-5 w-5" />
              </span>
              <span className="text-base font-bold uppercase leading-tight tracking-[0.16em] text-white">
                Cash Engine
                <span className="block text-[11px] font-semibold tracking-[0.3em] text-primary">
                  PRO
                </span>
              </span>
            </div>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-primary">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="mt-3 text-2xl font-bold text-white">R$ 2,4M</div>
                <div className="text-[11px] text-muted-foreground">Volume processado</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div className="mt-3 text-2xl font-bold text-white">98,7%</div>
                <div className="text-[11px] text-muted-foreground">Aprovação checkout</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-violet-400">
                  <Users className="h-4 w-4" />
                </div>
                <div className="mt-3 text-2xl font-bold text-white">+12k</div>
                <div className="text-[11px] text-muted-foreground">Afiliados ativos</div>
              </div>
            </div>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-white">
                Tudo que você precisa. <span className="text-primary">Em uma plataforma.</span>
              </h3>
              <p className="text-sm text-muted-foreground">
                Infraestrutura completa para escalar suas vendas com segurança.
              </p>
            </div>
            <ul className="space-y-3">
              {[
                "Painel em tempo real",
                "Checkout com alta conversão",
                "Rede ilimitada de afiliados",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/90">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Zap className="h-3.5 w-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
