import { Link } from "wouter";
import Layout from "@/components/Layout";
import { ROUTES } from "@shared/constants";

export default function PaymentCancel() {
  return (
    <Layout>
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="text-6xl mb-6">🌙</div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6">
              Paiement annulé
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Votre paiement a été annulé. Aucun montant n'a été débité. Vous pouvez recommencer à tout moment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={ROUTES.BOOKLET}>
                <a className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Commander un livret
                </a>
              </Link>
              <Link href={ROUTES.HOME}>
                <a className="inline-block px-6 py-3 border border-border text-foreground rounded-lg font-semibold hover:bg-card transition-colors">
                  Retour à l'accueil
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
