import { useRef } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { ROUTES, SERVICES } from "@shared/constants";
import Layout from "@/components/Layout";

const HERO_BACKGROUND =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663032226662/ShUkNE3tSckVw9ug4bUHBt/hero-background-eheYopB4dnj22rr2bLjRfg.webp";
const MARIE_PORTRAIT =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663032226662/ShUkNE3tSckVw9ug4bUHBt/marie-portrait-KCBi2bVqXk6y7uw7QxinkA.webp";
const ZODIAC_ILLUSTRATION =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663032226662/ShUkNE3tSckVw9ug4bUHBt/zodiac-illustration-bWCHQ8rxgfJCxxZDo8Bsnt.webp";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  // Parallax: background image drifts slowly up, stars drift faster, content drifts mid.
  // Parallax: gentle only, image mostly static so moon phases stay visible.
  const bgY = useTransform(scrollY, [0, 800], [0, 80]);
  const starsY = useTransform(scrollY, [0, 800], [0, -120]);
  const heroContentY = useTransform(scrollY, [0, 600], [0, 80]);
  const heroFade = useTransform(scrollY, [0, 400], [1, 0.35]);

  return (
    <Layout>
      {/* ================================= HERO ================================= */}
      <section
        ref={heroRef}
        className="relative min-h-[88vh] md:min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background image (parallax) — anchored to top so moon phases sit
            fully below the nav, not cropped behind it. `bg-top` aligns the
            top edge of the image with the top of the hero section. */}
        <motion.div
          style={{ y: bgY, backgroundImage: `url(${HERO_BACKGROUND})` }}
          className="absolute inset-0 bg-cover bg-top"
        />
        {/* Soft bottom fade into the page background (for seamless section
            transition) — no top darkening here, nav already has its own
            glass treatment over the image. */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-background/95" />
        {/* Twinkle layer (CSS keyframe) */}
        <div className="absolute inset-0 starfield-twinkle pointer-events-none mix-blend-screen opacity-70" />

        {/* Floating decorative stars (parallax counter-drift) */}
        <motion.div
          style={{ y: starsY }}
          className="absolute inset-0 pointer-events-none"
        >
          <span className="absolute top-[14%] left-[10%] text-accent/70 text-xl float-slow">✦</span>
          <span className="absolute top-[22%] right-[14%] text-accent/80 text-2xl float-slow" style={{ animationDelay: "1.5s" }}>✧</span>
          <span className="absolute top-[38%] left-[78%] text-accent/60 text-sm float-slow" style={{ animationDelay: "2.2s" }}>✦</span>
          <span className="absolute top-[55%] left-[6%] text-accent/60 text-lg float-slow" style={{ animationDelay: "3s" }}>✦</span>
          <span className="absolute top-[68%] right-[18%] text-accent/70 text-xl float-slow" style={{ animationDelay: "4.5s" }}>✧</span>
          <span className="absolute top-[82%] left-[30%] text-accent/50 text-sm float-slow" style={{ animationDelay: "5s" }}>✦</span>
          <span className="absolute top-[12%] left-[55%] text-white/40 text-xs float-slow" style={{ animationDelay: "2.8s" }}>·</span>
          <span className="absolute top-[46%] left-[22%] text-white/50 text-xs float-slow" style={{ animationDelay: "3.6s" }}>·</span>
          <span className="absolute top-[75%] left-[68%] text-white/40 text-xs float-slow" style={{ animationDelay: "1.2s" }}>·</span>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainer}
          style={{ y: heroContentY, opacity: heroFade }}
          className="relative container mx-auto px-4 text-center"
        >
          <div className="max-w-3xl mx-auto">
            <motion.div variants={fadeUp}>
              <p className="uppercase tracking-[0.3em] text-accent text-xs md:text-sm font-medium mb-6">
                Guidances &nbsp;✦&nbsp; Astrologie &nbsp;✦&nbsp; Intuition
              </p>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-[1.05] tracking-tight"
            >
              Votre ciel intérieur,
              <br />
              <span className="text-accent italic">révélé</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Des guidances spirituelles et des livrets astrologiques
              personnalisés, écrits pour vous seule, à partir de votre ciel de
              naissance.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-14"
            >
              <Link href={ROUTES.BOOKLET}>
                <a className="group px-8 py-4 bg-accent text-accent-foreground rounded-full font-semibold hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5 transition-all text-center">
                  Commander un livret astral
                  <span className="inline-block ml-1 transition-transform group-hover:translate-x-1">→</span>
                </a>
              </Link>
              <Link href={ROUTES.BOOKING}>
                <a className="px-8 py-4 border-2 border-white/70 text-white rounded-full font-semibold hover:bg-white hover:text-background transition-colors text-center">
                  Réserver un rendez-vous
                </a>
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center gap-2 text-white/60"
            >
              <span className="text-xs uppercase tracking-widest">Découvrir</span>
              <span className="animate-bounce text-accent text-2xl">↓</span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ================================= PRESENTATION ========================= */}
      <section className="py-20 md:py-28 bg-card">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="container mx-auto px-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            <motion.div variants={fadeUp} className="flex justify-center">
              <div className="relative">
                <img
                  src={MARIE_PORTRAIT}
                  alt="Marie"
                  className="w-full max-w-md rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/15 rounded-full blur-2xl" />
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-accent/20 rounded-full blur-xl" />
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <p className="uppercase tracking-[0.25em] text-accent text-xs font-medium mb-3">
                Qui suis-je
              </p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6 leading-[1.1]">
                Bienvenue,
                <br />
                je suis <span className="text-accent italic">Marie</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Depuis plus de quinze ans, j'accompagne celles et ceux qui
                cherchent du sens à leur parcours, à leurs cycles, à leurs
                rencontres.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Mon approche : une astrologie posée, claire, ancrée — avec une
                écoute qui respecte votre histoire.
              </p>
              <Link href={ROUTES.ABOUT}>
                <a className="inline-flex items-center gap-2 px-6 py-3 border-2 border-accent text-accent rounded-full font-semibold hover:bg-accent hover:text-accent-foreground transition-colors">
                  Mon parcours
                  <span>→</span>
                </a>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ================================= SERVICES ============================= */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="uppercase tracking-[0.25em] text-accent text-xs font-medium mb-3">
              Prestations
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 serif-divider">
              Trois portes d'entrée
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-6">
              Trois manières complémentaires d'explorer votre ciel et de
              recevoir une guidance adaptée à votre moment de vie.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {SERVICES.map((service) => (
              <motion.div
                key={service.id}
                variants={fadeUp}
                className="gold-glow bg-card rounded-2xl p-8 border border-border/60 text-center"
              >
                <div className="text-5xl mb-5">{service.icon}</div>
                <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>
                <Link href={ROUTES.SERVICES}>
                  <a className="inline-block text-accent font-semibold tracking-wide hover:underline underline-offset-4">
                    Découvrir →
                  </a>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================================= ZODIAC =============================== */}
      <section className="py-20 md:py-28 bg-card">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="container mx-auto px-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            <motion.div variants={fadeUp}>
              <p className="uppercase tracking-[0.25em] text-accent text-xs font-medium mb-3">
                Le livret astral
              </p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6 leading-[1.1]">
                Une trinité cosmique,
                <br />
                <span className="italic">la vôtre</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Votre signe solaire, votre lune et votre ascendant forment
                l'alphabet de votre ciel — la signature qui vous rend unique.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Je rédige chaque livret à la main, à partir de votre ciel de
                naissance précis.
              </p>
              <Link href={ROUTES.BOOKLET}>
                <a className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-accent-foreground rounded-full font-semibold hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5 transition-all">
                  Commander votre livret
                  <span>→</span>
                </a>
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="flex justify-center relative"
            >
              <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-full" />
              <img
                src={ZODIAC_ILLUSTRATION}
                alt="Zodiaque"
                className="relative w-full max-w-md float-slow"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ================================= TESTIMONIALS ========================= */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="uppercase tracking-[0.25em] text-accent text-xs font-medium mb-3">
              Témoignages
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 serif-divider">
              Ce qu'elles en disent
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                name: "Sophie",
                text: "Le livret astral m'a offert une perspective complètement nouvelle sur ma vie. Les insights étaient profonds et justes.",
              },
              {
                name: "Julien",
                text: "Marie a une capacité remarquable à capturer l'essence de mon profil. Vraiment transformateur.",
              },
              {
                name: "Émilie",
                text: "Les guidances reçues lors de ma consultation m'ont aidée à prendre des décisions avec plus de clarté.",
              },
            ].map((testimonial) => (
              <motion.div
                key={testimonial.name}
                variants={fadeUp}
                className="gold-glow bg-card rounded-2xl p-8 border border-border/60 relative"
              >
                <span className="absolute -top-3 left-6 text-accent text-4xl leading-none font-serif select-none">
                  “
                </span>
                <p className="text-muted-foreground mb-5 italic leading-relaxed">
                  {testimonial.text}
                </p>
                <p className="font-semibold text-foreground tracking-wide">
                  — {testimonial.name}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================================= CTA ================================== */}
      <section className="relative py-20 md:py-28 overflow-hidden starfield">
        <div className="absolute inset-0 starfield-twinkle mix-blend-screen opacity-70 pointer-events-none" />
        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-[1.1]">
              Prête à explorer votre destinée ?
            </h2>
            <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
              Commencez votre voyage astrologique avec un livret personnalisé
              ou une consultation privée.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={ROUTES.BOOKLET}>
                <a className="px-8 py-4 bg-accent text-accent-foreground rounded-full font-semibold hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-0.5 transition-all">
                  Livret astral — 49€
                </a>
              </Link>
              <Link href={ROUTES.BOOKING}>
                <a className="px-8 py-4 border-2 border-white/70 text-white rounded-full font-semibold hover:bg-white hover:text-background transition-colors">
                  Consultation — 79€
                </a>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
