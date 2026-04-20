import { useRoute, Link } from "wouter";
import { Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { ROUTES } from "@shared/constants";

function formatDate(input: Date | string | null | undefined): string {
  if (!input) return "";
  const d = input instanceof Date ? input : new Date(input);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Minimal markdown-ish rendering: double newline → paragraph, single newline → br.
// Keeps scope tight; we can swap for react-markdown later if needed.
function renderBody(content: string) {
  const paragraphs = content.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return paragraphs.map((p, idx) => {
    if (p.startsWith("## ")) {
      return (
        <h2 key={idx} className="font-serif text-2xl md:text-3xl font-bold mt-10 mb-4">
          {p.slice(3)}
        </h2>
      );
    }
    if (p.startsWith("### ")) {
      return (
        <h3 key={idx} className="font-serif text-xl md:text-2xl font-bold mt-8 mb-3">
          {p.slice(4)}
        </h3>
      );
    }
    const lines = p.split("\n");
    return (
      <p key={idx} className="text-lg leading-relaxed mb-5 text-foreground/90">
        {lines.map((l, i) => (
          <span key={i}>
            {l}
            {i < lines.length - 1 && <br />}
          </span>
        ))}
      </p>
    );
  });
}

export default function BlogArticle() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug ?? "";
  const article = trpc.blog.getBySlug.useQuery(
    { slug },
    { enabled: slug.length > 0 },
  );

  return (
    <Layout>
      <section className="relative py-14 md:py-20 starfield -mt-16 md:-mt-20 pt-28 md:pt-36 overflow-hidden">
        <div className="absolute inset-0 starfield-twinkle mix-blend-screen opacity-70 pointer-events-none" />
        <div className="relative container mx-auto px-4">
          <Link href={ROUTES.BLOG}>
            <a className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Tous les articles
            </a>
          </Link>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <article className="max-w-3xl mx-auto">
            {article.isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-accent" />
              </div>
            ) : article.error || !article.data ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-6">
                  Cet article n'existe pas ou n'est plus disponible.
                </p>
                <Link href={ROUTES.BLOG}>
                  <a className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-accent text-accent rounded-full font-semibold hover:bg-accent hover:text-accent-foreground transition-colors">
                    Retour au blog
                  </a>
                </Link>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {article.data.publishedAt && (
                  <p className="uppercase tracking-[0.25em] text-accent text-xs font-medium mb-4">
                    {formatDate(article.data.publishedAt)}
                  </p>
                )}
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-8 leading-[1.1]">
                  {article.data.title}
                </h1>
                {article.data.excerpt && (
                  <p className="text-xl text-muted-foreground mb-10 leading-relaxed italic font-serif">
                    {article.data.excerpt}
                  </p>
                )}
                <div className="border-t border-border pt-10">
                  {renderBody(article.data.content)}
                </div>

                <div className="mt-16 pt-8 border-t border-border text-center">
                  <Link href={ROUTES.BLOG}>
                    <a className="inline-flex items-center gap-2 text-accent font-semibold hover:underline underline-offset-4">
                      <ArrowLeft className="w-4 h-4" />
                      Tous les articles
                    </a>
                  </Link>
                </div>
              </motion.div>
            )}
          </article>
        </div>
      </section>
    </Layout>
  );
}
