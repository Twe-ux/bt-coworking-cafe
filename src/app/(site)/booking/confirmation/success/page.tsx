"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading"
  );
  const [message, setMessage] = useState(
    "Traitement de votre paiement en cours..."
  );
  const [subMessage, setSubMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const webhookTriggeredRef = useRef(false); // NEW: Use ref instead of state to prevent double trigger
  const isInitializedRef = useRef(false); // NEW: Use ref to persist across renders
  const MAX_RETRIES = 5; // 5 tentatives = 10 secondes

  useEffect(() => {
    // Prevent double execution on mount (React 18 StrictMode calls useEffect twice)
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const paymentIntentId = searchParams.get("payment_intent");
    const setupIntentId = searchParams.get("setup_intent");
    const redirectStatus = searchParams.get("redirect_status");

    if (!paymentIntentId && !setupIntentId) {
      setStatus("error");
      setMessage("Aucun paiement trouvé");
      return;
    }

    if (redirectStatus !== "succeeded") {
      setStatus("error");
      setMessage("Le paiement n'a pas été complété avec succès");
      return;
    }

    // In development (localhost), trigger webhook immediately ONCE
    const isDevelopment =
      typeof window !== "undefined" && window.location.hostname === "localhost";
    if (isDevelopment && paymentIntentId && !webhookTriggeredRef.current) {
      triggerTestWebhook(paymentIntentId);
    }

    // Start polling for booking creation
    pollForBooking(paymentIntentId, setupIntentId, 0);
  }, []); // CHANGED: Empty deps to run only once on mount

  const triggerTestWebhook = async (paymentIntentId: string) => {
    if (webhookTriggeredRef.current) return; // Only trigger once

    webhookTriggeredRef.current = true;
    try {
      const webhookResponse = await fetch("/api/payments/test-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId }),
      });
      const webhookData = await webhookResponse.json();

      if (webhookData.success) {
        // Webhook triggered successfully
      } else {
        // Webhook failed
      }
    } catch (error) {
      // Error triggering webhook
    }
  };

  const pollForBooking = async (
    paymentIntentId: string | null,
    setupIntentId: string | null,
    currentRetry: number
  ) => {
    try {
      // Check if booking exists by payment intent or setup intent ID
      const intentId = paymentIntentId || setupIntentId;
      const intentType = paymentIntentId ? "payment" : "setup";

      const response = await fetch(
        `/api/bookings/by-intent?intentId=${intentId}&intentType=${intentType}`
      );
      const data = await response.json();

      if (data.success && data.data) {
        // Booking found! Redirect to confirmation page
        setStatus("success");
        setMessage("Réservation créée avec succès !");
        setSubMessage("Redirection vers votre confirmation...");
        setTimeout(() => {
          router.push(`/booking/confirmation/${data.data._id}`);
        }, 500);
        return;
      }

      // Booking not found yet, retry
      if (currentRetry < MAX_RETRIES) {
        const nextRetry = currentRetry + 1;
        setRetryCount(nextRetry);
        setMessage("Création de votre réservation en cours...");
        setTimeout(
          () => pollForBooking(paymentIntentId, setupIntentId, nextRetry),
          2000
        ); // Retry every 2 seconds
      } else {
        // Max retries reached - Show success message instead of error
        setStatus("success");
        const isDevelopment =
          typeof window !== "undefined" &&
          window.location.hostname === "localhost";
        if (isDevelopment) {
          setMessage(
            "Webhook non déclenché automatiquement. Veuillez utiliser la commande manuelle ci-dessous."
          );
          setStatus("error");
        } else {
          setMessage("Paiement accepté !");
          setSubMessage(
            "Un email de confirmation vous sera envoyé sous peu. Redirection..."
          );
          // Redirect to home page after 3 seconds
          setTimeout(() => {
            router.push("/");
          }, 3000);
        }
      }
    } catch (error) {
      // Error polling for booking
      setStatus("error");
      setMessage(
        "Une erreur est survenue lors de la création de votre réservation"
      );
    }
  };

  return (
    <section className="confirmation-page py-5" style={{ minHeight: "100vh", paddingBottom: "200px" }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="booking-card text-center">
              {status === "loading" && (
                <>
                  <div className="mb-4">
                    <div
                      className="spinner-border text-success"
                      role="status"
                      style={{ width: "4rem", height: "4rem" }}
                    >
                      <span className="visually-hidden">Chargement...</span>
                    </div>
                  </div>
                  <h2
                    className="mb-3"
                    style={{ fontSize: "1.5rem", fontWeight: "700" }}
                  >
                    Traitement en cours...
                  </h2>
                  <p
                    className="text-muted mb-0"
                    style={{ fontSize: "0.9375rem" }}
                  >
                    {message}
                  </p>
                  <p
                    className="text-muted mt-3"
                    style={{ fontSize: "0.875rem" }}
                  >
                    <i className="bi bi-info-circle me-2"></i>
                    Veuillez patienter, ne fermez pas cette page
                  </p>
                </>
              )}

              {status === "success" && (
                <>
                  <div className="success-icon mb-3">
                    <i
                      className="bi bi-check-circle-fill text-success"
                      style={{ fontSize: "4rem" }}
                    ></i>
                  </div>
                  <h2
                    className="mb-3"
                    style={{ fontSize: "1.5rem", fontWeight: "700" }}
                  >
                    {message}
                  </h2>
                  {subMessage && (
                    <p
                      className="text-muted mb-0"
                      style={{ fontSize: "0.9375rem" }}
                    >
                      {subMessage}
                    </p>
                  )}
                </>
              )}

              {status === "error" && (
                <>
                  <div className="mb-4">
                    <i
                      className="bi bi-exclamation-triangle-fill text-warning"
                      style={{ fontSize: "4rem" }}
                    ></i>
                  </div>
                  <h2
                    className="mb-3"
                    style={{ fontSize: "1.5rem", fontWeight: "700" }}
                  >
                    Attention
                  </h2>
                  <p
                    className="text-muted mb-4"
                    style={{ fontSize: "0.9375rem" }}
                  >
                    {message}
                  </p>
                  <div className="d-flex gap-2 justify-content-center">
                    <button
                      onClick={() => {
                        setStatus("loading");
                        setRetryCount(0);
                        const paymentIntentId =
                          searchParams.get("payment_intent");
                        const setupIntentId = searchParams.get("setup_intent");

                        // Just poll again - webhook was already triggered on initial load
                        pollForBooking(paymentIntentId, setupIntentId, 0);
                      }}
                      className="btn btn-success"
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Réessayer
                    </button>
                    <button
                      onClick={() => router.push("/booking")}
                      className="btn btn-outline-secondary"
                    >
                      Retour aux réservations
                    </button>
                  </div>

                  {typeof window !== "undefined" &&
                    window.location.hostname === "localhost" && (
                      <div
                        className="alert alert-info mt-4 text-start"
                        style={{ fontSize: "0.875rem" }}
                      >
                        <strong>
                          <i className="bi bi-code-square me-2"></i>
                          Mode développement
                        </strong>
                        <p className="mb-2 mt-2">
                          En développement local, les webhooks Stripe ne sont
                          pas déclenchés automatiquement. Le système a tenté de
                          déclencher le webhook automatiquement.
                        </p>
                        <p className="mb-0">
                          Si cela ne fonctionne pas, utilisez la commande
                          suivante dans un terminal :
                        </p>
                        <pre
                          className="mt-2 mb-0 p-2 bg-light rounded"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {`curl -X POST http://localhost:3000/api/payments/test-webhook \\
  -H "Content-Type: application/json" \\
  -d '{"paymentIntentId": "${searchParams.get("payment_intent")}"}'`}
                        </pre>
                      </div>
                    )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

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
    </section>
  );
}
