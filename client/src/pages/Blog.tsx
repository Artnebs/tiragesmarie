import Layout from "@/components/Layout";
import { ROUTES } from "@shared/constants";
import { Link } from "wouter";

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "Comprendre votre signe solaire",
      excerpt:
        "Découvrez ce que votre signe solaire révèle sur votre essence profonde et votre identité cosmique.",
      category: "Astrologie",
      date: "15 avril 2026",
      slug: "comprendre-signe-solaire",
    },
    {
      id: 2,
      title: "Les phases lunaires et votre énergie",
      excerpt:
        "Comment les cycles lunaires influencent votre énergie, vos émotions et vos cycles de vie.",
      category: "Lune",
      date: "10 avril 2026",
      slug: "phases-lunaires-energie",
    },
    {
      id: 3,
      title: "Mercure rétrograde : ce qu'il faut savoir",
      excerpt:
        "Démystifions Mercure rétrograde et explorons comment naviguer cette période astrologique.",
      category: "Transits",
      date: "5 avril 2026",
      slug: "mercure-retrograde",
    },
    {
      id: 4,
      title: "L'ascendant : votre masque cosmique",
      excerpt:
        "Apprenez comment votre ascendant façonne votre première impression et votre apparence.",
      category: "Astrologie",
      date: "1er avril 2026",
      slug: "ascendant-masque-cosmique",
    },
    {
      id: 5,
      title: "Les maisons astrologiques expliquées",
      excerpt:
        "Une introduction complète aux 12 maisons astrologiques et leur influence sur votre vie.",
      category: "Astrologie",
      date: "25 mars 2026",
      slug: "maisons-astrologiques",
    },
    {
      id: 6,
      title: "Vénus et l'amour : votre style relationnel",
      excerpt:
        "Découvrez comment Vénus dans votre thème natal influence votre approche de l'amour et des relations.",
      category: "Planètes",
      date: "20 mars 2026",
      slug: "venus-amour-relations",
    },
  ];

  const categories = Array.from(
    new Set(blogPosts.map((post) => post.category))
  );

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-card border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6">
            Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explorez des articles sur l'astrologie, la guidance spirituelle et le développement personnel.
          </p>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          {/* Categories */}
          <div className="flex flex-wrap gap-3 justify-center mb-16">
            <button className="px-6 py-2 bg-accent text-accent-foreground rounded-full font-semibold hover:opacity-90 transition-opacity">
              Tous
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 border-2 border-accent text-accent rounded-full font-semibold hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {post.date}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                    {post.title}
                  </h3>

                  <p className="text-muted-foreground mb-4 flex-1">
                    {post.excerpt}
                  </p>

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

          {/* Pagination */}
          <div className="flex justify-center gap-2">
            <button className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
              1
            </button>
            <button className="px-4 py-2 border-2 border-accent text-accent rounded-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-colors">
              2
            </button>
            <button className="px-4 py-2 border-2 border-accent text-accent rounded-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-colors">
              Suivant →
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Abonnez-vous au blog
            </h2>
            <p className="text-muted-foreground">
              Recevez les nouveaux articles directement dans votre boîte mail.
            </p>
          </div>

          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              S'abonner
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Nous respectons votre vie privée. Désinscription possible à tout moment.
          </p>
        </div>
      </section>
    </Layout>
  );
}
