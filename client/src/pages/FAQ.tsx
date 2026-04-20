import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Layout from "@/components/Layout";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqItems: FAQItem[] = [
  {
    category: "Général",
    question: "Qu'est-ce que l'astrologie ?",
    answer:
      "L'astrologie est l'étude de la position et du mouvement des astres et de leur influence sur la vie humaine. Elle offre un langage pour comprendre les patterns et les cycles qui structurent notre existence.",
  },
  {
    category: "Général",
    question: "L'astrologie est-elle scientifique ?",
    answer:
      "L'astrologie n'est pas une science au sens strict, mais plutôt un système symbolique et intuitif. Elle complète bien les approches scientifiques pour offrir une compréhension plus holistique de nous-mêmes.",
  },
  {
    category: "Livret Astral",
    question: "Qu'est-ce qu'un livret astral personnalisé ?",
    answer:
      "Un livret astral est un document complet analysant votre profil astrologique unique : votre signe solaire, lunaire, ascendant, positions planétaires et maisons astrologiques, avec des guidances adaptées.",
  },
  {
    category: "Livret Astral",
    question: "Combien de temps pour recevoir mon livret ?",
    answer:
      "Généralement 3 à 5 jours ouvrables après votre commande. Je prépare chaque livret avec attention et intention.",
  },
  {
    category: "Livret Astral",
    question: "Que faire si je ne connais pas mon heure de naissance ?",
    answer:
      "Vous pouvez laisser ce champ vide ou approximatif. Contactez-moi pour discuter des options. L'heure de naissance affecte surtout l'ascendant et les maisons.",
  },
  {
    category: "Livret Astral",
    question: "Le livret est-il vraiment personnalisé ?",
    answer:
      "Absolument ! Chaque livret est créé en fonction de vos données astrologiques uniques. Je ne propose pas de modèles génériques.",
  },
  {
    category: "Rendez-vous",
    question: "Combien coûte une consultation ?",
    answer:
      "Les consultations commencent à partir de 80€. Les tarifs varient selon la durée et le type de consultation. Contactez-moi pour les détails.",
  },
  {
    category: "Rendez-vous",
    question: "Combien de temps dure une consultation ?",
    answer:
      "Les consultations durent généralement 60 à 90 minutes selon vos besoins et les sujets à explorer.",
  },
  {
    category: "Rendez-vous",
    question: "Proposez-vous des consultations en ligne ?",
    answer:
      "Oui, je propose des consultations en ligne via visio ainsi que des rendez-vous en personne selon votre préférence.",
  },
  {
    category: "Rendez-vous",
    question: "Comment se déroule une consultation ?",
    answer:
      "Nous commençons par discuter de vos intentions et de vos questions. Ensuite, j'explore votre thème astrologique et les influences actuelles pour vous offrir des guidances adaptées.",
  },
  {
    category: "Confidentialité",
    question: "Mes données sont-elles sécurisées ?",
    answer:
      "Oui, vos données sont traitées de manière confidentielle et sécurisée. Je respecte la politique de confidentialité et les régulations en vigueur.",
  },
  {
    category: "Confidentialité",
    question: "Recevrai-je des emails marketing ?",
    answer:
      "Non, vous ne recevrez que les emails essentiels relatifs à votre commande ou rendez-vous. Je respecte votre vie privée.",
  },
];

export default function FAQ() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const categories = Array.from(new Set(faqItems.map((item) => item.category)));

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden starfield -mt-16 md:-mt-20 pt-32 md:pt-40">
        <div className="absolute inset-0 starfield-twinkle mix-blend-screen opacity-70 pointer-events-none" />
        <div className="relative container mx-auto px-4 text-center">
          <p className="uppercase tracking-[0.3em] text-accent text-xs md:text-sm font-medium mb-5">
            Vos questions
          </p>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-[1.05]">
            Questions <span className="italic text-accent">fréquentes</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Trouvez les réponses à vos questions sur l'astrologie, mes services
            et le processus de commande.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {categories.map((category) => (
              <div key={category} className="mb-12">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-6">
                  {category}
                </h2>

                <div className="space-y-4">
                  {faqItems
                    .filter((item) => item.category === category)
                    .map((item, idx) => {
                      const itemId = `${category}-${idx}`;
                      const isExpanded = expandedId === itemId as string;

                      return (
                        <div
                          key={itemId}
                          className="bg-card rounded-lg border border-border overflow-hidden"
                        >
                          <button
                            onClick={() =>
                              setExpandedId(isExpanded ? null : itemId)
                            }
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted transition-colors text-left"
                          >
                            <h3 className="font-semibold text-foreground">
                              {item.question}
                            </h3>
                            <ChevronDown
                              className={`w-5 h-5 text-accent transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {isExpanded && (
                            <div className="px-6 py-4 border-t border-border bg-background">
                              <p className="text-muted-foreground">
                                {item.answer}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
            Vous n'avez pas trouvé votre réponse ?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            N'hésitez pas à me contacter directement. Je serais ravie de répondre à vos questions.
          </p>
          <a
            href="mailto:marie@lestiragesdemarie.fr"
            className="inline-block px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Me contacter
          </a>
        </div>
      </section>
    </Layout>
  );
}
