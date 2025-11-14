"use client";

import { useEffect, useState } from "react";
import { Card, Table, Badge, Button, Form, Row, Col, Alert } from "react-bootstrap";

interface Reservation {
  _id: string;
  user: {
    name: string;
    email: string;
    username?: string;
  };
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

const paymentStatusColors: Record<string, string> = {
  pending: "warning",
  paid: "success",
  failed: "danger",
  refunded: "info",
};

const paymentStatusLabels: Record<string, string> = {
  pending: "En attente",
  paid: "Payé",
  failed: "Échoué",
  refunded: "Remboursé",
};

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterSpaceType, setFilterSpaceType] = useState<string>("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchReservations();
  }, [filterStatus, filterSpaceType]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus) params.append("status", filterStatus);
      if (filterSpaceType) params.append("spaceType", filterSpaceType);

      const response = await fetch(`/api/admin/reservations?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setReservations(data.data);
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setMessage({ type: "error", text: "Erreur lors du chargement des réservations" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/reservations/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Statut mis à jour avec succès" });
        fetchReservations();
      } else {
        setMessage({ type: "error", text: data.error || "Erreur lors de la mise à jour" });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setMessage({ type: "error", text: "Erreur lors de la mise à jour" });
    }
  };

  const handleCancelReservation = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/reservations/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Réservation annulée avec succès" });
        fetchReservations();
      } else {
        setMessage({ type: "error", text: data.error || "Erreur lors de l'annulation" });
      }
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      setMessage({ type: "error", text: "Erreur lors de l'annulation" });
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="text-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="page-title-box">
            <h4 className="page-title">Gestion des Réservations</h4>
          </div>
        </div>
      </div>

      {message && (
        <Alert
          variant={message.type === "success" ? "success" : "danger"}
          dismissible
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}

      <Row className="mb-3">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Form.Group>
                <Form.Label>Filtrer par statut</Form.Label>
                <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmée</option>
                  <option value="cancelled">Annulée</option>
                  <option value="completed">Terminée</option>
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Form.Group>
                <Form.Label>Filtrer par espace</Form.Label>
                <Form.Select
                  value={filterSpaceType}
                  onChange={(e) => setFilterSpaceType(e.target.value)}
                >
                  <option value="">Tous les espaces</option>
                  <option value="open-space">Open-space</option>
                  <option value="salle-verriere">Salle Verrière</option>
                  <option value="salle-etage">Salle Étage</option>
                  <option value="evenementiel">Événementiel</option>
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Espace</th>
                  <th>Date/Heure</th>
                  <th>Personnes</th>
                  <th>Prix</th>
                  <th>Statut</th>
                  <th>Paiement</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      <i className="bi bi-calendar-x display-4 text-muted"></i>
                      <p className="mt-2 text-muted">Aucune réservation trouvée</p>
                    </td>
                  </tr>
                ) : (
                  reservations.map((reservation) => (
                    <tr key={reservation._id}>
                      <td>
                        <div>
                          <strong>{reservation.contactName || reservation.user.name}</strong>
                        </div>
                        <small className="text-muted">
                          {reservation.contactEmail || reservation.user.email}
                        </small>
                      </td>
                      <td>{reservation.space.name}</td>
                      <td>
                        <div>{formatDateTime(reservation.startDate)}</div>
                        <small className="text-muted">
                          au {formatDateTime(reservation.endDate)}
                        </small>
                      </td>
                      <td>{reservation.numberOfPeople}</td>
                      <td>
                        <strong>{reservation.totalPrice.toFixed(2)}€</strong>
                      </td>
                      <td>
                        <Badge bg={statusColors[reservation.status] || "secondary"}>
                          {statusLabels[reservation.status] || reservation.status}
                        </Badge>
                      </td>
                      <td>
                        {reservation.requiresPayment ? (
                          <Badge
                            bg={paymentStatusColors[reservation.paymentStatus] || "secondary"}
                          >
                            {paymentStatusLabels[reservation.paymentStatus] ||
                              reservation.paymentStatus}
                          </Badge>
                        ) : (
                          <span className="text-muted small">Sans paiement</span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          {reservation.status === "pending" && (
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => handleUpdateStatus(reservation._id, "confirmed")}
                              title="Confirmer"
                            >
                              <i className="bi bi-check-circle"></i>
                            </Button>
                          )}
                          {reservation.status !== "cancelled" && (
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleCancelReservation(reservation._id)}
                              title="Annuler"
                            >
                              <i className="bi bi-x-circle"></i>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
