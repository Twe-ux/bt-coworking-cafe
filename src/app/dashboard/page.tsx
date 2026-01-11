"use client";

import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useTopbarContext } from "@/context/useTopbarContext";

interface Reservation {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  spaceType: string;
  date: string;
  startTime: string;
  endTime: string;
  numberOfPeople: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  contactName?: string;
  contactEmail?: string;
}

const spaceTypeLabels: Record<string, string> = {
  "open-space": "Open-space",
  "salle-verriere": "Salle Verrière",
  "salle-etage": "Salle Étage",
  evenementiel: "Événementiel",
  desk: "Bureau",
  "meeting-room": "Salle de réunion",
  "private-office": "Bureau privé",
  "event-space": "Espace événementiel",
};

const spaceTypeColors: Record<string, string> = {
  "open-space": "#039be5",
  "salle-verriere": "#0b8043",
  "salle-etage": "#f09300",
  evenementiel: "#d50000",
  desk: "#7986cb",
  "meeting-room": "#33b679",
  "private-office": "#8e24aa",
  "event-space": "#e67c73",
};

export default function DashboardPage() {
  const [todayReservations, setTodayReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
  });
  const { setPageTitle } = useTopbarContext();

  useEffect(() => {
    setPageTitle("Tableau de bord");
    fetchTodayReservations();
  }, [setPageTitle]);

  const fetchTodayReservations = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];

      // Récupérer les réservations d'aujourd'hui
      const todayResponse = await fetch(
        `/api/admin/reservations?startDate=${today}&endDate=${today}`
      );
      const todayData = await todayResponse.json();

      // Récupérer toutes les réservations en attente
      const pendingResponse = await fetch(
        `/api/admin/reservations?status=pending`
      );
      const pendingData = await pendingResponse.json();

      if (todayData.success) {
        const activeReservations = todayData.data.filter(
          (r: Reservation) => r.status !== "cancelled"
        );
        setTodayReservations(activeReservations);

        setStats({
          total: activeReservations.length,
          confirmed: activeReservations.filter(
            (r: Reservation) => r.status === "confirmed"
          ).length,
          pending: pendingData.success ? pendingData.data.length : 0,
        });
      }
    } catch (error) {
      console.error("Error fetching today's reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "confirmed":
        return "confirmed";
      case "pending":
        return "pending";
      case "completed":
        return "completed";
      default:
        return "cancelled";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmée";
      case "pending":
        return "En attente";
      case "completed":
        return "Terminée";
      default:
        return status;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Stats Cards */}
      <Row className="mb-4">
        <Col lg={4} md={6}>
          <div className="stats-card p-4">
            <div className="d-flex align-items-center gap-3">
              <div className="stat-icon primary">
                <Icon icon="ri:calendar-check-line" width={28} color="white" />
              </div>
              <div className="stat-content">
                <p className="stat-label">Réservations aujourd'hui</p>
                <h3 className="stat-value">{stats.total}</h3>
              </div>
            </div>
          </div>
        </Col>

        <Col lg={4} md={6}>
          <div className="stats-card p-4">
            <div className="d-flex align-items-center gap-3">
              <div className="stat-icon success">
                <Icon icon="ri:checkbox-circle-line" width={28} color="white" />
              </div>
              <div className="stat-content">
                <p className="stat-label">Confirmées</p>
                <h3 className="stat-value">{stats.confirmed}</h3>
              </div>
            </div>
          </div>
        </Col>

        <Col lg={4} md={6}>
          <Link
            href="/dashboard/booking/reservations?status=pending"
            style={{ textDecoration: "none" }}
          >
            <div className="stats-card clickable p-4">
              <div className="d-flex align-items-center gap-3">
                <div className="stat-icon warning">
                  <Icon icon="ri:time-line" width={28} color="white" />
                </div>
                <div className="stat-content">
                  <p className="stat-label">En attente</p>
                  <h3 className="stat-value">{stats.pending}</h3>
                </div>
              </div>
            </div>
          </Link>
        </Col>
      </Row>

      {/* Today's Reservations */}
      <Row>
        <Col lg={12}>
          <div className="reservations-section p-4">
            <div className="section-header">
              <div className="section-title">
                <h4>
                  <Icon icon="ri:calendar-event-line" width={24} />
                  Réservations d'aujourd'hui
                </h4>
                <p>
                  {new Date().toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <Link href="/dashboard/booking/calendar">
                <button className="btn-calendar">
                  <Icon icon="ri:calendar-line" width={18} />
                  Voir le calendrier
                </button>
              </Link>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p className="loading-text">Chargement...</p>
              </div>
            ) : todayReservations.length === 0 ? (
              <div className="empty-state">
                <Icon
                  icon="ri:calendar-2-line"
                  width={64}
                  className="empty-icon"
                />
                <p className="empty-text">
                  Aucune réservation pour aujourd'hui
                </p>
              </div>
            ) : (
              <div className="reservations-list">
                {todayReservations.map((reservation) => (
                  <Link
                    key={reservation._id}
                    href="/dashboard/booking/calendar"
                    style={{ textDecoration: "none" }}
                  >
                    <div className="reservation-card">
                      <div className="reservation-content">
                        <div
                          className="reservation-indicator"
                          style={{
                            background:
                              spaceTypeColors[reservation.spaceType] ||
                              "#667eea",
                          }}
                        />
                        <div className="reservation-details">
                          <div className="reservation-header">
                            <span className="reservation-time">
                              {reservation.startTime} - {reservation.endTime}
                            </span>
                            <div
                              className="space-badge"
                              style={{
                                background:
                                  spaceTypeColors[reservation.spaceType] ||
                                  "#667eea",
                              }}
                            >
                              {spaceTypeLabels[reservation.spaceType] ||
                                reservation.spaceType}
                            </div>
                            <span
                              className={`status-badge ${getStatusBadgeClass(
                                reservation.status
                              )}`}
                            >
                              {getStatusLabel(reservation.status)}
                            </span>
                          </div>
                          <div className="reservation-meta">
                            <div className="meta-item">
                              <Icon icon="ri:user-line" width={16} />
                              {reservation.contactName ||
                                reservation.user.name}
                            </div>
                            <div className="meta-item">
                              <Icon icon="ri:group-line" width={16} />
                              {reservation.numberOfPeople} personne
                              {reservation.numberOfPeople > 1 ? "s" : ""}
                            </div>
                            <div className="meta-item price">
                              <Icon icon="ri:money-euro-circle-line" width={16} />
                              {reservation.totalPrice.toFixed(2)}€
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
}
