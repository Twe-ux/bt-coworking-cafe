"use client";

import { useEffect, useState } from "react";
import PageTitle from "@/components/site/pageTitle";
import BookingProgressBar from "@/components/site/booking/BookingProgressBar";
import Link from "next/link";
import BookingHelper from "@/components/site/booking/BookingHelper";

interface SpaceConfig {
  spaceType: string;
  name: string;
  slug: string;
  description?: string;
  pricing: {
    hourly: number;
    daily: number;
    weekly: number;
    monthly: number;
    perPerson: boolean;
  };
  availableReservationTypes: {
    hourly: boolean;
    daily: boolean;
    weekly: boolean;
    monthly: boolean;
  };
  requiresQuote: boolean;
  minCapacity: number;
  maxCapacity: number;
  imageUrl?: string;
  displayOrder: number;
}

interface DisplaySpace {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  image: string;
  capacity: string;
  features: string[];
  priceFrom: string;
  requiresQuote: boolean;
}

// Mapping DB spaceType to URL slug
const spaceTypeToSlug: Record<string, string> = {
  "open-space": "open-space",
  "salle-verriere": "meeting-room-glass",
  "salle-etage": "meeting-room-floor",
  "evenementiel": "event-space",
};

// Static display data (icons, features, etc.)
const spaceDisplayData: Record<string, Partial<DisplaySpace>> = {
  "open-space": {
    title: "Place",
    subtitle: "Open-space",
    icon: "bi-person-workspace",
    features: ["WiFi", "Café", "Imprimante"],
  },
  "salle-verriere": {
    title: "Salle de réunion",
    subtitle: "Verrière",
    icon: "bi-briefcase",
    features: ["Écran", "WiFi", "Tableau blanc"],
  },
  "salle-etage": {
    title: "Salle de réunion",
    subtitle: "Étage",
    icon: "bi-building",
    features: ["Projecteur", "WiFi", "Climatisation"],
  },
  "evenementiel": {
    title: "Événementiel",
    subtitle: "Grand espace",
    icon: "bi-calendar-event",
    features: ["Sonorisation", "Vidéoprojecteur", "Traiteur possible"],
  },
};

export default function BookingPage() {
  const [spaces, setSpaces] = useState<DisplaySpace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const response = await fetch("/api/space-configurations");
        const data = await response.json();

        if (data.success) {
          const displaySpaces = data.data.map((config: SpaceConfig) => {
            const displayData = spaceDisplayData[config.spaceType] || {};
            const urlSlug = spaceTypeToSlug[config.spaceType] || config.slug;

            // Determine price display
            let priceFrom = "Sur devis";
            if (!config.requiresQuote) {
              const lowestPrice = config.pricing.hourly > 0 ? config.pricing.hourly : config.pricing.daily;
              priceFrom = lowestPrice > 0 ? `${lowestPrice}€/h` : "Sur devis";
            }

            // Format capacity
            const capacity =
              config.minCapacity === config.maxCapacity
                ? `${config.minCapacity} personne${config.minCapacity > 1 ? "s" : ""}`
                : config.maxCapacity > 50
                ? `Jusqu'à ${config.maxCapacity} personnes`
                : `${config.minCapacity}-${config.maxCapacity} personnes`;

            return {
              id: urlSlug,
              title: displayData.title || config.name,
              subtitle: displayData.subtitle || "",
              description: config.description || displayData.description || "",
              icon: displayData.icon || "bi-building",
              image: config.imageUrl || `/images/spaces/${config.slug}.jpg`,
              capacity,
              features: displayData.features || [],
              priceFrom,
              requiresQuote: config.requiresQuote,
            };
          });

          setSpaces(displaySpaces);
        }
      } catch (error) {
        console.error("Error fetching spaces:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpaces();
  }, []);

  if (loading) {
    return (
      <>
        <PageTitle title="Réserver un espace" currentPage="Réservation" />
        <section className="booking-selection py-5">
          <div className="container">
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
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
            {spaces.map((space) => (
              <div key={space.id} className="col-lg-3 col-md-6">
                <Link
                  href={space.requiresQuote ? "/contact" : `/booking/${space.id}/new`}
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
                          <span>{space.requiresQuote ? "Demander un devis" : "Réserver"}</span>
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
