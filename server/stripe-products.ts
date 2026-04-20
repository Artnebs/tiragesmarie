/**
 * Stripe Products Configuration
 * Définit les produits et services vendables
 */

export const STRIPE_PRODUCTS = {
  booklet: {
    id: "booklet_astral",
    name: "Livret Astral Personnalisé",
    description:
      "Un livret astrologique complet analysant votre profil unique avec signe solaire, lunaire, ascendant et influences planétaires.",
    priceInCents: 4900, // 49€
    currency: "eur",
    metadata: {
      type: "booklet",
      category: "astrology",
    },
  },
  appointment: {
    id: "consultation_session",
    name: "Consultation Privée - Tirage & Guidance",
    description:
      "Une séance privée de 60-90 minutes pour une lecture intuitive, des guidances personnalisées et l'exploration de votre destinée astrologique.",
    priceInCents: 7900, // 79€
    currency: "eur",
    metadata: {
      type: "appointment",
      category: "consultation",
    },
  },
};

/**
 * Récupérer le produit par type
 */
export function getProductByType(type: "booklet" | "appointment") {
  return STRIPE_PRODUCTS[type];
}

/**
 * Formater le prix pour l'affichage (centimes -> euros)
 */
export function formatPrice(priceInCents: number, currency: string = "eur") {
  const priceInEuros = priceInCents / 100;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(priceInEuros);
}
