'use client';

import { useState, FormEvent } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';

interface CheckoutFormProps {
  bookingId: string;
  amount: number;
}

export default function CheckoutForm({ bookingId, amount }: CheckoutFormProps) {
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
      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking/confirmation/${bookingId}`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'Une erreur est survenue lors du paiement');
        setProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded, redirect to confirmation page
        router.push(`/booking/confirmation/${bookingId}`);
      } else {
        setErrorMessage('Le paiement n\'a pas pu être confirmé');
        setProcessing(false);
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
