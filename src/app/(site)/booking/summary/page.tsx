'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import BookingProgressBar from '@/components/site/booking/BookingProgressBar';

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
}

interface AdditionalService {
  _id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  priceUnit: 'per-person' | 'flat-rate';
  icon?: string;
}

interface SelectedService {
  service: AdditionalService;
  quantity: number;
}

const spaceTypeLabels: Record<string, string> = {
  'open-space': 'Place - Open-space',
  'meeting-room-glass': 'Salle de réunion - Verrière',
  'meeting-room-floor': 'Salle de réunion - Étage',
  'event-space': 'Événementiel',
};

const spaceTypeInfo: Record<string, { title: string; subtitle: string }> = {
  "open-space": { title: "Place", subtitle: "Open-space" },
  "meeting-room-glass": { title: "Salle de réunion", subtitle: "Verrière" },
  "meeting-room-floor": { title: "Salle de réunion", subtitle: "Étage" },
  "event-space": { title: "Événementiel", subtitle: "Grand espace" },
};

const reservationTypeLabels: Record<string, string> = {
  hourly: 'À l\'heure',
  daily: 'À la journée',
  weekly: 'À la semaine',
  monthly: 'Au mois',
};

export default function BookingSummaryPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [availableServices, setAvailableServices] = useState<AdditionalService[]>([]);
  const [selectedServices, setSelectedServices] = useState<Map<string, SelectedService>>(new Map());
  const [loading, setLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(true);

  useEffect(() => {
    // Load booking data from sessionStorage
    const storedData = sessionStorage.getItem('bookingData');
    if (!storedData) {
      router.push('/booking');
      return;
    }
    setBookingData(JSON.parse(storedData));

    // Fetch available services
    fetchAdditionalServices();
  }, []);

  const fetchAdditionalServices = async () => {
    try {
      setServicesLoading(true);
      const response = await fetch('/api/additional-services?isActive=true');
      const data = await response.json();
      if (data.success) {
        setAvailableServices(data.data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
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
  };

  const updateServiceQuantity = (serviceId: string, quantity: number) => {
    const newSelected = new Map(selectedServices);
    const selected = newSelected.get(serviceId);
    if (selected && quantity >= 1) {
      newSelected.set(serviceId, { ...selected, quantity });
      setSelectedServices(newSelected);
    }
  };

  const calculateServicesPrice = () => {
    let total = 0;
    selectedServices.forEach((selected) => {
      const service = selected.service;
      const quantity = selected.quantity;
      if (service.priceUnit === 'per-person' && bookingData) {
        total += service.price * bookingData.numberOfPeople * quantity;
      } else {
        total += service.price * quantity;
      }
    });
    return total;
  };

  const getTotalPrice = () => {
    if (!bookingData) return 0;
    return bookingData.basePrice + calculateServicesPrice();
  };

  const handleCreateReservation = async (requiresPayment: boolean) => {
    if (!bookingData) return;

    setLoading(true);

    try {
      // Prepare additional services data
      const additionalServicesData = Array.from(selectedServices.values()).map((selected) => ({
        service: selected.service._id,
        name: selected.service.name,
        quantity: selected.quantity,
        unitPrice: selected.service.price,
        totalPrice:
          selected.service.priceUnit === 'per-person'
            ? selected.service.price * bookingData.numberOfPeople * selected.quantity
            : selected.service.price * selected.quantity,
      }));

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
        requiresPayment,
      };

      const response = await fetch('/api/bookings/create-with-services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationPayload),
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.error || 'Erreur lors de la création de la réservation');
        setLoading(false);
        return;
      }

      const bookingId = data.data._id;

      // Clear sessionStorage
      sessionStorage.removeItem('bookingData');

      // Redirect based on payment requirement
      if (requiresPayment) {
        router.push(`/booking/checkout/${bookingId}`);
      } else {
        router.push(`/booking/confirmation/${bookingId}`);
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert('Une erreur est survenue');
      setLoading(false);
    }
  };

  if (!bookingData) {
    return null;
  }

  const servicesPrice = calculateServicesPrice();
  const totalPrice = getTotalPrice();

  const spaceInfo = spaceTypeInfo[bookingData.spaceType] || { title: 'Espace', subtitle: '' };
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
              <div className="booking-card mb-4" style={{ padding: "1.25rem" }}>
                {/* Progress Bar */}
                <BookingProgressBar
                  currentStep={4}
                  customLabels={{
                    step1: spaceInfo.subtitle,
                    step2: `${dateLabel}\n${timeLabel}\n${peopleLabel}`,
                    step3: 'Détails',
                  }}
                />

                <hr style={{ margin: "0 0 1rem 0", border: "none", borderTop: "1px solid #e0e0e0" }} />

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
                  <h2 className="text-center mb-0" style={{ fontSize: "1.35rem" }}>
                    Récapitulatif
                  </h2>
                </div>
              </div>

              <div className="row g-3">
                {/* Left Column - Summary */}
                <div className="col-lg-7">
                  <div className="booking-card mb-3" style={{ padding: "1rem" }}>
                    <h5 className="mb-3" style={{ fontSize: '1rem' }}>
                      <i className="bi bi-receipt me-2"></i>
                      Détails de la réservation
                    </h5>

                    <div className="summary-section">
                      <div className="summary-row" style={{ padding: '0.5rem 0', fontSize: '0.9rem' }}>
                        <span className="summary-label" style={{ fontSize: '0.85rem' }}>Espace</span>
                        <span className="summary-value" style={{ fontWeight: '600' }}>
                          {spaceTypeLabels[bookingData.spaceType]}
                        </span>
                      </div>

                      <div className="summary-row" style={{ padding: '0.5rem 0', fontSize: '0.9rem' }}>
                        <span className="summary-label" style={{ fontSize: '0.85rem' }}>Type</span>
                        <span className="summary-value">
                          {reservationTypeLabels[bookingData.reservationType]}
                        </span>
                      </div>

                      <div className="summary-row" style={{ padding: '0.5rem 0', fontSize: '0.9rem' }}>
                        <span className="summary-label" style={{ fontSize: '0.85rem' }}>Date</span>
                        <span className="summary-value">
                          {new Date(bookingData.date).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                          })}
                        </span>
                      </div>

                      <div className="summary-row" style={{ padding: '0.5rem 0', fontSize: '0.9rem' }}>
                        <span className="summary-label" style={{ fontSize: '0.85rem' }}>Horaires</span>
                        <span className="summary-value">
                          {bookingData.startTime} - {bookingData.endTime}
                          <span className="text-muted ms-2" style={{ fontSize: '0.85rem' }}>({bookingData.duration})</span>
                        </span>
                      </div>

                      <div className="summary-row" style={{ padding: '0.5rem 0', fontSize: '0.9rem' }}>
                        <span className="summary-label" style={{ fontSize: '0.85rem' }}>Personnes</span>
                        <span className="summary-value">
                          {bookingData.numberOfPeople}{' '}
                          {bookingData.numberOfPeople > 1 ? 'personnes' : 'personne'}
                        </span>
                      </div>

                      <div className="summary-row" style={{ padding: '0.5rem 0', fontSize: '0.9rem' }}>
                        <span className="summary-label" style={{ fontSize: '0.85rem' }}>Contact</span>
                        <span className="summary-value">
                          {bookingData.contactName}
                          <br />
                          <small className="text-muted" style={{ fontSize: '0.8rem' }}>{bookingData.contactEmail}</small>
                          <br />
                          <small className="text-muted" style={{ fontSize: '0.8rem' }}>{bookingData.contactPhone}</small>
                        </span>
                      </div>

                      {bookingData.specialRequests && (
                        <div className="summary-row" style={{ padding: '0.5rem 0', fontSize: '0.9rem' }}>
                          <span className="summary-label" style={{ fontSize: '0.85rem' }}>Demandes</span>
                          <span className="summary-value" style={{ fontSize: '0.85rem' }}>
                            {bookingData.specialRequests}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Services */}
                  <div className="booking-card" style={{ padding: "1rem" }}>
                    <h5 className="mb-3" style={{ fontSize: '1rem' }}>
                      <i className="bi bi-plus-circle me-2"></i>
                      Services supplémentaires
                    </h5>

                    {servicesLoading ? (
                      <div className="text-center py-4">
                        <div className="spinner-border text-primary"></div>
                      </div>
                    ) : availableServices.length === 0 ? (
                      <p className="text-muted">Aucun service disponible</p>
                    ) : (
                      <div className="services-list">
                        {availableServices.map((service) => {
                          const isSelected = selectedServices.has(service._id);
                          const selected = selectedServices.get(service._id);

                          return (
                            <div
                              key={service._id}
                              className={`service-item ${isSelected ? 'selected' : ''}`}
                            >
                              <div className="service-checkbox">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleService(service)}
                                  id={`service-${service._id}`}
                                />
                                <label htmlFor={`service-${service._id}`}>
                                  <div className="service-info">
                                    <div className="service-name">{service.name}</div>
                                    {service.description && (
                                      <div className="service-description">
                                        {service.description}
                                      </div>
                                    )}
                                  </div>
                                  <div className="service-price">
                                    {service.price.toFixed(2)}€
                                    {service.priceUnit === 'per-person' && '/pers'}
                                  </div>
                                </label>
                              </div>

                              {isSelected && selected && (
                                <div className="service-quantity">
                                  <button
                                    onClick={() =>
                                      updateServiceQuantity(
                                        service._id,
                                        selected.quantity - 1
                                      )
                                    }
                                    disabled={selected.quantity <= 1}
                                  >
                                    <i className="bi bi-dash"></i>
                                  </button>
                                  <span>{selected.quantity}</span>
                                  <button
                                    onClick={() =>
                                      updateServiceQuantity(
                                        service._id,
                                        selected.quantity + 1
                                      )
                                    }
                                  >
                                    <i className="bi bi-plus"></i>
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Price & Actions */}
                <div className="col-lg-5">
                  <div className="booking-card sticky-card" style={{ padding: "1rem" }}>
                    <h5 className="mb-3" style={{ fontSize: '1rem' }}>Total</h5>

                    <div className="price-breakdown">
                      <div className="price-row" style={{ fontSize: '0.9rem', padding: '0.5rem 0' }}>
                        <span>Tarif de base</span>
                        <span>{bookingData.basePrice.toFixed(2)}€</span>
                      </div>

                      {selectedServices.size > 0 && (
                        <>
                          <div className="price-divider"></div>
                          {Array.from(selectedServices.values()).map((selected) => {
                            const itemTotal =
                              selected.service.priceUnit === 'per-person'
                                ? selected.service.price *
                                  bookingData.numberOfPeople *
                                  selected.quantity
                                : selected.service.price * selected.quantity;

                            return (
                              <div key={selected.service._id} className="price-row small" style={{ fontSize: '0.85rem', padding: '0.4rem 0' }}>
                                <span>
                                  {selected.service.name} x{selected.quantity}
                                  {selected.service.priceUnit === 'per-person' &&
                                    ` (${bookingData.numberOfPeople} pers)`}
                                </span>
                                <span>{itemTotal.toFixed(2)}€</span>
                              </div>
                            );
                          })}
                        </>
                      )}

                      <div className="price-divider"></div>

                      <div className="price-row total-row" style={{ fontSize: '1rem', padding: '0.75rem 0' }}>
                        <span style={{ fontWeight: '600' }}>Total à payer</span>
                        <span className="total-price" style={{ fontSize: '1.5rem' }}>{totalPrice.toFixed(2)}€</span>
                      </div>
                    </div>

                    <div className="actions-section mt-3">
                      <button
                        className="btn btn-success w-100 mb-2"
                        onClick={() => handleCreateReservation(true)}
                        disabled={loading}
                        style={{ fontSize: '0.95rem', padding: '0.75rem' }}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Création...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-credit-card me-2"></i>
                            Payer maintenant
                          </>
                        )}
                      </button>

                      <button
                        className="btn btn-outline-success w-100"
                        onClick={() => handleCreateReservation(false)}
                        disabled={loading}
                        style={{ fontSize: '0.95rem', padding: '0.75rem' }}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Création...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-calendar-check me-2"></i>
                            Réserver sans payer
                          </>
                        )}
                      </button>

                      <p className="text-muted text-center mt-2 mb-0" style={{ fontSize: '0.75rem' }}>
                        <i className="bi bi-info-circle me-1"></i>
                        Vous recevrez une confirmation par email
                      </p>
                    </div>
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
