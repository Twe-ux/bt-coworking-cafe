'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageTitle from '@/components/site/pageTitle';
import BookingProgressBar from '@/components/site/booking/BookingProgressBar';

// Map URL slugs to database spaceType values
const spaceTypeMapping: Record<string, string> = {
  'open-space': 'open-space',
  'meeting-room-glass': 'salle-verriere',
  'meeting-room-floor': 'salle-etage',
  'event-space': 'evenementiel',
};

const spaceTypeInfo: Record<string, { title: string; subtitle: string }> = {
  'open-space': { title: 'Place', subtitle: 'Open-space' },
  'meeting-room-glass': { title: 'Salle de réunion', subtitle: 'Verrière' },
  'meeting-room-floor': { title: 'Salle de réunion', subtitle: 'Étage' },
  'event-space': { title: 'Événementiel', subtitle: 'Grand espace' },
};

type ReservationType = 'hourly' | 'daily' | 'weekly' | 'monthly';

interface SpaceConfiguration {
  spaceType: string;
  name: string;
  pricing: {
    hourly: number;
    daily: number;
    weekly: number;
    monthly: number;
    perPerson: boolean;
  };
  availableReservationTypes: {
    hourly: boolean;
    daily: boolean;
    weekly: boolean;
    monthly: boolean;
  };
  requiresQuote: boolean;
  minCapacity: number;
  maxCapacity: number;
  defaultHours: {
    [key: string]: {
      isOpen: boolean;
      openTime?: string;
      closeTime?: string;
    };
  };
  exceptionalClosures?: Array<{
    date: string;
    reason?: string;
  }>;
}

const allReservationTypes = [
  { id: 'hourly' as ReservationType, label: 'À l\'heure', icon: 'bi-clock' },
  { id: 'daily' as ReservationType, label: 'À la journée', icon: 'bi-calendar-day' },
  { id: 'weekly' as ReservationType, label: 'À la semaine', icon: 'bi-calendar-week' },
  { id: 'monthly' as ReservationType, label: 'Au mois', icon: 'bi-calendar-month' },
];

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00',
];

export default function BookingDatePage({ params }: { params: { type: string } }) {
  const router = useRouter();
  const spaceInfo = spaceTypeInfo[params.type] || { title: 'Espace', subtitle: '' };
  const dbSpaceType = spaceTypeMapping[params.type] || params.type;

  const [reservationType, setReservationType] = useState<ReservationType>('hourly');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
  const [duration, setDuration] = useState<string>('');
  const [spaceConfig, setSpaceConfig] = useState<SpaceConfiguration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Filter available reservation types based on configuration
  const availableReservationTypes = spaceConfig?.availableReservationTypes
    ? allReservationTypes.filter((reservType) => {
        return spaceConfig.availableReservationTypes?.[reservType.id as keyof typeof spaceConfig.availableReservationTypes];
      })
    : allReservationTypes;

  // Fetch space configuration
  useEffect(() => {
    const fetchSpaceConfig = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/space-configurations/${dbSpaceType}`);
        const data = await response.json();

        if (data.success) {
          setSpaceConfig(data.data);

          // Redirect to contact if this space requires a quote
          if (data.data.requiresQuote) {
            router.push('/contact');
            return;
          }
        } else {
          setError('Configuration de l\'espace non disponible');
        }
      } catch (err) {
        console.error('Error fetching space config:', err);
        setError('Erreur lors du chargement de la configuration');
      } finally {
        setLoading(false);
      }
    };

    fetchSpaceConfig();
  }, [dbSpaceType]);

  // Set default date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  // Calculate price and duration when times change
  useEffect(() => {
    if (startTime && endTime && selectedDate && spaceConfig) {
      calculatePriceAndDuration();
    }
  }, [startTime, endTime, selectedDate, reservationType, spaceConfig]);

  const calculatePriceAndDuration = async () => {
    if (!startTime || !endTime || !spaceConfig) return;

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    if (endMinutes <= startMinutes) {
      setDuration('');
      setCalculatedPrice(0);
      return;
    }

    const durationMinutes = endMinutes - startMinutes;
    const durationHours = durationMinutes / 60;

    // Format duration
    const hours = Math.floor(durationHours);
    const minutes = durationMinutes % 60;
    setDuration(hours > 0 ? `${hours}H ${minutes > 0 ? minutes.toString().padStart(2, '0') : ''}`.trim() : `${minutes}min`);

    // Calculate price using API
    try {
      const startDateTime = new Date(`${selectedDate}T${startTime}`).toISOString();
      const endDateTime = new Date(`${selectedDate}T${endTime}`).toISOString();

      const response = await fetch('/api/calculate-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spaceType: dbSpaceType,
          reservationType,
          startTime: startDateTime,
          endTime: endDateTime,
          numberOfPeople: 1, // Default to 1, will be updated in details page
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Use base price (before per-person multiplier) for display
        setCalculatedPrice(data.data.basePrice);
      } else {
        console.error('Price calculation error:', data.error);
        // Fallback to local calculation
        let price = 0;
        switch (reservationType) {
          case 'hourly':
            price = durationHours * spaceConfig.pricing.hourly;
            break;
          case 'daily':
            price = spaceConfig.pricing.daily;
            break;
          case 'weekly':
            price = spaceConfig.pricing.weekly;
            break;
          case 'monthly':
            price = spaceConfig.pricing.monthly;
            break;
        }
        setCalculatedPrice(price);
      }
    } catch (err) {
      console.error('Error calculating price:', err);
      // Fallback to local calculation
      let price = 0;
      switch (reservationType) {
        case 'hourly':
          price = durationHours * spaceConfig.pricing.hourly;
          break;
        case 'daily':
          price = spaceConfig.pricing.daily;
          break;
        case 'weekly':
          price = spaceConfig.pricing.weekly;
          break;
        case 'monthly':
          price = spaceConfig.pricing.monthly;
          break;
      }
      setCalculatedPrice(price);
    }
  };

  // Check if selected time is within opening hours
  const checkOpeningHours = (): { isValid: boolean; message?: string } => {
    if (!spaceConfig || !selectedDate || !startTime || !endTime) {
      return { isValid: true };
    }

    // Check exceptional closures
    const selectedDateOnly = selectedDate.split('T')[0];
    const closure = spaceConfig.exceptionalClosures?.find(
      (c) => c.date.split('T')[0] === selectedDateOnly
    );
    if (closure) {
      return {
        isValid: false,
        message: `L'espace est fermé ce jour${closure.reason ? ` : ${closure.reason}` : ''}`,
      };
    }

    // Get day of week
    const dayOfWeek = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const dayHours = spaceConfig.defaultHours?.[dayOfWeek];

    if (!dayHours || !dayHours.isOpen) {
      return {
        isValid: false,
        message: 'L\'espace est fermé ce jour',
      };
    }

    // Check if times are within opening hours (only for hourly reservations)
    if (reservationType === 'hourly' && dayHours.openTime && dayHours.closeTime) {
      if (startTime < dayHours.openTime || endTime > dayHours.closeTime) {
        return {
          isValid: false,
          message: `Les horaires d'ouverture pour ce jour sont de ${dayHours.openTime} à ${dayHours.closeTime}`,
        };
      }
    }

    return { isValid: true };
  };

  const openingHoursCheck = checkOpeningHours();

  const handleContinue = () => {
    // Validate opening hours
    if (!openingHoursCheck.isValid) {
      alert(openingHoursCheck.message);
      return;
    }

    // Store booking data in sessionStorage
    const bookingData = {
      spaceType: params.type,
      reservationType,
      date: selectedDate,
      startTime,
      endTime,
      basePrice: calculatedPrice,
      duration,
    };
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));

    // Navigate to details page
    router.push('/booking/details');
  };

  const isValidSelection = selectedDate && startTime && endTime && calculatedPrice > 0 && openingHoursCheck.isValid;

  if (loading) {
    return (
      <>
        <PageTitle title="Réserver un espace" currentPage="Date et horaires" />
        <section className="booking-date-page py-5">
          <div className="container">
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageTitle title="Réserver un espace" currentPage="Date et horaires" />
        <section className="booking-date-page py-5">
          <div className="container">
            <div className="alert alert-danger text-center">
              {error}
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageTitle title="Réserver un espace" currentPage="Date et horaires" />

      <section className="booking-date-page py-5">
        <div className="container">
          {/* Progress Bar */}
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8">
              <BookingProgressBar currentStep={2} />
            </div>
          </div>

          {/* Main Card */}
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="booking-card">
                {/* Back button */}
                <button
                  onClick={() => router.back()}
                  className="btn btn-link text-muted p-0 mb-4"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Retour
                </button>

                {/* Title */}
                <div className="text-center mb-3">
                  <h2 className="mb-2" style={{ fontSize: '1.5rem' }}>Quand voulez-vous venir ?</h2>
                  <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                    Sélectionnez votre durée et votre créneau
                  </p>
                  <div className="selected-space-badge">
                    <i className="bi bi-geo-alt me-2"></i>
                    {spaceInfo.title} - {spaceInfo.subtitle}
                  </div>
                </div>

                {/* Reservation Type */}
                <div className="mb-5">
                  <label className="form-label fw-semibold mb-3">
                    Type de réservation
                  </label>
                  <div className="reservation-types-grid">
                    {availableReservationTypes.map((type) => (
                      <button
                        key={type.id}
                        className={`reservation-type-btn ${
                          reservationType === type.id ? 'active' : ''
                        }`}
                        onClick={() => setReservationType(type.id)}
                      >
                        <i className={type.icon}></i>
                        <span>{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Selection */}
                <div className="mb-5">
                  <label className="form-label fw-semibold mb-3">
                    Date
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Time Selection */}
                <div className="row mb-5">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold mb-3">
                      Heure de début
                    </label>
                    <div className="time-slots-grid">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          className={`time-slot-btn ${
                            startTime === time ? 'active' : ''
                          }`}
                          onClick={() => setStartTime(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold mb-3">
                      Heure de fin
                      {duration && (
                        <span className="text-muted ms-2">
                          (sélection: {startTime} - {endTime})
                        </span>
                      )}
                    </label>
                    <div className="time-slots-grid">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          className={`time-slot-btn ${
                            endTime === time ? 'active' : ''
                          } ${startTime && time <= startTime ? 'disabled' : ''}`}
                          onClick={() => setEndTime(time)}
                          disabled={!!(startTime && time <= startTime)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Opening Hours Warning */}
                {!openingHoursCheck.isValid && openingHoursCheck.message && (
                  <div className="alert alert-warning mb-4">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {openingHoursCheck.message}
                  </div>
                )}

                {/* Duration & Price Display */}
                {duration && calculatedPrice > 0 && openingHoursCheck.isValid && (
                  <div className="price-summary mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">
                        <i className="bi bi-clock me-2"></i>
                        Durée: {duration}
                      </span>
                    </div>
                    <div className="price-display">
                      {calculatedPrice.toFixed(0)}€
                    </div>
                    <p className="text-muted text-center mb-0 small">
                      Tarif de base
                      {spaceConfig?.pricing.perPerson && ' par personne'}
                      {' - Services supplémentaires à l\'étape suivante'}
                    </p>
                  </div>
                )}

                {/* Continue Button */}
                <button
                  className="btn btn-success btn-lg w-100"
                  onClick={handleContinue}
                  disabled={!isValidSelection}
                >
                  Continuer vers les détails
                  <i className="bi bi-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .booking-date-page {
          background-color: #f8f9fa;
          min-height: 70vh;
          padding: 2.5rem 0 !important;
        }

        .booking-card {
          background: white;
          border-radius: 16px;
          padding: 1.75rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .selected-space-badge {
          display: inline-block;
          background: #f0f0f0;
          padding: 0.5rem 1.5rem;
          border-radius: 20px;
          color: #666;
          font-size: 0.9rem;
          margin-top: 1rem;
        }

        .reservation-types-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
        }

        .reservation-type-btn {
          background: #f8f9fa;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
          color: #666;
        }

        .reservation-type-btn i {
          font-size: 1.5rem;
        }

        .reservation-type-btn:hover {
          border-color: #417972;
          background: #f0f8f0;
        }

        .reservation-type-btn.active {
          background: #417972;
          border-color: #417972;
          color: white;
        }

        .time-slots-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 0.5rem;
          max-height: 300px;
          overflow-y: auto;
          padding: 0.5rem;
        }

        .time-slot-btn {
          background: #f8f9fa;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 0.75rem 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
          color: #666;
          font-size: 0.9rem;
        }

        .time-slot-btn:hover:not(.disabled) {
          border-color: #417972;
          background: #f0f8f0;
        }

        .time-slot-btn.active {
          background: #417972;
          border-color: #417972;
          color: white;
        }

        .time-slot-btn.disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .price-summary {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
        }

        .price-display {
          font-size: 2.25rem;
          font-weight: 700;
          color: #333;
          margin: 0.5rem 0;
        }

        .btn-success {
          background: #417972;
          border: none;
          padding: 1rem;
          font-weight: 600;
          border-radius: 12px;
        }

        .btn-success:hover:not(:disabled) {
          background: #4cae4c;
        }

        .btn-success:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .booking-card {
            padding: 1.5rem;
          }

          .time-slots-grid {
            grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
          }

          .price-display {
            font-size: 2.5rem;
          }

          .reservation-types-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </>
  );
}
