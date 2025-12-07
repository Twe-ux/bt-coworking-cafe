"use client";

import { useTopbarContext } from "@/context/useTopbarContext";
import frLocale from "@fullcalendar/core/locales/fr";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { Alert, Badge, Button, Card, Modal } from "react-bootstrap";

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

interface SpaceConfiguration {
  spaceType: string;
  name: string;
  pricing: {
    hourly: number;
    daily: number;
    perPerson: boolean;
  };
  minCapacity: number;
  maxCapacity: number;
}

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

const spaceTypeGradients: Record<string, string> = {
  "open-space": "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
  "salle-verriere": "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
  "salle-etage": "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
  evenementiel: "linear-gradient(135deg, #EF4444 0%, #F87171 100%)",
  desk: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
  "meeting-room": "linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)",
  "private-office": "linear-gradient(135deg, #EC4899 0%, #F472B6 100%)",
  "event-space": "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
};

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
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Reservation | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [moreEvents, setMoreEvents] = useState<Reservation[]>([]);
  const [moreEventsDate, setMoreEventsDate] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [currentView, setCurrentView] = useState("Mois");
  const [paymentType, setPaymentType] = useState("unpaid");
  const [spaceConfigurations, setSpaceConfigurations] = useState<
    SpaceConfiguration[]
  >([]);
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(0);
  const [isPendingStatus, setIsPendingStatus] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);
  const [selectedSpaceType, setSelectedSpaceType] = useState<string>("");
  const [isPartialPrivatization, setIsPartialPrivatization] = useState(false);
  const [exceptionalClosures, setExceptionalClosures] = useState<any[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { setPageTitle, setPageActions } = useTopbarContext();

  // Get selected space configuration
  const selectedSpaceConfig = spaceConfigurations.find(
    (c) => c.spaceType === selectedSpaceType
  );

  // Fix calendar size when sidebar changes
  useEffect(() => {
    const handleResize = () => {
      const calendarApi = calendarRef.current?.getApi();
      if (calendarApi) {
        setTimeout(() => {
          calendarApi.updateSize();
        }, 350); // Wait for sidebar animation to complete
      }
    };

    // Listen for data-menu-size attribute changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-menu-size"
        ) {
          handleResize();
        }
      });
    });

    const htmlElement = document.documentElement;
    observer.observe(htmlElement, {
      attributes: true,
      attributeFilter: ["data-menu-size"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Update title with current view date
  const updatePageTitle = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      const currentDate = calendarApi.getDate();
      const view = calendarApi.view;

      let dateStr = "";
      if (view.type === "dayGridMonth") {
        dateStr = currentDate.toLocaleDateString("fr-FR", {
          month: "long",
          year: "numeric",
        });
      } else if (view.type === "timeGridWeek") {
        const start = view.activeStart;
        const end = new Date(view.activeEnd);
        end.setDate(end.getDate() - 1);
        dateStr = `${start.getDate()} - ${end.getDate()} ${end.toLocaleDateString(
          "fr-FR",
          { month: "long", year: "numeric" }
        )}`;
      } else if (view.type === "timeGridDay") {
        dateStr = currentDate.toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
      setPageTitle(`Calendrier - ${dateStr}`);
    }
  };

  useEffect(() => {
    updatePageTitle();
    setPageActions(
      <>
        <button
          onClick={() => {
            const calendarApi = calendarRef.current?.getApi();
            calendarApi?.today();
            setTimeout(updatePageTitle, 100);
          }}
          style={{
            padding: "8px 16px",
            background: "rgba(102, 126, 234, 0.1)",
            border: "1px solid #667eea",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 600,
            color: "#667eea",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#667eea";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(102, 126, 234, 0.1)";
            e.currentTarget.style.color = "#667eea";
          }}
        >
          Aujourd'hui
        </button>
        <button
          onClick={() => {
            const calendarApi = calendarRef.current?.getApi();
            calendarApi?.prev();
            setTimeout(updatePageTitle, 100);
          }}
          style={{
            width: "40px",
            height: "40px",
            padding: 0,
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            fontSize: "20px",
            color: "#374151",
            cursor: "pointer",
            transition: "all 0.3s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f9fafb";
            e.currentTarget.style.borderColor = "#d1d5db";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.borderColor = "#e5e7eb";
          }}
        >
          ‹
        </button>
        <button
          onClick={() => {
            const calendarApi = calendarRef.current?.getApi();
            calendarApi?.next();
            setTimeout(updatePageTitle, 100);
          }}
          style={{
            width: "40px",
            height: "40px",
            padding: 0,
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            fontSize: "20px",
            color: "#374151",
            cursor: "pointer",
            transition: "all 0.3s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f9fafb";
            e.currentTarget.style.borderColor = "#d1d5db";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.borderColor = "#e5e7eb";
          }}
        >
          ›
        </button>
        <div
          style={{
            width: "1px",
            height: "24px",
            background: "#e5e7eb",
            margin: "0 8px",
          }}
        ></div>
        <button
          onClick={() => {
            const calendarApi = calendarRef.current?.getApi();
            const viewMap: Record<string, string> = {
              Jour: "timeGridDay",
              Semaine: "timeGridWeek",
              Mois: "dayGridMonth",
            };
            calendarApi?.changeView(viewMap["Jour"]);
            setCurrentView("Jour");
            setTimeout(updatePageTitle, 100);
          }}
          style={{
            padding: "8px 16px",
            background: currentView === "Jour" ? "#667eea" : "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 500,
            color: currentView === "Jour" ? "white" : "#374151",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            if (currentView !== "Jour") {
              e.currentTarget.style.background = "#f9fafb";
              e.currentTarget.style.borderColor = "#d1d5db";
            }
          }}
          onMouseLeave={(e) => {
            if (currentView !== "Jour") {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.borderColor = "#e5e7eb";
            }
          }}
        >
          Jour
        </button>
        <button
          onClick={() => {
            const calendarApi = calendarRef.current?.getApi();
            const viewMap: Record<string, string> = {
              Jour: "timeGridDay",
              Semaine: "timeGridWeek",
              Mois: "dayGridMonth",
            };
            calendarApi?.changeView(viewMap["Semaine"]);
            setCurrentView("Semaine");
            setTimeout(updatePageTitle, 100);
          }}
          style={{
            padding: "8px 16px",
            background: currentView === "Semaine" ? "#667eea" : "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 500,
            color: currentView === "Semaine" ? "white" : "#374151",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            if (currentView !== "Semaine") {
              e.currentTarget.style.background = "#f9fafb";
              e.currentTarget.style.borderColor = "#d1d5db";
            }
          }}
          onMouseLeave={(e) => {
            if (currentView !== "Semaine") {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.borderColor = "#e5e7eb";
            }
          }}
        >
          Semaine
        </button>
        <button
          onClick={() => {
            const calendarApi = calendarRef.current?.getApi();
            const viewMap: Record<string, string> = {
              Jour: "timeGridDay",
              Semaine: "timeGridWeek",
              Mois: "dayGridMonth",
            };
            calendarApi?.changeView(viewMap["Mois"]);
            setCurrentView("Mois");
            setTimeout(updatePageTitle, 100);
          }}
          style={{
            padding: "8px 16px",
            background: currentView === "Mois" ? "#667eea" : "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 500,
            color: currentView === "Mois" ? "white" : "#374151",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            if (currentView !== "Mois") {
              e.currentTarget.style.background = "#f9fafb";
              e.currentTarget.style.borderColor = "#d1d5db";
            }
          }}
          onMouseLeave={(e) => {
            if (currentView !== "Mois") {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.borderColor = "#e5e7eb";
            }
          }}
        >
          Mois
        </button>
      </>
    );

    return () => {
      setPageTitle("Dashboard");
      setPageActions(null);
    };
  }, [currentView, setPageTitle, setPageActions]);

  useEffect(() => {
    fetchReservations();
    fetchSpaceConfigurations();
    fetchExceptionalClosures();

    // Update title when calendar loads
    const timer = setTimeout(() => {
      updatePageTitle();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const fetchSpaceConfigurations = async () => {
    try {
      const response = await fetch("/api/space-configurations");
      const data = await response.json();
      if (data.success) {
        setSpaceConfigurations(data.data);
      }
    } catch (error) {
      console.error("Error fetching space configurations:", error);
    }
  };

  // Calculate price based on space type, number of people, and duration
  const calculatePrice = (
    spaceType: string,
    numberOfPeople: number,
    startTime: string,
    endTime: string
  ): number | null => {
    const config = spaceConfigurations.find((c) => c.spaceType === spaceType);
    if (!config) return 0;

    // If requires quote, return null to indicate "Sur devis"
    if (config.requiresQuote) {
      return null;
    }

    // Calculate duration in hours
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    const durationHours = endHour + endMin / 60 - (startHour + startMin / 60);

    // Check if using tier-based pricing
    if (config.pricing.tiers && config.pricing.tiers.length > 0) {
      const tier = config.pricing.tiers.find(
        (t) => numberOfPeople >= t.minPeople && numberOfPeople <= t.maxPeople
      );

      if (tier) {
        // Check if should use daily rate (if duration >= 5 hours or similar threshold)
        const isDailyRate = durationHours >= 5;

        if (isDailyRate) {
          // Use daily rate
          return tier.dailyRate;
        } else {
          // Use hourly rate
          return tier.hourlyRate * durationHours;
        }
      } else {
        // Person count exceeds tier max, calculate with extra person charges
        const maxTier = config.pricing.tiers[config.pricing.tiers.length - 1];
        const extraPeople = numberOfPeople - maxTier.maxPeople;
        const isDailyRate = durationHours >= 5;

        if (isDailyRate) {
          return (
            maxTier.dailyRate + extraPeople * (maxTier.extraPersonDaily || 0)
          );
        } else {
          return (
            maxTier.hourlyRate * durationHours +
            extraPeople * (maxTier.extraPersonHourly || 0) * durationHours
          );
        }
      }
    }

    // Simple per-person pricing with max hours threshold (e.g., open-space)
    if (
      config.pricing.maxHoursBeforeDaily &&
      durationHours > config.pricing.maxHoursBeforeDaily
    ) {
      return numberOfPeople * (config.pricing.dailyRatePerPerson || 0);
    }

    // Standard calculation: hourly rate * duration * number of people
    const hourlyRate = config.pricing.hourly;
    if (config.pricing.perPerson) {
      return hourlyRate * durationHours * numberOfPeople;
    }
    return hourlyRate * durationHours;
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/reservations");
      const data = await response.json();

      if (data.success) {
        setReservations(data.data);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Erreur lors du chargement",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erreur lors du chargement des réservations",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchExceptionalClosures = async () => {
    try {
      const response = await fetch("/api/admin/global-hours");
      const data = await response.json();

      if (data.success && data.data && data.data.exceptionalClosures) {
        setExceptionalClosures(data.data.exceptionalClosures);
      }
    } catch (error) {
      console.error("Error fetching exceptional closures:", error);
    }
  };

  const updateReservationStatus = async (
    id: string,
    status: string,
    paymentStatus?: string
  ) => {
    try {
      const updates: any = { id, status };
      if (paymentStatus) {
        updates.paymentStatus = paymentStatus;
      }

      const response = await fetch("/api/admin/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "Statut mis à jour avec succès" });
        setShowModal(false);
        fetchReservations();
        fetchExceptionalClosures(); // Reload closures in case one was added
      } else {
        setMessage({
          type: "error",
          text: data.error || "Erreur lors de la mise à jour",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de la mise à jour" });
    }
  };

  const handleEventDrop = async (info: any) => {
    const reservation = info.event.extendedProps.reservation;
    const newDate = new Date(info.event.start);

    // Format new date and times
    const date = formatDateForAPI(newDate);
    const startTime = newDate.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const endTime = new Date(info.event.end).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    try {
      const response = await fetch("/api/admin/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: reservation._id,
          date,
          startTime,
          endTime,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: "Réservation déplacée avec succès",
        });
        fetchReservations();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Erreur lors du déplacement",
        });
        info.revert(); // Revert the event to its original position
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors du déplacement" });
      info.revert();
    }
  };

  const handleEventResize = async (info: any) => {
    const reservation = info.event.extendedProps.reservation;
    const startTime = new Date(info.event.start).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const endTime = new Date(info.event.end).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    try {
      const response = await fetch("/api/admin/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: reservation._id,
          startTime,
          endTime,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: "Horaires mis à jour avec succès",
        });
        fetchReservations();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Erreur lors de la modification",
        });
        info.revert();
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de la modification" });
      info.revert();
    }
  };

  // Convert reservations to calendar events
  const reservationEvents = reservations
    .filter((reservation) => reservation.status !== "cancelled") // Exclure uniquement les annulées
    .map((reservation) => {
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
      const gradient =
        spaceTypeGradients[reservation.spaceType] ||
        spaceTypeGradients["open-space"];

      return {
        id: reservation._id,
        title,
        start: start.toISOString(),
        end: end.toISOString(),
        backgroundColor: spaceTypeColors[reservation.spaceType] || "#667eea",
        borderColor: "transparent",
        textColor: "#ffffff",
        extendedProps: {
          reservation,
          gradient,
        },
        classNames: [
          reservation.status === "pending" ? "event-pending" : "",
          reservation.status === "confirmed" ? "event-confirmed" : "",
          reservation.status === "completed" ? "event-completed" : "",
          `event-${reservation.spaceType}`,
        ].filter(Boolean),
      };
    });

  // Convert exceptional closures to calendar events
  const closureEvents = exceptionalClosures.map((closure, index) => {
    const date = new Date(closure.date);

    if (closure.isFullDay !== false) {
      // Full day closure
      return {
        id: `closure-${index}`,
        title: `🚫 FERMÉ${closure.reason ? ` - ${closure.reason}` : ""}`,
        start: date.toISOString().split("T")[0],
        end: date.toISOString().split("T")[0],
        allDay: true,
        backgroundColor: "#FEE2E2",
        borderColor: "#EF4444",
        textColor: "#991B1B",
        color: "#991B1B",
        classNames: ["exceptional-closure-fullday"],
        extendedProps: {
          isClosure: true,
          isFullDay: true,
          closure,
        },
      };
    } else {
      // Partial closure with time range
      const [startHour, startMin] = (closure.startTime || "00:00").split(":");
      const [endHour, endMin] = (closure.endTime || "23:59").split(":");

      const start = new Date(date);
      start.setHours(parseInt(startHour), parseInt(startMin));

      const end = new Date(date);
      end.setHours(parseInt(endHour), parseInt(endMin));

      return {
        id: `closure-${index}`,
        title: `🚫 FERMÉ${closure.reason ? ` - ${closure.reason}` : ""}`,
        start: start.toISOString(),
        end: end.toISOString(),
        backgroundColor: "#EF4444",
        borderColor: "transparent",
        textColor: "#ffffff",
        extendedProps: {
          isClosure: true,
          closure,
        },
      };
    }
  });

  // Combine both types of events
  const events = [...reservationEvents, ...closureEvents];

  const handleEventClick = (info: any) => {
    // Don't open modal for exceptional closures
    if (info.event.extendedProps.isClosure) {
      return;
    }

    const reservation = info.event.extendedProps.reservation;
    setSelectedEvent(reservation);
    setIsEditMode(false);
    setEditForm(null);
    setShowModal(true);
  };

  const handleEditClick = () => {
    if (selectedEvent) {
      setEditForm({
        spaceType: selectedEvent.spaceType,
        date: new Date(selectedEvent.date).toISOString().split("T")[0],
        startTime: selectedEvent.startTime,
        endTime: selectedEvent.endTime,
        numberOfPeople: selectedEvent.numberOfPeople,
        totalPrice: selectedEvent.totalPrice,
        status: selectedEvent.status,
        paymentStatus: selectedEvent.paymentStatus,
        contactName: selectedEvent.contactName || selectedEvent.user.name,
        contactEmail: selectedEvent.contactEmail || selectedEvent.user.email,
      });
      setIsEditMode(true);
    }
  };

  const handleEditFormChange = (field: string, value: any) => {
    setEditForm((prev: any) => {
      const updated = { ...prev, [field]: value };

      // Recalculate price if relevant fields change
      if (
        ["spaceType", "numberOfPeople", "startTime", "endTime"].includes(field)
      ) {
        const price = calculatePrice(
          updated.spaceType,
          updated.numberOfPeople,
          updated.startTime,
          updated.endTime
        );
        updated.totalPrice = price;
      }

      return updated;
    });
  };

  const handleSaveEdit = async () => {
    if (!selectedEvent || !editForm) return;

    try {
      const response = await fetch("/api/admin/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedEvent._id,
          ...editForm,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: "Réservation mise à jour avec succès",
        });
        setShowModal(false);
        setIsEditMode(false);
        setEditForm(null);
        fetchReservations();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Erreur lors de la mise à jour",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de la mise à jour" });
    }
  };

  const handleDateClick = (info: any) => {
    const clickedDate = new Date(info.date || info.start);

    // Check if the clicked date has an exceptional closure
    const dateStr = clickedDate.toISOString().split("T")[0];
    const hasClosure = exceptionalClosures.some((closure) => {
      const closureDate = new Date(closure.date).toISOString().split("T")[0];
      if (closureDate !== dateStr) return false;

      // If full day closure, block entirely
      if (closure.isFullDay !== false) return true;

      // If partial closure with times, check if it overlaps
      // For now, we'll block the entire day if there's any closure
      // You could make this more sophisticated to only block specific hours
      return true;
    });

    if (hasClosure) {
      setMessage({
        type: "error",
        text: "Impossible de créer une réservation : jour fermé",
      });
      return;
    }

    setSelectedDate(clickedDate);

    // Si c'est une vue avec heures (timeGrid), on peut récupérer l'heure
    if (info.start && info.end) {
      const startTime = new Date(info.start).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const endTime = new Date(info.end).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setSelectedTimeSlot({ start: startTime, end: endTime });
    } else {
      // Par défaut, 9h-10h
      setSelectedTimeSlot({ start: "09:00", end: "10:00" });
    }

    // Reset calculated price and payment type
    setCalculatedPrice(0);
    setPaymentType("unpaid");
    setShowCreateModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Format date to YYYY-MM-DD without UTC conversion
  const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 120px)",
      }}
    >
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
      <Card
        className="border-0 shadow-sm flex-grow-1"
        style={{
          borderRadius: "16px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Card.Body
          className="p-0"
          style={{ display: "flex", flexDirection: "column", flex: 1 }}
        >
          <div
            className="p-0"
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <style jsx global>{`
              .fc {
                font-family: "Google Sans", "Roboto", -apple-system, sans-serif;
                font-size: 0.9375rem;
              }

              /* Toolbar - hide default, we made custom */
              .fc-toolbar {
                display: none !important;
              }

              /* Google Calendar Style Headers */
              .fc-col-header {
                background: white;
                border-bottom: 1px solid #dadce0;
              }

              .fc-col-header-cell {
                padding: 8px 4px !important;
                border-color: transparent !important;
                text-align: center;
              }

              .fc-col-header-cell-cushion {
                display: block !important;
                font-size: 11px;
                font-weight: 500;
                color: #70757a;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                padding: 8px 0 !important;
              }

              /* Show full date in headers (e.g., "Lun 25 nov") */
              .fc-col-header-cell-cushion {
                white-space: nowrap;
              }

              /* Day numbers styling */
              .fc-daygrid-day-number {
                float: none !important;
                text-align: center;
                padding: 8px !important;
                margin: 0 auto !important;
                font-size: 26px !important;
                font-weight: 400 !important;
                color: #3c4043;
                background: transparent !important;
                width: auto !important;
                height: auto !important;
                display: block !important;
              }

              /* Today styling - blue circle */
              .fc-day-today .fc-daygrid-day-number {
                background: #1a73e8 !important;
                color: white !important;
                width: 46px !important;
                height: 46px !important;
                border-radius: 50% !important;
                display: inline-flex !important;
                align-items: center;
                justify-content: center;
                font-size: 24px !important;
                font-weight: 500 !important;
                margin: 4px auto !important;
              }

              /* Day cells */
              .fc-daygrid-day {
                transition: background-color 0.2s ease;
              }
              .fc-daygrid-day:hover {
                background-color: #f8f9fa;
              }

              .fc-day-today {
                background-color: #e8f0fe !important;
              }

              /* Month view adjustments */
              .fc-dayGridMonth-view .fc-daygrid-day-number {
                font-size: 12px !important;
                padding: 4px !important;
              }
              .fc-dayGridMonth-view .fc-day-today .fc-daygrid-day-number {
                width: 28px !important;
                height: 28px !important;
                font-size: 12px !important;
              }
              .fc-dayGridMonth-view .fc-daygrid-day-frame {
                min-height: 100px !important;
              }

              /* Time grid view - hide day numbers in cells */
              .fc-timegrid-view .fc-daygrid-day-number {
                display: none;
              }

              /* Time grid - Google style */
              .fc-timegrid-axis {
                background: white;
                border-right: 1px solid #dadce0;
                width: 60px;
              }
              .fc-timegrid-slot {
                height: 48px !important;
                border-color: #f0f0f0 !important;
              }
              .fc-timegrid-slot:nth-child(2n) {
                border-bottom-color: #dadce0 !important;
              }
              .fc-timegrid-slot-label {
                font-size: 10px !important;
                font-weight: 400 !important;
                color: #70757a !important;
                padding-right: 8px !important;
                text-align: right;
                vertical-align: top;
                padding-top: 2px !important;
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

              /* Events - Google Calendar style */
              .fc-event {
                padding: 2px 6px !important;
                cursor: grab !important;
                border-radius: 4px !important;
                border-right: 6px solid transparent !important;
                font-size: 12px !important;
                font-weight: 500 !important;
                transition: all 0.2s ease !important;
                margin: 1px 2px !important;
              }
              .fc-event:hover {
                box-shadow: 0 2px 8px rgba(60, 64, 67, 0.15) !important;
                z-index: 10 !important;
                transform: scale(1.02);
              }
              .fc-event:active {
                cursor: grabbing !important;
              }
              .fc-event.fc-event-dragging {
                opacity: 0.7 !important;
                box-shadow: 0 4px 12px rgba(60, 64, 67, 0.3) !important;
              }

              /* Event status indicators - moved to right */
              .fc-event.event-confirmed {
                border-right-color: rgba(16, 185, 129, 0.8) !important;
                border-right-width: 10px !important;
              }
              .fc-event.event-pending {
                border-right-color: rgba(251, 188, 4, 0.9) !important;
                border-right-width: 10px !important;
                opacity: 0.85;
              }
              .fc-event.event-completed {
                border-right-color: rgba(99, 102, 241, 0.8) !important;
                border-right-width: 10px !important;
                opacity: 0.7;
              }

              /* Event colors - Google Calendar style (solid colors) */
              .fc-event.event-open-space {
                background: #039be5 !important;
              }
              .fc-event.event-salle-verriere {
                background: #0b8043 !important;
              }
              .fc-event.event-salle-etage {
                background: #f09300 !important;
              }
              .fc-event.event-evenementiel {
                background: #d50000 !important;
              }
              .fc-event.event-desk {
                background: #7986cb !important;
              }
              .fc-event.event-meeting-room {
                background: #33b679 !important;
              }
              .fc-event.event-private-office {
                background: #8e24aa !important;
              }
              .fc-event.event-event-space {
                background: #e67c73 !important;
              }

              .fc-event-main {
                color: white !important;
              }

              /* Borders - minimal Google style */
              .fc-scrollgrid {
                border-color: #dadce0 !important;
                border-radius: 0;
              }
              .fc-scrollgrid td,
              .fc-scrollgrid th {
                border-color: #dadce0 !important;
              }
              .fc-scrollgrid-section > td {
                border-width: 0 !important;
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

              /* More link styling - Google Calendar style */
              .fc-daygrid-more-link {
                font-size: 11px !important;
                font-weight: 500 !important;
                color: #1a73e8 !important;
                text-decoration: none !important;
                padding: 2px 6px !important;
                margin: 2px 4px !important;
                border-radius: 4px !important;
                display: block !important;
                transition: background 0.2s !important;
              }
              .fc-daygrid-more-link:hover {
                background: rgba(26, 115, 232, 0.1) !important;
              }

              /* Dark Mode - Google Calendar dark theme */
              [data-bs-theme="dark"] .fc-col-header {
                background: #1f1f1f;
                border-bottom: 1px solid #3c4043;
              }
              [data-bs-theme="dark"] .fc-daygrid-more-link {
                color: #8ab4f8 !important;
              }
              [data-bs-theme="dark"] .fc-daygrid-more-link:hover {
                background: rgba(138, 180, 248, 0.15) !important;
              }
              [data-bs-theme="dark"] .fc-col-header-cell-cushion {
                color: #9aa0a6 !important;
              }
              [data-bs-theme="dark"] .fc-daygrid-day-number {
                color: #e8eaed !important;
              }
              [data-bs-theme="dark"] .fc-day-today {
                background-color: rgba(138, 180, 248, 0.2) !important;
              }
              [data-bs-theme="dark"] .fc-day-today .fc-daygrid-day-number {
                background: #8ab4f8 !important;
                color: #202124 !important;
              }
              [data-bs-theme="dark"] .fc-daygrid-day:hover {
                background-color: rgba(255, 255, 255, 0.04);
              }
              [data-bs-theme="dark"] .fc-timegrid-axis {
                background: #1f1f1f;
                border-right: 1px solid #3c4043;
              }
              [data-bs-theme="dark"] .fc-timegrid-slot {
                border-color: #3c4043 !important;
              }
              [data-bs-theme="dark"] .fc-timegrid-slot:nth-child(2n) {
                border-bottom-color: #5f6368 !important;
              }
              [data-bs-theme="dark"] .fc-timegrid-slot-label {
                color: #9aa0a6 !important;
              }
              [data-bs-theme="dark"] .fc-scrollgrid {
                border-color: #3c4043 !important;
              }
              [data-bs-theme="dark"] .fc-scrollgrid td,
              [data-bs-theme="dark"] .fc-scrollgrid th {
                border-color: #3c4043 !important;
              }
              [data-bs-theme="dark"] .fc-scroller::-webkit-scrollbar-track {
                background: #202124;
              }
              [data-bs-theme="dark"] .fc-scroller::-webkit-scrollbar-thumb {
                background: #5f6368;
              }
              [data-bs-theme="dark"]
                .fc-scroller::-webkit-scrollbar-thumb:hover {
                background: #80868b;
              }

              /* Ensure all day cells have same height */
              .fc-dayGridMonth-view .fc-daygrid-day-frame {
                min-height: 120px !important;
              }

              /* Exceptional closure styling - fill all available space under date */
              .fc-event.exceptional-closure-fullday {
                border: 2px solid #ef4444 !important;
                border-radius: 6px !important;
                margin: 0 4px 4px 4px !important;
                padding: 42px !important;
                font-weight: 700 !important;
                font-size: 13px !important;
                text-align: center !important;
                cursor: not-allowed !important;
                background: #fee2e2 !important;
                color: #991b1b !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                position: absolute !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                top: 0 !important;
              }

              .fc-event.exceptional-closure-fullday .fc-event-main {
                color: #991b1b !important;
              }
            `}</style>
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={false}
              titleFormat={{ year: "numeric", month: "long" }}
              dayHeaderFormat={(args) => {
                const view = calendarRef.current?.getApi().view;
                const date = args.date.marker || args.date;
                if (view?.type === "dayGridMonth") {
                  // Vue mois : juste le nom du jour
                  return new Date(date).toLocaleDateString("fr-FR", {
                    weekday: "long",
                  });
                } else {
                  // Vues jour/semaine : jour + date
                  return new Date(date).toLocaleDateString("fr-FR", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  });
                }
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
              eventDrop={handleEventDrop}
              eventResize={handleEventResize}
              height="100%"
              slotMinTime="08:00:00"
              slotMaxTime="20:00:00"
              slotDuration="00:30:00"
              allDaySlot={false}
              nowIndicator={true}
              weekends={true}
              editable={true}
              selectable={true}
              selectMirror={true}
              select={handleDateClick}
              dateClick={handleDateClick}
              dayMaxEvents={3}
              moreLinkClick={(info) => {
                // Get all events for this day
                const dayEvents = info.allSegs.map(
                  (seg) => seg.event.extendedProps.reservation
                );
                const dateStr = new Date(info.date).toLocaleDateString(
                  "fr-FR",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                );
                setMoreEvents(dayEvents);
                setMoreEventsDate(dateStr);
                setShowMoreModal(true);
                return "popover";
              }}
              moreLinkText={(num) => `+${num} resa${num > 1 ? "s" : ""}`}
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
                // Handle closure events differently
                if (arg.event.extendedProps.isClosure) {
                  return {
                    html: `
                    <div style="
                      padding: 2px 6px;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                      font-size: 13px;
                      line-height: 1.4;
                      font-weight: 700;
                      color: #991B1B;
                    ">
                      ${arg.event.title}
                    </div>
                  `,
                  };
                }

                // Handle reservation events
                const reservation = arg.event.extendedProps.reservation;
                const statusIcon =
                  reservation.status === "confirmed"
                    ? "✓"
                    : reservation.status === "pending"
                    ? "⏱"
                    : reservation.status === "cancelled"
                    ? "✕"
                    : "";

                // Google Calendar style - just time and title on one line
                return {
                  html: `
                  <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1px 4px;
                    overflow: hidden;
                    font-size: 11px;
                    line-height: 1.4;
                  ">
                    <div style="
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                      flex: 1;
                    ">
                      <span style="font-weight: 600;">${arg.timeText}</span>
                      <span style="margin: 0 4px;">•</span>
                      <span>${arg.event.title}</span>
                    </div>
                    ${
                      statusIcon
                        ? `<span style="margin-left: 4px; opacity: 0.8; flex-shrink: 0;">${statusIcon}</span>`
                        : ""
                    }
                  </div>
                `,
                };
              }}
            />
          </div>
        </Card.Body>
      </Card>

      {/* Legend */}
      <Card
        className="border-0 shadow-sm mt-3"
        style={{ borderRadius: "16px", overflow: "hidden" }}
      >
        <Card.Body className="p-3">
          <div className="row align-items-center">
            <div className="col-md-8 mb-3 mb-md-0">
              <div className="d-flex align-items-center mb-3">
                <Icon
                  icon="ri:palette-line"
                  width={20}
                  className="me-2 text-primary"
                />
                <h6 className="mb-0 fw-semibold">Types d'espaces</h6>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {spaceConfigurations.map((config) => {
                  const color = spaceTypeColors[config.spaceType] || "#667eea";
                  return (
                    <div
                      key={config.spaceType}
                      className="d-inline-flex align-items-center px-3 py-2 rounded-pill"
                      style={{
                        background: `${color}15`,
                        border: `1px solid ${color}30`,
                        fontSize: "0.8125rem",
                        fontWeight: 500,
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: color,
                          marginRight: "8px",
                        }}
                      />
                      {config.name}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center mb-3">
                <Icon
                  icon="ri:flag-line"
                  width={20}
                  className="me-2 text-primary"
                />
                <h6 className="mb-0 fw-semibold">Statuts</h6>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <div
                  className="d-inline-flex align-items-center px-3 py-2 rounded-pill"
                  style={{
                    background: "#10B98115",
                    border: "1px solid #10B98130",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                  }}
                >
                  <Icon
                    icon="ri:checkbox-circle-fill"
                    width={14}
                    className="me-1"
                    style={{ color: "#10B981" }}
                  />
                  Confirmée
                </div>
                <div
                  className="d-inline-flex align-items-center px-3 py-2 rounded-pill"
                  style={{
                    background: "#F59E0B15",
                    border: "1px solid #F59E0B30",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                  }}
                >
                  <Icon
                    icon="ri:time-line"
                    width={14}
                    className="me-1"
                    style={{ color: "#F59E0B" }}
                  />
                  En attente
                </div>
                <div
                  className="d-inline-flex align-items-center px-3 py-2 rounded-pill"
                  style={{
                    background: "#6366F115",
                    border: "1px solid #6366F130",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                  }}
                >
                  <Icon
                    icon="ri:check-double-line"
                    width={14}
                    className="me-1"
                    style={{ color: "#6366F1" }}
                  />
                  Terminée
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
        style={{ borderRadius: "16px" }}
      >
        <Modal.Header
          closeButton
          className="border-0 pb-2"
          style={{ padding: "1.5rem 1.75rem 0" }}
        >
          <Modal.Title
            style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1F2937" }}
          >
            {isEditMode
              ? "Modifier la réservation"
              : "Détails de la réservation"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "1.75rem" }}>
          {selectedEvent && !isEditMode && (
            <div>
              {/* Header Card */}
              <div
                className="mb-4 p-4"
                style={{
                  background: `${spaceTypeColors[selectedEvent.spaceType]}08`,
                  borderRadius: "12px",
                  border: `1px solid ${
                    spaceTypeColors[selectedEvent.spaceType]
                  }20`,
                }}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-2">
                      <Icon
                        icon="ri:user-3-fill"
                        width={24}
                        style={{
                          color: spaceTypeColors[selectedEvent.spaceType],
                          marginRight: "10px",
                        }}
                      />
                      <h5
                        className="mb-0"
                        style={{ fontWeight: 600, color: "#1F2937" }}
                      >
                        {selectedEvent.contactName || selectedEvent.user.name}
                      </h5>
                    </div>
                    <div
                      className="d-flex align-items-center text-muted"
                      style={{ fontSize: "0.9375rem" }}
                    >
                      <Icon icon="ri:mail-line" width={16} className="me-2" />
                      {selectedEvent.contactEmail || selectedEvent.user.email}
                    </div>
                  </div>
                  <div
                    className="px-4 py-2"
                    style={{
                      background: spaceTypeColors[selectedEvent.spaceType],
                      color: "white",
                      borderRadius: "8px",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {spaceTypeLabels[selectedEvent.spaceType] ||
                      selectedEvent.spaceType}
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="row g-3">
                <div className="col-md-6">
                  <div
                    className="p-4 h-100"
                    style={{
                      background: "#F9FAFB",
                      borderRadius: "12px",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <div className="d-flex align-items-center mb-3">
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "10px",
                          background: "#4F46E510",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "12px",
                        }}
                      >
                        <Icon
                          icon="ri:calendar-line"
                          width={20}
                          style={{ color: "#4F46E5" }}
                        />
                      </div>
                      <h6
                        className="mb-0"
                        style={{ fontWeight: 600, color: "#374151" }}
                      >
                        Date et heure
                      </h6>
                    </div>
                    <div
                      style={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "#1F2937",
                        marginBottom: "4px",
                      }}
                    >
                      {formatDate(selectedEvent.date)}
                    </div>
                    <div style={{ fontSize: "0.9375rem", color: "#6B7280" }}>
                      {selectedEvent.startTime} - {selectedEvent.endTime}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    className="p-4 h-100"
                    style={{
                      background: "#F9FAFB",
                      borderRadius: "12px",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <div className="d-flex align-items-center mb-3">
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "10px",
                          background: "#06B6D410",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "12px",
                        }}
                      >
                        <Icon
                          icon="ri:group-line"
                          width={20}
                          style={{ color: "#06B6D4" }}
                        />
                      </div>
                      <h6
                        className="mb-0"
                        style={{ fontWeight: 600, color: "#374151" }}
                      >
                        Participants
                      </h6>
                    </div>
                    <div
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        color: "#1F2937",
                      }}
                    >
                      {selectedEvent.numberOfPeople}
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                      personne{selectedEvent.numberOfPeople > 1 ? "s" : ""}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    className="p-4 h-100"
                    style={{
                      background: "#F9FAFB",
                      borderRadius: "12px",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <div className="d-flex align-items-center mb-3">
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "10px",
                          background: "#10B98110",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "12px",
                        }}
                      >
                        <Icon
                          icon="ri:money-euro-circle-line"
                          width={20}
                          style={{ color: "#10B981" }}
                        />
                      </div>
                      <h6
                        className="mb-0"
                        style={{ fontWeight: 600, color: "#374151" }}
                      >
                        Prix total
                      </h6>
                    </div>
                    <div
                      style={{
                        fontSize: "1.875rem",
                        fontWeight: 700,
                        color: "#10B981",
                      }}
                    >
                      {selectedEvent.totalPrice.toFixed(2)}€
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div
                    className="p-4 h-100"
                    style={{
                      background: "#F9FAFB",
                      borderRadius: "12px",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <div className="d-flex align-items-center mb-3">
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "10px",
                          background: "#F59E0B10",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "12px",
                        }}
                      >
                        <Icon
                          icon="ri:checkbox-circle-line"
                          width={20}
                          style={{ color: "#F59E0B" }}
                        />
                      </div>
                      <h6
                        className="mb-0"
                        style={{ fontWeight: 600, color: "#374151" }}
                      >
                        Statut
                      </h6>
                    </div>
                    <div className="d-flex flex-column gap-2">
                      <div
                        className="d-inline-flex align-items-center px-3 py-2 rounded-pill"
                        style={{
                          background:
                            selectedEvent.status === "confirmed"
                              ? "#10B98115"
                              : selectedEvent.status === "pending"
                              ? "#F59E0B15"
                              : selectedEvent.status === "completed"
                              ? "#6366F115"
                              : "#EF444415",
                          border: `1px solid ${
                            selectedEvent.status === "confirmed"
                              ? "#10B98130"
                              : selectedEvent.status === "pending"
                              ? "#F59E0B30"
                              : selectedEvent.status === "completed"
                              ? "#6366F130"
                              : "#EF444430"
                          }`,
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          width: "fit-content",
                        }}
                      >
                        <Icon
                          icon={
                            selectedEvent.status === "confirmed"
                              ? "ri:checkbox-circle-fill"
                              : selectedEvent.status === "pending"
                              ? "ri:time-line"
                              : selectedEvent.status === "completed"
                              ? "ri:check-double-line"
                              : "ri:close-circle-fill"
                          }
                          width={14}
                          className="me-2"
                          style={{
                            color:
                              selectedEvent.status === "confirmed"
                                ? "#10B981"
                                : selectedEvent.status === "pending"
                                ? "#F59E0B"
                                : selectedEvent.status === "completed"
                                ? "#6366F1"
                                : "#EF4444",
                          }}
                        />
                        {statusLabels[selectedEvent.status]}
                      </div>
                      <div
                        className="d-inline-flex align-items-center px-3 py-2 rounded-pill"
                        style={{
                          background:
                            selectedEvent.paymentStatus === "paid"
                              ? "#10B98115"
                              : selectedEvent.paymentStatus === "pending"
                              ? "#F59E0B15"
                              : "#EF444415",
                          border: `1px solid ${
                            selectedEvent.paymentStatus === "paid"
                              ? "#10B98130"
                              : selectedEvent.paymentStatus === "pending"
                              ? "#F59E0B30"
                              : "#EF444430"
                          }`,
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          width: "fit-content",
                        }}
                      >
                        <Icon
                          icon="ri:wallet-3-line"
                          width={14}
                          className="me-2"
                          style={{
                            color:
                              selectedEvent.paymentStatus === "paid"
                                ? "#10B981"
                                : selectedEvent.paymentStatus === "pending"
                                ? "#F59E0B"
                                : "#EF4444",
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

          {/* Edit Form */}
          {selectedEvent && isEditMode && editForm && (
            <div>
              <form>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Type d'espace
                    </label>
                    <select
                      className="form-select"
                      value={editForm.spaceType}
                      onChange={(e) =>
                        handleEditFormChange("spaceType", e.target.value)
                      }
                    >
                      {Object.entries(spaceTypeLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Nombre de personnes
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={editForm.numberOfPeople}
                      onChange={(e) =>
                        handleEditFormChange(
                          "numberOfPeople",
                          parseInt(e.target.value)
                        )
                      }
                      min="1"
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label fw-semibold">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={editForm.date}
                      onChange={(e) =>
                        handleEditFormChange("date", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Heure de début
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      value={editForm.startTime}
                      onChange={(e) =>
                        handleEditFormChange("startTime", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Heure de fin
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      value={editForm.endTime}
                      onChange={(e) =>
                        handleEditFormChange("endTime", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Nom du contact
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.contactName}
                      onChange={(e) =>
                        handleEditFormChange("contactName", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Email du contact
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      value={editForm.contactEmail}
                      onChange={(e) =>
                        handleEditFormChange("contactEmail", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Statut</label>
                    <select
                      className="form-select"
                      value={editForm.status}
                      onChange={(e) =>
                        handleEditFormChange("status", e.target.value)
                      }
                    >
                      <option value="pending">En attente</option>
                      <option value="confirmed">Confirmée</option>
                      <option value="completed">Terminée</option>
                      <option value="cancelled">Annulée</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Statut de paiement
                    </label>
                    <select
                      className="form-select"
                      value={editForm.paymentStatus}
                      onChange={(e) =>
                        handleEditFormChange("paymentStatus", e.target.value)
                      }
                    >
                      <option value="unpaid">Non payé</option>
                      <option value="partial">Partiel</option>
                      <option value="paid">Payé</option>
                    </select>
                  </div>

                  <div className="col-md-12">
                    <div
                      className="p-3 rounded"
                      style={{
                        background: "#F9FAFB",
                        border: "1px solid #E5E7EB",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-semibold text-muted">
                          Prix total calculé:
                        </span>
                        <span
                          className="fs-4 fw-bold"
                          style={{ color: "#10B981" }}
                        >
                          {editForm.totalPrice.toFixed(2)}€
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer
          className="border-0"
          style={{ padding: "0 1.75rem 1.5rem" }}
        >
          {selectedEvent && !isEditMode && (
            <div className="d-flex justify-content-between align-items-center w-100">
              <div className="d-flex gap-2">
                {selectedEvent.status === "pending" && (
                  <>
                    <Button
                      onClick={() =>
                        updateReservationStatus(selectedEvent._id, "confirmed")
                      }
                      style={{
                        background: "#10B981",
                        border: "none",
                        borderRadius: "8px",
                        padding: "0.5rem 1rem",
                        fontWeight: 500,
                        color: "white",
                      }}
                    >
                      <Icon
                        icon="ri:checkbox-circle-line"
                        width={16}
                        style={{ marginRight: "6px" }}
                      />
                      Confirmer
                    </Button>
                    <Button
                      onClick={() =>
                        updateReservationStatus(selectedEvent._id, "cancelled")
                      }
                      style={{
                        background: "#EF4444",
                        border: "none",
                        borderRadius: "8px",
                        padding: "0.5rem 1rem",
                        fontWeight: 500,
                        color: "white",
                      }}
                    >
                      <Icon
                        icon="ri:close-circle-line"
                        width={16}
                        style={{ marginRight: "6px" }}
                      />
                      Annuler
                    </Button>
                  </>
                )}
                {selectedEvent.status === "confirmed" && (
                  <>
                    <Button
                      onClick={() =>
                        updateReservationStatus(
                          selectedEvent._id,
                          "completed",
                          "paid"
                        )
                      }
                      style={{
                        background: "#6366F1",
                        border: "none",
                        borderRadius: "8px",
                        padding: "0.5rem 1rem",
                        fontWeight: 500,
                        color: "white",
                      }}
                    >
                      <Icon
                        icon="ri:check-double-line"
                        width={16}
                        style={{ marginRight: "6px" }}
                      />
                      Marquer terminée
                    </Button>
                    <Button
                      onClick={() =>
                        updateReservationStatus(selectedEvent._id, "cancelled")
                      }
                      style={{
                        background: "#EF4444",
                        border: "none",
                        borderRadius: "8px",
                        padding: "0.5rem 1rem",
                        fontWeight: 500,
                        color: "white",
                      }}
                    >
                      <Icon
                        icon="ri:close-circle-line"
                        width={16}
                        style={{ marginRight: "6px" }}
                      />
                      Annuler
                    </Button>
                  </>
                )}
                {selectedEvent.status === "cancelled" && (
                  <Button
                    onClick={() =>
                      updateReservationStatus(selectedEvent._id, "pending")
                    }
                    style={{
                      background: "#F59E0B",
                      border: "none",
                      borderRadius: "8px",
                      padding: "0.5rem 1rem",
                      fontWeight: 500,
                      color: "white",
                    }}
                  >
                    <Icon
                      icon="ri:restart-line"
                      width={16}
                      style={{ marginRight: "6px" }}
                    />
                    Réactiver
                  </Button>
                )}
              </div>
              <div className="d-flex gap-2">
                <Button
                  variant="outline-primary"
                  onClick={handleEditClick}
                  style={{
                    borderRadius: "8px",
                    padding: "0.5rem 1rem",
                    fontWeight: 500,
                  }}
                >
                  <Icon
                    icon="ri:edit-line"
                    width={16}
                    style={{ marginRight: "6px" }}
                  />
                  Modifier
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowModal(false)}
                  style={{
                    borderRadius: "8px",
                    padding: "0.5rem 1.5rem",
                    fontWeight: 500,
                  }}
                >
                  Fermer
                </Button>
              </div>
            </div>
          )}

          {selectedEvent && isEditMode && (
            <div className="d-flex justify-content-end gap-2 w-100">
              <Button
                variant="outline-secondary"
                onClick={() => setIsEditMode(false)}
                style={{
                  borderRadius: "8px",
                  padding: "0.5rem 1.5rem",
                  fontWeight: 500,
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSaveEdit}
                style={{
                  background: "#667eea",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.5rem 1.5rem",
                  fontWeight: 500,
                  color: "white",
                }}
              >
                <Icon
                  icon="ri:save-line"
                  width={16}
                  style={{ marginRight: "6px" }}
                />
                Enregistrer
              </Button>
            </div>
          )}
        </Modal.Footer>
      </Modal>

      {/* Modal for More Events */}
      <Modal
        show={showMoreModal}
        onHide={() => setShowMoreModal(false)}
        size="lg"
        centered
      >
        <Modal.Header
          closeButton
          className="border-0"
          style={{ padding: "1.5rem 1.75rem" }}
        >
          <Modal.Title style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            Réservations du {moreEventsDate}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "0 1.75rem 1.5rem" }}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {moreEvents.map((reservation, index) => (
              <div
                key={reservation._id || index}
                onClick={() => {
                  setSelectedEvent(reservation);
                  setShowMoreModal(false);
                  setShowModal(true);
                }}
                style={{
                  padding: "16px",
                  background: "#f8f9fa",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f1f3f5";
                  e.currentTarget.style.borderColor = "#d1d5db";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f8f9fa";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "4px",
                      height: "48px",
                      borderRadius: "2px",
                      background:
                        spaceTypeColors[reservation.spaceType] || "#667eea",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#1e293b",
                        }}
                      >
                        {reservation.startTime} - {reservation.endTime}
                      </span>
                      <div
                        style={{
                          padding: "2px 8px",
                          background:
                            spaceTypeColors[reservation.spaceType] || "#667eea",
                          color: "white",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 600,
                        }}
                      >
                        {spaceTypeLabels[reservation.spaceType] ||
                          reservation.spaceType}
                      </div>
                      <Badge
                        bg={
                          reservation.status === "confirmed"
                            ? "success"
                            : reservation.status === "pending"
                            ? "warning"
                            : reservation.status === "cancelled"
                            ? "danger"
                            : "secondary"
                        }
                        style={{ fontSize: "10px" }}
                      >
                        {statusLabels[reservation.status]}
                      </Badge>
                    </div>
                    <div style={{ fontSize: "13px", color: "#64748b" }}>
                      <Icon
                        icon="ri:user-line"
                        width={14}
                        style={{ marginRight: "4px" }}
                      />
                      {reservation.user.name}
                      {reservation.numberOfPeople > 1 &&
                        ` • ${reservation.numberOfPeople} personnes`}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#64748b",
                        marginTop: "2px",
                      }}
                    >
                      <Icon
                        icon="ri:money-euro-circle-line"
                        width={14}
                        style={{ marginRight: "4px" }}
                      />
                      {reservation.totalPrice.toFixed(2)}€
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer
          className="border-0"
          style={{ padding: "0 1.75rem 1.5rem" }}
        >
          <Button
            variant="outline-secondary"
            onClick={() => setShowMoreModal(false)}
            style={{
              borderRadius: "8px",
              padding: "0.5rem 1.5rem",
              fontWeight: 500,
            }}
          >
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Creating Reservation */}
      <Modal
        show={showCreateModal}
        onHide={() => {
          setShowCreateModal(false);
          setIsPendingStatus(false);
          setPaymentType("unpaid");
          setIsPartialPrivatization(false);
        }}
        size="lg"
        centered
      >
        <Modal.Header
          closeButton
          className="border-0"
          style={{ padding: "1.5rem 1.75rem" }}
        >
          <Modal.Title style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            Nouvelle réservation
            {selectedDate &&
              ` - ${selectedDate.toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "0 1.75rem 1.5rem" }}>
          <form
            id="reservation-form"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);

              const reservation = {
                spaceType: formData.get("spaceType"),
                date: selectedDate ? formatDateForAPI(selectedDate) : "",
                startTime: formData.get("startTime"),
                endTime: formData.get("endTime"),
                contactName: formData.get("contactName"),
                contactEmail: formData.get("contactEmail"),
                numberOfPeople: parseInt(
                  formData.get("numberOfPeople") as string
                ),
                totalPrice: calculatedPrice === null ? 0 : calculatedPrice, // Sur devis = 0 for now, to be updated later
                status: isPendingStatus ? "pending" : "confirmed",
                paymentStatus: formData.get("paymentStatus"),
                amountPaid: formData.get("amountPaid")
                  ? parseFloat(formData.get("amountPaid") as string)
                  : 0,
                invoiceOption: formData.get("invoiceOption") === "true",
                isPartialPrivatization: isPartialPrivatization,
              };

              console.log("Creating reservation:", reservation);

              fetch("/api/admin/reservations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reservation),
              })
                .then((res) => res.json())
                .then((data) => {
                  if (data.success) {
                    setMessage({
                      type: "success",
                      text: "Réservation créée avec succès",
                    });
                    setShowCreateModal(false);
                    setIsPendingStatus(false); // Reset checkbox
                    setPaymentType("unpaid"); // Reset payment type
                    setIsPartialPrivatization(false); // Reset privatization
                    fetchReservations();
                    fetchExceptionalClosures(); // Reload closures in case one was added
                  } else {
                    // Show detailed error message
                    let errorMsg = data.error || "Erreur lors de la création";
                    if (data.validationErrors) {
                      errorMsg +=
                        ": " +
                        data.validationErrors
                          .map((e: any) => `${e.field} - ${e.message}`)
                          .join(", ");
                    }
                    console.error("Reservation creation error:", data);
                    setMessage({ type: "error", text: errorMsg });
                  }
                })
                .catch((err) => {
                  console.error("Reservation creation error:", err);
                  setMessage({
                    type: "error",
                    text: "Erreur lors de la création",
                  });
                });
            }}
          >
            <div className="row g-3">
              <div className="col-md-6">
                <label
                  className="form-label"
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#374151",
                  }}
                >
                  Type d'espace
                </label>
                <select
                  name="spaceType"
                  className="form-select"
                  required
                  style={{ borderRadius: "8px" }}
                  onChange={(e) => {
                    setSelectedSpaceType(e.target.value);
                    const form = document.getElementById(
                      "reservation-form"
                    ) as HTMLFormElement;
                    if (form) {
                      const formData = new FormData(form);
                      const spaceType = e.target.value;
                      const numberOfPeople =
                        parseInt(formData.get("numberOfPeople") as string) || 1;
                      const startTime =
                        (formData.get("startTime") as string) || "09:00";
                      const endTime =
                        (formData.get("endTime") as string) || "10:00";
                      const price = calculatePrice(
                        spaceType,
                        numberOfPeople,
                        startTime,
                        endTime
                      );
                      setCalculatedPrice(price);
                    }
                  }}
                >
                  <option value="">Sélectionner...</option>
                  {spaceConfigurations.map((config) => (
                    <option key={config.spaceType} value={config.spaceType}>
                      {config.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label
                  className="form-label"
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#374151",
                  }}
                >
                  Nombre de personnes
                  {selectedSpaceConfig && (
                    <small className="text-muted ms-2">
                      (min: {selectedSpaceConfig.minCapacity}, max:{" "}
                      {selectedSpaceConfig.maxCapacity})
                    </small>
                  )}
                </label>
                <input
                  type="number"
                  name="numberOfPeople"
                  className="form-control"
                  min={selectedSpaceConfig?.minCapacity || 1}
                  max={selectedSpaceConfig?.maxCapacity || 100}
                  defaultValue={selectedSpaceConfig?.minCapacity || 1}
                  required
                  style={{ borderRadius: "8px" }}
                  onChange={(e) => {
                    const form = document.getElementById(
                      "reservation-form"
                    ) as HTMLFormElement;
                    if (form) {
                      const formData = new FormData(form);
                      const spaceType = formData.get("spaceType") as string;
                      const numberOfPeople = parseInt(e.target.value) || 1;
                      const startTime =
                        (formData.get("startTime") as string) || "09:00";
                      const endTime =
                        (formData.get("endTime") as string) || "10:00";
                      if (spaceType) {
                        const price = calculatePrice(
                          spaceType,
                          numberOfPeople,
                          startTime,
                          endTime
                        );
                        setCalculatedPrice(price);
                      }
                    }
                  }}
                />
              </div>

              <div className="col-md-6">
                <label
                  className="form-label"
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#374151",
                  }}
                >
                  Heure de début
                </label>
                <input
                  type="time"
                  name="startTime"
                  className="form-control"
                  defaultValue={selectedTimeSlot?.start || "09:00"}
                  required
                  style={{ borderRadius: "8px" }}
                  onChange={(e) => {
                    const form = document.getElementById(
                      "reservation-form"
                    ) as HTMLFormElement;
                    if (form) {
                      const formData = new FormData(form);
                      const spaceType = formData.get("spaceType") as string;
                      const numberOfPeople =
                        parseInt(formData.get("numberOfPeople") as string) || 1;
                      const startTime = e.target.value;
                      const endTime =
                        (formData.get("endTime") as string) || "10:00";
                      if (spaceType) {
                        const price = calculatePrice(
                          spaceType,
                          numberOfPeople,
                          startTime,
                          endTime
                        );
                        setCalculatedPrice(price);
                      }
                    }
                  }}
                />
              </div>

              <div className="col-md-6">
                <label
                  className="form-label"
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#374151",
                  }}
                >
                  Heure de fin
                </label>
                <input
                  type="time"
                  name="endTime"
                  className="form-control"
                  defaultValue={selectedTimeSlot?.end || "10:00"}
                  required
                  style={{ borderRadius: "8px" }}
                  onChange={(e) => {
                    const form = document.getElementById(
                      "reservation-form"
                    ) as HTMLFormElement;
                    if (form) {
                      const formData = new FormData(form);
                      const spaceType = formData.get("spaceType") as string;
                      const numberOfPeople =
                        parseInt(formData.get("numberOfPeople") as string) || 1;
                      const startTime =
                        (formData.get("startTime") as string) || "09:00";
                      const endTime = e.target.value;
                      if (spaceType) {
                        const price = calculatePrice(
                          spaceType,
                          numberOfPeople,
                          startTime,
                          endTime
                        );
                        setCalculatedPrice(price);
                      }
                    }
                  }}
                />
              </div>

              <div className="col-md-6">
                <label
                  className="form-label"
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#374151",
                  }}
                >
                  Nom du client
                </label>
                <input
                  type="text"
                  name="contactName"
                  className="form-control"
                  required
                  style={{ borderRadius: "8px" }}
                  placeholder="Nom complet"
                />
              </div>

              <div className="col-md-6">
                <label
                  className="form-label"
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#374151",
                  }}
                >
                  Email du client
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  className="form-control"
                  required
                  style={{ borderRadius: "8px" }}
                  placeholder="email@example.com"
                />
              </div>

              <div className="col-md-12">
                <label
                  className="form-label"
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#374151",
                  }}
                >
                  Prix total (€)
                </label>
                <input
                  type="text"
                  name="totalPrice"
                  className="form-control"
                  value={
                    calculatedPrice === null
                      ? "Sur devis"
                      : calculatedPrice.toFixed(2) + " €"
                  }
                  readOnly
                  style={{
                    borderRadius: "8px",
                    backgroundColor: "#f3f4f6",
                    fontWeight: 600,
                    fontSize: "16px",
                    color: calculatedPrice === null ? "#F59E0B" : "#10B981",
                  }}
                />
                {calculatedPrice !== null && (
                  <small
                    className="text-muted"
                    style={{
                      fontSize: "12px",
                      marginTop: "4px",
                      display: "block",
                    }}
                  >
                    <Icon
                      icon="ri:information-line"
                      width={14}
                      style={{ marginRight: "4px" }}
                    />
                    Prix calculé automatiquement selon la configuration de
                    l'espace
                  </small>
                )}
                {calculatedPrice === null && (
                  <small
                    className="text-warning"
                    style={{
                      fontSize: "12px",
                      marginTop: "4px",
                      display: "block",
                    }}
                  >
                    <Icon
                      icon="ri:alert-line"
                      width={14}
                      style={{ marginRight: "4px" }}
                    />
                    Tarif sur devis - Contactez le client pour définir le prix
                  </small>
                )}
              </div>

              <div className="col-12">
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    name="invoiceOption"
                    className="form-check-input"
                    id="invoiceOption"
                    value="true"
                    onChange={(e) => {
                      if (e.target.checked) {
                        // Si facture cochée, mettre le statut de paiement à "pending" (en attente de facture)
                        const paymentSelect = document.querySelector(
                          'select[name="paymentStatus"]'
                        ) as HTMLSelectElement;
                        if (paymentSelect) {
                          paymentSelect.value = "pending";
                          paymentSelect.disabled = true;
                          setPaymentType("pending");
                        }
                      } else {
                        // Si facture décochée, réactiver le select et remettre à unpaid
                        const paymentSelect = document.querySelector(
                          'select[name="paymentStatus"]'
                        ) as HTMLSelectElement;
                        if (paymentSelect) {
                          paymentSelect.value = "unpaid";
                          paymentSelect.disabled = false;
                          setPaymentType("unpaid");
                        }
                      }
                    }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="invoiceOption"
                    style={{
                      fontSize: "14px",
                      color: "#374151",
                      fontWeight: 500,
                    }}
                  >
                    <Icon
                      icon="ri:file-text-line"
                      width={16}
                      style={{ marginRight: "4px" }}
                    />
                    Sur facture
                  </label>
                </div>

                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="pendingStatusOption"
                    checked={isPendingStatus}
                    onChange={(e) => setIsPendingStatus(e.target.checked)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="pendingStatusOption"
                    style={{
                      fontSize: "14px",
                      color: "#374151",
                      fontWeight: 500,
                    }}
                  >
                    <Icon
                      icon="ri:time-line"
                      width={16}
                      style={{ marginRight: "4px", color: "#F59E0B" }}
                    />
                    Mettre en attente
                    <small
                      className="text-muted d-block"
                      style={{ fontSize: "12px", marginLeft: "20px" }}
                    >
                      Par défaut, la réservation est validée directement (saisie
                      manuelle)
                    </small>
                  </label>
                </div>

                {selectedSpaceType === "evenementiel" && (
                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="partialPrivatizationOption"
                      checked={isPartialPrivatization}
                      onChange={(e) =>
                        setIsPartialPrivatization(e.target.checked)
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor="partialPrivatizationOption"
                      style={{
                        fontSize: "14px",
                        color: "#374151",
                        fontWeight: 500,
                      }}
                    >
                      <Icon
                        icon="ri:shield-user-line"
                        width={16}
                        style={{ marginRight: "4px", color: "#8B5CF6" }}
                      />
                      Privatisation partielle
                      <small
                        className="text-muted d-block"
                        style={{ fontSize: "12px", marginLeft: "20px" }}
                      >
                        Ne pas créer de fermeture exceptionnelle sur le site (le
                        lieu reste ouvert au public)
                      </small>
                    </label>
                  </div>
                )}
              </div>

              <div className="col-md-6">
                <label
                  className="form-label"
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#374151",
                  }}
                >
                  Statut de paiement
                </label>
                <select
                  name="paymentStatus"
                  className="form-select"
                  required
                  style={{ borderRadius: "8px" }}
                  onChange={(e) => setPaymentType(e.target.value)}
                  defaultValue="unpaid"
                >
                  <option value="unpaid">Non payé</option>
                  <option value="paid">Payé</option>
                  <option value="partial">Partiel</option>
                </select>
              </div>

              {paymentType === "partial" && (
                <div className="col-md-6">
                  <label
                    className="form-label"
                    style={{
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#374151",
                    }}
                  >
                    Montant payé (€)
                  </label>
                  <input
                    type="number"
                    name="amountPaid"
                    className="form-control"
                    step="0.01"
                    min="0"
                    required
                    style={{ borderRadius: "8px" }}
                    placeholder="0.00"
                  />
                </div>
              )}
            </div>

            <div className="d-flex gap-2 mt-4">
              <Button
                type="submit"
                style={{
                  background: "#667eea",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.5rem 1.5rem",
                  fontWeight: 500,
                }}
              >
                Créer la réservation
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setShowCreateModal(false);
                  setIsPendingStatus(false);
                  setPaymentType("unpaid");
                  setIsPartialPrivatization(false);
                }}
                style={{
                  borderRadius: "8px",
                  padding: "0.5rem 1.5rem",
                  fontWeight: 500,
                }}
              >
                Annuler
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CalendarPage;
