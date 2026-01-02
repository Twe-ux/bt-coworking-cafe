"use client";

import BookingProgressBar from "@/components/site/booking/BookingProgressBar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "../../[id]/client-dashboard.scss";

interface BookingData {
  spaceType: string;
  reservationType: string;
  date: string;
  startTime: string;
  endTime: string;
  basePrice: number;
  duration: string;
  numberOfPeople: number;
  isDailyRate?: boolean;
}

interface AdditionalService {
  _id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  dailyPrice?: number;
  priceUnit: "per-person" | "flat-rate";
  icon?: string;
}

interface SelectedService {
  service: AdditionalService;
  quantity: number;
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
  const [createAccount, setCreateAccount] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Auto-save contact data to sessionStorage when fields change
  useEffect(() => {
    if (bookingData) {
      const updatedData = {
        ...bookingData,
        contactName,
        contactEmail,
        contactPhone,
        specialRequests,
      };
      sessionStorage.setItem("bookingData", JSON.stringify(updatedData));
    }
  }, [contactName, contactEmail, contactPhone, specialRequests, bookingData]);
  const [loading, setLoading] = useState(false);
  const [availableServices, setAvailableServices] = useState<
    AdditionalService[]
  >([]);
  const [selectedServices, setSelectedServices] = useState<
    Map<string, SelectedService>
  >(new Map());
  const [servicesLoading, setServicesLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

    // Pre-fill with stored contact data if available (from previous step 3 visit)
    if (data.contactName) {
      setContactName(data.contactName);
    } else if (session?.user) {
      setContactName(session.user.name || "");
    }

    if (data.contactEmail) {
      setContactEmail(data.contactEmail);
    } else if (session?.user) {
      setContactEmail(session.user.email || "");
    }

    if (data.contactPhone) {
      setContactPhone(data.contactPhone);
    } else if (session?.user) {
      // Charger le téléphone depuis le profil utilisateur
      fetchUserPhone();
    }

    if (data.specialRequests) {
      setSpecialRequests(data.specialRequests);
    }

    // Load selected services from sessionStorage if they exist
    const storedServices = sessionStorage.getItem("selectedServices");
    if (storedServices) {
      const servicesArray = JSON.parse(storedServices) as [string, SelectedService][];
      const servicesMap = new Map<string, SelectedService>(servicesArray);
      setSelectedServices(servicesMap);
    }

    // Fetch available services
    fetchAdditionalServices();
  }, [session]);

  const fetchUserPhone = async () => {
    try {
      const response = await fetch("/api/user/profile");
      const data = await response.json();
      if (data.user?.phone) {
        setContactPhone(data.user.phone);
      }
    } catch (error) {
      console.error("Error fetching user phone:", error);
    }
  };

  const fetchAdditionalServices = async () => {
    try {
      setServicesLoading(true);
      const response = await fetch("/api/additional-services?isActive=true");
      const data = await response.json();
      if (data.success) {
        setAvailableServices(data.data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setServicesLoading(false);
    }
  };

  const toggleService = (service: AdditionalService) => {
    const newSelected = new Map(selectedServices);
    if (newSelected.has(service._id)) {
      newSelected.delete(service._id);
    } else {
      newSelected.set(service._id, { service, quantity: 1 });
    }
    setSelectedServices(newSelected);

    // Auto-save to sessionStorage
    const servicesArray = Array.from(newSelected.entries());
    sessionStorage.setItem("selectedServices", JSON.stringify(servicesArray));
  };

  const updateServiceQuantity = (serviceId: string, quantity: number) => {
    const newSelected = new Map(selectedServices);
    const selected = newSelected.get(serviceId);
    if (selected && quantity >= 1) {
      newSelected.set(serviceId, { ...selected, quantity });
      setSelectedServices(newSelected);

      // Auto-save to sessionStorage
      const servicesArray = Array.from(newSelected.entries());
      sessionStorage.setItem("selectedServices", JSON.stringify(servicesArray));
    }
  };

  const isDailyRate = () => {
    if (!bookingData) return false;
    // Utiliser le champ isDailyRate sauvegardé dans les données de réservation
    return bookingData.isDailyRate === true;
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

  const getTotalPrice = () => {
    if (!bookingData) return 0;
    return bookingData.basePrice + calculateServicesPrice();
  };

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

    // Si utilisateur connecté et téléphone renseigné, sauvegarder dans le profil
    if (session?.user && contactPhone) {
      try {
        await fetch("/api/user/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: contactName,
            email: contactEmail,
            phone: contactPhone,
          }),
        });
      } catch (error) {
        console.error("Error saving phone to profile:", error);
        // Continue anyway, don't block the booking flow
      }
    }

    // Update booking data with contact details and account preferences
    const updatedBookingData = {
      ...bookingData,
      contactName,
      contactEmail,
      contactPhone,
      specialRequests,
      createAccount,
      subscribeNewsletter,
      password: createAccount ? password : undefined,
    };

    sessionStorage.setItem("bookingData", JSON.stringify(updatedBookingData));

    // Save selected services to sessionStorage
    const servicesArray = Array.from(selectedServices.entries());
    sessionStorage.setItem("selectedServices", JSON.stringify(servicesArray));

    // Navigate to summary page
    router.push("/booking/summary");
  };

  const isValidForm = () => {
    const basicValid =
      contactName.trim() !== "" &&
      contactEmail.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) &&
      contactPhone.trim() !== "";

    if (!basicValid) return false;

    // If creating account, validate passwords
    if (createAccount) {
      return password.length >= 8 && password === confirmPassword;
    }

    return true;
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
                  onStepClick={(step) => {
                    if (step === 1) {
                      router.push("/booking");
                    } else if (step === 2 && bookingData) {
                      router.push(`/booking/${bookingData.spaceType}/new`);
                    }
                  }}
                />

                <hr
                  style={{
                    margin: "0 0 1rem 0",
                    border: "none",
                    borderTop: "1px solid #e0e0e0",
                  }}
                />

                {/* Navigation and Title */}
                <div className="mb-4">
                  <div className="custom-breadcrumb d-flex justify-content-between align-items-center">
                    <button
                      onClick={() => router.back()}
                      className="breadcrumb-link"
                      style={{
                        background: "none",
                        border: "none",
                        padding: "0.35rem 0.75rem",
                      }}
                    >
                      <i className="bi bi-arrow-left"></i>
                      <span>Retour</span>
                    </button>
                    <span
                      className="breadcrumb-current"
                      style={{ fontSize: "1.1rem", fontWeight: "600" }}
                    >
                      Informations de contact
                    </span>
                    <div style={{ width: "80px" }}></div>{" "}
                    {/* Spacer for centering */}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mt-4">
                  {/* Already a client? Login section */}
                  {!session && (
                    <div className="stat-card mb-4">
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="stat-icon"
                            style={{
                              width: "50px",
                              height: "50px",
                              fontSize: "1.5rem",
                            }}
                          >
                            <i className="bi bi-person-circle"></i>
                          </div>
                          <span
                            style={{
                              fontSize: "1rem",
                              fontWeight: "600",
                              color: "var(--main-clr)",
                            }}
                          >
                            Déjà client ?
                          </span>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm"
                          style={{
                            background: "var(--btn-clr)",
                            color: "var(--secondary-clr)",
                            fontWeight: "600",
                            border: "none",
                            padding: "0.5rem 1.25rem",
                            borderRadius: "10px",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "var(--main-clr)";
                            e.currentTarget.style.color = "var(--primary-clr)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "var(--btn-clr)";
                            e.currentTarget.style.color =
                              "var(--secondary-clr)";
                          }}
                          onClick={() => {
                            // Save current form data before redirecting
                            if (bookingData) {
                              const updatedData = {
                                ...bookingData,
                                contactName,
                                contactEmail,
                                contactPhone,
                                specialRequests,
                              };
                              sessionStorage.setItem(
                                "bookingData",
                                JSON.stringify(updatedData)
                              );
                            }
                            router.push(
                              `/auth/login?callbackUrl=/booking/details`
                            );
                          }}
                        >
                          Se connecter
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Two column layout */}
                  <div className="row mb-4">
                    {/* Left column: Contact info */}
                    <div className="col-md-6 mb-4 mb-md-0">
                      <div className="stat-card h-100">
                        <div className="w-100">
                          <h5
                            className="mb-3"
                            style={{
                              fontSize: "1.1rem",
                              fontWeight: "700",
                              color: "var(--main-clr)",
                            }}
                          >
                            Coordonnées
                          </h5>
                          <div className="mb-3">
                            <label
                              className="form-label"
                              style={{ fontSize: "0.9rem", fontWeight: "500" }}
                            >
                              Nom complet
                            </label>
                            <input
                              type="text"
                              className="form-control"
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
                              className="form-control"
                              placeholder="vous@email.com"
                              value={contactEmail}
                              onChange={(e) => setContactEmail(e.target.value)}
                              required
                            />
                          </div>

                          <div className="mb-0">
                            <label
                              className="form-label"
                              style={{ fontSize: "0.9rem", fontWeight: "500" }}
                            >
                              Téléphone
                            </label>
                            <input
                              type="tel"
                              className="form-control"
                              placeholder="06 XX XX XX XX"
                              value={contactPhone}
                              onChange={(e) => setContactPhone(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right column: Account options - Only for guests */}
                    {!session && (
                      <div className="col-md-6">
                        <div className="d-flex flex-column h-100">
                          <div className="stat-card flex-grow-1">
                            <div className="w-100">
                              <h5
                                className="mb-3"
                                style={{
                                  fontSize: "1.1rem",
                                  fontWeight: "700",
                                  color: "var(--main-clr)",
                                }}
                              >
                                Informations compte
                              </h5>

                              <div className="form-check custom-checkbox mb-3">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="createAccount"
                                  checked={createAccount}
                                  onChange={(e) =>
                                    setCreateAccount(e.target.checked)
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="createAccount"
                                  style={{
                                    fontSize: "0.95rem",
                                    fontWeight: "600",
                                    color: "var(--main-clr)",
                                  }}
                                >
                                  Créer un compte client
                                </label>
                              </div>

                              {createAccount && (
                                <div className="ms-4 mb-3">
                                  <div className="mb-3">
                                    <label
                                      className="form-label"
                                      style={{
                                        fontSize: "0.85rem",
                                        fontWeight: "500",
                                      }}
                                    >
                                      Mot de passe
                                    </label>
                                    <input
                                      type="password"
                                      className="form-control"
                                      placeholder="Minimum 8 caractères"
                                      value={password}
                                      onChange={(e) =>
                                        setPassword(e.target.value)
                                      }
                                      required={createAccount}
                                      style={{ fontSize: "0.9rem" }}
                                    />
                                  </div>
                                  <div className="mb-2">
                                    <label
                                      className="form-label"
                                      style={{
                                        fontSize: "0.85rem",
                                        fontWeight: "500",
                                      }}
                                    >
                                      Confirmer le mot de passe
                                    </label>
                                    <input
                                      type="password"
                                      className="form-control"
                                      placeholder="Retapez votre mot de passe"
                                      value={confirmPassword}
                                      onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                      }
                                      required={createAccount}
                                      style={{ fontSize: "0.9rem" }}
                                    />
                                    {createAccount &&
                                      password &&
                                      confirmPassword &&
                                      password !== confirmPassword && (
                                        <small className="text-danger">
                                          Les mots de passe ne correspondent pas
                                        </small>
                                      )}
                                  </div>
                                </div>
                              )}

                              <div className="form-check custom-checkbox">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="newsletter"
                                  checked={subscribeNewsletter}
                                  onChange={(e) =>
                                    setSubscribeNewsletter(e.target.checked)
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="newsletter"
                                  style={{
                                    fontSize: "0.95rem",
                                    fontWeight: "500",
                                    color: "var(--gry-clr)",
                                  }}
                                >
                                  S'abonner à la newsletter
                                </label>
                              </div>
                            </div>
                          </div>
                          {/* Benefits of creating an account - shown by default */}
                          {!createAccount && (
                            <div
                              className="mt-3 p-3 rounded"
                              style={{
                                background:
                                  "linear-gradient(135deg, rgba(242, 211, 129, 0.15) 0%, rgba(65, 121, 114, 0.1) 100%)",
                                border: "2px solid var(--btn-clr)",
                              }}
                            >
                              <h6
                                className="mb-2"
                                style={{
                                  fontSize: "0.95rem",
                                  fontWeight: "700",
                                  color: "var(--main-clr)",
                                }}
                              >
                                <i
                                  className="bi bi-star-fill me-2"
                                  style={{ color: "var(--btn-clr)" }}
                                ></i>
                                Avantages d'un compte client
                              </h6>
                              <ul
                                className="mb-0 ps-4"
                                style={{
                                  fontSize: "0.85rem",
                                  lineHeight: "1.8",
                                  color: "var(--gry-clr)",
                                }}
                              >
                                <li>Historique de vos réservations</li>
                                <li>
                                  Réservations plus rapides (données
                                  pré-remplies)
                                </li>
                                <li>
                                  Gestion de vos informations personnelles
                                </li>
                                <li>Suivi en temps réel de vos réservations</li>
                                <li>Offres exclusives et promotions</li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Services */}
                  {!servicesLoading && availableServices.length > 0 && (
                    <div className="mb-4">
                      <label
                        className="form-label"
                        style={{ fontSize: "0.9rem", fontWeight: "500" }}
                      >
                        Services supplémentaires{" "}
                        <span className="text-muted">(optionnel)</span>
                      </label>

                      {/* Category Buttons */}
                      <div className="d-flex gap-2 flex-wrap mb-3">
                        {["food", "beverage", "equipment", "other"]
                          .map((cat) => ({
                            category: cat,
                            count: availableServices.filter(
                              (s) => s.category === cat
                            ).length,
                          }))
                          .filter((item) => item.count > 0)
                          .map((item) => {
                            const categoryLabels: Record<string, string> = {
                              food: "Nourritures",
                              beverage: "Boissons",
                              equipment: "Équipements",
                              other: "Autres",
                            };
                            return (
                              <button
                                key={item.category}
                                type="button"
                                className="filter-btn"
                                onClick={() =>
                                  setSelectedCategory(item.category)
                                }
                              >
                                {categoryLabels[item.category]} ({item.count})
                              </button>
                            );
                          })}
                      </div>

                      {/* Selected Services Summary */}
                      {selectedServices.size > 0 && (
                        <div className="alert alert-light border">
                          <div
                            className="fw-semibold mb-2"
                            style={{ fontSize: "0.85rem" }}
                          >
                            Services sélectionnés :
                          </div>
                          {Array.from(selectedServices.values()).map(
                            ({ service, quantity }) => {
                              const isDaily = isDailyRate();
                              const displayPrice =
                                isDaily && service.dailyPrice !== undefined
                                  ? service.dailyPrice
                                  : service.price;
                              const totalServicePrice =
                                service.priceUnit === "per-person"
                                  ? displayPrice *
                                    (bookingData?.numberOfPeople || 1) *
                                    quantity
                                  : displayPrice * quantity;

                              return (
                                <div
                                  key={service._id}
                                  className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom"
                                >
                                  <div className="flex-grow-1">
                                    <div
                                      style={{
                                        fontSize: "0.85rem",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {service.name}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: "0.75rem",
                                        color: "#6c757d",
                                      }}
                                    >
                                      {displayPrice.toFixed(2)}€{" "}
                                      {service.priceUnit === "per-person"
                                        ? "/ pers."
                                        : ""}
                                      {" · Total: "}
                                      {totalServicePrice.toFixed(2)}€
                                    </div>
                                  </div>
                                  <div className="d-flex align-items-center gap-2">
                                    <div
                                      className="btn-group btn-group-sm"
                                      role="group"
                                    >
                                      <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() =>
                                          updateServiceQuantity(
                                            service._id,
                                            quantity - 1
                                          )
                                        }
                                        disabled={quantity <= 1}
                                        style={{
                                          fontSize: "0.75rem",
                                          padding: "0.25rem 0.5rem",
                                        }}
                                      >
                                        <i className="bi bi-dash"></i>
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        disabled
                                        style={{
                                          fontSize: "0.75rem",
                                          padding: "0.25rem 0.75rem",
                                          minWidth: "40px",
                                        }}
                                      >
                                        {quantity}
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() =>
                                          updateServiceQuantity(
                                            service._id,
                                            quantity + 1
                                          )
                                        }
                                        style={{
                                          fontSize: "0.75rem",
                                          padding: "0.25rem 0.5rem",
                                        }}
                                      >
                                        <i className="bi bi-plus"></i>
                                      </button>
                                    </div>
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-link text-danger p-0"
                                      onClick={() => toggleService(service)}
                                      style={{ fontSize: "0.9rem" }}
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      )}
                    </div>
                  )}

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

                  {/* Price Summary */}
                  {bookingData && selectedServices.size > 0 && (
                    <div className="alert alert-info">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span>Tarif de base:</span>
                        <span className="fw-semibold">
                          {bookingData.basePrice.toFixed(2)}€
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span>Services supplémentaires:</span>
                        <span className="fw-semibold">
                          {calculateServicesPrice().toFixed(2)}€
                        </span>
                      </div>
                      <hr className="my-2" />
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold">Total:</span>
                        <span className="fw-bold fs-5 text-success">
                          {getTotalPrice().toFixed(2)}€
                        </span>
                      </div>
                    </div>
                  )}
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

      {/* Services Modal */}
      {selectedCategory && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setSelectedCategory(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {
                    {
                      food: "Nourritures",
                      beverage: "Boissons",
                      equipment: "Équipements",
                      other: "Autres",
                    }[selectedCategory]
                  }
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedCategory(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="services-list">
                  {availableServices
                    .filter((s) => s.category === selectedCategory)
                    .map((service) => {
                      const isSelected = selectedServices.has(service._id);
                      const selected = selectedServices.get(service._id);
                      const isDaily = isDailyRate();
                      const displayPrice =
                        isDaily && service.dailyPrice !== undefined
                          ? service.dailyPrice
                          : service.price;

                      return (
                        <div
                          key={service._id}
                          className={`service-item mb-2 p-3 border rounded ${
                            isSelected ? "border-success bg-light" : ""
                          }`}
                        >
                          <div className="d-flex align-items-start">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleService(service)}
                              id={`service-modal-${service._id}`}
                              className="form-check-input mt-1 me-3"
                              style={{ cursor: "pointer" }}
                            />
                            <label
                              htmlFor={`service-modal-${service._id}`}
                              className="flex-grow-1"
                              style={{ cursor: "pointer" }}
                            >
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <div
                                    className="fw-semibold"
                                    style={{ fontSize: "0.9rem" }}
                                  >
                                    {service.name}
                                  </div>
                                  {service.description && (
                                    <div
                                      className="text-muted"
                                      style={{ fontSize: "0.8rem" }}
                                    >
                                      {service.description}
                                    </div>
                                  )}
                                </div>
                                <div
                                  className="text-nowrap ms-3"
                                  style={{
                                    fontSize: "0.9rem",
                                    fontWeight: "600",
                                  }}
                                >
                                  {displayPrice.toFixed(2)}€
                                  {service.priceUnit === "per-person" &&
                                    "/pers"}
                                  {isDaily &&
                                    service.dailyPrice !== undefined && (
                                      <div
                                        className="text-success"
                                        style={{
                                          fontSize: "0.7rem",
                                          fontWeight: "400",
                                        }}
                                      >
                                        (Prix jour)
                                      </div>
                                    )}
                                </div>
                              </div>
                            </label>
                          </div>

                          {isSelected && selected && (
                            <div className="d-flex align-items-center mt-2 ms-5">
                              <label
                                className="me-2"
                                style={{ fontSize: "0.85rem" }}
                              >
                                Quantité:
                              </label>
                              <div className="btn-group btn-group-sm">
                                <button
                                  type="button"
                                  className="btn btn-outline-secondary"
                                  onClick={() =>
                                    updateServiceQuantity(
                                      service._id,
                                      selected.quantity - 1
                                    )
                                  }
                                  disabled={selected.quantity <= 1}
                                >
                                  -
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline-secondary"
                                  disabled
                                >
                                  {selected.quantity}
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline-secondary"
                                  onClick={() =>
                                    updateServiceQuantity(
                                      service._id,
                                      selected.quantity + 1
                                    )
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedCategory(null)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
