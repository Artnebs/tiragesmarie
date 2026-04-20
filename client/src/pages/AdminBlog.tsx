import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Loader2,
  Plus,
  Trash2,
  Eye,
  Pencil,
  Save,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { ROUTES } from "@shared/constants";

type EditorState =
  | { mode: "list" }
  | { mode: "new" }
  | { mode: "edit"; id: number };

// ---- helpers -----------------------------------------------------------------

const emptyDraft = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  metaDescription: "",
  keywords: "",
  status: "draft" as "draft" | "published",
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

// ---- main --------------------------------------------------------------------

export default function AdminBlog() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [state, setState] = useState<EditorState>({ mode: "list" });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation(ROUTES.ADMIN_LOGIN);
    }
  }, [isAuthenticated, loading, setLocation]);

  const articles = trpc.blog.listAll.useQuery(
    { limit: 100, offset: 0 },
    { enabled: isAuthenticated },
  );
  const createArticle = trpc.blog.create.useMutation();
  const updateArticle = trpc.blog.update.useMutation();
  const deleteArticle = trpc.blog.remove.useMutation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }
  if (!isAuthenticated) return null;

  const list = articles.data ?? [];

  // ---- list view ----
  if (state.mode === "list") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-10">
            <div>
              <button
                onClick={() => setLocation(ROUTES.ADMIN)}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
              >
                <ArrowLeft className="w-4 h-4" />
                Tableau de bord
              </button>
              <h1 className="font-serif text-4xl font-bold text-foreground mb-1">
                Blog
              </h1>
              <p className="text-muted-foreground">
                Rédigez et publiez vos articles. {list.length} article{list.length > 1 ? "s" : ""}.
              </p>
            </div>
            <Button
              onClick={() => setState({ mode: "new" })}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouvel article
            </Button>
          </div>

          {articles.isLoading ? (
            <Card className="p-10 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
            </Card>
          ) : list.length === 0 ? (
            <Card className="p-10 text-center">
              <p className="text-muted-foreground mb-4">
                Aucun article pour le moment.
              </p>
              <Button onClick={() => setState({ mode: "new" })} className="gap-2">
                <Plus className="w-4 h-4" />
                Créer le premier article
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {list.map((a: any) => (
                <Card
                  key={a.id}
                  className="p-5 flex flex-col md:flex-row md:items-center gap-4 hover:border-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          a.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {a.status === "published" ? "Publié" : "Brouillon"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        /{a.slug}
                      </span>
                    </div>
                    <p className="font-serif text-lg font-bold text-foreground truncate">
                      {a.title}
                    </p>
                    {a.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                        {a.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {a.status === "published" && (
                      <a
                        href={`/blog/${a.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                        title="Voir l'article"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setState({ mode: "edit", id: a.id })}
                      className="gap-1"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Éditer
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-red-600 hover:text-red-700"
                      disabled={deleteArticle.isPending}
                      onClick={async () => {
                        if (!window.confirm(`Supprimer « ${a.title} » ?`)) return;
                        try {
                          await deleteArticle.mutateAsync({ id: a.id });
                          toast.success("Article supprimé");
                          articles.refetch();
                        } catch (err) {
                          toast.error(
                            err instanceof Error ? err.message : "Erreur",
                          );
                        }
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---- editor view ----
  return (
    <ArticleEditor
      state={state}
      onBack={() => setState({ mode: "list" })}
      onSaved={() => {
        articles.refetch();
        setState({ mode: "list" });
      }}
      createArticle={createArticle}
      updateArticle={updateArticle}
    />
  );
}

// ---- editor sub-component ----------------------------------------------------

interface EditorProps {
  state: { mode: "new" } | { mode: "edit"; id: number };
  onBack: () => void;
  onSaved: () => void;
  createArticle: ReturnType<typeof trpc.blog.create.useMutation>;
  updateArticle: ReturnType<typeof trpc.blog.update.useMutation>;
}

function ArticleEditor({
  state,
  onBack,
  onSaved,
  createArticle,
  updateArticle,
}: EditorProps) {
  const existing = trpc.blog.getById.useQuery(
    { id: state.mode === "edit" ? state.id : 0 },
    { enabled: state.mode === "edit" },
  );

  const [draft, setDraft] = useState(emptyDraft);
  const [slugEdited, setSlugEdited] = useState(false);

  useEffect(() => {
    if (state.mode === "edit" && existing.data) {
      setDraft({
        title: existing.data.title,
        slug: existing.data.slug,
        content: existing.data.content,
        excerpt: existing.data.excerpt ?? "",
        metaDescription: existing.data.metaDescription ?? "",
        keywords: existing.data.keywords ?? "",
        status: existing.data.status,
      });
      setSlugEdited(true);
    } else if (state.mode === "new") {
      setDraft(emptyDraft);
      setSlugEdited(false);
    }
  }, [state.mode, existing.data]);

  const submitting = createArticle.isPending || updateArticle.isPending;

  async function save(publish: boolean) {
    const payload = {
      ...draft,
      status: publish ? ("published" as const) : draft.status,
    };
    try {
      if (state.mode === "new") {
        await createArticle.mutateAsync(payload as any);
        toast.success(publish ? "Article publié" : "Brouillon enregistré");
      } else {
        await updateArticle.mutateAsync({ id: state.id, ...payload } as any);
        toast.success(publish ? "Article publié" : "Modifications enregistrées");
      }
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    }
  }

  const isLoading = state.mode === "edit" && existing.isLoading;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste
        </button>

        {isLoading ? (
          <Card className="p-10 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-accent" />
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
            {/* Main editor */}
            <Card className="p-6 md:p-10 space-y-5">
              <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                {state.mode === "new" ? "Nouvel article" : "Modifier l'article"}
              </h1>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setDraft((d) => ({
                      ...d,
                      title,
                      slug: slugEdited ? d.slug : slugify(title),
                    }));
                  }}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 bg-background text-foreground text-lg font-serif"
                  placeholder="Comprendre votre signe solaire"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Slug (URL)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">/blog/</span>
                  <input
                    type="text"
                    value={draft.slug}
                    onChange={(e) => {
                      setSlugEdited(true);
                      setDraft((d) => ({ ...d, slug: slugify(e.target.value) }));
                    }}
                    className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 bg-background text-foreground text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Extrait (optionnel — affiché en liste)
                </label>
                <textarea
                  value={draft.excerpt}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, excerpt: e.target.value }))
                  }
                  rows={2}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 bg-background text-foreground"
                  placeholder="Une phrase d'accroche pour la liste…"
                  maxLength={500}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Contenu *
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  Double saut de ligne pour un nouveau paragraphe. Préfixez
                  avec <code className="bg-muted px-1 rounded">## </code>
                  pour un titre de section.
                </p>
                <textarea
                  value={draft.content}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, content: e.target.value }))
                  }
                  rows={18}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 bg-background text-foreground font-serif leading-relaxed"
                  placeholder={"Votre signe solaire est l'essence même de votre personnalité…\n\n## Comprendre son signe solaire\n\nLe signe solaire correspond à la position du Soleil au moment de votre naissance…"}
                />
              </div>
            </Card>

            {/* Side panel */}
            <div className="space-y-4">
              <Card className="p-5">
                <h3 className="font-semibold text-foreground mb-3 text-sm">
                  Publication
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Statut actuel :
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      draft.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {draft.status === "published" ? "Publié" : "Brouillon"}
                  </span>
                </p>
                <div className="space-y-2">
                  <Button
                    onClick={() => save(false)}
                    disabled={submitting || !draft.title || !draft.content}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Enregistrer brouillon
                  </Button>
                  <Button
                    onClick={() => save(true)}
                    disabled={submitting || !draft.title || !draft.content || draft.content.length < 50}
                    className="w-full gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    {draft.status === "published" ? "Mettre à jour" : "Publier"}
                  </Button>
                </div>
                {draft.content.length < 50 && draft.content.length > 0 && (
                  <p className="text-xs text-amber-700 mt-3">
                    Le contenu doit faire au moins 50 caractères.
                  </p>
                )}
              </Card>

              <Card className="p-5">
                <h3 className="font-semibold text-foreground mb-3 text-sm">
                  SEO (optionnel)
                </h3>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Meta description
                </label>
                <textarea
                  value={draft.metaDescription}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, metaDescription: e.target.value }))
                  }
                  maxLength={160}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 bg-background text-foreground text-sm"
                />
                <p className="text-[11px] text-muted-foreground text-right mt-1">
                  {draft.metaDescription.length}/160
                </p>

                <label className="block text-xs font-semibold text-foreground mb-1 mt-3">
                  Mots-clés
                </label>
                <input
                  type="text"
                  value={draft.keywords}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, keywords: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 bg-background text-foreground text-sm"
                  placeholder="astrologie, signe solaire, …"
                />
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
