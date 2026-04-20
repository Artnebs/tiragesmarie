import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DayPicker } from "react-day-picker";
import { fr } from "date-fns/locale";
import { addDays, startOfDay, endOfDay, isSameDay, format } from "date-fns";
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

interface SlotGridProps {
  slots: Slot[];
  selected: Slot | null;
  onSelect: (slot: Slot) => void;
  isLoading: boolean;
}

function SlotGrid({ slots, selected, onSelect, isLoading }: SlotGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-12 rounded-lg bg-border animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <p className="text-muted-foreground text-sm mt-4 text-center">
        Aucun créneau disponible ce jour.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
      {slots.map((slot) => {
        const isSelected = selected?.start === slot.start;
        return (
          <button
            key={slot.start}
            type="button"
            onClick={() => onSelect(slot)}
            className={[
              "px-3 py-3 rounded-lg text-sm font-semibold border transition-all",
              isSelected
                ? "bg-accent text-accent-foreground border-accent shadow-md scale-105"
                : "bg-background text-foreground border-border hover:border-accent hover:text-accent",
            ].join(" ")}
          >
            {formatSlotTime(slot.start)}
          </button>
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

  // Query available slots for the selected day
  const {
    data: slots = [],
    isLoading: slotsLoading,
    isFetching: slotsFetching,
  } = trpc.availability.getAvailableSlots.useQuery(
    selectedDay
      ? {
          from: startOfDay(selectedDay).toISOString(),
          to: endOfDay(selectedDay).toISOString(),
        }
      : { from: today.toISOString(), to: today.toISOString() },
    {
      enabled: !!selectedDay,
      staleTime: 30_000,
    }
  );

  const createAppointment = trpc.appointment.create.useMutation();

  const {
    register,
    handleSubmit,
    reset,
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
        toast.error("Ce créneau vient d'être réservé. Veuillez en choisir un autre.");
        setSelectedSlot(null);
      } else {
        toast.error(message);
      }
    }
  };

  // ── Confirmation screen ───────────────────────────────────────────────────

  if (confirmed) {
    return (
      <Layout>
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto bg-card rounded-2xl p-12 shadow-sm border border-border">
              <div className="text-6xl mb-6">*</div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
                Créneau pré-réservé !
              </h1>
              {selectedSlot && (
                <p className="text-lg text-accent font-semibold mb-4">
                  {formatDateParis(selectedSlot.start)} à{" "}
                  {formatSlotTime(selectedSlot.start)}
                </p>
              )}
              <p className="text-muted-foreground mb-4">
                Votre créneau est pré-réservé, nous vous confirmerons par email.
              </p>
              <p className="text-muted-foreground mb-8">
                Je me réjouis de vous rencontrer et d'explorer votre univers
                astrologique ensemble.
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

  // ── Main booking flow ─────────────────────────────────────────────────────

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-20 bg-card border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6">
            Réserver un rendez-vous
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Prenez rendez-vous pour une consultation privée ou une séance de
            tirage et de guidance.
          </p>
        </div>
      </section>

      {/* Info strip */}
      <section className="py-12 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "⏰",
                title: "Durée",
                description: "Les consultations durent 90 minutes.",
              },
              {
                icon: "💬",
                title: "Format",
                description:
                  "Rendez-vous en ligne via visio ou en personne selon votre préférence.",
              },
              {
                icon: "💳",
                title: "Tarif",
                description: "79 € pour une consultation complète.",
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-serif font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking area */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-10 text-center">
              Choisissez votre créneau
            </h2>

            {/* Step 1: Pick a date + Step 2: Pick a slot */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
              {/* Calendar */}
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                <p className="text-sm font-semibold text-foreground mb-4">
                  1. Sélectionnez une date
                </p>
                <div className="flex justify-center">
                  <DayPicker
                    mode="single"
                    selected={selectedDay}
                    onSelect={onDaySelect}
                    locale={fr}
                    disabled={[
                      { before: today },
                      { after: maxDate },
                    ]}
                    classNames={{
                      root: "w-full",
                      today: "font-bold text-accent",
                      selected:
                        "!bg-accent !text-accent-foreground rounded-full",
                      day_button:
                        "hover:bg-accent/20 rounded-full transition-colors",
                    }}
                  />
                </div>
              </div>

              {/* Slot grid */}
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                {!selectedDay ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-10">
                    <p className="text-muted-foreground text-sm">
                      Sélectionnez un jour dans le calendrier pour voir les
                      créneaux disponibles.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-foreground mb-1">
                      2. Choisissez un créneau
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {format(selectedDay, "EEEE d MMMM yyyy", { locale: fr })}
                    </p>
                    <SlotGrid
                      slots={slots}
                      selected={selectedSlot}
                      onSelect={onSlotSelect}
                      isLoading={slotsLoading || slotsFetching}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Step 3: Contact form — revealed after slot selection */}
            {selectedSlot && (
              <div className="bg-card rounded-2xl p-8 md:p-12 border border-border shadow-sm">
                <div className="mb-8">
                  <p className="text-sm font-semibold text-foreground mb-1">
                    3. Vos coordonnées
                  </p>
                  <p className="text-accent font-semibold">
                    Créneau sélectionné :{" "}
                    {formatDateParis(selectedSlot.start)} à{" "}
                    {formatSlotRange(selectedSlot)}
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Row 1: Prénom & Nom */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        {...register("firstName")}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                        placeholder="Marie"
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
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                        placeholder="Dupont"
                      />
                      {errors.lastName && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Email & Téléphone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        {...register("email")}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                        placeholder="vous@exemple.com"
                      />
                      {errors.email && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Téléphone (optionnel)
                      </label>
                      <input
                        type="tel"
                        {...register("phone")}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                        placeholder="+33 6 12 34 56 78"
                      />
                      {errors.phone && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Message (optionnel)
                    </label>
                    <textarea
                      {...register("message")}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
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
                    disabled={isSubmitting || createAppointment.isPending}
                    className="w-full px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting || createAppointment.isPending
                      ? "Réservation en cours..."
                      : "Confirmer ma réservation"}
                  </button>

                  <p className="text-xs text-muted-foreground text-center">
                    * Champs obligatoires. Vos données sont traitées de manière
                    confidentielle.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 text-center max-w-xl">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
            Vous préférez un livret astral ?
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Découvrez notre livret astrologique personnalisé avec analyse
            complète de votre profil.
          </p>
          <Link href={ROUTES.BOOKLET}>
            <a className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Découvrir le Livret Astral
            </a>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
