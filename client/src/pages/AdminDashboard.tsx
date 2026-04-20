import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2, BarChart3, Mail, Calendar, BookOpen, Zap } from "lucide-react";

export default function AdminDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [location, setLocation] = useLocation();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, loading, setLocation]);

  // Fetch data
  const bookletRequests = trpc.booklet.list.useQuery(
    { status: undefined, limit: 10, offset: 0 },
    { enabled: isAuthenticated }
  );

  const appointments = trpc.appointment.list.useQuery(
    { status: undefined, limit: 10, offset: 0 },
    { enabled: isAuthenticated }
  );

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

  const stats = [
    {
      label: "Demandes de Livrets",
      value: bookletRequests.data?.length || 0,
      icon: BookOpen,
      color: "text-accent",
    },
    {
      label: "Rendez-vous",
      value: appointments.data?.length || 0,
      icon: Calendar,
      color: "text-amber-600",
    },
    {
      label: "En Attente",
      value:
        (bookletRequests.data?.filter((r: any) => r.status === "pending").length ||
          0) +
        (appointments.data?.filter((a: any) => a.status === "pending").length || 0),
      icon: Zap,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
            Tableau de Bord Admin
          </h1>
          <p className="text-muted-foreground">
            Bienvenue, {user?.name || "Admin"}. Gérez vos demandes et rendez-vous.
          </p>
        </div>

        {/* Stats Grid */}
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

        {/* Booklet Requests Section */}
        <div className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
            Demandes de Livrets Récentes
          </h2>
          {bookletRequests.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
            </div>
          ) : bookletRequests.data && bookletRequests.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Nom
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Date de Naissance
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Statut
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookletRequests.data.map((request: any) => (
                    <tr
                      key={request.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        {request.firstName} {request.lastName}
                      </td>
                      <td className="py-3 px-4">{request.email}</td>
                      <td className="py-3 px-4">{request.dateOfBirth}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            request.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : request.status === "in_progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {request.status === "pending"
                            ? "En attente"
                            : request.status === "in_progress"
                              ? "En cours"
                              : "Livré"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="sm">
                          Voir
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                Aucune demande de livret pour le moment
              </p>
            </Card>
          )}
        </div>

        {/* Appointments Section */}
        <div className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
            Rendez-vous Récents
          </h2>
          {appointments.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
            </div>
          ) : appointments.data && appointments.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Nom
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Téléphone
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Date du RDV
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Statut
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.data.map((appointment: any) => (
                    <tr
                      key={appointment.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        {appointment.firstName} {appointment.lastName}
                      </td>
                      <td className="py-3 px-4">{appointment.email}</td>
                      <td className="py-3 px-4">{appointment.phone || "-"}</td>
                      <td className="py-3 px-4">
                        {new Date(appointment.appointmentDate).toLocaleDateString(
                          "fr-FR"
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            appointment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : appointment.status === "confirmed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {appointment.status === "pending"
                            ? "En attente"
                            : appointment.status === "confirmed"
                              ? "Confirmé"
                              : "Complété"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="sm">
                          Voir
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                Aucun rendez-vous pour le moment
              </p>
            </Card>
          )}
        </div>

        {/* Future Features */}
        <Card className="p-8 bg-muted/50 border-2 border-dashed border-border">
          <div className="flex items-start gap-4">
            <Zap className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Fonctionnalités à Venir
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Content Engine : Générer des posts Instagram et articles blog</li>
                <li>• Générateur de Livrets : Créer et exporter des livrets PDF</li>
                <li>• Gestion du Blog : Éditer et publier des articles</li>
                <li>• IA Assistant : Aide à la génération de contenu (bientôt)</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
