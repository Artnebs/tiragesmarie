import { useMemo, useState } from "react";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

function formatDate(input: Date | string | null | undefined): string {
  if (!input) return "";
  const d = input instanceof Date ? input : new Date(input);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Blog() {
  const articles = trpc.blog.list.useQuery({ limit: 24, offset: 0 });
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const list = articles.data ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((a: any) =>
      `${a.title} ${a.excerpt ?? ""}`.toLowerCase().includes(q),
    );
  }, [articles.data, query]);

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-card border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6">
            Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Articles sur l'astrologie, la guidance spirituelle et le développement
            personnel.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto mb-12">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un article…"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {articles.isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
            </div>
          ) : articles.error ? (
            <p className="text-center text-muted-foreground">
              Impossible de charger les articles.
            </p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              {query
                ? `Aucun article pour « ${query} ».`
                : "Aucun article publié pour le moment. Revenez bientôt."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((post: any) => (
                <article
                  key={post.id}
                  className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="p-6 flex flex-col flex-1">
                    {post.publishedAt && (
                      <span className="text-xs text-muted-foreground mb-2">
                        {formatDate(post.publishedAt)}
                      </span>
                    )}
                    <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-muted-foreground mb-4 flex-1">
                        {post.excerpt}
                      </p>
                    )}
                    <a
                      href={`/blog/${post.slug}`}
                      className="inline-block text-accent font-semibold hover:text-accent-foreground transition-colors"
                    >
                      Lire l'article →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
