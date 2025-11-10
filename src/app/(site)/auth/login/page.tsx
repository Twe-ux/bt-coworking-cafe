'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import './auth.scss';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        // Redirect will be handled by middleware based on role
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Une erreur est survenue lors de la connexion');
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-section py__130">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="auth-card">
              <div className="auth-header text-center mb-4">
                <h2 className="auth-title">Connexion</h2>
                <p className="auth-subtitle">
                  Connectez-vous à votre espace personnel
                </p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="mb-4">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control auth-input"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-control auth-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="remember"
                    />
                    <label className="form-check-label" htmlFor="remember">
                      Se souvenir de moi
                    </label>
                  </div>
                  <Link
                    href="/auth/forgot-password"
                    className="auth-link"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="btn auth-btn w-100"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Connexion...
                    </>
                  ) : (
                    'Se connecter'
                  )}
                </button>
              </form>

              <div className="auth-footer text-center mt-4">
                <p>
                  Vous n'avez pas de compte ?{' '}
                  <Link href="/auth/register" className="auth-link fw-bold">
                    Créer un compte
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
