"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Reservation {
  _id: string;
  space: {
    name: string;
    slug: string;
    spaceType: string;
  };
  startDate: string;
  endDate: string;
  reservationType: string;
  numberOfPeople: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  requiresPayment: boolean;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

const statusColors: Record<string, string> = {
  pending: "warning",
  confirmed: "success",
  cancelled: "danger",
  completed: "secondary",
};

const statusLabels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  cancelled: "Annulée",
  completed: "Terminée",
};

const paymentStatusLabels: Record<string, string> = {
  pending: "En attente",
  paid: "Payé",
  failed: "Échoué",
  refunded: "Remboursé",
};

export default function ClientReservationsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("upcoming");

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/signin");
    }
  }, [sessionStatus, router]);

  useEffect(() => {
    if (session) {
      fetchReservations();
    }
  }, [session, filter]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const statusParam = filter === "all" ? "" : `?status=${filter}`;
      const response = await fetch(`/api/user/reservations${statusParam}`);
      const data = await response.json();

      if (data.success) {
        setReservations(data.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (sessionStatus === "loading" || loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 mb-0">Mes Réservations</h1>
            <Link href="/booking" className="btn btn-primary">
              <i className="bi bi-plus-circle me-2"></i>
              Nouvelle réservation
            </Link>
          </div>

          {/* Filter Tabs */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${filter === "upcoming" ? "active" : ""}`}
                onClick={() => setFilter("upcoming")}
              >
                <i className="bi bi-calendar-check me-2"></i>
                À venir
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${filter === "past" ? "active" : ""}`}
                onClick={() => setFilter("past")}
              >
                <i className="bi bi-calendar-x me-2"></i>
                Passées
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                <i className="bi bi-list-ul me-2"></i>
                Toutes
              </button>
            </li>
          </ul>

          {/* Reservations List */}
          {reservations.length === 0 ? (
            <div className="card text-center py-5">
              <div className="card-body">
                <i className="bi bi-calendar-x display-1 text-muted mb-3"></i>
                <h5 className="card-title">Aucune réservation</h5>
                <p className="card-text text-muted">
                  {filter === "upcoming"
                    ? "Vous n'avez pas de réservation à venir."
                    : filter === "past"
                    ? "Vous n'avez pas encore de réservations passées."
                    : "Vous n'avez aucune réservation."}
                </p>
                <Link href="/booking" className="btn btn-primary mt-3">
                  Réserver un espace
                </Link>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {reservations.map((reservation) => (
                <div key={reservation._id} className="col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-header bg-white d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 h6">{reservation.space.name}</h5>
                      <span
                        className={`badge bg-${
                          statusColors[reservation.status] || "secondary"
                        }`}
                      >
                        {statusLabels[reservation.status] || reservation.status}
                      </span>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <div className="d-flex align-items-center text-muted mb-2">
                          <i className="bi bi-calendar-event me-2"></i>
                          <small>{formatDate(reservation.startDate)}</small>
                        </div>
                        <div className="d-flex align-items-center text-muted mb-2">
                          <i className="bi bi-clock me-2"></i>
                          <small>
                            {formatTime(reservation.startDate)} -{" "}
                            {formatTime(reservation.endDate)}
                          </small>
                        </div>
                        <div className="d-flex align-items-center text-muted mb-2">
                          <i className="bi bi-people me-2"></i>
                          <small>
                            {reservation.numberOfPeople} personne
                            {reservation.numberOfPeople > 1 ? "s" : ""}
                          </small>
                        </div>
                      </div>

                      <div className="border-top pt-3 mt-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted">Prix total</span>
                          <strong className="h5 mb-0">
                            {reservation.totalPrice.toFixed(2)}€
                          </strong>
                        </div>
                        {reservation.requiresPayment && (
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted small">Paiement</span>
                            <span
                              className={`badge ${
                                reservation.paymentStatus === "paid"
                                  ? "bg-success"
                                  : "bg-warning"
                              }`}
                            >
                              {paymentStatusLabels[reservation.paymentStatus] ||
                                reservation.paymentStatus}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="card-footer bg-white">
                      <Link
                        href={`/booking/confirmation/${reservation._id}`}
                        className="btn btn-outline-primary btn-sm w-100"
                      >
                        <i className="bi bi-eye me-2"></i>
                        Voir les détails
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
