import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DayPicker } from "react-day-picker";
import { fr } from "date-fns/locale";
import {
  addDays,
  startOfDay,
  endOfDay,
  format,
  isSameDay,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Clock, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { ROUTES } from "@shared/constants";
import { Link } from "wouter";
import "react-day-picker/style.css";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Slot {
  start: string;
  end: string;
}

const ContactFormSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().max(20).optional(),
  message: z.string().max(5000).optional(),
});

type ContactFormData = z.infer<typeof ContactFormSchema>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatSlotTime(isoString: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoString));
}

function formatSlotRange(slot: Slot): string {
  return `${formatSlotTime(slot.start)} – ${formatSlotTime(slot.end)}`;
}

function formatDateParis(isoString: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(isoString));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Stepper({
  step,
}: {
  step: 1 | 2 | 3;
}) {
  const items = [
    { id: 1, label: "Date" },
    { id: 2, label: "Créneau" },
    { id: 3, label: "Contact" },
  ] as const;
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-6 mb-10 text-xs sm:text-sm">
      {items.map((item, idx) => {
        const state =
          item.id < step ? "done" : item.id === step ? "active" : "todo";
        return (
          <div key={item.id} className="flex items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2">
              <span
                className={[
                  "inline-flex items-center justify-center w-7 h-7 rounded-full font-semibold text-xs border transition-all",
                  state === "done"
                    ? "bg-accent text-accent-foreground border-accent"
                    : state === "active"
                      ? "border-accent text-accent bg-card"
                      : "border-border text-muted-foreground bg-card",
                ].join(" ")}
              >
                {state === "done" ? <Check className="w-3.5 h-3.5" /> : item.id}
              </span>
              <span
                className={[
                  "font-semibold tracking-wide",
                  state === "todo" ? "text-muted-foreground" : "text-foreground",
                ].join(" ")}
              >
                {item.label}
              </span>
            </div>
            {idx < items.length - 1 && (
              <span
                className={[
                  "hidden sm:block w-8 md:w-12 h-px",
                  item.id < step ? "bg-accent" : "bg-border",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

interface CalendarCardProps {
  today: Date;
  maxDate: Date;
  selectedDay: Date | undefined;
  onSelect: (day: Date | undefined) => void;
  availableDates: Set<string>;
}

function CalendarCard({
  today,
  maxDate,
  selectedDay,
  onSelect,
  availableDates,
}: CalendarCardProps) {
  return (
    <div className="bg-card rounded-3xl p-4 sm:p-6 md:p-8 border border-border/70 shadow-sm">
      <DayPicker
        mode="single"
        selected={selectedDay}
        onSelect={onSelect}
        locale={fr}
        weekStartsOn={1}
        disabled={[{ before: today }, { after: maxDate }]}
        showOutsideDays
        components={{
          Chevron: ({ orientation }) =>
            orientation === "left" ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            ),
        }}
        modifiers={{
          hasSlot: (date) =>
            availableDates.has(format(date, "yyyy-MM-dd")),
        }}
        modifiersClassNames={{
          hasSlot: "rdp-has-slot",
        }}
        classNames={{
          root: "marie-dp w-full",
          months: "flex justify-center",
          month: "w-full",
          month_caption:
            "flex items-center justify-center mb-4 font-serif text-xl md:text-2xl font-semibold text-foreground capitalize",
          caption_label: "capitalize",
          nav: "absolute top-2 right-2 flex gap-2",
          button_previous:
            "p-2 rounded-full hover:bg-accent/10 text-foreground transition-colors disabled:opacity-30",
          button_next:
            "p-2 rounded-full hover:bg-accent/10 text-foreground transition-colors disabled:opacity-30",
          month_grid: "w-full border-collapse",
          weekdays: "grid grid-cols-7 mb-2",
          weekday:
            "text-muted-foreground text-[11px] md:text-xs font-semibold uppercase tracking-wider py-2",
          week: "grid grid-cols-7",
          day: "aspect-square p-0.5",
          day_button:
            "w-full h-full flex items-center justify-center rounded-full text-sm md:text-base font-medium transition-all hover:bg-accent/15 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/40",
          today: "font-bold ring-1 ring-accent/40 rounded-full",
          selected:
            "!bg-accent !text-accent-foreground !font-semibold !rounded-full shadow-md shadow-accent/25",
          disabled:
            "text-muted-foreground/30 !hover:bg-transparent cursor-not-allowed",
          outside: "text-muted-foreground/40",
        }}
      />
      <style>{`
        .marie-dp { position: relative; }
        .marie-dp .rdp-nav_button_previous,
        .marie-dp .rdp-nav_button_next { display: none; }
        .marie-dp .rdp-day_button.rdp-has-slot::after {
          content: "";
          position: absolute;
          bottom: 4px;
          left: 50%;
          width: 4px;
          height: 4px;
          border-radius: 9999px;
          background: var(--accent);
          transform: translateX(-50%);
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}

interface SlotGridProps {
  slots: Slot[];
  selected: Slot | null;
  onSelect: (slot: Slot) => void;
  isLoading: boolean;
}

function SlotGrid({ slots, selected, onSelect, isLoading }: SlotGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-16 rounded-2xl bg-border/60 animate-pulse" />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center">
        <Clock className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground text-sm">
          Aucun créneau disponible ce jour — choisissez une autre date.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {slots.map((slot) => {
        const isSelected = selected?.start === slot.start;
        return (
          <motion.button
            key={slot.start}
            type="button"
            onClick={() => onSelect(slot)}
            whileTap={{ scale: 0.97 }}
            className={[
              "relative px-3 py-4 rounded-2xl text-sm font-semibold border transition-all",
              isSelected
                ? "bg-accent text-accent-foreground border-accent shadow-lg shadow-accent/25"
                : "bg-card text-foreground border-border hover:border-accent hover:bg-accent/5",
            ].join(" ")}
          >
            <span className="block text-base md:text-lg">
              {formatSlotTime(slot.start)}
            </span>
            <span
              className={[
                "block text-[11px] mt-0.5",
                isSelected ? "text-accent-foreground/80" : "text-muted-foreground",
              ].join(" ")}
            >
              1h30
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Booking() {
  const today = startOfDay(new Date());
  const maxDate = addDays(today, 56);

  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  // Pre-fetch availability for the full 8-week window to light up dates that have slots.
  const { data: rangeSlots = [] } = trpc.availability.getAvailableSlots.useQuery(
    {
      from: today.toISOString(),
      to: endOfDay(maxDate).toISOString(),
    },
    { staleTime: 60_000 },
  );

  const availableDates = useMemo(() => {
    const set = new Set<string>();
    for (const s of rangeSlots as Slot[]) {
      set.add(format(new Date(s.start), "yyyy-MM-dd"));
    }
    return set;
  }, [rangeSlots]);

  const dailySlots = useMemo(() => {
    if (!selectedDay) return [];
    return (rangeSlots as Slot[]).filter((s) =>
      isSameDay(new Date(s.start), selectedDay),
    );
  }, [rangeSlots, selectedDay]);

  const createAppointment = trpc.appointment.create.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactFormSchema),
  });

  const onDaySelect = (day: Date | undefined) => {
    setSelectedDay(day);
    setSelectedSlot(null);
  };

  const onSlotSelect = (slot: Slot) => {
    setSelectedSlot(slot);
    // Smoothly scroll to the form after a slot is picked
    requestAnimationFrame(() => {
      document
        .getElementById("booking-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const onSubmit = async (data: ContactFormData) => {
    if (!selectedSlot) return;
    try {
      await createAppointment.mutateAsync({
        ...data,
        appointmentDate: selectedSlot.start,
      });
      setConfirmed(true);
      toast.success("Créneau pré-réservé avec succès !");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Une erreur s'est produite.";
      if (message.includes("Créneau déjà réservé")) {
        toast.error("Ce créneau vient d'être pris. Veuillez en choisir un autre.");
        setSelectedSlot(null);
      } else {
        toast.error(message);
      }
    }
  };

  const step: 1 | 2 | 3 = !selectedDay ? 1 : !selectedSlot ? 2 : 3;

  // ── Confirmation screen ───────────────────────────────────────────────────

  if (confirmed) {
    return (
      <Layout>
        <section className="relative min-h-[70vh] flex items-center justify-center py-16 overflow-hidden starfield -mt-16 md:-mt-20 pt-32 md:pt-40">
          <div className="absolute inset-0 starfield-twinkle mix-blend-screen opacity-70 pointer-events-none" />
          <div className="relative container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="max-w-2xl mx-auto bg-card/95 backdrop-blur-sm rounded-3xl p-10 md:p-14 border border-border shadow-xl"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/15 text-accent mb-6 mx-auto">
                <Sparkles className="w-7 h-7" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6 leading-tight">
                Créneau pré-réservé
              </h1>
              {selectedSlot && (
                <p className="text-lg text-accent font-semibold mb-4">
                  {formatDateParis(selectedSlot.start)}
                  <br />à {formatSlotTime(selectedSlot.start)}
                </p>
              )}
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Vous recevrez un email de confirmation sous peu. Je me réjouis
                de vous rencontrer et d'explorer votre univers astrologique.
              </p>
              <Link href={ROUTES.HOME}>
                <a className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-full font-semibold hover:shadow-lg hover:shadow-accent/30 transition-all">
                  Retour à l'accueil
                </a>
              </Link>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  // ── Main booking flow ─────────────────────────────────────────────────────

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden starfield -mt-16 md:-mt-20 pt-32 md:pt-40">
        <div className="absolute inset-0 starfield-twinkle mix-blend-screen opacity-70 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none">
          <span className="absolute top-[28%] left-[14%] text-accent/70 text-xl float-slow">✦</span>
          <span className="absolute top-[40%] right-[18%] text-accent/60 text-lg float-slow" style={{ animationDelay: "2s" }}>✧</span>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <p className="uppercase tracking-[0.3em] text-accent text-xs md:text-sm font-medium mb-5">
            Consultation privée · 79&nbsp;€
          </p>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-[1.05]">
            Réserver un <span className="italic text-accent">rendez-vous</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Choisissez une date, puis un créneau de 1h30 pour une séance de
            tirage, de guidance ou une lecture intuitive.
          </p>
        </div>
      </section>

      {/* Info strip */}
      <section className="py-10 md:py-14 bg-background border-b border-border/60">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-3 md:gap-8 max-w-3xl mx-auto">
            {[
              { title: "1h30", sub: "de consultation" },
              { title: "Visio ou présentiel", sub: "au choix" },
              { title: "79 €", sub: "séance complète" },
            ].map((item) => (
              <div
                key={item.title}
                className="text-center rounded-2xl bg-card border border-border/60 px-4 py-5 md:py-6"
              >
                <p className="font-serif text-lg md:text-2xl font-bold text-accent mb-1">
                  {item.title}
                </p>
                <p className="text-[11px] md:text-sm text-muted-foreground uppercase tracking-wider">
                  {item.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking flow */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Stepper step={step} />

            {/* 1. Calendar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground mb-5 tracking-tight">
                Choisissez une date
              </h2>
              <CalendarCard
                today={today}
                maxDate={maxDate}
                selectedDay={selectedDay}
                onSelect={onDaySelect}
                availableDates={availableDates}
              />
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Les dates avec un point doré ont des créneaux disponibles.
              </p>
            </motion.div>

            {/* 2. Slots */}
            <AnimatePresence mode="wait">
              {selectedDay && (
                <motion.div
                  key={format(selectedDay, "yyyy-MM-dd")}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="mb-8"
                >
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground mb-1 tracking-tight">
                    Choisissez un créneau
                  </h2>
                  <p className="text-sm text-muted-foreground mb-5 capitalize">
                    {format(selectedDay, "EEEE d MMMM yyyy", { locale: fr })}
                  </p>
                  <div className="bg-card rounded-3xl p-5 md:p-8 border border-border/70 shadow-sm">
                    <SlotGrid
                      slots={dailySlots}
                      selected={selectedSlot}
                      onSelect={onSlotSelect}
                      isLoading={false}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 3. Form */}
            <AnimatePresence>
              {selectedSlot && (
                <motion.div
                  key="form"
                  id="booking-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground mb-1 tracking-tight">
                    Vos coordonnées
                  </h2>
                  <p className="text-sm text-accent font-semibold mb-5">
                    {formatDateParis(selectedSlot.start)} · {formatSlotRange(selectedSlot)}
                  </p>
                  <div className="bg-card rounded-3xl p-6 md:p-10 border border-border/70 shadow-sm">
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Prénom *
                          </label>
                          <input
                            type="text"
                            {...register("firstName")}
                            className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 bg-background text-foreground"
                            placeholder="Sophie"
                          />
                          {errors.firstName && (
                            <p className="text-red-600 text-xs mt-1">
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
                            className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 bg-background text-foreground"
                            placeholder="Dupont"
                          />
                          {errors.lastName && (
                            <p className="text-red-600 text-xs mt-1">
                              {errors.lastName.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            {...register("email")}
                            className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 bg-background text-foreground"
                            placeholder="vous@exemple.com"
                          />
                          {errors.email && (
                            <p className="text-red-600 text-xs mt-1">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Téléphone
                          </label>
                          <input
                            type="tel"
                            {...register("phone")}
                            className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 bg-background text-foreground"
                            placeholder="+33 6 12 34 56 78"
                          />
                          {errors.phone && (
                            <p className="text-red-600 text-xs mt-1">
                              {errors.phone.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Message (optionnel)
                        </label>
                        <textarea
                          {...register("message")}
                          className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 bg-background text-foreground"
                          placeholder="Quelques mots sur ce qui vous amène…"
                          rows={4}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || createAppointment.isPending}
                        className="w-full px-6 py-4 bg-accent text-accent-foreground rounded-full font-semibold text-base hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting || createAppointment.isPending
                          ? "Réservation en cours…"
                          : "Confirmer ma réservation"}
                      </button>

                      <p className="text-xs text-muted-foreground text-center">
                        Vos données sont traitées de manière confidentielle.
                      </p>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 text-center max-w-xl">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-3">
            Vous préférez un livret astral ?
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Un document complet analysant votre profil astrologique, à
            emporter avec vous.
          </p>
          <Link href={ROUTES.BOOKLET}>
            <a className="inline-flex items-center gap-2 px-6 py-3 border-2 border-accent text-accent rounded-full font-semibold hover:bg-accent hover:text-accent-foreground transition-colors">
              Découvrir le Livret Astral →
            </a>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
