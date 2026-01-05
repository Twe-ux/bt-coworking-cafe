"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import BookingProgressBar from "@/components/site/booking/BookingProgressBar";
import InfoEmpreinte from "@/components/site/booking/InfoEmpreinte";
import "../../[id]/client-dashboard.scss";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

interface BookingData {
  spaceType: string;
  reservationType: string;
  date: string;
  startTime: string;
  endTime: string;
  basePrice: number;
  duration: string;
  numberOfPeople: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  specialRequests?: string;
  isDailyRate?: boolean;
  createAccount?: boolean;
  subscribeNewsletter?: boolean;
  password?: string;
}

interface AdditionalService {
  _id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  dailyPrice?: number;
  priceUnit: "per-person" | "flat-rate";
  vatRate: number;
  icon?: string;
}

interface SelectedService {
  service: AdditionalService;
  quantity: number;
}

const spaceTypeLabels: Record<string, string> = {
  "open-space": "Place - Open-space",
  "meeting-room-glass": "Salle de réunion - Verrière",
  "meeting-room-floor": "Salle de réunion - Étage",
  "event-space": "Événementiel",
};

const spaceTypeInfo: Record<string, { title: string; subtitle: string }> = {
  "open-space": { title: "Place", subtitle: "Open-space" },
  "meeting-room-glass": { title: "Salle de réunion", subtitle: "Verrière" },
  "meeting-room-floor": { title: "Salle de réunion", subtitle: "Étage" },
  "event-space": { title: "Événementiel", subtitle: "Grand espace" },
};

const reservationTypeLabels: Record<string, string> = {
  hourly: "À l'heure",
  daily: "À la journée",
  weekly: "À la semaine",
  monthly: "Au mois",
};

// Mapping inverse : URL slug → DB spaceType
const slugToSpaceType: Record<string, string> = {
  "open-space": "open-space",
  "meeting-room-glass": "salle-verriere",
  "meeting-room-floor": "salle-etage",
  "event-space": "evenementiel",
};

// Payment Form Component
interface PaymentFormContentProps {
  bookingId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

function PaymentFormContent({ bookingId, onSuccess, onError }: PaymentFormContentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking/confirmation/${bookingId}`,
        },
      });

      if (error) {
        onError(error.message || "Une erreur est survenue");
        setIsProcessing(false);
      } else {
        onSuccess();
      }
    } catch (err) {
      onError("Une erreur est survenue lors du paiement");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="btn w-100 mt-4"
        style={{
          padding: "1rem 2rem",
          fontSize: "1rem",
          fontWeight: "600",
          backgroundColor: "#588983",
          color: "white",
          border: "none",
        }}
      >
        {isProcessing ? (
          <>
            <span className="spinner-border spinner-border-sm me-2"></span>
            Traitement en cours...
          </>
        ) : (
          <>
            <i className="bi bi-lock me-2"></i>
            Valider la réservation
          </>
        )}
      </button>
    </form>
  );
}

export default function BookingSummaryPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [selectedServices, setSelectedServices] = useState<
    Map<string, SelectedService>
  >(new Map());
  const [loading, setLoading] = useState(false);
  const [daysUntilBooking, setDaysUntilBooking] = useState<number>(0);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [spaceConfig, setSpaceConfig] = useState<any>(null);
  const [showTTC, setShowTTC] = useState(true);

  // Stripe payment states
  const [clientSecret, setClientSecret] = useState<string>("");
  const [bookingId, setBookingId] = useState<string>("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentError, setPaymentError] = useState<string>("");

  // Fonction pour convertir un prix entre TTC et HT
  const convertPrice = (
    priceTTC: number,
    vatRate: number,
    toTTC: boolean
  ): number => {
    if (toTTC) {
      return priceTTC; // Already TTC
    } else {
      return priceTTC / (1 + vatRate / 100); // Convert to HT
    }
  };

  useEffect(() => {
    // Load booking data from sessionStorage
    const storedData = sessionStorage.getItem("bookingData");
    if (!storedData) {
      router.push("/booking");
      return;
    }
    const data = JSON.parse(storedData);
    setBookingData(data);

    // Calculate days until booking
    const now = new Date();
    const bookingDate = new Date(data.date);
    const days = Math.ceil(
      (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    setDaysUntilBooking(days);

    // Load selected services from sessionStorage
    const storedServices = sessionStorage.getItem("selectedServices");
    if (storedServices) {
      const servicesArray = JSON.parse(storedServices) as [
        string,
        SelectedService
      ][];
      const servicesMap = new Map<string, SelectedService>(servicesArray);
      setSelectedServices(servicesMap);
    }

    // Fetch space configuration to get deposit policy
    const fetchSpaceConfig = async () => {
      try {
        // Convert URL slug to DB spaceType
        const dbSpaceType = slugToSpaceType[data.spaceType] || data.spaceType;
        console.log(
          "🔍 Fetching space config for:",
          data.spaceType,
          "→ DB:",
          dbSpaceType
        );
        const response = await fetch(
          `/api/space-configurations/${dbSpaceType}`
        );
        console.log("📡 Response status:", response.status, response.ok);

        if (response.ok) {
          const configData = await response.json();
          console.log("✅ Config data received:", configData);
          console.log("📋 depositPolicy:", configData.data?.depositPolicy);
          setSpaceConfig(configData.data);
        } else {
          console.error(
            "❌ Response not OK:",
            response.status,
            response.statusText
          );
          const errorData = await response.text();
          console.error("Error response:", errorData);
        }
      } catch (error) {
        console.error("❌ Error fetching space config:", error);
      }
    };

    if (data.spaceType) {
      console.log("🚀 Starting fetch for spaceType:", data.spaceType);
      fetchSpaceConfig();
    } else {
      console.warn("⚠️ No spaceType in booking data");
    }
  }, []);

  const isDailyRate = () => {
    return bookingData?.isDailyRate === true;
  };

  const calculateServicesPrice = () => {
    let total = 0;
    const isDaily = isDailyRate();

    selectedServices.forEach((selected) => {
      const service = selected.service;
      const quantity = selected.quantity;

      // Utiliser le prix forfait jour si disponible et si c'est une réservation à la journée
      const priceToUse =
        isDaily && service.dailyPrice !== undefined
          ? service.dailyPrice
          : service.price;

      if (service.priceUnit === "per-person" && bookingData) {
        total += priceToUse * bookingData.numberOfPeople * quantity;
      } else {
        total += priceToUse * quantity;
      }
    });
    return total;
  };

  const updateServiceQuantity = (serviceId: string, quantity: number) => {
    const newSelected = new Map(selectedServices);
    const selected = newSelected.get(serviceId);
    if (selected && quantity >= 1) {
      newSelected.set(serviceId, { ...selected, quantity });
      setSelectedServices(newSelected);

      // Save to sessionStorage
      const servicesArray = Array.from(newSelected.entries());
      sessionStorage.setItem("selectedServices", JSON.stringify(servicesArray));
    }
  };

  const removeService = (serviceId: string) => {
    const newSelected = new Map(selectedServices);
    newSelected.delete(serviceId);
    setSelectedServices(newSelected);

    // Save to sessionStorage
    const servicesArray = Array.from(newSelected.entries());
    sessionStorage.setItem("selectedServices", JSON.stringify(servicesArray));
  };

  const getTotalPrice = () => {
    if (!bookingData) return 0;
    return bookingData.basePrice + calculateServicesPrice();
  };

  const calculateDepositAmount = () => {
    const totalPrice = getTotalPrice();

    console.log("💰 Calcul empreinte:", {
      spaceConfig,
      depositPolicyEnabled: spaceConfig?.depositPolicy?.enabled,
      totalPrice,
      policy: spaceConfig?.depositPolicy,
    });

    if (!spaceConfig?.depositPolicy?.enabled) {
      console.log("⚠️ Pas de depositPolicy enabled, retour du prix total");
      return totalPrice * 100; // Default to full amount if no policy
    }

    const totalPriceInCents = totalPrice * 100;
    const policy = spaceConfig.depositPolicy;

    let depositInCents = totalPriceInCents;

    // Calculate deposit based on policy
    if (policy.fixedAmount) {
      depositInCents = policy.fixedAmount;
      console.log("✅ Montant fixe appliqué:", depositInCents / 100, "€");
    } else if (policy.percentage) {
      depositInCents = Math.round(
        totalPriceInCents * (policy.percentage / 100)
      );
      console.log(
        "✅ Pourcentage appliqué:",
        policy.percentage,
        "% =",
        depositInCents / 100,
        "€"
      );
    }

    // Apply minimum if set
    if (policy.minimumAmount && depositInCents < policy.minimumAmount) {
      depositInCents = policy.minimumAmount;
      console.log("✅ Minimum appliqué:", depositInCents / 100, "€");
    }

    console.log("💳 Montant final empreinte:", depositInCents / 100, "€");
    return depositInCents;
  };

  const handleCreateReservation = async () => {
    if (!bookingData) return;

    setLoading(true);
    setPaymentError("");

    try {
      // Prepare additional services data
      const isDaily = isDailyRate();
      const additionalServicesData = Array.from(selectedServices.values()).map(
        (selected) => {
          const priceToUse =
            isDaily && selected.service.dailyPrice !== undefined
              ? selected.service.dailyPrice
              : selected.service.price;

          return {
            service: selected.service._id,
            name: selected.service.name,
            quantity: selected.quantity,
            unitPrice: priceToUse,
            totalPrice:
              selected.service.priceUnit === "per-person"
                ? priceToUse * bookingData.numberOfPeople * selected.quantity
                : priceToUse * selected.quantity,
          };
        }
      );

      // Create reservation
      const reservationPayload = {
        spaceType: bookingData.spaceType,
        date: bookingData.date,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        numberOfPeople: bookingData.numberOfPeople,
        reservationType: bookingData.reservationType,
        basePrice: bookingData.basePrice,
        servicesPrice: calculateServicesPrice(),
        totalPrice: getTotalPrice(),
        contactName: bookingData.contactName,
        contactEmail: bookingData.contactEmail,
        contactPhone: bookingData.contactPhone,
        specialRequests: bookingData.specialRequests,
        additionalServices: additionalServicesData,
        requiresPayment: true,
        createAccount: bookingData.createAccount || false,
        subscribeNewsletter: bookingData.subscribeNewsletter || false,
        password: bookingData.password,
      };

      const response = await fetch("/api/bookings/create-with-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationPayload),
      });

      const data = await response.json();

      if (!data.success) {
        setPaymentError(data.error || "Erreur lors de la création de la réservation");
        setLoading(false);
        return;
      }

      const createdBookingId = data.data._id;
      setBookingId(createdBookingId);

      // Create payment intent
      const paymentResponse = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: createdBookingId }),
      });

      const paymentData = await paymentResponse.json();

      if (!paymentData.success) {
        setPaymentError(paymentData.error || "Erreur lors de la création du paiement");
        setLoading(false);
        return;
      }

      // Set client secret and show payment form
      setClientSecret(paymentData.data.clientSecret);
      setShowPaymentForm(true);
      setLoading(false);
    } catch (error) {
      console.error("Error creating reservation:", error);
      setPaymentError("Une erreur est survenue");
      setLoading(false);
    }
  };

  if (!bookingData) {
    return null;
  }

  const servicesPrice = calculateServicesPrice();
  const totalPrice = getTotalPrice();

  const spaceInfo = spaceTypeInfo[bookingData.spaceType] || {
    title: "Espace",
    subtitle: "",
  };
  const dateLabel = new Date(bookingData.date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
  const timeLabel = `${bookingData.startTime}-${bookingData.endTime}`;
  const peopleLabel = `${bookingData.numberOfPeople} pers.`;

  return (
    <>
      <section className="booking-summary-page py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="booking-card mb-4">
                {/* Progress Bar */}
                <BookingProgressBar
                  currentStep={4}
                  customLabels={{
                    step1: spaceInfo.subtitle,
                    step2: `${dateLabel} ${timeLabel}\n${peopleLabel}`,
                    step3: "Détails",
                  }}
                  onStepClick={(step) => {
                    if (step === 1) {
                      router.push("/booking");
                    } else if (step === 2 && bookingData) {
                      router.push(`/booking/${bookingData.spaceType}/new`);
                    } else if (step === 3) {
                      router.push("/booking/details");
                    }
                  }}
                />

                <hr className="my-3" style={{ opacity: 0.1 }} />

                {/* Navigation and Title */}
                <div className="custom-breadcrumb d-flex justify-content-between align-items-center">
                  <button
                    onClick={() => router.back()}
                    className="breadcrumb-link"
                  >
                    <i className="bi bi-arrow-left"></i>
                    <span>Retour</span>
                  </button>
                  <h1 className="breadcrumb-current m-0">Récapitulatif</h1>
                  <div style={{ width: "80px" }}></div>
                </div>
              </div>

              <div className="row g-3" style={{ display: "flex" }}>
                {/* Left Column (55%) - Summary + Price Breakdown */}
                <div
                  className="d-flex flex-column"
                  style={{ flex: "0 0 55%", gap: "1rem" }}
                >
                  <div
                    className="booking-card d-flex flex-column"
                    style={{ flex: 1 }}
                  >
                    <div className="d-flex align-items-center gap-3 mb-4 pb-3" style={{ borderBottom: "2px solid #f0f0f0" }}>
                      <i className="bi bi-calendar-check" style={{ fontSize: "1.5rem", color: "#588983" }}></i>
                      <h2
                        className="h6 mb-0 fw-bold"
                        style={{ fontSize: "1.125rem", color: "#333" }}
                      >
                        Résumé de la réservation
                      </h2>
                    </div>

                    <div
                      className="summary-section"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0",
                      }}
                    >
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 0",
                        borderBottom: "1px solid #f0f0f0"
                      }}>
                        <span style={{ fontWeight: "600", color: "#666" }}>Espace</span>
                        <span style={{ color: "#333", textAlign: "right" }}>
                          {spaceTypeLabels[bookingData.spaceType]}
                        </span>
                      </div>

                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 0",
                        borderBottom: "1px solid #f0f0f0"
                      }}>
                        <span style={{ fontWeight: "600", color: "#666" }}>Type</span>
                        <span style={{ color: "#333", textAlign: "right" }}>
                          {reservationTypeLabels[bookingData.reservationType]}
                        </span>
                      </div>

                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 0",
                        borderBottom: "1px solid #f0f0f0"
                      }}>
                        <span style={{ fontWeight: "600", color: "#666" }}>Date</span>
                        <span style={{ color: "#333", textAlign: "right" }}>
                          {new Date(bookingData.date).toLocaleDateString(
                            "fr-FR",
                            {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric"
                            }
                          )}
                        </span>
                      </div>

                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 0",
                        borderBottom: "1px solid #f0f0f0"
                      }}>
                        <span style={{ fontWeight: "600", color: "#666" }}>Horaires</span>
                        <span style={{ color: "#333", textAlign: "right" }}>
                          {bookingData.startTime} - {bookingData.endTime}{" "}
                          <small style={{ color: "#999" }}>
                            ({bookingData.duration})
                          </small>
                        </span>
                      </div>

                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 0",
                        borderBottom: "1px solid #f0f0f0"
                      }}>
                        <span style={{ fontWeight: "600", color: "#666" }}>Personnes</span>
                        <span style={{ color: "#333", textAlign: "right" }}>
                          {bookingData.numberOfPeople}{" "}
                          {bookingData.numberOfPeople > 1
                            ? "personnes"
                            : "personne"}
                        </span>
                      </div>

                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 0",
                        borderBottom: bookingData.specialRequests ? "1px solid #f0f0f0" : "none"
                      }}>
                        <span style={{ fontWeight: "600", color: "#666" }}>Contact</span>
                        <span style={{ color: "#333", textAlign: "right" }}>
                          <div>{bookingData.contactName}</div>
                          <small style={{ color: "#999" }}>
                            {bookingData.contactEmail}
                          </small>
                          <br />
                          <small style={{ color: "#999" }}>
                            {bookingData.contactPhone}
                          </small>
                        </span>
                      </div>

                      {bookingData.specialRequests && (
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "12px 0"
                        }}>
                          <span style={{ fontWeight: "600", color: "#666" }}>Demandes</span>
                          <span style={{ color: "#333", textAlign: "right" }}>
                            {bookingData.specialRequests}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price Breakdown Card */}
                  <div className="booking-card">
                    <div className="d-flex align-items-center gap-3 mb-4 pb-3" style={{ borderBottom: "2px solid #f0f0f0" }}>
                      <i className="bi bi-cash-stack" style={{ fontSize: "1.5rem", color: "#588983" }}></i>
                      <h2
                        className="h6 mb-0 fw-bold"
                        style={{ fontSize: "1.125rem", color: "#333" }}
                      >
                        Récapitulatif des prix
                      </h2>
                    </div>

                    <div className="price-breakdown">
                      {/* TTC/HT Switch */}
                      <div className="d-flex justify-content-end align-items-center gap-3 mb-3">
                        <span
                          className={`tax-toggle ${showTTC ? "active" : ""}`}
                          onClick={() => setShowTTC(true)}
                          style={{
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            fontWeight: showTTC ? "600" : "400",
                          }}
                        >
                          Prix TTC
                        </span>
                        <div className="form-check form-switch mb-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="taxSwitchSummary"
                            checked={!showTTC}
                            onChange={() => setShowTTC(!showTTC)}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                        <span
                          className={`tax-toggle ${!showTTC ? "active" : ""}`}
                          onClick={() => setShowTTC(false)}
                          style={{
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            fontWeight: !showTTC ? "600" : "400",
                          }}
                        >
                          Prix HT
                        </span>
                      </div>

                      {/* Header Row */}
                      <div
                        className="price-row"
                        style={{
                          // borderBottom: "2px solid #e0e0e0",
                          paddingBottom: "0.75rem",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center w-100">
                          <span
                            style={{
                              fontWeight: "700",
                              fontSize: "0.9rem",
                              color: "#666",
                            }}
                          >
                            Prestation
                          </span>
                          <div className="d-flex gap-4 align-items-center">
                            <span
                              style={{
                                fontWeight: "700",
                                fontSize: "0.85rem",
                                color: "#666",
                                minWidth: "80px",
                                textAlign: "right",
                              }}
                            >
                              Quantité
                            </span>
                            <span
                              style={{
                                fontWeight: "700",
                                fontSize: "0.85rem",
                                color: "#666",
                                minWidth: "100px",
                                textAlign: "right",
                              }}
                            >
                              Prix unitaire
                            </span>
                            <span
                              style={{
                                fontWeight: "700",
                                fontSize: "0.85rem",
                                color: "#666",
                                minWidth: "80px",
                                textAlign: "right",
                              }}
                            >
                              Total
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="price-divider"></div>

                      {/* Base Rate Row */}
                      <div
                        className="price-row"
                        style={{
                          paddingTop: "0.5rem",
                          paddingBottom: "0.5rem",
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center w-100">
                          <span>Tarif </span>
                          <div className="d-flex gap-4 align-items-center">
                            <span
                              className="text-muted"
                              style={{
                                fontSize: "0.875rem",
                                minWidth: "80px",
                                textAlign: "right",
                              }}
                            >
                              {bookingData.numberOfPeople}{" "}
                              {bookingData.numberOfPeople > 1
                                ? "pers."
                                : "pers."}
                            </span>
                            <span
                              className="text-muted"
                              style={{
                                fontSize: "0.875rem",
                                minWidth: "100px",
                                textAlign: "right",
                              }}
                            >
                              {(() => {
                                const vatRate =
                                  bookingData.reservationType === "hourly"
                                    ? 10
                                    : 20;
                                const unitPrice = convertPrice(
                                  bookingData.basePrice /
                                    bookingData.numberOfPeople,
                                  vatRate,
                                  showTTC
                                );
                                return unitPrice.toFixed(2);
                              })()}
                              €
                            </span>
                            <span
                              className="fw-semibold"
                              style={{ minWidth: "80px", textAlign: "right" }}
                            >
                              {(() => {
                                const vatRate =
                                  bookingData.reservationType === "hourly"
                                    ? 10
                                    : 20;
                                const totalPrice = convertPrice(
                                  bookingData.basePrice,
                                  vatRate,
                                  showTTC
                                );
                                return totalPrice.toFixed(2);
                              })()}
                              €
                            </span>
                          </div>
                        </div>
                      </div>

                      {selectedServices.size > 0 &&
                        Array.from(selectedServices.values()).map(
                          (selected) => {
                            const isDaily = isDailyRate();
                            const displayPriceTTC =
                              isDaily &&
                              selected.service.dailyPrice !== undefined
                                ? selected.service.dailyPrice
                                : selected.service.price;
                            const vatRate = selected.service.vatRate || 20;

                            const displayPrice = convertPrice(
                              displayPriceTTC,
                              vatRate,
                              showTTC
                            );
                            const totalServicePrice =
                              selected.service.priceUnit === "per-person"
                                ? displayPrice *
                                  (bookingData?.numberOfPeople || 1) *
                                  selected.quantity
                                : displayPrice * selected.quantity;

                            return (
                              <div
                                key={selected.service._id}
                                className="price-row"
                                style={{
                                  paddingTop: "0.5rem",
                                  paddingBottom: "0.5rem",
                                }}
                              >
                                <div className="d-flex justify-content-between align-items-center w-100">
                                  <span>
                                    {selected.service.name}{" "}
                                    {selected.service.priceUnit ===
                                      "per-person" && "(par pers.)"}
                                  </span>
                                  <div className="d-flex gap-4 align-items-center">
                                    <span
                                      className="text-muted"
                                      style={{
                                        fontSize: "0.875rem",
                                        minWidth: "80px",
                                        textAlign: "right",
                                      }}
                                    >
                                      {selected.quantity}
                                    </span>
                                    <span
                                      className="text-muted"
                                      style={{
                                        fontSize: "0.875rem",
                                        minWidth: "100px",
                                        textAlign: "right",
                                      }}
                                    >
                                      {displayPrice.toFixed(2)}€
                                    </span>
                                    <span
                                      className="fw-semibold"
                                      style={{
                                        minWidth: "80px",
                                        textAlign: "right",
                                      }}
                                    >
                                      {totalServicePrice.toFixed(2)}€
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}

                      <div className="price-row total-row">
                        <span>Total {showTTC ? "TTC" : "HT"}</span>
                        <span className="total-price">
                          {(() => {
                            // Calculate total TTC
                            const totalTTC = getTotalPrice();

                            if (showTTC) {
                              return totalTTC.toFixed(2);
                            } else {
                              // Convert to HT
                              const baseVatRate =
                                bookingData.reservationType === "hourly"
                                  ? 10
                                  : 20;
                              const baseHT = convertPrice(
                                bookingData.basePrice,
                                baseVatRate,
                                false
                              );

                              let servicesHT = 0;
                              selectedServices.forEach((selected) => {
                                const service = selected.service;
                                const quantity = selected.quantity;
                                const isDaily = isDailyRate();
                                const displayPriceTTC =
                                  isDaily && service.dailyPrice !== undefined
                                    ? service.dailyPrice
                                    : service.price;
                                const vatRate = service.vatRate || 20;
                                const displayPriceHT = convertPrice(
                                  displayPriceTTC,
                                  vatRate,
                                  false
                                );

                                if (service.priceUnit === "per-person") {
                                  servicesHT +=
                                    displayPriceHT *
                                    (bookingData?.numberOfPeople || 1) *
                                    quantity;
                                } else {
                                  servicesHT += displayPriceHT * quantity;
                                }
                              });

                              return (baseHT + servicesHT).toFixed(2);
                            }
                          })()}
                          €
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column (45%) - Payment Only */}
                <div
                  className="d-flex flex-column"
                  style={{ flex: "0 0 45%", gap: "1rem" }}
                >
                  <div className="booking-card d-flex flex-column" style={{ height: "100%" }}>
                    <div className="d-flex align-items-center gap-3 mb-4 pb-3" style={{ borderBottom: "2px solid #f0f0f0" }}>
                      <i className="bi bi-credit-card" style={{ fontSize: "1.5rem", color: "#588983" }}></i>
                      <h2
                        className="h6 mb-0 fw-bold"
                        style={{ fontSize: "1.125rem", color: "#333" }}
                      >
                        Paiement sécurisé
                      </h2>
                    </div>

                    {/* Info empreinte */}
                    <InfoEmpreinte
                      type={
                        daysUntilBooking <= 7
                          ? "manual_capture"
                          : "setup_intent"
                      }
                      amount={calculateDepositAmount()}
                      daysUntilBooking={daysUntilBooking}
                    />

                    {/* Payment Error */}
                    {paymentError && (
                      <div className="alert alert-danger" role="alert">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {paymentError}
                      </div>
                    )}

                    {/* Payment Form or Button */}
                    {showPaymentForm && clientSecret ? (
                      <Elements
                        stripe={stripePromise}
                        options={{
                          clientSecret,
                          appearance: {
                            theme: 'stripe',
                            variables: {
                              colorPrimary: '#588983',
                              colorBackground: '#ffffff',
                              colorText: '#333333',
                              colorDanger: '#df1b41',
                              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                              spacingUnit: '4px',
                              borderRadius: '8px',
                            },
                            rules: {
                              '.Input': {
                                border: '1px solid #e0e0e0',
                                boxShadow: 'none',
                              },
                              '.Input:focus': {
                                border: '1px solid #588983',
                                boxShadow: '0 0 0 1px #588983',
                              },
                              '.Label': {
                                color: '#333333',
                                fontWeight: '600',
                              },
                            },
                          },
                        }}
                      >
                        <PaymentFormContent
                          bookingId={bookingId}
                          onSuccess={() => {
                            // Clear sessionStorage
                            sessionStorage.removeItem("bookingData");
                            sessionStorage.removeItem("selectedServices");
                            router.push(`/booking/confirmation/${bookingId}`);
                          }}
                          onError={(error) => setPaymentError(error)}
                        />
                      </Elements>
                    ) : (
                      <div className="flex-grow-1 d-flex flex-column justify-content-center">
                        {/* Placeholder for payment form */}
                        <div
                          style={{
                            background: "#f9f9f9",
                            border: "2px dashed #588983",
                            borderRadius: "12px",
                            padding: "2rem",
                            textAlign: "center",
                            minHeight: "280px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: "1.5rem",
                          }}
                        >
                          <i className="bi bi-credit-card" style={{ fontSize: "4rem", color: "#588983", marginBottom: "1rem" }}></i>
                          <p style={{ fontWeight: "600", fontSize: "1.125rem", color: "#666", marginBottom: "1rem" }}>
                            Formulaire de paiement Stripe Elements
                          </p>
                          <p style={{ color: "#999", fontSize: "0.875rem", lineHeight: "1.8", margin: "0" }}>
                            Les champs du formulaire Stripe apparaîtront ici :<br />
                            • Numéro de carte<br />
                            • Date d'expiration<br />
                            • CVC
                          </p>
                        </div>

                        <button
                          className="btn w-100"
                          onClick={() => handleCreateReservation()}
                          disabled={loading}
                          style={{
                            padding: "1rem 2rem",
                            fontSize: "1rem",
                            fontWeight: "600",
                            backgroundColor: "#588983",
                            color: "white",
                            border: "none",
                          }}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Création en cours...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-lock me-2"></i>
                              Valider la réservation
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    <p className="text-center text-muted mt-3" style={{ fontSize: "0.8125rem" }}>
                      <i className="bi bi-shield-check me-1"></i>
                      Paiement sécurisé par Stripe
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
