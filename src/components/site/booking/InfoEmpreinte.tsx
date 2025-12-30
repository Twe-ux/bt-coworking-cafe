"use client";

import React from 'react';

interface InfoEmpreinteProps {
  type: 'manual_capture' | 'setup_intent';
  amount: number;
  daysUntilBooking: number;
}

export default function InfoEmpreinte({ type, amount, daysUntilBooking }: InfoEmpreinteProps) {
  const formatAmount = (cents: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(cents / 100);
  };

  return (
    <div className="alert alert-info mb-4">
      <div className="d-flex align-items-start">
        <i className="bi bi-info-circle fs-4 me-3"></i>
        <div>
          <h6 className="alert-heading mb-2">
            {type === 'manual_capture' ? 'Empreinte bancaire' : 'Enregistrement de carte'}
          </h6>

          {type === 'manual_capture' ? (
            <>
              <p className="mb-2" style={{ color: '#004085', fontSize: '0.95rem' }}>
                Une empreinte bancaire de <strong style={{ fontSize: '1.1rem' }}>{formatAmount(amount)}</strong> sera effectuée pour garantir votre réservation.
              </p>
              <ul className="mb-0 ps-3" style={{ color: '#004085' }}>
                <li>
                  <strong>Si vous vous présentez :</strong> L'empreinte sera <span className="text-success fw-bold">annulée automatiquement</span>
                </li>
                <li>
                  <strong>En cas de no-show :</strong> L'empreinte sera <span className="text-danger fw-bold">encaissée</span>
                </li>
              </ul>
            </>
          ) : (
            <>
              <p className="mb-2" style={{ color: '#004085', fontSize: '0.95rem' }}>
                Votre carte bancaire sera enregistrée de manière sécurisée pour cette réservation.
              </p>
              <ul className="mb-0 ps-3" style={{ color: '#004085' }}>
                <li>
                  Un paiement de <strong style={{ fontSize: '1.1rem' }}>{formatAmount(amount)}</strong> sera effectué <strong>7 jours avant</strong> votre réservation
                </li>
                <li>
                  Vous recevrez un email de confirmation avant le prélèvement
                </li>
                <li>
                  Vous pouvez annuler gratuitement jusqu'à 7 jours avant la date
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
