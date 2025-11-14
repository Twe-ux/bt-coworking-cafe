'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PageTitle from '@/components/site/pageTitle';
import CheckoutForm from '@/components/site/booking/CheckoutForm';
import { useSession } from 'next-auth/react';

interface Booking {
  _id: string;
  space: {
    _id: string;
    name: string;
    type: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  numberOfPeople: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
}

// Initialize Stripe - this will be loaded once
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function CheckoutPage({ params }: { params: { bookingId: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to sign in if not authenticated
    if (status === 'unauthenticated') {
      router.push(`/signin?callbackUrl=/booking/checkout/${params.bookingId}`);
      return;
    }

    if (status === 'authenticated') {
      fetchBookingAndCreateIntent();
    }
  }, [status, params.bookingId]);

  const fetchBookingAndCreateIntent = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch booking details
      const bookingResponse = await fetch(`/api/bookings/${params.bookingId}`);
      const bookingData = await bookingResponse.json();

      if (!bookingData.success) {
        setError(bookingData.error || 'Impossible de charger la réservation');
        setLoading(false);
        return;
      }

      const bookingDetails = bookingData.data;
      setBooking(bookingDetails);

      // Check if already paid
      if (bookingDetails.paymentStatus === 'paid') {
        router.push(`/booking/confirmation/${params.bookingId}`);
        return;
      }

      // Check if cancelled
      if (bookingDetails.status === 'cancelled') {
        setError('Cette réservation a été annulée');
        setLoading(false);
        return;
      }

      // Create payment intent
      const intentResponse = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: params.bookingId,
        }),
      });

      const intentData = await intentResponse.json();

      if (!intentData.success) {
        setError(intentData.error || 'Impossible de créer l\'intention de paiement');
        setLoading(false);
        return;
      }

      setClientSecret(intentData.data.clientSecret);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching booking or creating payment intent:', err);
      setError('Une erreur est survenue lors de la préparation du paiement');
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
    };
    return labels[type] || type;
  };

  if (status === 'loading' || loading) {
    return (
      <>
        <PageTitle title="Paiement" currentPage="Paiement" />
        <section className="checkout-page py__130">
          <div className="container">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p className="mt-3 text-muted">Préparation du paiement...</p>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageTitle title="Paiement" currentPage="Paiement" />
        <section className="checkout-page py__130">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
                <div className="text-center mt-4">
                  <button
                    onClick={() => router.push('/booking')}
                    className="btn btn-primary"
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Retour aux espaces
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (!booking || !clientSecret) {
    return null;
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#0d6efd',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <>
      <PageTitle title="Paiement sécurisé" currentPage="Paiement" />

      <section className="checkout-page py__130">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {/* Booking Summary */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="card-title mb-4">
                    <i className="bi bi-receipt me-2"></i>
                    Récapitulatif de la réservation
                  </h5>

                  <div className="row mb-3">
                    <div className="col-sm-4 text-muted">Espace</div>
                    <div className="col-sm-8">
                      <strong>{booking.space.name}</strong>
                      <span className="badge bg-primary ms-2">
                        {getTypeLabel(booking.space.type)}
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

                  <hr />

                  <div className="row">
                    <div className="col-sm-4 text-muted">
                      <strong>Total à payer</strong>
                    </div>
                    <div className="col-sm-8">
                      <h4 className="text-primary mb-0">
                        {booking.totalPrice.toFixed(2)}€
                      </h4>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-4">
                    <i className="bi bi-credit-card me-2"></i>
                    Informations de paiement
                  </h5>

                  <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm
                      bookingId={params.bookingId}
                      amount={Math.round(booking.totalPrice * 100)}
                    />
                  </Elements>
                </div>
              </div>

              {/* Security Info */}
              <div className="text-center mt-4">
                <p className="text-muted mb-2">
                  <i className="bi bi-shield-check me-2"></i>
                  Paiement 100% sécurisé
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <small className="text-muted">
                    <i className="bi bi-lock-fill me-1"></i>
                    Cryptage SSL
                  </small>
                  <small className="text-muted">
                    <i className="bi bi-credit-card-2-front me-1"></i>
                    Stripe
                  </small>
                  <small className="text-muted">
                    <i className="bi bi-shield-fill-check me-1"></i>
                    PCI DSS
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .py__130 {
          padding: 130px 0;
        }

        @media (max-width: 768px) {
          .py__130 {
            padding: 60px 0;
          }
        }
      `}</style>
    </>
  );
}
