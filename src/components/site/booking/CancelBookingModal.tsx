"use client";

import { useState } from "react";
import { Alert, Button, Modal, Spinner } from "react-bootstrap";

interface Booking {
  _id: string;
  spaceType: string;
  date: string;
  startTime?: string;
  endTime?: string;
  totalPrice: number;
  status: string;
  confirmationNumber?: string;
  space?: {
    name: string;
  };
}

interface CancelBookingModalProps {
  booking: Booking | null;
  show: boolean;
  onHide: () => void;
  onCancelled?: () => void;
}

interface CancellationPreview {
  daysUntilBooking: number;
  chargePercentage: number;
  cancellationFee: number;
  refundAmount: number;
  message: string;
}

export default function CancelBookingModal({
  booking,
  show,
  onHide,
  onCancelled,
}: CancelBookingModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [preview, setPreview] = useState<CancellationPreview | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Load cancellation preview when modal opens
  const loadCancellationPreview = async () => {
    if (!booking) return;

    setLoadingPreview(true);
    setError(null);

    try {
      // For pending bookings, cancellation is always free - no need to calculate
      if (booking.status === "pending") {
        setPreview({
          daysUntilBooking: 0,
          chargePercentage: 0,
          cancellationFee: 0,
          refundAmount: 0,
          message:
            "Annulation gratuite. Votre réservation n'a pas encore été validée par le commerce. L'empreinte bancaire sera automatiquement annulée.",
        });
        setLoadingPreview(false);
        return;
      }

      // For confirmed bookings, fetch real cancellation policy from public API
      const policyResponse = await fetch(`/api/cancellation-policy?spaceType=${booking.spaceType}`);
      const policyData = await policyResponse.json();

      if (!policyData.success) {
        throw new Error("Impossible de récupérer les conditions d'annulation");
      }

      const policy = policyData.data.cancellationPolicy;

      // Calculate days until booking
      const bookingDate = new Date(booking.date);
      const now = new Date();
      const daysUntilBooking = Math.ceil(
        (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Determine charge percentage based on real policy
      let chargePercentage = 100;
      const sortedTiers = [...policy.tiers].sort(
        (a, b) => b.daysBeforeBooking - a.daysBeforeBooking
      );

      for (const tier of sortedTiers) {
        if (daysUntilBooking >= tier.daysBeforeBooking) {
          chargePercentage = tier.chargePercentage;
          break;
        }
      }

      const cancellationFee = (booking.totalPrice * chargePercentage) / 100;
      const refundAmount = booking.totalPrice - cancellationFee;

      let message = "";
      if (chargePercentage === 0) {
        message =
          "<strong>Aucun frais appliqué.</strong> Le montant total sera <strong>remboursé intégralement</strong>.";
      } else if (chargePercentage === 100) {
        message = `<strong>Annulation tardive.</strong> Le montant total de <strong>${booking.totalPrice.toFixed(
          2
        )}€</strong> sera <strong>prélevé</strong>.`;
      } else {
        message = `Selon nos conditions de vente, <strong>${cancellationFee.toFixed(
          2
        )}€</strong> sera <strong>prélevé</strong> (${chargePercentage}% du montant total).`;
      }

      setPreview({
        daysUntilBooking,
        chargePercentage,
        cancellationFee,
        refundAmount,
        message,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors du calcul des frais"
      );
    } finally {
      setLoadingPreview(false);
    }
  };

  // Handle modal show
  const handleShow = () => {
    setSuccess(null);
    setError(null);
    setPreview(null);
    loadCancellationPreview();
  };

  // Handle cancellation
  const handleCancel = async () => {
    if (!booking) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/bookings/${booking._id}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to cancel booking");
      }

      setSuccess(data.data.cancellationMessage);

      // Call onCancelled callback after short delay
      setTimeout(() => {
        if (onCancelled) onCancelled();
        onHide();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return null;

  const spaceName = booking.space?.name || booking.spaceType;
  const bookingDate = new Date(booking.date).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Modal
      show={show}
      onHide={onHide}
      onShow={handleShow}
      centered
      backdrop="static"
    >
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="text-white">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Annuler la réservation
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success">
            <i className="bi bi-check-circle-fill me-2"></i>
            {success}
          </Alert>
        )}

        {!success && (
          <>
            <div className="mb-4">
              <h6 className="text-muted mb-3">Détails de la réservation</h6>
              <div className="bg-light p-3 rounded">
                <p className="text-muted mb-2">
                  <strong>Espace :</strong> {spaceName}
                </p>
                <p className="text-muted mb-2">
                  <strong>Date :</strong> {bookingDate}
                </p>
                {booking.startTime && booking.endTime && (
                  <p className="text-muted mb-2">
                    <strong>Horaire :</strong> {booking.startTime} -{" "}
                    {booking.endTime}
                  </p>
                )}
                <p className="text-muted mb-0">
                  <strong>Montant :</strong> {booking.totalPrice.toFixed(2)}€
                </p>
              </div>
            </div>

            {loadingPreview && (
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Calcul des frais...</p>
              </div>
            )}

            {preview && !loadingPreview && (
              <>
                <div className="mb-4">
                  <h6 className="text-muted mb-3">Conditions d'annulation</h6>
                  <div
                    className={`p-3 rounded border-start border-4 ${
                      preview.chargePercentage === 0
                        ? "bg-success bg-opacity-10 border-success"
                        : preview.chargePercentage === 100
                        ? "bg-danger bg-opacity-10 border-danger"
                        : "bg-warning bg-opacity-10 border-warning"
                    }`}
                  >
                    {booking.status === "pending" ? (
                      // For pending bookings, show only the message
                      <p className="text-muted mb-0">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        <span
                          dangerouslySetInnerHTML={{ __html: preview.message }}
                        />
                      </p>
                    ) : (
                      // For confirmed bookings, show details
                      <>
                        <p className="text-muted mb-2">
                          <strong>Empreinte bancaire :</strong>{" "}
                          {booking.totalPrice.toFixed(2)}€
                        </p>
                        <p className="text-muted mb-2">
                          <strong>Temps restant :</strong>{" "}
                          {preview.daysUntilBooking} jour
                          {preview.daysUntilBooking > 1 ? "s" : ""}
                        </p>
                        {preview.cancellationFee > 0 && (
                          <p className="text-muted mb-2">
                            <strong>Montant prélevé :</strong>{" "}
                            {preview.cancellationFee.toFixed(2)}€ (
                            {preview.chargePercentage}%)
                          </p>
                        )}
                        {preview.refundAmount > 0 && (
                          <p className="text-muted mb-2">
                            <strong>Montant non prélevé :</strong>{" "}
                            {preview.refundAmount.toFixed(2)}€
                          </p>
                        )}
                        <p className="text-muted mb-0 mt-3">
                          <i
                            className={`bi ${
                              preview.chargePercentage === 0
                                ? "bi-check-circle-fill text-success"
                                : preview.chargePercentage === 100
                                ? "bi-exclamation-circle-fill text-danger"
                                : "bi-info-circle-fill text-warning"
                            } me-2`}
                          ></i>
                          <span
                            dangerouslySetInnerHTML={{ __html: preview.message }}
                          />
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <Alert variant="warning" className="mb-0">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <strong>Attention :</strong> Cette action est irréversible.
                  Êtes-vous sûr de vouloir annuler cette réservation ?
                </Alert>
              </>
            )}
          </>
        )}
      </Modal.Body>

      {!success && (
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Retour
          </Button>
          <Button
            variant="danger"
            onClick={handleCancel}
            disabled={loading || loadingPreview || !preview}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Annulation...
              </>
            ) : (
              <>
                <i className="bi bi-x-circle me-2"></i>
                Confirmer l'annulation
              </>
            )}
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
}
