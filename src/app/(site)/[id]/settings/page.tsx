import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { options } from '@/lib/auth-options';
import Link from 'next/link';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';

interface SettingsPageProps {
  params: { id: string };
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const session = await getServerSession(options);

  // Check if user is authenticated
  if (!session) {
    redirect(`/auth/login?callbackUrl=/${params.id}/settings`);
  }

  // Check if user has a username
  if (!session.user.username) {
    redirect('/auth/login');
  }

  // Security check: verify the URL username matches the logged-in user
  if (params.id !== session.user.username) {
    // Redirect to their own settings
    redirect(`/${session.user.username}/settings`);
  }

  const username = session.user.username;

  return (
    <section className="client-dashboard py__130">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href={`/${username}`}>Dashboard</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Paramètres
            </li>
          </ol>
        </nav>

        {/* Page Title */}
        <div className="mb-5">
          <h1 className="section-title">Paramètres</h1>
          <p className="text-muted">Gérez vos préférences et paramètres de compte</p>
        </div>

        <div className="row">
          <div className="col-lg-8">
            {/* Notification Settings */}
            <div className="card shadow-sm mb-4">
              <div className="card-body p-4">
                <h3 className="mb-4">Notifications</h3>

                <form>
                  <div className="mb-3 form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="emailNotifications"
                      defaultChecked
                    />
                    <label className="form-check-label" htmlFor="emailNotifications">
                      Recevoir les notifications par email
                    </label>
                  </div>

                  <div className="mb-3 form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="reservationReminders"
                      defaultChecked
                    />
                    <label className="form-check-label" htmlFor="reservationReminders">
                      Rappels de réservation
                    </label>
                  </div>

                  <div className="mb-3 form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="promotionalEmails"
                    />
                    <label className="form-check-label" htmlFor="promotionalEmails">
                      Recevoir les offres promotionnelles
                    </label>
                  </div>

                  <div className="mb-3 form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="newsletter"
                    />
                    <label className="form-check-label" htmlFor="newsletter">
                      Newsletter mensuelle
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Enregistrer les préférences
                  </button>
                </form>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="card shadow-sm mb-4">
              <div className="card-body p-4">
                <h3 className="mb-4">Confidentialité</h3>

                <form>
                  <div className="mb-3 form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="profilePublic"
                    />
                    <label className="form-check-label" htmlFor="profilePublic">
                      Profil public
                    </label>
                    <small className="d-block text-muted">
                      Permettre aux autres utilisateurs de voir votre profil
                    </small>
                  </div>

                  <div className="mb-3 form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="showEmail"
                    />
                    <label className="form-check-label" htmlFor="showEmail">
                      Afficher mon email
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Enregistrer les paramètres
                  </button>
                </form>
              </div>
            </div>

            {/* Language & Region */}
            <div className="card shadow-sm mb-4">
              <div className="card-body p-4">
                <h3 className="mb-4">Langue et région</h3>

                <form>
                  <div className="mb-3">
                    <label htmlFor="language" className="form-label">
                      Langue
                    </label>
                    <select className="form-select" id="language">
                      <option value="fr" selected>
                        Français
                      </option>
                      <option value="en">English</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="timezone" className="form-label">
                      Fuseau horaire
                    </label>
                    <select className="form-select" id="timezone">
                      <option value="Europe/Paris" selected>
                        Europe/Paris (GMT+1)
                      </option>
                      <option value="Europe/London">Europe/London (GMT+0)</option>
                      <option value="America/New_York">America/New York (GMT-5)</option>
                    </select>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Enregistrer
                  </button>
                </form>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="card shadow-sm border-danger mb-4">
              <div className="card-body p-4">
                <h3 className="mb-4 text-danger">Zone de danger</h3>

                <div className="mb-3">
                  <h5>Supprimer le compte</h5>
                  <p className="text-muted">
                    Une fois votre compte supprimé, toutes vos données seront définitivement
                    effacées. Cette action est irréversible.
                  </p>
                  <button type="button" className="btn btn-danger">
                    Supprimer mon compte
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            {/* Quick Info */}
            <div className="card shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="mb-3">Informations du compte</h5>
                <div className="mb-2">
                  <small className="text-muted">Nom d'utilisateur</small>
                  <p className="mb-0">@{username}</p>
                </div>
                <div className="mb-2">
                  <small className="text-muted">Email</small>
                  <p className="mb-0">{session.user.email}</p>
                </div>
                <div className="mb-2">
                  <small className="text-muted">Rôle</small>
                  <p className="mb-0">
                    <span className="badge bg-primary">{session.user.role.name}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <h5 className="mb-3">Actions rapides</h5>
                <div className="d-grid gap-2">
                  <Link href={`/${username}`} className="btn btn-outline-primary">
                    <i className="bi bi-house me-2"></i>
                    Dashboard
                  </Link>
                  <Link href={`/${username}/profile`} className="btn btn-outline-primary">
                    <i className="bi bi-person me-2"></i>
                    Mon profil
                  </Link>
                  <Link
                    href={`/${username}/reservations`}
                    className="btn btn-outline-primary"
                  >
                    <i className="bi bi-calendar-check me-2"></i>
                    Réservations
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
