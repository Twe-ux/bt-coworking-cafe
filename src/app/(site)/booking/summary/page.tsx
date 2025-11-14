'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import PageTitle from '@/components/site/pageTitle';
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

  return (
    <>
      <PageTitle title="Récapitulatif de la réservation" currentPage="Récapitulatif" />

      <section className="booking-summary-page py-4">
        <div className="container">
          {/* Progress Bar */}
          <div className="row justify-content-center mb-3">
            <div className="col-lg-10">
              <BookingProgressBar currentStep={4} />
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-10">
              {/* Back button */}
              <button
                onClick={() => router.back()}
                className="btn btn-link text-muted p-0 mb-4"
              >
                <i className="bi bi-arrow-left me-2"></i>
                Retour
              </button>

              <div className="row g-4">
                {/* Left Column - Summary */}
                <div className="col-lg-7">
                  <div className="booking-card mb-3">
                    <h5 className="mb-3" style={{ fontSize: '1.1rem' }}>
                      <i className="bi bi-receipt me-2"></i>
                      Récapitulatif de votre réservation
                    </h5>

                    <div className="summary-section">
                      <div className="summary-row">
                        <span className="summary-label">Espace</span>
                        <span className="summary-value">
                          {spaceTypeLabels[bookingData.spaceType]}
                        </span>
                      </div>

                      <div className="summary-row">
                        <span className="summary-label">Type</span>
                        <span className="summary-value">
                          {reservationTypeLabels[bookingData.reservationType]}
                        </span>
                      </div>

                      <div className="summary-row">
                        <span className="summary-label">Date</span>
                        <span className="summary-value">
                          {new Date(bookingData.date).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="summary-row">
                        <span className="summary-label">Horaires</span>
                        <span className="summary-value">
                          {bookingData.startTime} - {bookingData.endTime}
                          <span className="text-muted ms-2">({bookingData.duration})</span>
                        </span>
                      </div>

                      <div className="summary-row">
                        <span className="summary-label">Personnes</span>
                        <span className="summary-value">
                          {bookingData.numberOfPeople}{' '}
                          {bookingData.numberOfPeople > 1 ? 'personnes' : 'personne'}
                        </span>
                      </div>

                      <div className="summary-row">
                        <span className="summary-label">Contact</span>
                        <span className="summary-value">
                          {bookingData.contactName}
                          <br />
                          <small className="text-muted">{bookingData.contactEmail}</small>
                          <br />
                          <small className="text-muted">{bookingData.contactPhone}</small>
                        </span>
                      </div>

                      {bookingData.specialRequests && (
                        <div className="summary-row">
                          <span className="summary-label">Demandes</span>
                          <span className="summary-value">
                            {bookingData.specialRequests}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Services */}
                  <div className="booking-card">
                    <h5 className="mb-3" style={{ fontSize: '1.1rem' }}>
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
                  <div className="booking-card sticky-card">
                    <h5 className="mb-3" style={{ fontSize: '1.1rem' }}>Total</h5>

                    <div className="price-breakdown">
                      <div className="price-row">
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
                              <div key={selected.service._id} className="price-row small">
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

                      <div className="price-row total-row">
                        <span>Total à payer</span>
                        <span className="total-price">{totalPrice.toFixed(2)}€</span>
                      </div>
                    </div>

                    <div className="actions-section mt-4">
                      <button
                        className="btn btn-success btn-lg w-100 mb-3"
                        onClick={() => handleCreateReservation(true)}
                        disabled={loading}
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
                        className="btn btn-outline-success btn-lg w-100"
                        onClick={() => handleCreateReservation(false)}
                        disabled={loading}
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

                      <p className="text-muted text-center mt-3 mb-0 small">
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

      <style jsx>{`
        .booking-summary-page {
          background-color: #f8f9fa;
          min-height: 70vh;
          padding: 3rem 0 !important;
        }

        .booking-card {
          background: white;
          border-radius: 14px;
          padding: 1.5rem;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        .sticky-card {
          position: sticky;
          top: 20px;
        }

        .summary-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .summary-row:last-child {
          border-bottom: none;
        }

        .summary-label {
          font-weight: 600;
          color: #666;
          min-width: 120px;
        }

        .summary-value {
          text-align: right;
          color: #333;
          flex: 1;
        }

        .services-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .service-item {
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          padding: 1rem;
          transition: all 0.2s ease;
        }

        .service-item.selected {
          border-color: #5cb85c;
          background: #f0f8f0;
        }

        .service-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .service-checkbox input[type='checkbox'] {
          margin-top: 0.25rem;
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .service-checkbox label {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          cursor: pointer;
          margin: 0;
        }

        .service-name {
          font-weight: 600;
          color: #333;
          margin-bottom: 0.25rem;
        }

        .service-description {
          font-size: 0.85rem;
          color: #666;
        }

        .service-price {
          font-weight: 600;
          color: #5cb85c;
          white-space: nowrap;
          margin-left: 1rem;
        }

        .service-quantity {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid #e0e0e0;
        }

        .service-quantity button {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid #5cb85c;
          background: white;
          color: #5cb85c;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .service-quantity button:hover:not(:disabled) {
          background: #5cb85c;
          color: white;
        }

        .service-quantity button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .service-quantity span {
          font-weight: 600;
          min-width: 30px;
          text-align: center;
        }

        .price-breakdown {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 12px;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          font-size: 0.95rem;
        }

        .price-row.small {
          font-size: 0.85rem;
          color: #666;
        }

        .price-row.total-row {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 0;
          margin-top: 0.5rem;
        }

        .total-price {
          color: #5cb85c;
          font-size: 1.35rem;
        }

        .price-divider {
          border-top: 1px solid #e0e0e0;
          margin: 0.75rem 0;
        }

        .btn-success {
          background: #5cb85c;
          border: none;
          font-weight: 600;
          border-radius: 12px;
        }

        .btn-success:hover:not(:disabled) {
          background: #4cae4c;
        }

        .btn-outline-success {
          border: 2px solid #5cb85c;
          color: #5cb85c;
          font-weight: 600;
          border-radius: 12px;
        }

        .btn-outline-success:hover:not(:disabled) {
          background: #f0f8f0;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 992px) {
          .sticky-card {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .booking-card {
            padding: 1.5rem;
          }

          .summary-row {
            flex-direction: column;
            gap: 0.25rem;
          }

          .summary-label {
            min-width: auto;
          }

          .summary-value {
            text-align: left;
          }
        }
      `}</style>
    </>
  );
}
