import { useState } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import { ROUTES } from "@shared/constants";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      if (res.status === 401) {
        setError("Mot de passe incorrect.");
        return;
      }
      if (res.status === 503) {
        setError(
          "L'authentification administrateur n'est pas configurée côté serveur.",
        );
        return;
      }
      if (!res.ok) {
        setError("Une erreur est survenue. Réessayez plus tard.");
        return;
      }
      await utils.auth.me.invalidate();
      setLocation(ROUTES.ADMIN);
    } catch {
      setError("Impossible de joindre le serveur.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <section className="min-h-[70vh] flex items-center justify-center py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-card rounded-lg shadow-sm border border-border p-8 md:p-10">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
              Espace Marie
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              Connectez-vous pour accéder au tableau de bord.
            </p>

            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  autoComplete="current-password"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || password.length === 0}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? "Connexion..." : "Se connecter"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
