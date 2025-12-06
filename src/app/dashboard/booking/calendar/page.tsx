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

    // Title enrichi avec plus d'informations
    const title = `${spaceTypeLabels[reservation.spaceType]} • ${
      reservation.contactName || reservation.user.name
    } (${reservation.numberOfPeople}p)`;

    return {
      id: reservation._id,
      title,
      start: start.toISOString(),
      end: end.toISOString(),
      backgroundColor:
        reservation.status === "cancelled"
          ? "#cbd5e1"
          : reservation.status === "pending"
          ? `${spaceTypeColors[reservation.spaceType]}80`
          : spaceTypeColors[reservation.spaceType] || "#6b7280",
      borderColor: spaceTypeColors[reservation.spaceType] || "#6b7280",
      textColor: reservation.status === "cancelled" ? "#64748b" : "#ffffff",
      extendedProps: {
        reservation,
      },
      classNames: [
        reservation.status === "cancelled" ? "event-cancelled" : "",
        reservation.status === "pending" ? "event-pending" : "",
      ].filter(Boolean),
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
          <div className="row">
            <div className="col-md-8">
              <h6 className="mb-3">Types d'espaces</h6>
              <div className="d-flex flex-wrap gap-2">
                {Object.entries(spaceTypeColors).map(([type, color]) => (
                  <Badge
                    key={type}
                    bg="light"
                    text="dark"
                    className="px-3 py-2"
                    style={{
                      borderLeft: `4px solid ${color}`,
                      fontSize: '0.875rem',
                    }}
                  >
                    {spaceTypeLabels[type] || type}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="col-md-4">
              <h6 className="mb-3">Statuts</h6>
              <div className="d-flex flex-wrap gap-2">
                <Badge bg="success" className="px-3 py-2" style={{ fontSize: '0.875rem' }}>
                  Confirmée
                </Badge>
                <Badge
                  bg="light"
                  text="dark"
                  className="px-3 py-2"
                  style={{ fontSize: '0.875rem', opacity: 0.7 }}
                >
                  En attente
                </Badge>
                <Badge bg="secondary" className="px-3 py-2" style={{ fontSize: '0.875rem' }}>
                  Annulée
                </Badge>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Calendar */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <style jsx global>{`
            .fc {
              font-size: 0.95rem;
            }
            .fc-toolbar-title {
              font-size: 1.5rem !important;
              font-weight: 600;
            }
            .fc-button {
              padding: 0.5rem 1rem !important;
              font-size: 0.9rem !important;
            }
            .fc-event {
              padding: 4px 6px;
              cursor: pointer;
              border-radius: 4px;
              font-size: 0.85rem;
              font-weight: 500;
            }
            .fc-event:hover {
              opacity: 0.85;
            }
            .fc-event.event-pending {
              border-style: dashed !important;
              border-width: 2px !important;
            }
            .fc-event.event-cancelled {
              text-decoration: line-through;
            }
            .fc-timegrid-slot {
              height: 3rem;
            }
            .fc-col-header-cell {
              padding: 1rem 0;
              font-weight: 600;
              font-size: 0.9rem;
              background-color: #f8f9fa;
            }
            .fc-daygrid-day-number {
              font-size: 0.95rem;
              font-weight: 600;
            }
            .fc-timegrid-slot-label {
              font-size: 0.85rem;
            }
          `}</style>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            buttonText={{
              today: "Aujourd'hui",
              month: "Mois",
              week: "Semaine",
              day: "Jour",
            }}
            locale={frLocale}
            events={events}
            eventClick={handleEventClick}
            height="auto"
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
            slotDuration="00:30:00"
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
            slotLabelFormat={{
              hour: "2-digit",
              minute: "2-digit",
              meridiem: false,
            }}
            eventContent={(arg) => {
              return {
                html: `
                  <div style="padding: 2px 4px; overflow: hidden; text-overflow: ellipsis;">
                    <div style="font-weight: 600; font-size: 0.85rem;">${arg.timeText}</div>
                    <div style="font-size: 0.8rem; line-height: 1.3;">${arg.event.title}</div>
                  </div>
                `,
              };
            }}
          />
        </Card.Body>
      </Card>

      {/* Event Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title>Détails de la réservation</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 py-3">
          {selectedEvent && (
            <div>
              <Card className="border-0 bg-light mb-3">
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="mb-1">{selectedEvent.contactName || selectedEvent.user.name}</h5>
                      <div className="text-muted">
                        <Icon icon="ri:mail-line" width={14} className="me-1" />
                        {selectedEvent.contactEmail || selectedEvent.user.email}
                      </div>
                    </div>
                    <Badge
                      bg="light"
                      text="dark"
                      className="px-3 py-2"
                      style={{
                        borderLeft: `4px solid ${spaceTypeColors[selectedEvent.spaceType]}`,
                        fontSize: '0.9rem',
                      }}
                    >
                      {spaceTypeLabels[selectedEvent.spaceType] || selectedEvent.spaceType}
                    </Badge>
                  </div>
                </Card.Body>
              </Card>

              <div className="row g-3">
                <div className="col-md-6">
                  <Card className="border h-100">
                    <Card.Body className="p-3">
                      <div className="d-flex align-items-center mb-2">
                        <Icon icon="ri:calendar-line" width={20} className="me-2 text-primary" />
                        <h6 className="mb-0">Date et heure</h6>
                      </div>
                      <div className="fw-medium">{formatDate(selectedEvent.date)}</div>
                      <div className="text-muted">
                        {selectedEvent.startTime} - {selectedEvent.endTime}
                      </div>
                    </Card.Body>
                  </Card>
                </div>

                <div className="col-md-6">
                  <Card className="border h-100">
                    <Card.Body className="p-3">
                      <div className="d-flex align-items-center mb-2">
                        <Icon icon="ri:user-line" width={20} className="me-2 text-primary" />
                        <h6 className="mb-0">Participants</h6>
                      </div>
                      <div className="fw-medium">{selectedEvent.numberOfPeople} personne(s)</div>
                    </Card.Body>
                  </Card>
                </div>

                <div className="col-md-6">
                  <Card className="border h-100">
                    <Card.Body className="p-3">
                      <div className="d-flex align-items-center mb-2">
                        <Icon icon="ri:money-euro-circle-line" width={20} className="me-2 text-success" />
                        <h6 className="mb-0">Prix</h6>
                      </div>
                      <div className="fs-4 fw-semibold text-success">
                        {selectedEvent.totalPrice.toFixed(2)}€
                      </div>
                    </Card.Body>
                  </Card>
                </div>

                <div className="col-md-6">
                  <Card className="border h-100">
                    <Card.Body className="p-3">
                      <div className="d-flex align-items-center mb-2">
                        <Icon icon="ri:shield-check-line" width={20} className="me-2 text-info" />
                        <h6 className="mb-0">Statut</h6>
                      </div>
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
                          className="px-2 py-1"
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
                          className="px-2 py-1"
                        >
                          {selectedEvent.paymentStatus}
                        </Badge>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CalendarPage;
