import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Plus,
  Reply,
  Share2,
  ShieldCheck,
  Sparkles,
  Users2,
} from "lucide-react";
import { communityPosts, type CommunityPost, type CommunityReply } from "@/lib/mock/data";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/app/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useFakeLoading } from "@/components/app/Skeletons";

function roleChip(role: CommunityPost["role"]) {
  switch (role) {
    case "Admin":
      return "bg-primary/10 text-primary border-primary/20";
    case "Produtor":
      return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
    default:
      return "bg-amber-500/10 text-amber-700 border-amber-500/20";
  }
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "");
}

function PostCard({ post }: { post: CommunityPost }) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [showReplies, setShowReplies] = useState(true);

  function toggleLike() {
    if (liked) {
      setLikes((n) => Math.max(0, n - 1));
    } else {
      setLikes((n) => n + 1);
    }
    setLiked((v) => !v);
  }

  return (
    <article className="rounded-xl border border-border bg-card shadow-sm">
      <header className="flex items-start gap-3 px-5 pt-5">
        <Avatar className="h-10 w-10 shrink-0 ring-2 ring-background">
          <AvatarFallback className={cn("bg-gradient-to-br text-white", post.avatarColor)}>
            {initials(post.author)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-foreground">{post.author}</p>
            <Badge variant="outline" className={cn("h-5 px-1.5 text-[10px]", roleChip(post.role))}>
              {post.role}
            </Badge>
            {post.mock && (
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px] gap-1 bg-muted/60">
                <Sparkles className="h-2.5 w-2.5" />
                Dado demonstrativo
              </Badge>
            )}
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground tabular-nums">
            {formatDateTime(post.createdAt)}
          </p>
        </div>
      </header>

      <CardContent className="pt-3 pb-3">
        <p className="whitespace-pre-wrap text-[14.5px] leading-relaxed text-foreground">
          {post.content}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn("gap-1.5", liked && "text-rose-600")}
            onClick={toggleLike}
          >
            <Heart className={cn("h-4 w-4", liked && "fill-current")} />
            <span className="tabular-nums text-xs">{likes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={() => setShowReplies((v) => !v)}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="tabular-nums text-xs">{post.replies.length}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5">
            <Share2 className="h-4 w-4" />
            <span className="text-xs">Compartilhar</span>
          </Button>
        </div>

        {showReplies && post.replies.length > 0 && (
          <div className="mt-4 space-y-3 border-t border-border pt-4">
            {post.replies.map((r) => (
              <ReplyCard key={r.id} reply={r} />
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-background/60 p-2">
          <Input
            placeholder="Escreva um comentário..."
            className="border-0 shadow-none focus-visible:ring-0"
          />
          <Button size="sm" variant="outline" className="gap-1.5">
            <Reply className="h-3.5 w-3.5" />
            Responder
          </Button>
        </div>
      </CardContent>
    </article>
  );
}

function ReplyCard({ reply }: { reply: CommunityReply }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-muted/30 p-3">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className={cn("bg-gradient-to-br text-white", reply.avatarColor)}>
          {initials(reply.author)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-foreground">{reply.author}</p>
          <span className="text-[10px] text-muted-foreground tabular-nums">
            {formatDateTime(reply.createdAt)}
          </span>
        </div>
        <p className="mt-1 text-[13.5px] leading-relaxed text-foreground/90">{reply.content}</p>
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <button className="inline-flex items-center gap-1 hover:text-rose-600 transition">
            <Heart className="h-3.5 w-3.5" />
            <span className="tabular-nums">{reply.likes}</span>
          </button>
          <button className="inline-flex items-center gap-1 hover:text-foreground transition">
            <Reply className="h-3.5 w-3.5" />
            Responder
          </button>
        </div>
      </div>
    </div>
  );
}

export function CommunityPage() {
  const loading = useFakeLoading();
  const posts = communityPosts;

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className="gap-1.5 bg-primary/5 text-primary border-primary/20"
            >
              <ShieldCheck className="h-3 w-3" />
              Dados demonstrativos
            </Badge>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Comunidade</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Converse com produtores, afiliados e o time Cash Engine PRO.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1.5">
            <Users2 className="h-4 w-4" />
            Membros
          </Button>
          <Button className="gap-1.5">
            <Plus className="h-4 w-4" />
            Novo post
          </Button>
        </div>
      </header>

      <div className="mt-6 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-gradient-to-br from-primary to-blue-500 text-white">
              K
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Input placeholder="Compartilhe uma dúvida, dica ou novidade..." />
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-muted-foreground">
                Posts são moderados. Conteúdos ofensivos serão removidos.
              </p>
              <Button size="sm" className="gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Publicar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-6 space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-11/12" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </Card>
          ))
        ) : posts.length === 0 ? (
          <EmptyState
            icon={MessageCircle}
            title="A comunidade está começando agora"
            description="Seja o primeiro a publicar uma mensagem e engajar outros membros."
          />
        ) : (
          posts.map((p) => <PostCard key={p.id} post={p} />)
        )}
      </section>
    </div>
  );
}
