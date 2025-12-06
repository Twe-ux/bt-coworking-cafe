'use client';

import { useState } from 'react';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Special handling for already subscribed
        if (data.alreadySubscribed) {
          setStatus('error');
          setMessage(data.error || 'Tu es déjà inscrit(e) à la newsletter !');
        } else {
          throw new Error(data.error || 'Erreur lors de l\'inscription');
        }
        return;
      }

      setStatus('success');
      setMessage(data.message || 'Merci ! Tu es maintenant inscrit(e) à notre newsletter.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(
        error instanceof Error ? error.message : 'Une erreur est survenue'
      );
    }
  };

  return (
    <div className="subscribe">
      <div className="row justify-content-center">
        <div className="d-flex gap-2 flex-column mb-4 align-items-center">
          <h2>Abonne-toi à notre newsletter</h2>
          <p>
            Reçois une fois par mois toutes les actus, événements et promotions
            en cours...
          </p>
        </div>

        <form onSubmit={handleSubmit} className="d-flex gap-3 justify-content-center flex-column align-items-center">
          <div className="d-flex gap-3 justify-content-center">
            <input
              className="input__btn"
              type="email"
              placeholder="Ton Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === 'loading'}
            />
            <button
              className="common__btn"
              type="submit"
              disabled={status === 'loading'}
            >
              <span>
                {status === 'loading' ? 'Inscription...' : 'Rejoins-nous !'}
              </span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          {message && (
            <div
              className={`alert ${
                status === 'success' ? 'alert-success' : 'alert-danger'
              } mt-2`}
              role="alert"
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
