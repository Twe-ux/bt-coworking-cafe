'use client';

import { useState, FormEvent } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';

interface CheckoutFormProps {
  bookingId: string;
  amount: number;
  intentType: 'setup_intent' | 'manual_capture';
}

export default function CheckoutForm({ bookingId, amount, intentType }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setErrorMessage(null);

    try {
      // First, submit the elements to validate
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(submitError.message || 'Erreur de validation');
        setProcessing(false);
        return;
      }

      if (intentType === 'setup_intent') {
        // For setup intent (bookings >7 days): save card for later
        const { error: setupError, setupIntent } = await stripe.confirmSetup({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/booking/confirmation/${bookingId}`,
          },
          redirect: 'if_required',
        });

        if (setupError) {
          setErrorMessage(setupError.message || 'Une erreur est survenue lors de l\'enregistrement de la carte');
          setProcessing(false);
        } else if (setupIntent && setupIntent.status === 'succeeded') {
          // Setup succeeded, redirect to confirmation page
          router.push(`/booking/confirmation/${bookingId}`);
        } else {
          setErrorMessage('L\'enregistrement de la carte n\'a pas pu être confirmé');
          setProcessing(false);
        }
      } else {
        // For manual capture payment intent (bookings ≤7 days): authorization hold
        const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/booking/confirmation/${bookingId}`,
          },
          redirect: 'if_required',
        });

        if (paymentError) {
          setErrorMessage(paymentError.message || 'Une erreur est survenue lors du paiement');
          setProcessing(false);
        } else if (paymentIntent) {
          // Check payment intent status - handle both succeeded and requires_capture
          if (paymentIntent.status === 'succeeded' || paymentIntent.status === 'requires_capture') {
            // Payment succeeded or authorized (manual capture), redirect to confirmation page
            router.push(`/booking/confirmation/${bookingId}`);
          } else {
            setErrorMessage('Le paiement n\'a pas pu être confirmé');
            setProcessing(false);
          }
        } else {
          setErrorMessage('Le paiement n\'a pas pu être confirmé');
          setProcessing(false);
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      setErrorMessage('Une erreur est survenue lors du paiement');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errorMessage && (
        <div className="alert alert-danger mb-4" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {errorMessage}
        </div>
      )}

      <div className="mb-4">
        <PaymentElement />
      </div>

      <div className="d-grid">
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={!stripe || processing}
        >
          {processing ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Traitement du paiement...
            </>
          ) : (
            <>
              <i className="bi bi-lock me-2"></i>
              Payer {(amount / 100).toFixed(2)}€
            </>
          )}
        </button>
      </div>

      <div className="text-center mt-3">
        <small className="text-muted">
          <i className="bi bi-shield-check me-1"></i>
          Paiement sécurisé par Stripe
        </small>
      </div>
    </form>
  );
}
