import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { options } from '@/app/api/auth/[...nextauth]/options';
import Link from 'next/link';
import './client-dashboard.scss';

export default async function ClientDashboard() {
  const session = await getServerSession(options);

  if (!session) {
    redirect('/auth/login?callbackUrl=/id');
  }

  return (
    <section className="client-dashboard py__130">
      <div className="container">
        {/* Welcome Section */}
        <div className="welcome-card mb-5">
          <h1 className="welcome-title">
            Bonjour, {session.user.name} ! 👋
          </h1>
          <p className="welcome-text">
            Bienvenue dans votre espace personnel
          </p>
        </div>

        {/* Quick Actions */}
        <div className="row mb-5">
          <div className="col-12">
            <h2 className="section-title">Actions rapides</h2>
          </div>

          <div className="col-md-4 mb-4">
            <Link href="/id/reservations" className="action-card">
              <div className="action-icon">
                <i className="bi bi-calendar-check"></i>
              </div>
              <h3 className="action-title">Mes réservations</h3>
              <p className="action-description">
                Voir et gérer vos réservations
              </p>
            </Link>
          </div>

          <div className="col-md-4 mb-4">
            <Link href="/id/reservations/new" className="action-card">
              <div className="action-icon">
                <i className="bi bi-plus-circle"></i>
              </div>
              <h3 className="action-title">Nouvelle réservation</h3>
              <p className="action-description">
                Réserver un espace de coworking
              </p>
            </Link>
          </div>

          <div className="col-md-4 mb-4">
            <Link href="/id/profile" className="action-card">
              <div className="action-icon">
                <i className="bi bi-person"></i>
              </div>
              <h3 className="action-title">Mon profil</h3>
              <p className="action-description">
                Gérer vos informations personnelles
              </p>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="row">
          <div className="col-12">
            <h2 className="section-title">Statistiques</h2>
          </div>

          <div className="col-md-4 mb-4">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="bi bi-calendar-event"></i>
              </div>
              <div className="stat-content">
                <h4 className="stat-value">0</h4>
                <p className="stat-label">Réservations actives</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
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

          <div className="col-md-4 mb-4">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="bi bi-check-circle"></i>
              </div>
              <div className="stat-content">
                <h4 className="stat-value">0</h4>
                <p className="stat-label">Réservations complétées</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
