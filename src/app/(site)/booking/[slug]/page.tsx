'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import PageTitle from '@/components/site/pageTitle';
import Link from 'next/link';

interface Space {
  _id: string;
  name: string;
  slug: string;
  description: string;
  type: string;
  capacity: number;
  pricing: {
    hourly?: number;
    daily?: number;
    weekly?: number;
    monthly?: number;
  };
  amenities: string[];
  images: string[];
  featuredImage?: string;
  floor?: string;
  building?: string;
}

const BookingDetailsPage = ({ params }: { params: { slug: string } }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({
    date: '',
    startTime: '09:00',
    endTime: '17:00',
    numberOfPeople: 1,
    notes: '',
  });
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSpace();
  }, [params.slug]);

  useEffect(() => {
    calculatePrice();
  }, [bookingForm.startTime, bookingForm.endTime, space]);

  const fetchSpace = async () => {
    try {
      const response = await fetch(`/api/spaces/${params.slug}`);
      const data = await response.json();

      if (data.success) {
        setSpace(data.data);
      } else {
        setError('Espace non trouvé');
      }
    } catch (error) {
      console.error('Error fetching space:', error);
      setError('Erreur lors du chargement de l\'espace');
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    if (!space) return;

    const [startHour, startMinute] = bookingForm.startTime.split(':').map(Number);
    const [endHour, endMinute] = bookingForm.endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    if (endMinutes <= startMinutes) {
      setCalculatedPrice(0);
      return;
    }

    const durationMinutes = endMinutes - startMinutes;
    const durationHours = durationMinutes / 60;

    let price = 0;

    if (space.pricing.hourly) {
      price = space.pricing.hourly * durationHours;
    } else if (space.pricing.daily && durationHours >= 4) {
      price = space.pricing.daily;
    }

    setCalculatedPrice(Math.round(price * 100) / 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!session) {
      router.push(`/auth/signin?callbackUrl=/booking/${params.slug}`);
      return;
    }

    if (!bookingForm.date) {
      setError('Veuillez sélectionner une date');
      return;
    }

    if (bookingForm.numberOfPeople > (space?.capacity || 0)) {
      setError(`Le nombre maximum de personnes est ${space?.capacity}`);
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spaceId: space?._id,
          date: bookingForm.date,
          startTime: bookingForm.startTime,
          endTime: bookingForm.endTime,
          numberOfPeople: bookingForm.numberOfPeople,
          notes: bookingForm.notes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to checkout page
        router.push(`/booking/checkout/${data.data._id}`);
      } else {
        setError(data.error || 'Erreur lors de la création de la réservation');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      setError('Erreur lors de la création de la réservation');
    } finally {
      setSubmitting(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'desk': 'Bureau',
      'meeting-room': 'Salle de réunion',
      'private-office': 'Bureau privé',
      'event-space': 'Espace événement',
    };
    return labels[type] || type;
  };

  const getAmenityIcon = (amenity: string) => {
    const icons: Record<string, string> = {
      wifi: 'bi-wifi',
      projector: 'bi-projector',
      whiteboard: 'bi-easel',
      coffee: 'bi-cup-hot',
      printer: 'bi-printer',
      phone: 'bi-telephone',
      tv: 'bi-tv',
      'air-conditioning': 'bi-wind',
      'natural-light': 'bi-sun',
      'standing-desk': 'bi-arrow-up-square',
      'ergonomic-chair': 'bi-chair',
      locker: 'bi-lock',
      'kitchen-access': 'bi-house-door',
      parking: 'bi-car-front',
    };
    return icons[amenity] || 'bi-check-circle';
  };

  const getAmenityLabel = (amenity: string) => {
    const labels: Record<string, string> = {
      wifi: 'WiFi',
      projector: 'Projecteur',
      whiteboard: 'Tableau blanc',
      coffee: 'Café',
      printer: 'Imprimante',
      phone: 'Téléphone',
      tv: 'TV',
      'air-conditioning': 'Climatisation',
      'natural-light': 'Lumière naturelle',
      'standing-desk': 'Bureau debout',
      'ergonomic-chair': 'Chaise ergonomique',
      locker: 'Casier',
      'kitchen-access': 'Accès cuisine',
      parking: 'Parking',
    };
    return labels[amenity] || amenity;
  };

  if (loading) {
    return (
      <>
        <PageTitle title="Chargement..." currentPage="Réservation" />
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </>
    );
  }

  if (error && !space) {
    return (
      <>
        <PageTitle title="Erreur" currentPage="Réservation" />
        <div className="container py-5">
          <div className="alert alert-danger">{error}</div>
          <Link href="/booking" className="btn btn-primary">
            Retour aux espaces
          </Link>
        </div>
      </>
    );
  }

  if (!space) {
    return null;
  }

  return (
    <>
      <PageTitle title={space.name} currentPage="Réservation" />

      <section className="booking-details py__130">
        <div className="container">
          <div className="row g-4">
            {/* Space Details */}
            <div className="col-lg-8">
              {/* Image Gallery */}
              <div className="card border-0 shadow-sm mb-4">
                <img
                  src={space.featuredImage || space.images[0] || '/placeholder-space.jpg'}
                  className="card-img-top"
                  alt={space.name}
                  style={{ height: '400px', objectFit: 'cover' }}
                />
              </div>

              {/* Description */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h3 className="card-title mb-0">{space.name}</h3>
                    <span className="badge bg-primary fs-6">{getTypeLabel(space.type)}</span>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex gap-3">
                      <div>
                        <i className="bi bi-people me-1"></i>
                        <span>Capacité: {space.capacity} personne{space.capacity > 1 ? 's' : ''}</span>
                      </div>
                      {space.floor && (
                        <div>
                          <i className="bi bi-building me-1"></i>
                          <span>Étage: {space.floor}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="card-text">{space.description}</p>
                </div>
              </div>

              {/* Amenities */}
              {space.amenities.length > 0 && (
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body">
                    <h5 className="card-title mb-3">Équipements</h5>
                    <div className="row g-3">
                      {space.amenities.map((amenity) => (
                        <div key={amenity} className="col-md-6">
                          <div className="d-flex align-items-center">
                            <i className={`${getAmenityIcon(amenity)} me-2 text-primary`}></i>
                            <span>{getAmenityLabel(amenity)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing */}
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-3">Tarifs</h5>
                  <div className="row g-3">
                    {space.pricing.hourly && (
                      <div className="col-md-6">
                        <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                          <span>Tarif horaire</span>
                          <strong className="text-primary">{space.pricing.hourly}€/h</strong>
                        </div>
                      </div>
                    )}
                    {space.pricing.daily && (
                      <div className="col-md-6">
                        <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                          <span>Tarif journalier</span>
                          <strong className="text-primary">{space.pricing.daily}€/jour</strong>
                        </div>
                      </div>
                    )}
                    {space.pricing.weekly && (
                      <div className="col-md-6">
                        <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                          <span>Tarif hebdomadaire</span>
                          <strong className="text-primary">{space.pricing.weekly}€/semaine</strong>
                        </div>
                      </div>
                    )}
                    {space.pricing.monthly && (
                      <div className="col-md-6">
                        <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                          <span>Tarif mensuel</span>
                          <strong className="text-primary">{space.pricing.monthly}€/mois</strong>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm sticky-top" style={{ top: '100px' }}>
                <div className="card-body">
                  <h5 className="card-title mb-4">Faire une réservation</h5>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Date</label>
                      <input
                        type="date"
                        className="form-control"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={bookingForm.date}
                        onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Heure de début</label>
                      <input
                        type="time"
                        className="form-control"
                        required
                        value={bookingForm.startTime}
                        onChange={(e) => setBookingForm({ ...bookingForm, startTime: e.target.value })}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Heure de fin</label>
                      <input
                        type="time"
                        className="form-control"
                        required
                        value={bookingForm.endTime}
                        onChange={(e) => setBookingForm({ ...bookingForm, endTime: e.target.value })}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Nombre de personnes</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        min="1"
                        max={space.capacity}
                        value={bookingForm.numberOfPeople}
                        onChange={(e) =>
                          setBookingForm({ ...bookingForm, numberOfPeople: parseInt(e.target.value) })
                        }
                      />
                      <small className="text-muted">Maximum: {space.capacity}</small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Notes (optionnel)</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={bookingForm.notes}
                        onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                        placeholder="Demandes spéciales..."
                      />
                    </div>

                    {calculatedPrice > 0 && (
                      <div className="alert alert-info mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <span>Prix total estimé:</span>
                          <strong className="h5 mb-0">{calculatedPrice}€</strong>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={submitting || calculatedPrice === 0}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Création...
                        </>
                      ) : (
                        'Continuer vers le paiement'
                      )}
                    </button>

                    {!session && (
                      <small className="text-muted d-block mt-2 text-center">
                        Vous serez redirigé vers la page de connexion
                      </small>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BookingDetailsPage;
