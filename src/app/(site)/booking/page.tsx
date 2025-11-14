"use client";

import PageTitle from "@/components/site/pageTitle";
import BookingProgressBar from "@/components/site/booking/BookingProgressBar";
import Link from "next/link";
import BookingHelper from "@/components/site/booking/BookingHelper";

const spaceTypes = [
  {
    id: "open-space",
    title: "Place",
    subtitle: "Open-space",
    description: "Bureau dans un espace partagé et convivial",
    icon: "bi-person-workspace",
    image: "/images/spaces/open-space.jpg",
    capacity: "1 personne",
    features: ["WiFi", "Café", "Imprimante"],
    priceFrom: "10€/h",
  },
  {
    id: "meeting-room-glass",
    title: "Salle de réunion",
    subtitle: "Verrière",
    description: "Salle lumineuse avec verrière pour vos réunions",
    icon: "bi-briefcase",
    image: "/images/spaces/meeting-glass.jpg",
    capacity: "2-8 personnes",
    features: ["Écran", "WiFi", "Tableau blanc"],
    priceFrom: "40€/h",
  },
  {
    id: "meeting-room-floor",
    title: "Salle de réunion",
    subtitle: "Étage",
    description: "Salle privée à l'étage, calme et équipée",
    icon: "bi-building",
    image: "/images/spaces/meeting-floor.jpg",
    capacity: "4-12 personnes",
    features: ["Projecteur", "WiFi", "Climatisation"],
    priceFrom: "50€/h",
  },
  {
    id: "event-space",
    title: "Événementiel",
    subtitle: "Grand espace",
    description: "Espace modulable pour vos événements et conférences",
    icon: "bi-calendar-event",
    image: "/images/spaces/event.jpg",
    capacity: "Jusqu'à 50 personnes",
    features: ["Sonorisation", "Vidéoprojecteur", "Traiteur possible"],
    priceFrom: "200€/h",
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
          <div className="text-center mb-4">
            <h2 className="mb-2" style={{ fontSize: "1.75rem" }}>
              Quel espace souhaitez-vous réserver ?
            </h2>
            <p className="text-muted" style={{ fontSize: "0.95rem" }}>
              Sélectionnez le type d'espace qui correspond à vos besoins
            </p>
          </div>

          {/* Space Type Cards */}
          <div className="row g-4 justify-content-center">
            {spaceTypes.map((space) => (
              <div key={space.id} className="col-lg-3 col-md-6">
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
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextElementSibling?.classList.remove(
                              "d-none"
                            );
                          }}
                        />
                      ) : null}
                      <div
                        className={`space-icon-placeholder ${
                          space.image ? "d-none" : ""
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
        </div>
      </section>

      <style jsx>{`
        .booking-selection {
          background-color: #f8f9fa;
          min-height: 60vh;
          padding: 2.5rem 0 !important;
        }

        .space-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
          cursor: pointer;
        }

        .space-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        }

        .card-image-container {
          position: relative;
          height: 180px;
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
          font-size: 3rem;
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
          font-size: 1rem;
          font-weight: 600;
        }

        .overlay-content i {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        .card-content {
          padding: 1.25rem;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 0.25rem;
        }

        .card-subtitle {
          font-size: 0.85rem;
          margin-bottom: 0;
        }

        .price-badge {
          background: #417972;
          color: white;
          padding: 0.4rem 0.85rem;
          border-radius: 16px;
          font-weight: 600;
          font-size: 0.85rem;
        }

        .card-description {
          color: #666;
          font-size: 0.875rem;
          margin: 0.85rem 0;
          line-height: 1.5;
        }

        .card-meta {
          border-top: 1px solid #eee;
          padding-top: 0.85rem;
        }

        .meta-item {
          color: #666;
          font-size: 0.85rem;
          margin-bottom: 0.65rem;
          font-weight: 500;
        }

        .features-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .feature-badge {
          background: #f0f0f0;
          padding: 0.2rem 0.65rem;
          border-radius: 10px;
          font-size: 0.75rem;
          color: #666;
        }

        @media (max-width: 768px) {
          .card-image-container {
            height: 150px;
          }

          .card-title {
            font-size: 1.1rem;
          }

          .space-icon-placeholder {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </>
  );
}
