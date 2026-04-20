import { useState } from "react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Loader2,
  Mail,
  Calendar,
  BookOpen,
  Zap,
  LogOut,
  RefreshCw,
  PencilLine,
} from "lucide-react";
import { Link } from "wouter";
import { ROUTES } from "@shared/constants";

const BOOKLET_STATUSES = ["pending", "generated", "sent", "completed"] as const;
const APPOINTMENT_STATUSES = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
] as const;

const BOOKLET_STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  generated: "Livret généré",
  sent: "Envoyé",
  completed: "Terminé",
};

const APPOINTMENT_STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  completed: "Terminé",
  cancelled: "Annulé",
};

function statusPillClasses(status: string): string {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
    case "generated":
      return "bg-blue-100 text-blue-800";
    case "sent":
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
}

export default function AdminDashboard() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation(ROUTES.ADMIN_LOGIN);
    }
  }, [isAuthenticated, loading, setLocation]);

  const [bookletFilter, setBookletFilter] = useState<string>("all");
  const [apptFilter, setApptFilter] = useState<string>("all");

  const bookletRequests = trpc.booklet.list.useQuery(
    {
      status: bookletFilter === "all" ? undefined : bookletFilter,
      limit: 50,
      offset: 0,
    },
    { enabled: isAuthenticated },
  );

  const appointments = trpc.appointment.list.useQuery(
    {
      status: apptFilter === "all" ? undefined : apptFilter,
      limit: 50,
      offset: 0,
    },
    { enabled: isAuthenticated },
  );

  const updateBookletStatus = trpc.booklet.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Statut mis à jour");
      bookletRequests.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const updateAppointmentStatus = trpc.appointment.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Statut mis à jour");
      appointments.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const pendingBooklets =
    bookletRequests.data?.filter((r: any) => r.status === "pending").length ?? 0;
  const pendingAppointments =
    appointments.data?.filter((a: any) => a.status === "pending").length ?? 0;

  const stats = [
    {
      label: "Demandes de Livrets",
      value: bookletRequests.data?.length ?? 0,
      icon: BookOpen,
      color: "text-accent",
    },
    {
      label: "Rendez-vous",
      value: appointments.data?.length ?? 0,
      icon: Calendar,
      color: "text-amber-600",
    },
    {
      label: "En attente",
      value: pendingBooklets + pendingAppointments,
      icon: Zap,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
              Tableau de Bord
            </h1>
            <p className="text-muted-foreground">
              Bienvenue {user?.name || "Marie"}. Gérez vos demandes et rendez-vous.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={ROUTES.ADMIN_BLOG}>
              <a className="inline-flex items-center gap-2 px-3 h-9 rounded-md border border-border text-sm font-semibold hover:bg-accent hover:text-accent-foreground transition-colors">
                <PencilLine className="w-4 h-4" />
                Blog
              </a>
            </Link>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Se déconnecter
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-2">
                      {stat.label}
                    </p>
                    <p className="font-serif text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Booklet Requests */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Demandes de Livrets
            </h2>
            <div className="flex items-center gap-2">
              <select
                className="text-sm border border-border rounded-md px-2 py-1 bg-background"
                value={bookletFilter}
                onChange={(e) => setBookletFilter(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                {BOOKLET_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {BOOKLET_STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => bookletRequests.refetch()}
                disabled={bookletRequests.isFetching}
              >
                <RefreshCw
                  className={`w-4 h-4 ${
                    bookletRequests.isFetching ? "animate-spin" : ""
                  }`}
                />
              </Button>
            </div>
          </div>

          {bookletRequests.isLoading ? (
            <Card className="p-8 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
            </Card>
          ) : (bookletRequests.data?.length ?? 0) === 0 ? (
            <Card className="p-8 text-center">
              <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                Aucune demande pour ce filtre.
              </p>
            </Card>
          ) : (
            <div className="overflow-x-auto border border-border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Nom</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Naissance</th>
                    <th className="text-left py-3 px-4 font-semibold">Reçue le</th>
                    <th className="text-left py-3 px-4 font-semibold">Statut</th>
                    <th className="text-left py-3 px-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookletRequests.data!.map((request: any) => (
                    <tr
                      key={request.id}
                      className="border-t border-border hover:bg-muted/20"
                    >
                      <td className="py-3 px-4">
                        {request.firstName} {request.lastName}
                      </td>
                      <td className="py-3 px-4">
                        <a
                          href={`mailto:${request.email}`}
                          className="text-accent hover:underline"
                        >
                          {request.email}
                        </a>
                      </td>
                      <td className="py-3 px-4">
                        {request.dateOfBirth} {request.timeOfBirth}
                        <div className="text-xs text-muted-foreground">
                          {request.placeOfBirth}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(request.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusPillClasses(
                            request.status,
                          )}`}
                        >
                          {BOOKLET_STATUS_LABEL[request.status] ??
                            request.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={request.status}
                          onChange={(e) =>
                            updateBookletStatus.mutate({
                              id: request.id,
                              status: e.target.value,
                            })
                          }
                          disabled={updateBookletStatus.isPending}
                          className="text-xs border border-border rounded-md px-2 py-1 bg-background"
                        >
                          {BOOKLET_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              → {BOOKLET_STATUS_LABEL[s]}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Appointments */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Rendez-vous
            </h2>
            <div className="flex items-center gap-2">
              <select
                className="text-sm border border-border rounded-md px-2 py-1 bg-background"
                value={apptFilter}
                onChange={(e) => setApptFilter(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                {APPOINTMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {APPOINTMENT_STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => appointments.refetch()}
                disabled={appointments.isFetching}
              >
                <RefreshCw
                  className={`w-4 h-4 ${
                    appointments.isFetching ? "animate-spin" : ""
                  }`}
                />
              </Button>
            </div>
          </div>

          {appointments.isLoading ? (
            <Card className="p-8 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
            </Card>
          ) : (appointments.data?.length ?? 0) === 0 ? (
            <Card className="p-8 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                Aucun rendez-vous pour ce filtre.
              </p>
            </Card>
          ) : (
            <div className="overflow-x-auto border border-border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Nom</th>
                    <th className="text-left py-3 px-4 font-semibold">Contact</th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Statut</th>
                    <th className="text-left py-3 px-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.data!.map((appointment: any) => (
                    <tr
                      key={appointment.id}
                      className="border-t border-border hover:bg-muted/20"
                    >
                      <td className="py-3 px-4">
                        {appointment.firstName} {appointment.lastName}
                      </td>
                      <td className="py-3 px-4">
                        <a
                          href={`mailto:${appointment.email}`}
                          className="text-accent hover:underline"
                        >
                          {appointment.email}
                        </a>
                        {appointment.phone && (
                          <div className="text-xs text-muted-foreground">
                            {appointment.phone}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {new Date(appointment.appointmentDate).toLocaleString(
                          "fr-FR",
                          {
                            timeZone: "Europe/Paris",
                            dateStyle: "medium",
                            timeStyle: "short",
                          },
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusPillClasses(
                            appointment.status,
                          )}`}
                        >
                          {APPOINTMENT_STATUS_LABEL[appointment.status] ??
                            appointment.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={appointment.status}
                          onChange={(e) =>
                            updateAppointmentStatus.mutate({
                              id: appointment.id,
                              status: e.target.value,
                            })
                          }
                          disabled={updateAppointmentStatus.isPending}
                          className="text-xs border border-border rounded-md px-2 py-1 bg-background"
                        >
                          {APPOINTMENT_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              → {APPOINTMENT_STATUS_LABEL[s]}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
