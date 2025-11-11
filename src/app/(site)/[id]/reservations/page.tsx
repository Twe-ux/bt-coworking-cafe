import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { options } from '@/app/api/auth/[...nextauth]/options';
import Link from 'next/link';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';

interface ReservationsPageProps {
  params: { id: string };
}

export default async function ReservationsPage({ params }: ReservationsPageProps) {
  const session = await getServerSession(options);

  // Check if user is authenticated
  if (!session) {
    redirect(`/auth/login?callbackUrl=/${params.id}/reservations`);
  }

  // Check if user has a username
  if (!session.user.username) {
    redirect('/auth/login');
  }

  // Security check: verify the URL username matches the logged-in user
  if (params.id !== session.user.username) {
    // Redirect to their own reservations
    redirect(`/${session.user.username}/reservations`);
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
              Réservations
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h1 className="section-title">Mes Réservations</h1>
            <p className="text-muted">Gérez toutes vos réservations d'espaces de coworking</p>
          </div>
          <Link href={`/${username}/reservations/new`} className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i>
            Nouvelle réservation
          </Link>
        </div>

        {/* Filters */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <select className="form-select">
                  <option value="">Tous les statuts</option>
                  <option value="upcoming">À venir</option>
                  <option value="active">En cours</option>
                  <option value="completed">Terminées</option>
                  <option value="cancelled">Annulées</option>
                </select>
              </div>
              <div className="col-md-4">
                <input
                  type="date"
                  className="form-control"
                  placeholder="Date de début"
                />
              </div>
              <div className="col-md-4">
                <input type="date" className="form-control" placeholder="Date de fin" />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="bi bi-calendar-check"></i>
              </div>
              <div className="stat-content">
                <h4 className="stat-value">0</h4>
                <p className="stat-label">Réservations actives</p>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="bi bi-clock-history"></i>
              </div>
              <div className="stat-content">
                <h4 className="stat-value">0</h4>
                <p className="stat-label">Heures réservées</p>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="bi bi-check-circle"></i>
              </div>
              <div className="stat-content">
                <h4 className="stat-value">0</h4>
                <p className="stat-label">Complétées</p>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="bi bi-x-circle"></i>
              </div>
              <div className="stat-content">
                <h4 className="stat-value">0</h4>
                <p className="stat-label">Annulées</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reservations List */}
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body p-0">
                {/* Empty State */}
                <div className="text-center py-5">
                  <div className="mb-4">
                    <i
                      className="bi bi-calendar-x"
                      style={{ fontSize: '4rem', color: '#6c757d' }}
                    ></i>
                  </div>
                  <h3 className="mb-3">Aucune réservation</h3>
                  <p className="text-muted mb-4">
                    Vous n'avez pas encore de réservation. Commencez par réserver un espace
                    de coworking.
                  </p>
                  <Link
                    href={`/${username}/reservations/new`}
                    className="btn btn-primary"
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Créer une réservation
                  </Link>
                </div>

                {/* Reservations Table (when data exists) */}
                {/* <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Espace</th>
                        <th>Durée</th>
                        <th>Prix</th>
                        <th>Statut</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      // Reservation rows will go here
                    </tbody>
                  </table>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
