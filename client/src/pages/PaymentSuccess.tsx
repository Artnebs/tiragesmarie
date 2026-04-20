import { useEffect, useRef, useState } from "react";
import { useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Layout from "@/components/Layout";
import { ROUTES } from "@shared/constants";

type PaymentState =
  | { phase: "polling" }
  | { phase: "succeeded"; productType: string | null; customerName: string | null }
  | { phase: "timeout" }
  | { phase: "error"; message: string };

function getSessionId(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("session_id");
}

export default function PaymentSuccess() {
  const [, navigate] = useLocation();
  const sessionId = getSessionId();
  const [state, setState] = useState<PaymentState>({ phase: "polling" });
  const pollCount = useRef(0);
  const MAX_POLLS = 15; // ~30s at 2s intervals
  const POLL_INTERVAL_MS = 2000;

  const statusQuery = trpc.stripe.getPaymentStatus.useQuery(
    { sessionId: sessionId ?? "" },
    {
      enabled: !!sessionId && state.phase === "polling",
      refetchInterval: state.phase === "polling" ? POLL_INTERVAL_MS : false,
      retry: false,
    }
  );

  useEffect(() => {
    if (!sessionId) {
      navigate(ROUTES.HOME);
      return;
    }
  }, [sessionId, navigate]);

  useEffect(() => {
    if (state.phase !== "polling") return;
    if (!statusQuery.data) return;

    pollCount.current += 1;
    const { status, productType, customerName } = statusQuery.data;

    if (status === "succeeded" || status === "paid") {
      setState({ phase: "succeeded", productType: productType ?? null, customerName: customerName ?? null });
      return;
    }

    if (pollCount.current >= MAX_POLLS) {
      setState({ phase: "timeout" });
    }
  }, [statusQuery.data, state.phase]);

  useEffect(() => {
    if (statusQuery.isError && state.phase === "polling") {
      setState({ phase: "error", message: "Impossible de vérifier le paiement." });
    }
  }, [statusQuery.isError, state.phase]);

  if (!sessionId) return null;

  if (state.phase === "polling") {
    return (
      <Layout>
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="text-6xl mb-6 animate-pulse">✨</div>
              <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
                Confirmation en cours...
              </h1>
              <p className="text-muted-foreground">
                Nous confirmons votre paiement avec Stripe. Cela prend quelques secondes.
              </p>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (state.phase === "succeeded") {
    const isBooklet = state.productType === "booklet";
    const firstName = state.customerName?.split(" ")[0] ?? null;

    return (
      <Layout>
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="text-6xl mb-6">🌟</div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6">
                Merci{firstName ? `, ${firstName}` : ""} !
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                Votre paiement a bien été reçu.
              </p>
              {isBooklet ? (
                <p className="text-lg text-muted-foreground mb-8">
                  Votre livret astral personnalisé est en cours de préparation. Vous le recevrez par email dans les 3 à 5 jours ouvrables.
                </p>
              ) : (
                <p className="text-lg text-muted-foreground mb-8">
                  Votre consultation privée a été confirmée. Vous recevrez bientôt une confirmation par email avec tous les détails.
                </p>
              )}
              <Link href={ROUTES.HOME}>
                <a className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Retour à l'accueil
                </a>
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (state.phase === "timeout") {
    return (
      <Layout>
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="text-6xl mb-6">⏳</div>
              <h1 className="text-4xl font-serif font-bold text-foreground mb-6">
                Confirmation en attente
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Votre paiement a bien été effectué, mais la confirmation prend plus de temps que prévu. Vous recevrez un email de confirmation très prochainement.
              </p>
              <Link href={ROUTES.HOME}>
                <a className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Retour à l'accueil
                </a>
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  // error state
  return (
    <Layout>
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="text-6xl mb-6">⚠️</div>
            <h1 className="text-4xl font-serif font-bold text-foreground mb-6">
              Une erreur est survenue
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {"message" in state ? state.message : "Erreur inconnue."} Si votre paiement a été débité, contactez-nous.
            </p>
            <Link href={ROUTES.CONTACT}>
              <a className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Nous contacter
              </a>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
