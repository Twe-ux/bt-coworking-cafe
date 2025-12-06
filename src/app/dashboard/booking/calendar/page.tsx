"use client";

import { useEffect, useState, useRef } from "react";
import { Card, Badge, Modal, Button, Alert } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";

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
  paymentStatus: string;
  contactName?: string;
  contactEmail?: string;
}

const spaceTypeColors: Record<string, string> = {
  "open-space": "#3762ea",
  "salle-verriere": "#10b981",
  "salle-etage": "#f59e0b",
  "evenementiel": "#ef4444",
  "desk": "#8b5cf6",
  "meeting-room": "#06b6d4",
  "private-office": "#ec4899",
  "event-space": "#f97316",
};

const spaceTypeLabels: Record<string, string> = {
  "open-space": "Open-space",
  "salle-verriere": "Salle Verrière",
  "salle-etage": "Salle Étage",
  "evenementiel": "Événementiel",
  "desk": "Bureau",
  "meeting-room": "Salle de réunion",
  "private-office": "Bureau privé",
  "event-space": "Espace événementiel",
};

const statusLabels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  cancelled: "Annulée",
  completed: "Terminée",
};

// Force dynamic rendering
export const dynamic = "force-dynamic";

const CalendarPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Reservation | null>(null);
  const [showModal, setShowModal] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/reservations");
      const data = await response.json();

      if (data.success) {
        setReservations(data.data);
      } else {
        setMessage({ type: "error", text: data.error || "Erreur lors du chargement" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors du chargement des réservations" });
    } finally {
      setLoading(false);
    }
  };

  const events = reservations.map((reservation) => {
    const date = new Date(reservation.date);
    const [startHour, startMin] = reservation.startTime.split(":");
    const [endHour, endMin] = reservation.endTime.split(":");

    const start = new Date(date);
    start.setHours(parseInt(startHour), parseInt(startMin));

    const end = new Date(date);
    end.setHours(parseInt(endHour), parseInt(endMin));

    return {
      id: reservation._id,
      title: `${spaceTypeLabels[reservation.spaceType] || reservation.spaceType} - ${
        reservation.contactName || reservation.user.name
      }`,
      start: start.toISOString(),
      end: end.toISOString(),
      backgroundColor: spaceTypeColors[reservation.spaceType] || "#6b7280",
      borderColor: spaceTypeColors[reservation.spaceType] || "#6b7280",
      extendedProps: {
        reservation,
      },
      className:
        reservation.status === "cancelled"
          ? "opacity-50"
          : reservation.status === "pending"
          ? "border-dashed"
          : "",
    };
  });

  const handleEventClick = (info: any) => {
    const reservation = info.event.extendedProps.reservation;
    setSelectedEvent(reservation);
    setShowModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <DashboardPageTitle title="Calendrier des Réservations" subName="Booking" />
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
      <DashboardPageTitle title="Calendrier des Réservations" subName="Booking" />

      {message && (
        <Alert
          variant={message.type === "success" ? "success" : "danger"}
          dismissible
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}

      {/* Legend */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <h6 className="mb-3">Légende des espaces</h6>
          <div className="d-flex flex-wrap gap-3">
            {Object.entries(spaceTypeColors).map(([type, color]) => (
              <div key={type} className="d-flex align-items-center">
                <div
                  className="rounded me-2"
                  style={{
                    width: "16px",
                    height: "16px",
                    backgroundColor: color,
                  }}
                ></div>
                <small>{spaceTypeLabels[type] || type}</small>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Calendar */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            locale={frLocale}
            events={events}
            eventClick={handleEventClick}
            height="auto"
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
            allDaySlot={false}
            nowIndicator={true}
            weekends={true}
            editable={false}
            selectable={false}
            selectMirror={true}
            dayMaxEvents={true}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              meridiem: false,
            }}
          />
        </Card.Body>
      </Card>

      {/* Event Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails de la réservation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <div>
              <div className="mb-3">
                <h6 className="text-muted mb-2">Client</h6>
                <div className="fw-medium">{selectedEvent.contactName || selectedEvent.user.name}</div>
                <div className="text-muted small">
                  {selectedEvent.contactEmail || selectedEvent.user.email}
                </div>
              </div>

              <div className="mb-3">
                <h6 className="text-muted mb-2">Espace</h6>
                <Badge
                  bg="light"
                  text="dark"
                  style={{
                    borderLeft: `4px solid ${spaceTypeColors[selectedEvent.spaceType]}`,
                  }}
                >
                  {spaceTypeLabels[selectedEvent.spaceType] || selectedEvent.spaceType}
                </Badge>
              </div>

              <div className="mb-3">
                <h6 className="text-muted mb-2">Date et heure</h6>
                <div className="d-flex align-items-center mb-1">
                  <Icon icon="ri:calendar-line" className="me-2" />
                  {formatDate(selectedEvent.date)}
                </div>
                <div className="d-flex align-items-center">
                  <Icon icon="ri:time-line" className="me-2" />
                  {selectedEvent.startTime} - {selectedEvent.endTime}
                </div>
              </div>

              <div className="mb-3">
                <h6 className="text-muted mb-2">Participants</h6>
                <div className="d-flex align-items-center">
                  <Icon icon="ri:user-line" className="me-2" />
                  {selectedEvent.numberOfPeople} personne(s)
                </div>
              </div>

              <div className="mb-3">
                <h6 className="text-muted mb-2">Prix</h6>
                <div className="fw-semibold">{selectedEvent.totalPrice.toFixed(2)}€</div>
              </div>

              <div className="mb-3">
                <h6 className="text-muted mb-2">Statut</h6>
                <div className="d-flex gap-2">
                  <Badge
                    bg={
                      selectedEvent.status === "confirmed"
                        ? "success"
                        : selectedEvent.status === "pending"
                        ? "warning"
                        : selectedEvent.status === "cancelled"
                        ? "danger"
                        : "secondary"
                    }
                  >
                    {statusLabels[selectedEvent.status]}
                  </Badge>
                  <Badge
                    bg={
                      selectedEvent.paymentStatus === "paid"
                        ? "success"
                        : selectedEvent.paymentStatus === "pending"
                        ? "warning"
                        : "danger"
                    }
                  >
                    Paiement: {selectedEvent.paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CalendarPage;
