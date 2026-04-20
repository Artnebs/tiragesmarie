import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { ROUTES } from "@shared/constants";
import { Link } from "wouter";

const BookletFormSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD"),
  timeOfBirth: z.string().regex(/^\d{2}:\d{2}$/, "Format: HH:MM"),
  placeOfBirth: z.string().min(2, "Le lieu doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  message: z.string().max(5000).optional(),
});

type BookletFormData = z.infer<typeof BookletFormSchema>;

const BOOKLET_MOCKUP =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663032226662/ShUkNE3tSckVw9ug4bUHBt/booklet-mockup-3uBktj2bWaFSRokvXmMuNj.webp";

export default function Booklet() {
  const [submitted, setSubmitted] = useState(false);
  const createBooklet = trpc.booklet.create.useMutation();
  const createCheckout = trpc.stripe.createBookletCheckout.useMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookletFormData>({
    resolver: zodResolver(BookletFormSchema),
  });

  const onSubmit = async (data: BookletFormData) => {
    try {
      const result = await createBooklet.mutateAsync(data);
      const checkout = await createCheckout.mutateAsync({
        bookletRequestId: result.requestId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      if (checkout.checkoutUrl) {
        window.location.href = checkout.checkoutUrl;
      } else {
        // Fallback: show confirmation if Stripe URL is missing
        setSubmitted(true);
        toast.success("Demande reçue ! Vous recevrez votre livret sous peu.");
      }
    } catch (error) {
      toast.error("Une erreur s'est produite. Veuillez réessayer.");
      console.error(error);
    }
  };

  if (submitted) {
    return (
      <Layout>
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="text-6xl mb-6">✨</div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6">
                Merci !
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Votre demande de livret astral a été reçue avec succès. Je vais préparer votre livret personnalisé avec attention et intention.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Vous recevrez votre livret par email dans les 3 à 5 jours ouvrables.
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

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden starfield -mt-16 md:-mt-20 pt-32 md:pt-40">
        <div className="absolute inset-0 starfield-twinkle mix-blend-screen opacity-70 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none">
          <span className="absolute top-[22%] left-[10%] text-accent/70 text-2xl float-slow">✦</span>
          <span className="absolute top-[60%] right-[12%] text-accent/70 text-xl float-slow" style={{ animationDelay: "2.5s" }}>✧</span>
          <span className="absolute bottom-[20%] left-[22%] text-accent/60 text-lg float-slow" style={{ animationDelay: "4s" }}>✦</span>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <p className="uppercase tracking-[0.3em] text-accent text-xs md:text-sm font-medium mb-5">
            49&nbsp;€ · envoi sous 7 jours
          </p>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-[1.05]">
            Livret Astral <span className="italic text-accent">Personnalisé</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Un document complet et élégant analysant votre profil astrologique
            unique, vos influences planétaires et votre destinée cosmique.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          {/* What's Included */}
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-12 text-center">
              Ce que vous recevrez
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                {[
                  {
                    title: "Couverture personnalisée",
                    description: "Avec votre nom et vos données de naissance",
                  },
                  {
                    title: "Signe solaire",
                    description:
                      "Votre essence profonde et votre identité cosmique",
                  },
                  {
                    title: "Signe lunaire",
                    description: "Vos émotions, votre monde intérieur",
                  },
                  {
                    title: "Ascendant",
                    description: "Votre apparence et votre première impression",
                  },
                  {
                    title: "Positions planétaires",
                    description: "L'influence de chaque planète dans votre thème",
                  },
                  {
                    title: "Maisons astrologiques",
                    description:
                      "Les domaines de vie influencés par votre thème",
                  },
                  {
                    title: "Guidances personnalisées",
                    description: "Des conseils adaptés à votre profil unique",
                  },
                  {
                    title: "Format PDF ou PowerPoint",
                    description: "À consulter ou à imprimer comme vous le souhaitez",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="text-accent text-2xl flex-shrink-0">✨</div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <img
                  src={BOOKLET_MOCKUP}
                  alt="Livret astral mockup"
                  className="w-full max-w-sm rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="max-w-2xl mx-auto bg-card rounded-lg p-8 md:p-12 shadow-sm">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-8 text-center">
              Commandez votre livret
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Row 1: Prénom & Nom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    {...register("firstName")}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Jean"
                  />
                  {errors.firstName && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    {...register("lastName")}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Dupont"
                  />
                  {errors.lastName && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Date & Heure */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Date de naissance (YYYY-MM-DD) *
                  </label>
                  <input
                    type="text"
                    {...register("dateOfBirth")}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="1990-05-15"
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Heure de naissance (HH:MM) *
                  </label>
                  <input
                    type="text"
                    {...register("timeOfBirth")}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="14:30"
                  />
                  {errors.timeOfBirth && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.timeOfBirth.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Lieu */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Lieu de naissance *
                </label>
                <input
                  type="text"
                  {...register("placeOfBirth")}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Paris, France"
                />
                {errors.placeOfBirth && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.placeOfBirth.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="vous@exemple.com"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Message (optionnel)
                </label>
                <textarea
                  {...register("message")}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Parlez-moi de vos intentions ou de vos questions..."
                  rows={4}
                />
                {errors.message && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || createBooklet.isPending || createCheckout.isPending}
                className="w-full px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || createBooklet.isPending || createCheckout.isPending
                  ? "Redirection vers le paiement..."
                  : "Commander mon livret — 49 €"}
              </button>

              <p className="text-xs text-muted-foreground text-center">
                * Champs obligatoires. Vos données sont traitées de manière confidentielle.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-12 text-center">
            Questions fréquentes
          </h2>

          <div className="max-w-2xl mx-auto space-y-6">
            {[
              {
                q: "Combien de temps pour recevoir mon livret ?",
                a: "Généralement 3 à 5 jours ouvrables après votre commande.",
              },
              {
                q: "Puis-je modifier mon livret après réception ?",
                a: "Oui, si vous recevez un fichier PowerPoint, vous pouvez le modifier comme vous le souhaitez.",
              },
              {
                q: "Que faire si je ne connais pas mon heure de naissance ?",
                a: "Vous pouvez laisser ce champ vide ou approximatif. Contactez-moi pour discuter des options.",
              },
              {
                q: "Le livret est-il vraiment personnalisé ?",
                a: "Absolument ! Chaque livret est créé en fonction de vos données astrologiques uniques.",
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-background rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  {item.q}
                </h3>
                <p className="text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
