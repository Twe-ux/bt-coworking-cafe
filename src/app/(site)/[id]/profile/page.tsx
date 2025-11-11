import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { options } from '@/lib/auth-options';
import Link from 'next/link';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';

interface ProfilePageProps {
  params: { id: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const session = await getServerSession(options);

  // Check if user is authenticated
  if (!session) {
    redirect(`/auth/login?callbackUrl=/${params.id}/profile`);
  }

  // Check if user has a username
  if (!session.user.username) {
    redirect('/auth/login');
  }

  // Security check: verify the URL username matches the logged-in user
  if (params.id !== session.user.username) {
    // Redirect to their own profile
    redirect(`/${session.user.username}/profile`);
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
              Profil
            </li>
          </ol>
        </nav>

        {/* Page Title */}
        <div className="mb-5">
          <h1 className="section-title">Mon Profil</h1>
          <p className="text-muted">Gérez vos informations personnelles</p>
        </div>

        {/* Profile Form */}
        <div className="row">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <h3 className="mb-4">Informations personnelles</h3>

                <form>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      defaultValue={session.user.name || ''}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Nom d'utilisateur
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      defaultValue={username}
                      disabled
                    />
                    <small className="text-muted">
                      Le nom d'utilisateur ne peut pas être modifié
                    </small>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      defaultValue={session.user.email || ''}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">
                      Rôle
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="role"
                      defaultValue={session.user.role.name}
                      disabled
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                      Enregistrer les modifications
                    </button>
                    <Link href={`/${username}`} className="btn btn-secondary">
                      Annuler
                    </Link>
                  </div>
                </form>
              </div>
            </div>

            {/* Change Password Section */}
            <div className="card shadow-sm mt-4">
              <div className="card-body p-4">
                <h3 className="mb-4">Changer le mot de passe</h3>

                <form>
                  <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">
                      Mot de passe actuel
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="currentPassword"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Changer le mot de passe
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            {/* Profile Card */}
            <div className="card shadow-sm">
              <div className="card-body p-4 text-center">
                <div className="mb-3">
                  <div
                    className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
                    style={{ width: '100px', height: '100px', fontSize: '2rem' }}
                  >
                    {session.user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>
                <h4>{session.user.name}</h4>
                <p className="text-muted mb-1">@{username}</p>
                <p className="text-muted">{session.user.email}</p>
                <span className="badge bg-primary">{session.user.role.name}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card shadow-sm mt-4">
              <div className="card-body p-4">
                <h5 className="mb-3">Actions rapides</h5>
                <div className="d-grid gap-2">
                  <Link href={`/${username}`} className="btn btn-outline-primary">
                    <i className="bi bi-house me-2"></i>
                    Dashboard
                  </Link>
                  <Link
                    href={`/${username}/reservations`}
                    className="btn btn-outline-primary"
                  >
                    <i className="bi bi-calendar-check me-2"></i>
                    Réservations
                  </Link>
                  <Link
                    href={`/${username}/settings`}
                    className="btn btn-outline-primary"
                  >
                    <i className="bi bi-gear me-2"></i>
                    Paramètres
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
