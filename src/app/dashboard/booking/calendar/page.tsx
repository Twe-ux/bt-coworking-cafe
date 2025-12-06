"use client";

import { useEffect, useState, useRef } from "react";
import { Card, Badge, Modal, Button, Alert } from "react-bootstrap";
import { Icon } from "@iconify/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
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
  paymentStatus: string;
  contactName?: string;
  contactEmail?: string;
}

const spaceTypeColors: Record<string, string> = {
  "open-space": "#4F46E5",
  "salle-verriere": "#10B981",
  "salle-etage": "#F59E0B",
  "evenementiel": "#EF4444",
  "desk": "#8B5CF6",
  "meeting-room": "#06B6D4",
  "private-office": "#EC4899",
  "event-space": "#F97316",
};

const spaceTypeGradients: Record<string, string> = {
  "open-space": "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
  "salle-verriere": "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
  "salle-etage": "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
  "evenementiel": "linear-gradient(135deg, #EF4444 0%, #F87171 100%)",
  "desk": "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
  "meeting-room": "linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)",
  "private-office": "linear-gradient(135deg, #EC4899 0%, #F472B6 100%)",
  "event-space": "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
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
  const [currentView, setCurrentView] = useState('Semaine');
  const calendarRef = useRef<FullCalendar>(null);
  const { setPageTitle, setPageActions } = useTopbarContext();

  useEffect(() => {
    setPageTitle('Calendrier des Réservations');
    setPageActions(
      <>
        <button
          onClick={() => {
            const calendarApi = calendarRef.current?.getApi();
            const viewMap: Record<string, string> = {
              'Jour': 'timeGridDay',
              'Semaine': 'timeGridWeek',
              'Mois': 'dayGridMonth',
            };
            calendarApi?.changeView(viewMap['Jour']);
            setCurrentView('Jour');
          }}
          style={{
            padding: '8px 16px',
            background: currentView === 'Jour' ? '#667eea' : 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            color: currentView === 'Jour' ? 'white' : '#374151',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            if (currentView !== 'Jour') {
              e.currentTarget.style.background = '#f9fafb';
              e.currentTarget.style.borderColor = '#d1d5db';
            }
          }}
          onMouseLeave={(e) => {
            if (currentView !== 'Jour') {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }
          }}
        >
          Jour
        </button>
        <button
          onClick={() => {
            const calendarApi = calendarRef.current?.getApi();
            const viewMap: Record<string, string> = {
              'Jour': 'timeGridDay',
              'Semaine': 'timeGridWeek',
              'Mois': 'dayGridMonth',
            };
            calendarApi?.changeView(viewMap['Semaine']);
            setCurrentView('Semaine');
          }}
          style={{
            padding: '8px 16px',
            background: currentView === 'Semaine' ? '#667eea' : 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            color: currentView === 'Semaine' ? 'white' : '#374151',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            if (currentView !== 'Semaine') {
              e.currentTarget.style.background = '#f9fafb';
              e.currentTarget.style.borderColor = '#d1d5db';
            }
          }}
          onMouseLeave={(e) => {
            if (currentView !== 'Semaine') {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }
          }}
        >
          Semaine
        </button>
        <button
          onClick={() => {
            const calendarApi = calendarRef.current?.getApi();
            const viewMap: Record<string, string> = {
              'Jour': 'timeGridDay',
              'Semaine': 'timeGridWeek',
              'Mois': 'dayGridMonth',
            };
            calendarApi?.changeView(viewMap['Mois']);
            setCurrentView('Mois');
          }}
          style={{
            padding: '8px 16px',
            background: currentView === 'Mois' ? '#667eea' : 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            color: currentView === 'Mois' ? 'white' : '#374151',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            if (currentView !== 'Mois') {
              e.currentTarget.style.background = '#f9fafb';
              e.currentTarget.style.borderColor = '#d1d5db';
            }
          }}
          onMouseLeave={(e) => {
            if (currentView !== 'Mois') {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }
          }}
        >
          Mois
        </button>
      </>
    );

    return () => {
      setPageTitle('Dashboard');
      setPageActions(null);
    };
  }, [currentView, setPageTitle, setPageActions]);

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

    // Get gradient based on space type
    const gradient = spaceTypeGradients[reservation.spaceType] || spaceTypeGradients["open-space"];

    return {
      id: reservation._id,
      title,
      start: start.toISOString(),
      end: end.toISOString(),
      backgroundColor: spaceTypeColors[reservation.spaceType] || "#667eea",
      borderColor: 'transparent',
      textColor: "#ffffff",
      extendedProps: {
        reservation,
        gradient,
      },
      classNames: [
        reservation.status === "cancelled" ? "event-cancelled" : "",
        reservation.status === "pending" ? "event-pending" : "",
        `event-${reservation.spaceType}`,
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
        <div className="text-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid" style={{ padding: '24px' }}>
      {message && (
        <Alert
          variant={message.type === "success" ? "success" : "danger"}
          dismissible
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}

      {/* Calendar */}
      <Card className="border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
        <Card.Body className="p-0">

          <div className="p-4">
          <style jsx global>{`
            .fc {
              font-family: 'Google Sans', 'Roboto', -apple-system, sans-serif;
              font-size: 0.9375rem;
            }

            /* Toolbar - hide default, we made custom */
            .fc-toolbar {
              display: none !important;
            }

            /* Header */
            .fc-col-header {
              background: #fafbfc;
              border-bottom: 2px solid #e9ecef;
            }
            .fc-col-header-cell {
              padding: 1rem 0 !important;
              font-weight: 700 !important;
              font-size: 11px !important;
              color: #868e96 !important;
              text-transform: uppercase !important;
              letter-spacing: 0.5px !important;
              border-color: #e9ecef !important;
              transition: background 0.2s;
            }
            .fc-col-header-cell:hover {
              background: #f1f3f5;
            }

            /* Day cells */
            .fc-daygrid-day {
              transition: background-color 0.2s ease;
            }
            .fc-daygrid-day:hover {
              background-color: #f8f9fa;
            }
            .fc-daygrid-day-number {
              font-size: 20px !important;
              font-weight: 600 !important;
              color: #495057;
              padding: 0.5rem !important;
            }
            .fc-day-today {
              background-color: rgba(102, 126, 234, 0.05) !important;
            }
            .fc-day-today .fc-daygrid-day-number {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              width: 42px;
              height: 42px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }

            /* Time grid */
            .fc-timegrid-axis {
              background: #fafbfc;
              border-right: 1px solid #e9ecef;
              width: 80px;
            }
            .fc-timegrid-slot {
              height: 60px !important;
              border-color: #f1f3f5 !important;
            }
            .fc-timegrid-slot:nth-child(2n) {
              border-bottom-color: #e9ecef !important;
            }
            .fc-timegrid-slot-label {
              font-size: 12px !important;
              font-weight: 500 !important;
              color: #6c757d !important;
              padding-right: 0.75rem !important;
            }
            .fc-timegrid-divider {
              display: none;
            }

            /* Current time indicator */
            .fc-timegrid-now-indicator-line {
              border-color: #ea4335 !important;
              border-width: 2px !important;
            }
            .fc-timegrid-now-indicator-arrow {
              border-color: #ea4335 !important;
            }

            /* Events */
            .fc-event {
              padding: 8px 10px !important;
              cursor: pointer !important;
              border-radius: 8px !important;
              border: none !important;
              font-size: 13px !important;
              font-weight: 600 !important;
              transition: all 0.3s ease !important;
              margin: 2px 4px !important;
            }
            .fc-event:hover {
              transform: translateY(-2px) !important;
              z-index: 10 !important;
            }

            /* Event gradients by type */
            .fc-event.event-open-space {
              background: linear-gradient(135deg, #4F46E5 0%, #6366F1 100%) !important;
              box-shadow: 0 2px 8px rgba(79, 70, 229, 0.25) !important;
            }
            .fc-event.event-open-space:hover {
              box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4) !important;
            }

            .fc-event.event-salle-verriere {
              background: linear-gradient(135deg, #10B981 0%, #34D399 100%) !important;
              box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25) !important;
            }
            .fc-event.event-salle-verriere:hover {
              box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4) !important;
            }

            .fc-event.event-salle-etage {
              background: linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%) !important;
              box-shadow: 0 2px 8px rgba(245, 158, 11, 0.25) !important;
            }
            .fc-event.event-salle-etage:hover {
              box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4) !important;
            }

            .fc-event.event-evenementiel {
              background: linear-gradient(135deg, #EF4444 0%, #F87171 100%) !important;
              box-shadow: 0 2px 8px rgba(239, 68, 68, 0.25) !important;
            }
            .fc-event.event-evenementiel:hover {
              box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4) !important;
            }

            .fc-event.event-pending {
              border: 2px dashed rgba(255, 255, 255, 0.5) !important;
              opacity: 0.85;
            }
            .fc-event.event-cancelled {
              opacity: 0.5;
              filter: grayscale(0.5);
            }
            .fc-event-main {
              color: white !important;
            }

            /* Borders */
            .fc-scrollgrid {
              border-color: #e9ecef !important;
              border-radius: 0;
            }
            .fc-scrollgrid td,
            .fc-scrollgrid th {
              border-color: #e9ecef !important;
            }

            /* Scrollbar */
            .fc-scroller::-webkit-scrollbar {
              width: 8px;
            }
            .fc-scroller::-webkit-scrollbar-track {
              background: #f1f3f5;
            }
            .fc-scroller::-webkit-scrollbar-thumb {
              background: #dee2e6;
              border-radius: 4px;
            }
            .fc-scroller::-webkit-scrollbar-thumb:hover {
              background: #adb5bd;
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
              const reservation = arg.event.extendedProps.reservation;
              const statusIcon =
                reservation.status === 'confirmed' ? '✓' :
                reservation.status === 'pending' ? '○' :
                reservation.status === 'cancelled' ? '✕' : '';

              return {
                html: `
                  <div style="
                    padding: 4px 6px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1.4;
                  ">
                    <div style="
                      font-weight: 600;
                      font-size: 0.75rem;
                      opacity: 0.95;
                      margin-bottom: 2px;
                      display: flex;
                      align-items: center;
                      gap: 4px;
                    ">
                      <span>${statusIcon}</span>
                      <span>${arg.timeText}</span>
                    </div>
                    <div style="
                      font-size: 0.8125rem;
                      line-height: 1.3;
                      font-weight: 500;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    ">${arg.event.title}</div>
                  </div>
                `,
              };
            }}
          />
          </div>
        </Card.Body>
      </Card>

      {/* Legend */}
      <Card className="border-0 shadow-sm mt-4" style={{ borderRadius: '12px', overflow: 'hidden' }}>
        <Card.Body className="p-4">
          <div className="row align-items-center">
            <div className="col-md-8 mb-3 mb-md-0">
              <div className="d-flex align-items-center mb-3">
                <Icon icon="ri:palette-line" width={20} className="me-2 text-primary" />
                <h6 className="mb-0 fw-semibold">Types d'espaces</h6>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {Object.entries(spaceTypeColors).map(([type, color]) => (
                  <div
                    key={type}
                    className="d-inline-flex align-items-center px-3 py-2 rounded-pill"
                    style={{
                      background: `${color}15`,
                      border: `1px solid ${color}30`,
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: color,
                        marginRight: '8px',
                      }}
                    />
                    {spaceTypeLabels[type] || type}
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center mb-3">
                <Icon icon="ri:flag-line" width={20} className="me-2 text-primary" />
                <h6 className="mb-0 fw-semibold">Statuts</h6>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <div
                  className="d-inline-flex align-items-center px-3 py-2 rounded-pill"
                  style={{
                    background: '#10B98115',
                    border: '1px solid #10B98130',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                  }}
                >
                  <Icon icon="ri:checkbox-circle-fill" width={14} className="me-1" style={{ color: '#10B981' }} />
                  Confirmée
                </div>
                <div
                  className="d-inline-flex align-items-center px-3 py-2 rounded-pill"
                  style={{
                    background: '#F59E0B15',
                    border: '1px solid #F59E0B30',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                  }}
                >
                  <Icon icon="ri:time-line" width={14} className="me-1" style={{ color: '#F59E0B' }} />
                  En attente
                </div>
                <div
                  className="d-inline-flex align-items-center px-3 py-2 rounded-pill"
                  style={{
                    background: '#6B728015',
                    border: '1px solid #6B728030',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                  }}
                >
                  <Icon icon="ri:close-circle-fill" width={14} className="me-1" style={{ color: '#6B7280' }} />
                  Annulée
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Event Details Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        style={{ borderRadius: '16px' }}
      >
        <Modal.Header closeButton className="border-0 pb-2" style={{ padding: '1.5rem 1.75rem 0' }}>
          <Modal.Title style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1F2937' }}>
            Détails de la réservation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '1.75rem' }}>
          {selectedEvent && (
            <div>
              {/* Header Card */}
              <div
                className="mb-4 p-4"
                style={{
                  background: `${spaceTypeColors[selectedEvent.spaceType]}08`,
                  borderRadius: '12px',
                  border: `1px solid ${spaceTypeColors[selectedEvent.spaceType]}20`,
                }}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-2">
                      <Icon
                        icon="ri:user-3-fill"
                        width={24}
                        style={{ color: spaceTypeColors[selectedEvent.spaceType], marginRight: '10px' }}
                      />
                      <h5 className="mb-0" style={{ fontWeight: 600, color: '#1F2937' }}>
                        {selectedEvent.contactName || selectedEvent.user.name}
                      </h5>
                    </div>
                    <div className="d-flex align-items-center text-muted" style={{ fontSize: '0.9375rem' }}>
                      <Icon icon="ri:mail-line" width={16} className="me-2" />
                      {selectedEvent.contactEmail || selectedEvent.user.email}
                    </div>
                  </div>
                  <div
                    className="px-4 py-2"
                    style={{
                      background: spaceTypeColors[selectedEvent.spaceType],
                      color: 'white',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {spaceTypeLabels[selectedEvent.spaceType] || selectedEvent.spaceType}
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="row g-3">
                <div className="col-md-6">
                  <div
                    className="p-4 h-100"
                    style={{
                      background: '#F9FAFB',
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                    }}
                  >
                    <div className="d-flex align-items-center mb-3">
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: '#4F46E510',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '12px',
                        }}
                      >
                        <Icon icon="ri:calendar-line" width={20} style={{ color: '#4F46E5' }} />
                      </div>
                      <h6 className="mb-0" style={{ fontWeight: 600, color: '#374151' }}>Date et heure</h6>
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1F2937', marginBottom: '4px' }}>
                      {formatDate(selectedEvent.date)}
                    </div>
                    <div style={{ fontSize: '0.9375rem', color: '#6B7280' }}>
                      {selectedEvent.startTime} - {selectedEvent.endTime}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    className="p-4 h-100"
                    style={{
                      background: '#F9FAFB',
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                    }}
                  >
                    <div className="d-flex align-items-center mb-3">
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: '#06B6D410',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '12px',
                        }}
                      >
                        <Icon icon="ri:group-line" width={20} style={{ color: '#06B6D4' }} />
                      </div>
                      <h6 className="mb-0" style={{ fontWeight: 600, color: '#374151' }}>Participants</h6>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1F2937' }}>
                      {selectedEvent.numberOfPeople}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                      personne{selectedEvent.numberOfPeople > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    className="p-4 h-100"
                    style={{
                      background: '#F9FAFB',
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                    }}
                  >
                    <div className="d-flex align-items-center mb-3">
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: '#10B98110',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '12px',
                        }}
                      >
                        <Icon icon="ri:money-euro-circle-line" width={20} style={{ color: '#10B981' }} />
                      </div>
                      <h6 className="mb-0" style={{ fontWeight: 600, color: '#374151' }}>Prix total</h6>
                    </div>
                    <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#10B981' }}>
                      {selectedEvent.totalPrice.toFixed(2)}€
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    className="p-4 h-100"
                    style={{
                      background: '#F9FAFB',
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                    }}
                  >
                    <div className="d-flex align-items-center mb-3">
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: '#F59E0B10',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '12px',
                        }}
                      >
                        <Icon icon="ri:checkbox-circle-line" width={20} style={{ color: '#F59E0B' }} />
                      </div>
                      <h6 className="mb-0" style={{ fontWeight: 600, color: '#374151' }}>Statut</h6>
                    </div>
                    <div className="d-flex flex-column gap-2">
                      <div
                        className="d-inline-flex align-items-center px-3 py-2 rounded-pill"
                        style={{
                          background: selectedEvent.status === "confirmed" ? '#10B98115' :
                                     selectedEvent.status === "pending" ? '#F59E0B15' : '#EF444415',
                          border: `1px solid ${selectedEvent.status === "confirmed" ? '#10B98130' :
                                                selectedEvent.status === "pending" ? '#F59E0B30' : '#EF444430'}`,
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          width: 'fit-content',
                        }}
                      >
                        <Icon
                          icon={
                            selectedEvent.status === "confirmed" ? "ri:checkbox-circle-fill" :
                            selectedEvent.status === "pending" ? "ri:time-line" :
                            "ri:close-circle-fill"
                          }
                          width={14}
                          className="me-2"
                          style={{
                            color: selectedEvent.status === "confirmed" ? '#10B981' :
                                   selectedEvent.status === "pending" ? '#F59E0B' : '#EF4444'
                          }}
                        />
                        {statusLabels[selectedEvent.status]}
                      </div>
                      <div
                        className="d-inline-flex align-items-center px-3 py-2 rounded-pill"
                        style={{
                          background: selectedEvent.paymentStatus === "paid" ? '#10B98115' :
                                     selectedEvent.paymentStatus === "pending" ? '#F59E0B15' : '#EF444415',
                          border: `1px solid ${selectedEvent.paymentStatus === "paid" ? '#10B98130' :
                                                selectedEvent.paymentStatus === "pending" ? '#F59E0B30' : '#EF444430'}`,
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          width: 'fit-content',
                        }}
                      >
                        <Icon
                          icon="ri:wallet-3-line"
                          width={14}
                          className="me-2"
                          style={{
                            color: selectedEvent.paymentStatus === "paid" ? '#10B981' :
                                   selectedEvent.paymentStatus === "pending" ? '#F59E0B' : '#EF4444'
                          }}
                        />
                        {selectedEvent.paymentStatus}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0" style={{ padding: '0 1.75rem 1.5rem' }}>
          <Button
            variant="outline-secondary"
            onClick={() => setShowModal(false)}
            style={{
              borderRadius: '8px',
              padding: '0.5rem 1.5rem',
              fontWeight: 500,
            }}
          >
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CalendarPage;
