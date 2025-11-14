'use client';

import PageTitle from '@/components/site/pageTitle';
import BookingProgressBar from '@/components/site/booking/BookingProgressBar';
import Link from 'next/link';

const spaceTypes = [
  {
    id: 'open-space',
    title: 'Place',
    subtitle: 'Open-space',
    description: 'Bureau dans un espace partagé et convivial',
    icon: 'bi-person-workspace',
    image: '/images/spaces/open-space.jpg',
    capacity: '1 personne',
    features: ['WiFi', 'Café', 'Imprimante'],
    priceFrom: '10€/h',
  },
  {
    id: 'meeting-room-glass',
    title: 'Salle de réunion',
    subtitle: 'Verrière',
    description: 'Salle lumineuse avec verrière pour vos réunions',
    icon: 'bi-briefcase',
    image: '/images/spaces/meeting-glass.jpg',
    capacity: '2-8 personnes',
    features: ['Écran', 'WiFi', 'Tableau blanc'],
    priceFrom: '40€/h',
  },
  {
    id: 'meeting-room-floor',
    title: 'Salle de réunion',
    subtitle: 'Étage',
    description: 'Salle privée à l\'étage, calme et équipée',
    icon: 'bi-building',
    image: '/images/spaces/meeting-floor.jpg',
    capacity: '4-12 personnes',
    features: ['Projecteur', 'WiFi', 'Climatisation'],
    priceFrom: '50€/h',
  },
  {
    id: 'event-space',
    title: 'Événementiel',
    subtitle: 'Grand espace',
    description: 'Espace modulable pour vos événements et conférences',
    icon: 'bi-calendar-event',
    image: '/images/spaces/event.jpg',
    capacity: 'Jusqu\'à 50 personnes',
    features: ['Sonorisation', 'Vidéoprojecteur', 'Traiteur possible'],
    priceFrom: '200€/h',
  },
];

export default function BookingPage() {
  return (
    <>
      <PageTitle title="Réserver un espace" currentPage="Réservation" />

      <section className="booking-selection py-5">
        <div className="container">
          {/* Progress Bar */}
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8">
              <BookingProgressBar currentStep={1} />
            </div>
          </div>

          {/* Page Title */}
          <div className="text-center mb-5">
            <h2 className="mb-3">Quel espace souhaitez-vous réserver ?</h2>
            <p className="text-muted">
              Sélectionnez le type d'espace qui correspond à vos besoins
            </p>
          </div>

          {/* Space Type Cards */}
          <div className="row g-4 justify-content-center">
            {spaceTypes.map((space) => (
              <div key={space.id} className="col-lg-6 col-md-6">
                <Link
                  href={`/booking/${space.id}/new`}
                  className="text-decoration-none"
                >
                  <div className="space-card h-100">
                    <div className="card-image-container">
                      {space.image ? (
                        <img
                          src={space.image}
                          alt={space.title}
                          className="space-image"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove(
                              'd-none'
                            );
                          }}
                        />
                      ) : null}
                      <div
                        className={`space-icon-placeholder ${
                          space.image ? 'd-none' : ''
                        }`}
                      >
                        <i className={space.icon}></i>
                      </div>
                      <div className="card-overlay">
                        <div className="overlay-content">
                          <i className="bi bi-arrow-right-circle"></i>
                          <span>Réserver</span>
                        </div>
                      </div>
                    </div>

                    <div className="card-content">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h3 className="card-title mb-0">{space.title}</h3>
                          <p className="card-subtitle text-muted">
                            {space.subtitle}
                          </p>
                        </div>
                        <span className="price-badge">{space.priceFrom}</span>
                      </div>

                      <p className="card-description">{space.description}</p>

                      <div className="card-meta">
                        <div className="meta-item">
                          <i className="bi bi-people me-2"></i>
                          <span>{space.capacity}</span>
                        </div>
                        <div className="features-list">
                          {space.features.map((feature, index) => (
                            <span key={index} className="feature-badge">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Help Section */}
          <div className="row justify-content-center mt-5">
            <div className="col-lg-8">
              <div className="help-card text-center">
                <i className="bi bi-question-circle help-icon"></i>
                <h5 className="mb-2">Besoin d'aide pour choisir ?</h5>
                <p className="text-muted mb-3">
                  Notre équipe est à votre disposition pour vous conseiller
                </p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <a href="tel:+33123456789" className="btn btn-outline-primary">
                    <i className="bi bi-telephone me-2"></i>
                    Appelez-nous
                  </a>
                  <a href="mailto:contact@btcafe.com" className="btn btn-outline-primary">
                    <i className="bi bi-envelope me-2"></i>
                    Écrivez-nous
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .booking-selection {
          background-color: #f8f9fa;
          min-height: 70vh;
        }

        .space-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          cursor: pointer;
        }

        .space-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .card-image-container {
          position: relative;
          height: 240px;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .space-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .space-card:hover .space-image {
          transform: scale(1.05);
        }

        .space-icon-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 4rem;
        }

        .card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(92, 184, 92, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .space-card:hover .card-overlay {
          opacity: 1;
        }

        .overlay-content {
          color: white;
          text-align: center;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .overlay-content i {
          font-size: 3rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        .card-content {
          padding: 1.5rem;
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 0.25rem;
        }

        .card-subtitle {
          font-size: 0.95rem;
          margin-bottom: 0;
        }

        .price-badge {
          background: #5cb85c;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .card-description {
          color: #666;
          font-size: 0.95rem;
          margin: 1rem 0;
          line-height: 1.6;
        }

        .card-meta {
          border-top: 1px solid #eee;
          padding-top: 1rem;
        }

        .meta-item {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
          font-weight: 500;
        }

        .features-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .feature-badge {
          background: #f0f0f0;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          color: #666;
        }

        .help-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .help-icon {
          font-size: 3rem;
          color: #5cb85c;
          margin-bottom: 1rem;
        }

        @media (max-width: 768px) {
          .card-image-container {
            height: 180px;
          }

          .card-title {
            font-size: 1.25rem;
          }

          .space-icon-placeholder {
            font-size: 3rem;
          }
        }
      `}</style>
    </>
  );
}
