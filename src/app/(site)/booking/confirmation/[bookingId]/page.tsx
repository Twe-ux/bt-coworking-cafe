'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface AdditionalService {
  service: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Booking {
  _id: string;
  spaceType: string;
  date: string;
  startTime: string;
  endTime: string;
  numberOfPeople: number;
  basePrice: number;
  servicesPrice: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  requiresPayment: boolean;
  confirmationNumber?: string;
  specialRequests?: string;
  additionalServices?: AdditionalService[];
  createdAt: string;
  captureMethod?: 'manual' | 'automatic';
  stripePaymentIntentId?: string;
  stripeSetupIntentId?: string;
}

interface SpaceConfig {
  name: string;
  spaceType: string;
  imageUrl?: string;
  depositPolicy?: {
    enabled: boolean;
    percentage?: number;
    fixedAmount?: number;
    minimumAmount?: number;
  };
}

export default function ConfirmationPage({ params }: { params: { bookingId: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [spaceConfig, setSpaceConfig] = useState<SpaceConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Allow both authenticated and unauthenticated users to view confirmation
    if (status !== 'loading') {
      fetchBooking();
    }
  }, [status, params.bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/bookings/${params.bookingId}`);
      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Impossible de charger la réservation');
        setLoading(false);
        return;
      }

      const bookingDetails = data.data;
      setBooking(bookingDetails);

      // Fetch space configuration
      if (bookingDetails.spaceType) {
        const spaceResponse = await fetch(`/api/space-configurations/${bookingDetails.spaceType}`);
        const spaceData = await spaceResponse.json();
        if (spaceData.success) {
          setSpaceConfig(spaceData.data);
        }
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching booking:', err);
      setError('Une erreur est survenue lors du chargement de la réservation');
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    return time;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'desk': 'Bureau',
      'meeting-room': 'Salle de réunion',
      'private-office': 'Bureau privé',
      'event-space': 'Espace événement',
      'open-space': 'Open-space',
      'salle-verriere': 'Salle Verrière',
      'salle-etage': 'Salle Étage',
      'evenementiel': 'Événementiel',
    };
    return labels[type] || type;
  };

  const calculateDepositAmount = () => {
    if (!booking || !spaceConfig?.depositPolicy?.enabled) {
      return null;
    }

    const totalPriceInCents = booking.totalPrice * 100;
    const policy = spaceConfig.depositPolicy;
    let depositInCents = totalPriceInCents;

    if (policy.fixedAmount) {
      depositInCents = policy.fixedAmount;
    } else if (policy.percentage) {
      depositInCents = Math.round(totalPriceInCents * (policy.percentage / 100));
    }

    if (policy.minimumAmount && depositInCents < policy.minimumAmount) {
      depositInCents = policy.minimumAmount;
    }

    return depositInCents;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { class: string; label: string }> = {
      'confirmed': { class: 'bg-success', label: 'Confirmé' },
      'pending': { class: 'bg-warning', label: 'En attente' },
      'cancelled': { class: 'bg-danger', label: 'Annulé' },
      'completed': { class: 'bg-info', label: 'Terminé' },
    };
    return badges[status] || { class: 'bg-secondary', label: status };
  };

  const getPaymentStatusBadge = (status: string) => {
    const badges: Record<string, { class: string; label: string }> = {
      'paid': { class: 'bg-success', label: 'Payé' },
      'pending': { class: 'bg-warning', label: 'En attente' },
      'failed': { class: 'bg-danger', label: 'Échoué' },
      'refunded': { class: 'bg-info', label: 'Remboursé' },
    };
    return badges[status] || { class: 'bg-secondary', label: status };
  };

  if (status === 'loading' || loading) {
    return (
      <>
        <section className="confirmation-page py-5">
          <div className="container">
            <div className="text-center py-5">
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
        <section className="confirmation-page py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
                <div className="text-center mt-4">
                  <Link href="/booking" className="btn btn-primary">
                    <i className="bi bi-arrow-left me-2"></i>
                    Retour aux espaces
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (!booking) {
    return null;
  }

  const statusBadge = getStatusBadge(booking.status);
  const paymentBadge = getPaymentStatusBadge(booking.paymentStatus);
  const isPaid = booking.paymentStatus === 'paid';
  const isConfirmed = isPaid || !booking.requiresPayment;

  return (
    <>
      <section className="confirmation-page py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {/* Back button and Title */}
              <div className="booking-card mb-4">
                <div className="mb-3 position-relative">
                  <button
                    onClick={() => router.push('/booking')}
                    className="btn btn-link text-muted p-0 position-absolute"
                    style={{ fontSize: "0.9rem", left: 0, top: 0 }}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Retour
                  </button>
                  <h2 className="text-center mb-0" style={{ fontSize: "1.35rem" }}>
                    Confirmation de réservation
                  </h2>
                </div>
              </div>
              {/* Success Message */}
              {isConfirmed && (
                <div className="text-center mb-5">
                  <div className="success-icon mb-3">
                    <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h2 className="mb-3">Réservation confirmée !</h2>
                  <p className="text-muted">
                    {isPaid
                      ? 'Votre réservation a été confirmée avec succès. Un email de confirmation a été envoyé à votre adresse.'
                      : 'Votre demande de réservation a été enregistrée. Vous recevrez une confirmation par email dans les plus brefs délais.'}
                  </p>
                </div>
              )}

              {/* Confirmation Number */}
              {booking.confirmationNumber && (
                <div className="card border-0 shadow-sm mb-4 bg-light">
                  <div className="card-body text-center py-4">
                    <small className="text-muted d-block mb-2">Numéro de confirmation</small>
                    <h3 className="mb-0 font-monospace">{booking.confirmationNumber}</h3>
                    <small className="text-muted">
                      <i className="bi bi-info-circle me-1"></i>
                      Veuillez conserver ce numéro pour vos dossiers
                    </small>
                  </div>
                </div>
              )}

              {/* Booking Details */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="card-title mb-4">
                    <i className="bi bi-receipt me-2"></i>
                    Détails de la réservation
                  </h5>

                  {/* Space Image */}
                  {spaceConfig?.imageUrl && (
                    <div className="mb-4">
                      <img
                        src={spaceConfig.imageUrl}
                        alt={spaceConfig.name}
                        className="img-fluid rounded"
                        style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}

                  <div className="row mb-3">
                    <div className="col-sm-4 text-muted">Espace</div>
                    <div className="col-sm-8">
                      <strong>{spaceConfig?.name || 'Espace'}</strong>
                      <span className="badge bg-primary ms-2">
                        {getTypeLabel(booking.spaceType)}
                      </span>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-sm-4 text-muted">Date</div>
                    <div className="col-sm-8">
                      <i className="bi bi-calendar me-2"></i>
                      {formatDate(booking.date)}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-sm-4 text-muted">Horaire</div>
                    <div className="col-sm-8">
                      <i className="bi bi-clock me-2"></i>
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-sm-4 text-muted">Nombre de personnes</div>
                    <div className="col-sm-8">
                      <i className="bi bi-people me-2"></i>
                      {booking.numberOfPeople} {booking.numberOfPeople > 1 ? 'personnes' : 'personne'}
                    </div>
                  </div>

                  {booking.specialRequests && (
                    <div className="row mb-3">
                      <div className="col-sm-4 text-muted">Demandes spéciales</div>
                      <div className="col-sm-8">{booking.specialRequests}</div>
                    </div>
                  )}

                  {booking.additionalServices && booking.additionalServices.length > 0 && (
                    <>
                      <hr />
                      <div className="row mb-3">
                        <div className="col-12">
                          <h6 className="mb-3">
                            <i className="bi bi-bag-plus me-2"></i>
                            Services supplémentaires
                          </h6>
                          {booking.additionalServices.map((service, index) => (
                            <div key={index} className="row mb-2">
                              <div className="col-sm-8">
                                {service.name} <span className="text-muted">(x{service.quantity})</span>
                              </div>
                              <div className="col-sm-4 text-end">
                                {service.totalPrice.toFixed(2)}€
                              </div>
                            </div>
                          ))}
                          <div className="row mt-2 pt-2 border-top">
                            <div className="col-sm-8">
                              <strong>Sous-total services</strong>
                            </div>
                            <div className="col-sm-4 text-end">
                              <strong>{booking.servicesPrice?.toFixed(2) || '0.00'}€</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <hr />

                  <div className="row mb-3">
                    <div className="col-sm-4 text-muted">Statut</div>
                    <div className="col-sm-8">
                      <span className={`badge ${statusBadge.class}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-sm-4 text-muted">Paiement</div>
                    <div className="col-sm-8">
                      <span className={`badge ${paymentBadge.class}`}>
                        {paymentBadge.label}
                      </span>
                    </div>
                  </div>

                  <hr />

                  <div className="row mb-3">
                    <div className="col-sm-4 text-muted">
                      <strong>Prix total</strong>
                    </div>
                    <div className="col-sm-8">
                      <h4 className="text-primary mb-0">
                        {booking.totalPrice.toFixed(2)}€
                      </h4>
                    </div>
                  </div>

                  {(() => {
                    const depositAmount = calculateDepositAmount();
                    if (depositAmount && booking.requiresPayment) {
                      return (
                        <div className="row" style={{ backgroundColor: '#fff3cd', margin: '0 -1rem', padding: '1rem', borderRadius: '6px' }}>
                          <div className="col-sm-4">
                            <strong>💳 Empreinte bancaire</strong>
                          </div>
                          <div className="col-sm-8">
                            <h5 className="text-warning mb-0">
                              {(depositAmount / 100).toFixed(2)}€
                            </h5>
                            <small className="text-muted">
                              {booking.captureMethod === 'manual'
                                ? 'Montant autorisé sur votre carte (sera annulé si vous vous présentez)'
                                : 'Sera débité 7 jours avant la réservation'}
                            </small>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>

              {/* Important Information */}
              <div className="card border-0 shadow-sm mb-4 border-start border-primary border-4">
                <div className="card-body">
                  <h6 className="card-title">
                    <i className="bi bi-info-circle me-2"></i>
                    Informations importantes
                  </h6>
                  <ul className="mb-0 small">
                    <li>Veuillez arriver 5 minutes avant l'heure de début de votre réservation</li>
                    <li>Présentez votre numéro de confirmation à la réception</li>
                    <li>En cas d'annulation, veuillez nous prévenir au moins 24 heures à l'avance</li>
                    <li>Un email de confirmation a été envoyé avec tous les détails</li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                {session && session.user && (
                  <Link
                    href={`/${session.user.username}/reservations`}
                    className="btn btn-primary"
                  >
                    <i className="bi bi-list-ul me-2"></i>
                    Voir mes réservations
                  </Link>
                )}
                <Link
                  href="/booking"
                  className="btn btn-outline-primary"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Retour aux espaces
                </Link>
              </div>

              {/* Contact Info */}
              <div className="text-center mt-5">
                <p className="text-muted mb-2">
                  Des questions ? Contactez-nous
                </p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <a href="tel:+33123456789" className="text-decoration-none">
                    <i className="bi bi-telephone me-1"></i>
                    +33 1 23 45 67 89
                  </a>
                  <a href="mailto:contact@btcafe.com" className="text-decoration-none">
                    <i className="bi bi-envelope me-1"></i>
                    contact@btcafe.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .success-icon {
          animation: scaleIn 0.5s ease-out;
        }

        @keyframes scaleIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
