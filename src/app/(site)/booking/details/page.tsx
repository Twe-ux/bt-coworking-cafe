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
}

export default function BookingDetailsPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);
  const [updatedPrice, setUpdatedPrice] = useState<number | null>(null);

  useEffect(() => {
    // Load booking data from sessionStorage
    const storedData = sessionStorage.getItem('bookingData');
    if (!storedData) {
      router.push('/booking');
      return;
    }
    setBookingData(JSON.parse(storedData));

    // Pre-fill with user data if logged in
    if (session?.user) {
      setContactName(session.user.name || '');
      setContactEmail(session.user.email || '');
    }
  }, [session]);

  // Recalculate price when numberOfPeople changes
  useEffect(() => {
    if (!bookingData) return;

    const recalculatePrice = async () => {
      try {
        const startDateTime = new Date(`${bookingData.date}T${bookingData.startTime}`).toISOString();
        const endDateTime = new Date(`${bookingData.date}T${bookingData.endTime}`).toISOString();

        const response = await fetch('/api/calculate-price', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            spaceType: bookingData.spaceType,
            reservationType: bookingData.reservationType,
            startTime: startDateTime,
            endTime: endDateTime,
            numberOfPeople: numberOfPeople,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setUpdatedPrice(data.data.totalPrice);
        }
      } catch (error) {
        console.error('Error recalculating price:', error);
      }
    };

    recalculatePrice();
  }, [numberOfPeople, bookingData]);

  const handleContinue = async () => {
    if (!isValidForm()) return;

    setLoading(true);

    // Update booking data with contact details and updated price
    const updatedBookingData = {
      ...bookingData,
      numberOfPeople,
      basePrice: updatedPrice || bookingData?.basePrice || 0,
      contactName,
      contactEmail,
      contactPhone,
      specialRequests,
    };

    sessionStorage.setItem('bookingData', JSON.stringify(updatedBookingData));

    // Navigate to summary page
    router.push('/booking/summary');
  };

  const isValidForm = () => {
    return (
      numberOfPeople >= 1 &&
      contactName.trim() !== '' &&
      contactEmail.trim() !== '' &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) &&
      contactPhone.trim() !== ''
    );
  };

  if (!bookingData) {
    return null;
  }

  return (
    <>
      <PageTitle title="Finaliser les détails" currentPage="Détails de la réservation" />

      <section className="booking-details-page py-5">
        <div className="container">
          {/* Progress Bar */}
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8">
              <BookingProgressBar currentStep={3} />
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
                <div className="text-center mb-4">
                  <h2 className="mb-2" style={{ fontSize: '1.5rem' }}>Finaliser les détails</h2>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>Quelques informations supplémentaires</p>
                </div>

                {/* Number of People */}
                <div className="mb-5">
                  <label className="form-label fw-semibold mb-3">
                    Nombre de personnes (vous inclus)
                  </label>
                  <div className="people-counter">
                    <button
                      className="counter-btn"
                      onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                    >
                      <i className="bi bi-dash"></i>
                    </button>
                    <div className="counter-display">
                      <div className="counter-number">{numberOfPeople}</div>
                      <div className="counter-label">
                        <i className="bi bi-people me-2"></i>
                        {numberOfPeople} {numberOfPeople > 1 ? 'personnes' : 'personne'}
                      </div>
                    </div>
                    <button
                      className="counter-btn"
                      onClick={() => setNumberOfPeople(numberOfPeople + 1)}
                    >
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>
                  <small className="text-muted mt-2 d-block">
                    Capacité maximum: 12 personnes
                  </small>
                  {updatedPrice !== null && updatedPrice !== bookingData?.basePrice && (
                    <div className="alert alert-info mt-3">
                      <i className="bi bi-info-circle me-2"></i>
                      Prix mis à jour: <strong>{updatedPrice.toFixed(2)} €</strong>
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div className="mb-5">
                  <h5 className="mb-4">Informations de contact</h5>

                  <div className="mb-3">
                    <label className="form-label">Nom complet</label>
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
                    <label className="form-label">Email</label>
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
                    <label className="form-label">Téléphone</label>
                    <input
                      type="tel"
                      className="form-control form-control-lg"
                      placeholder="06 XX XX XX XX"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Special Requests */}
                <div className="mb-5">
                  <label className="form-label fw-semibold mb-2">
                    Demandes particulières (optionnel)
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Équipements spéciaux, allergies alimentaires, préférences d'ambiance, etc."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                  />
                </div>

                {/* Continue Button */}
                <button
                  className="btn btn-success btn-lg w-100"
                  onClick={handleContinue}
                  disabled={!isValidForm() || loading}
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
                  <p className="text-danger text-center mt-3 mb-0 small">
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
