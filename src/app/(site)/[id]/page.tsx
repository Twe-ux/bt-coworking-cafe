import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { options } from "@/lib/auth-options";
import Link from "next/link";
import "./client-dashboard.scss";
import { connectDB } from "@/lib/mongodb";
import { Reservation } from "@/models/reservation";

// Force dynamic rendering - don't pre-render at build time
export const dynamic = "force-dynamic";

interface ClientDashboardProps {
  params: { id: string };
}

export default async function ClientDashboard({
  params,
}: ClientDashboardProps) {
  const session = await getServerSession(options);

  // Check if user is authenticated
  if (!session) {
    redirect(`/auth/login?callbackUrl=/${params.id}`);
  }

  // Check if user has a username
  if (!session.user.username) {
    redirect("/auth/login");
  }

  // Security check: verify the URL username matches the logged-in user
  if (params.id !== session.user.username) {
    // Redirect to their own dashboard
    redirect(`/${session.user.username}`);
  }

  const username = session.user.username;

  // Fetch user's reservation statistics
  await connectDB();
  const userId = session.user.id;

  const [
    activeReservations,
    completedReservations,
    allReservations,
    upcomingReservations,
  ] = await Promise.all([
    Reservation.countDocuments({
      user: userId,
      status: { $in: ["pending", "confirmed"] },
      date: { $gte: new Date() },
    }),
    Reservation.countDocuments({
      user: userId,
      status: "completed",
    }),
    Reservation.find({
      user: userId,
      status: { $nin: ["cancelled"] },
    })
      .select("startTime endTime")
      .lean(),
    Reservation.find({
      user: userId,
      status: { $in: ["pending", "confirmed"] },
      date: { $gte: new Date() },
    })
      .select(
        "spaceType date startTime endTime numberOfPeople totalPrice paymentStatus"
      )
      .sort({ date: 1, startTime: 1 })
      .limit(3)
      .lean(),
  ]);

  // Calculate total hours booked
  const totalHours = allReservations.reduce((total, reservation) => {
    const [startHour, startMinute] = (reservation.startTime || "0:0")
      .split(":")
      .map(Number);
    const [endHour, endMinute] = (reservation.endTime || "0:0")
      .split(":")
      .map(Number);
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    const durationMinutes = endMinutes - startMinutes;
    return total + durationMinutes / 60;
  }, 0);

  return (
    <section className="client-dashboard py__110">
      <div className="container pb__130">
        {/* Welcome Section */}
        <div className="welcome-card mb-5">
          <h1 className="welcome-title">Bonjour, {session.user.name} ! 👋</h1>
          <p className="welcome-text">Bienvenue dans votre espace personnel</p>
        </div>

        {/* Quick Actions */}
        <div className="row mb-5">
          <div className="col-12">
            <h2 className="section-title">Actions rapides</h2>
          </div>

          <div className="col-md-4 mb-4">
            <Link href={`/${username}/reservations`} className="action-card">
              <div className="action-icon">
                <i className="bi bi-calendar-check"></i>
              </div>
              <h3 className="action-title">Mes réservations</h3>
              <p className="action-description">
                Voir et gérer vos réservations
              </p>
            </Link>
          </div>

          <div className="col-md-4 mb-4">
            <Link href="/booking" className="action-card">
              <div className="action-icon">
                <i className="bi bi-plus-circle"></i>
              </div>
              <h3 className="action-title">Nouvelle réservation</h3>
              <p className="action-description">
                Réserver un espace de coworking
              </p>
            </Link>
          </div>

          <div className="col-md-4 mb-4">
            <Link href={`/${username}/profile`} className="action-card">
              <div className="action-icon">
                <i className="bi bi-person"></i>
              </div>
              <h3 className="action-title">Mon profil</h3>
              <p className="action-description">
                Gérer vos informations personnelles
              </p>
            </Link>
          </div>
        </div>

        {/* Upcoming Reservations */}
        {upcomingReservations.length > 0 && (
          <div className="row mb-5">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="section-title">Prochaines réservations</h2>
                <Link
                  href={`/${username}/reservations`}
                  className="view-all-btn"
                >
                  Voir toutes
                </Link>
              </div>
            </div>

            {upcomingReservations.map((reservation: any) => {
              const getSpaceLabel = (spaceType: string) => {
                const labels: Record<string, string> = {
                  "open-space": "Open-space",
                  "salle-verriere": "Salle Verrière",
                  "salle-etage": "Salle Étage",
                  evenementiel: "Événementiel",
                };
                return labels[spaceType] || spaceType;
              };

              const formatDate = (dateString: string) => {
                return new Date(dateString).toLocaleDateString("fr-FR", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
              };

              return (
                <div key={reservation._id.toString()} className="col-md-4 mb-4">
                  <Link
                    href={`/booking/confirmation/${reservation._id.toString()}`}
                    className="reservation-card"
                  >
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="reservation-space mb-0">
                        {getSpaceLabel(reservation.spaceType)}
                      </h5>
                      <div className="info-item mb-0">
                        <i className="bi bi-people"></i>
                        <span>
                          {reservation.numberOfPeople}{" "}
                          {reservation.numberOfPeople > 1 ? "pers." : "pers."}
                        </span>
                      </div>
                    </div>
                    <div className="reservation-info">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="info-item mb-0">
                          <i className="bi bi-calendar"></i>
                          <span>{formatDate(reservation.date)}</span>
                        </div>
                        <div className="info-item mb-0">
                          <i className="bi bi-clock"></i>
                          <span>
                            {reservation.startTime} - {reservation.endTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="reservation-footer">
                      <span
                        className={`status-badge ${
                          reservation.paymentStatus === "paid"
                            ? "paid"
                            : "pending"
                        }`}
                      >
                        {reservation.paymentStatus === "paid"
                          ? "Payé"
                          : "En attente"}
                      </span>
                      <span className="price">
                        {reservation.totalPrice?.toFixed(2) || "0.00"}€
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats */}
        <div className="row">
          <div className="col-12">
            <h2 className="section-title">Statistiques</h2>
          </div>

          <div className="col-md-4 mb-4">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="bi bi-calendar-event"></i>
              </div>
              <div className="stat-content">
                <h4 className="stat-value">{activeReservations}</h4>
                <p className="stat-label">Réservations actives</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="bi bi-clock-history"></i>
              </div>
              <div className="stat-content">
                <h4 className="stat-value">{Math.round(totalHours)}</h4>
                <p className="stat-label">Heures réservées</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="bi bi-check-circle"></i>
              </div>
              <div className="stat-content">
                <h4 className="stat-value">{completedReservations}</h4>
                <p className="stat-label">Réservations complétées</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
