import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { ROUTES } from "@shared/constants";
import { Link } from "wouter";

const AppointmentFormSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().max(20).optional(),
  appointmentDate: z.string().datetime("Format: YYYY-MM-DDTHH:MM"),
  message: z.string().max(5000).optional(),
});

type AppointmentFormData = z.infer<typeof AppointmentFormSchema>;

export default function Booking() {
  const [submitted, setSubmitted] = useState(false);
  const createAppointment = trpc.appointment.create.useMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(AppointmentFormSchema),
  });

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      await createAppointment.mutateAsync(data);
      setSubmitted(true);
      toast.success("Rendez-vous réservé ! Vous recevrez une confirmation par email.");
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
              <div className="text-6xl mb-6">🌙</div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6">
                Rendez-vous confirmé !
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Votre réservation a été enregistrée avec succès. Vous recevrez une confirmation par email avec tous les détails.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Je me réjouis de vous rencontrer et d'explorer votre univers astrologique ensemble.
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
      <section className="py-16 md:py-24 bg-card border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6">
            Réserver un rendez-vous
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Prenez rendez-vous pour une consultation privée ou une séance de tirage et de guidance.
          </p>
        </div>
      </section>

      {/* Content */}
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
                description: "À partir de 80€. Contactez-moi pour les tarifs spécifiques.",
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="max-w-2xl mx-auto bg-card rounded-lg p-8 md:p-12 shadow-sm">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-8 text-center">
              Formulaire de réservation
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

              {/* Row 2: Email & Téléphone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Téléphone (optionnel)
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="+33 6 12 34 56 78"
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Date & Heure */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Date et heure souhaitées (YYYY-MM-DDTHH:MM) *
                </label>
                <input
                  type="text"
                  {...register("appointmentDate")}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="2026-05-15T14:30"
                />
                {errors.appointmentDate && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.appointmentDate.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Indiquez vos disponibilités. Je confirmerai le créneau par email.
                </p>
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
                disabled={isSubmitting || createAppointment.isPending}
                className="w-full px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || createAppointment.isPending
                  ? "Réservation en cours..."
                  : "Réserver mon rendez-vous"}
              </button>

              <p className="text-xs text-muted-foreground text-center">
                * Champs obligatoires. Vos données sont traitées de manière confidentielle.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Availability Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-12 text-center">
            Mes disponibilités
          </h2>

          <div className="max-w-2xl mx-auto">
            <p className="text-center text-muted-foreground mb-8">
              Je propose des rendez-vous selon vos disponibilités. Voici mes créneaux généralement disponibles :
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { day: "Lundi", time: "14h - 19h" },
                { day: "Mardi", time: "10h - 17h" },
                { day: "Mercredi", time: "14h - 19h" },
                { day: "Jeudi", time: "10h - 17h" },
                { day: "Vendredi", time: "14h - 19h" },
                { day: "Samedi", time: "10h - 14h" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-background rounded-lg p-6 text-center border border-border"
                >
                  <p className="font-semibold text-foreground mb-2">
                    {item.day}
                  </p>
                  <p className="text-muted-foreground">{item.time}</p>
                </div>
              ))}
            </div>

            <p className="text-center text-muted-foreground mt-8">
              N'hésitez pas à proposer d'autres créneaux. Je ferai de mon mieux pour vous accommoder.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
