"use client";

import BookingProgressBar from "@/components/site/booking/BookingProgressBar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface BookingData {
  spaceType: string;
  reservationType: string;
  date: string;
  startTime: string;
  endTime: string;
  basePrice: number;
  duration: string;
  numberOfPeople: number;
}

const spaceTypeInfo: Record<string, { title: string; subtitle: string }> = {
  "open-space": { title: "Place", subtitle: "Open-space" },
  "meeting-room-glass": { title: "Salle de réunion", subtitle: "Verrière" },
  "meeting-room-floor": { title: "Salle de réunion", subtitle: "Étage" },
  "event-space": { title: "Événementiel", subtitle: "Grand espace" },
};

export default function BookingDetailsPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [loading, setLoading] = useState(false);

  const bookingCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load booking data from sessionStorage
    const storedData = sessionStorage.getItem("bookingData");
    if (!storedData) {
      router.push("/booking");
      return;
    }
    const data = JSON.parse(storedData);
    setBookingData(data);

    // Pre-fill with user data if logged in
    if (session?.user) {
      setContactName(session.user.name || "");
      setContactEmail(session.user.email || "");
    }
  }, [session]);

  // Auto-scroll to center the card when page loads
  useEffect(() => {
    if (bookingData && bookingCardRef.current) {
      const scrollTimer = setTimeout(() => {
        const yOffset = -120; // Offset for header (adjusted down by 40px)
        const element = bookingCardRef.current;
        if (element) {
          const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 100);

      return () => clearTimeout(scrollTimer);
    }
  }, [bookingData]);

  const handleContinue = async () => {
    if (!isValidForm()) return;

    setLoading(true);

    // Update booking data with contact details
    const updatedBookingData = {
      ...bookingData,
      contactName,
      contactEmail,
      contactPhone,
      specialRequests,
    };

    sessionStorage.setItem("bookingData", JSON.stringify(updatedBookingData));

    // Navigate to summary page
    router.push("/booking/summary");
  };

  const isValidForm = () => {
    return (
      contactName.trim() !== "" &&
      contactEmail.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) &&
      contactPhone.trim() !== ""
    );
  };

  if (!bookingData) {
    return null;
  }

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
      <section className="booking-details-page py-5">
        <div className="container">
          {/* Main Card */}
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div
                className="booking-card"
                style={{ padding: "1.25rem" }}
                ref={bookingCardRef}
              >
                {/* Progress Bar */}
                <BookingProgressBar
                  currentStep={3}
                  customLabels={{
                    step1: spaceInfo.subtitle,
                    step2: `${dateLabel} ${timeLabel}\n${peopleLabel}`,
                  }}
                />

                <hr
                  style={{
                    margin: "0 0 1rem 0",
                    border: "none",
                    borderTop: "1px solid #e0e0e0",
                  }}
                />

                {/* Back button and Title */}
                <div className="mb-3 position-relative">
                  <button
                    onClick={() => router.back()}
                    className="btn btn-link text-muted p-0 position-absolute"
                    style={{ fontSize: "0.9rem", left: 0, top: 0 }}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Retour
                  </button>
                  <h2
                    className="text-center mb-0"
                    style={{ fontSize: "1.35rem" }}
                  >
                    Informations de contact
                  </h2>
                </div>

                {/* Contact Information */}
                <div className="mt-4">
                  <div className="mb-3">
                    <label
                      className="form-label"
                      style={{ fontSize: "0.9rem", fontWeight: "500" }}
                    >
                      Nom complet
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Votre nom complet"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      className="form-label"
                      style={{ fontSize: "0.9rem", fontWeight: "500" }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="vous@email.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      className="form-label"
                      style={{ fontSize: "0.9rem", fontWeight: "500" }}
                    >
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      className="form-control form-control-lg"
                      placeholder="06 XX XX XX XX"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      className="form-label"
                      style={{ fontSize: "0.9rem", fontWeight: "500" }}
                    >
                      Demandes particulières{" "}
                      <span className="text-muted">(optionnel)</span>
                    </label>
                    <textarea
                      className="form-control"
                      rows={4}
                      placeholder="Équipements spéciaux, allergies alimentaires, préférences d'ambiance, etc."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                    />
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  className="btn btn-success btn-lg w-100 mt-3"
                  onClick={handleContinue}
                  disabled={!isValidForm() || loading}
                  style={{ fontSize: "0.95rem" }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Chargement...
                    </>
                  ) : (
                    <>
                      Voir le récapitulatif
                      <i className="bi bi-arrow-right ms-2"></i>
                    </>
                  )}
                </button>

                {!isValidForm() && (
                  <p
                    className="text-danger text-center mt-2 mb-0 small"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Veuillez remplir tous les champs obligatoires
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
