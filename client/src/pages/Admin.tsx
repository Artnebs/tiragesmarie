import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import Layout from "@/components/Layout";
import { Link } from "wouter";
import { ROUTES } from "@shared/constants";

export default function Admin() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <Layout>
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6">
                Accès Admin
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Vous devez être connecté pour accéder au back-office.
              </p>
              <a
                href={getLoginUrl()}
                className="inline-block px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Se connecter
              </a>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground">
              Back-Office Admin
            </h1>
            <button
              onClick={() => logout()}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Déconnexion
            </button>
          </div>

          <p className="text-lg text-muted-foreground mb-12">
            Bienvenue, {user?.name || "Admin"} !
          </p>

          {/* Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "Demandes de livrets",
                description: "Gérer les demandes de livrets astrologiques",
                icon: "📖",
                link: "#requests",
              },
              {
                title: "Rendez-vous",
                description: "Voir et gérer les réservations de rendez-vous",
                icon: "📅",
                link: "#appointments",
              },
              {
                title: "Contenu",
                description: "Content Engine - Générer du contenu",
                icon: "✍️",
                link: "#content",
              },
              {
                title: "Blog",
                description: "Gérer les articles du blog",
                icon: "📝",
                link: "#blog",
              },
              {
                title: "Livrets générés",
                description: "Voir les livrets générés et leur statut",
                icon: "📊",
                link: "#booklets",
              },
              {
                title: "IA Agent (Bientôt)",
                description: "Placeholder pour intégration IA future",
                icon: "🤖",
                link: "#ai",
              },
            ].map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-border hover:border-accent"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </a>
            ))}
          </div>

          {/* Placeholder Sections */}
          <div className="space-y-12">
            {/* Requests */}
            <section id="requests" className="bg-card rounded-lg p-8 shadow-sm">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
                Demandes de livrets
              </h2>
              <p className="text-muted-foreground mb-4">
                Section en développement. Vous pourrez ici voir et gérer toutes les demandes de livrets astrologiques.
              </p>
              <div className="bg-background rounded-lg p-4 text-muted-foreground text-sm">
                Fonctionnalités : Lister les demandes, filtrer par statut, voir les détails, marquer comme complétée, etc.
              </div>
            </section>

            {/* Appointments */}
            <section id="appointments" className="bg-card rounded-lg p-8 shadow-sm">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
                Rendez-vous
              </h2>
              <p className="text-muted-foreground mb-4">
                Section en développement. Vous pourrez ici voir et gérer toutes les réservations de rendez-vous.
              </p>
              <div className="bg-background rounded-lg p-4 text-muted-foreground text-sm">
                Fonctionnalités : Calendrier, lister les rendez-vous, confirmer/annuler, envoyer des rappels, etc.
              </div>
            </section>

            {/* Content Engine */}
            <section id="content" className="bg-card rounded-lg p-8 shadow-sm">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
                Content Engine
              </h2>
              <p className="text-muted-foreground mb-4">
                Section en développement. Générez du contenu pour Instagram, le blog et des textes de guidance.
              </p>
              <div className="bg-background rounded-lg p-4 text-muted-foreground text-sm">
                Fonctionnalités : Générer des posts Instagram, des articles blog, des textes de guidance, éditer et publier.
              </div>
            </section>

            {/* Blog */}
            <section id="blog" className="bg-card rounded-lg p-8 shadow-sm">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
                Gestion du blog
              </h2>
              <p className="text-muted-foreground mb-4">
                Section en développement. Gérez les articles du blog, les catégories et les meta tags.
              </p>
              <div className="bg-background rounded-lg p-4 text-muted-foreground text-sm">
                Fonctionnalités : Créer/éditer/supprimer articles, gérer les catégories, optimiser SEO, etc.
              </div>
            </section>

            {/* Generated Booklets */}
            <section id="booklets" className="bg-card rounded-lg p-8 shadow-sm">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
                Livrets générés
              </h2>
              <p className="text-muted-foreground mb-4">
                Section en développement. Suivi des livrets générés et de leur statut de distribution.
              </p>
              <div className="bg-background rounded-lg p-4 text-muted-foreground text-sm">
                Fonctionnalités : Lister les livrets, voir les statuts, télécharger, renvoyer par email, etc.
              </div>
            </section>

            {/* AI Agent Placeholder */}
            <section id="ai" className="bg-card rounded-lg p-8 shadow-sm border-2 border-dashed border-accent">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🤖</div>
                <div className="flex-1">
                  <h2 className="text-3xl font-serif font-bold text-foreground mb-2">
                    IA Agent (Bientôt disponible)
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Cette section est prête pour une intégration future d'un agent IA. L'agent pourra :
                  </p>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>• Générer automatiquement du contenu (posts, articles, guidances)</li>
                    <li>• Répondre aux messages des clients</li>
                    <li>• Gérer les communications</li>
                    <li>• Assister dans la création de livrets</li>
                  </ul>
                  <p className="text-muted-foreground text-sm mt-4">
                    L'architecture est prête pour l'activation. Contactez le support pour activer cette fonctionnalité.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-12">
            <Link href={ROUTES.HOME}>
              <a className="inline-block px-6 py-3 border-2 border-accent text-accent rounded-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-colors">
                Retour au site
              </a>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
