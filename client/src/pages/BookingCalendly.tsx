import { useEffect } from "react";
import Layout from "@/components/Layout";
import { ROUTES } from "@shared/constants";
import { Link } from "wouter";

/**
 * Booking Page with Calendly Integration
 * 
 * Calendly URL should be set in environment variables:
 * VITE_CALENDLY_URL=https://calendly.com/marie-username
 * 
 * This page embeds the Calendly widget for appointment booking.
 * Calendly handles availability, scheduling, and reminders automatically.
 */
export default function BookingCalendly() {
  useEffect(() => {
    // Load Calendly script
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const calendlyUrl = import.meta.env.VITE_CALENDLY_URL;

  if (!calendlyUrl) {
    return (
      <Layout>
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6">
                Réserver un rendez-vous
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                La réservation en ligne n'est pas encore configurée. Veuillez nous contacter directement par email.
              </p>
              <a
                href="mailto:marie@example.com"
                className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Nous Contacter
              </a>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-card border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6">
            Réserver un rendez-vous
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choisissez un créneau disponible pour votre consultation privée. 
            Une séance de 60-90 minutes pour une lecture intuitive et des guidances personnalisées.
          </p>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {[
              {
                icon: "⏰",
                title: "Durée",
                description: "Les consultations durent 60 à 90 minutes selon vos besoins.",
              },
              {
                icon: "💬",
                title: "Format",
                description: "Rendez-vous en ligne via visio ou en personne selon votre préférence.",
              },
              {
                icon: "💳",
                title: "Tarif",
                description: "79€ pour une consultation privée complète avec tirage et guidance.",
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calendly Widget */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Calendly Embed */}
            <div
              className="calendly-inline-widget"
              data-url={calendlyUrl}
              style={{ minWidth: "100%", height: "700px" }}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-12 text-center">
            Questions Fréquentes
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "Comment se déroule la consultation ?",
                a: "Nous commençons par discuter de vos questions et préoccupations. Je fais ensuite un tirage intuitif adapté à votre situation et vous propose des guidances spirituelles personnalisées basées sur votre profil astrologique.",
              },
              {
                q: "Dois-je préparer quelque chose ?",
                a: "Non, il n'y a rien à préparer. Venez avec vos questions et votre ouverture. Si possible, ayez votre date, heure et lieu de naissance à portée de main.",
              },
              {
                q: "Puis-je reprogrammer ou annuler ?",
                a: "Oui, vous pouvez modifier ou annuler votre rendez-vous directement depuis le lien de confirmation que vous recevrez par email.",
              },
              {
                q: "Y a-t-il une garantie de satisfaction ?",
                a: "Je m'engage à vous offrir une consultation de qualité. Si vous n'êtes pas satisfait, nous pouvons discuter d'une solution.",
              },
            ].map((item, idx) => (
              <div key={idx} className="border-b border-border pb-6 last:border-b-0">
                <h3 className="text-lg font-serif font-bold text-foreground mb-3">
                  {item.q}
                </h3>
                <p className="text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
              Vous préférez un livret astral ?
            </h2>
            <p className="text-muted-foreground mb-8">
              Découvrez notre livret astrologique personnalisé avec analyse complète de votre profil.
            </p>
            <Link href={ROUTES.BOOKLET}>
              <a className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Découvrir le Livret Astral
              </a>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
