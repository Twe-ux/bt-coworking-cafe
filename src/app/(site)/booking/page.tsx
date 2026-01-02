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
  features?: string[];
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

// Static display data (icons only - features come from DB)
const spaceDisplayData: Record<string, Partial<DisplaySpace>> = {
  "open-space": {
    title: "Place",
    subtitle: "Open-space",
    icon: "bi-person-workspace",
  },
  "salle-verriere": {
    title: "Salle de réunion",
    subtitle: "Verrière",
    icon: "bi-briefcase",
  },
  "salle-etage": {
    title: "Salle de réunion",
    subtitle: "Étage",
    icon: "bi-building",
  },
  "evenementiel": {
    title: "Événementiel",
    subtitle: "Grand espace",
    icon: "bi-calendar-event",
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
              features: config.features || [],
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
        <PageTitle title="Réserver un espace" />
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
      <PageTitle title="Réserver un espace" />

      <section className="booking-selection py-5">
        <div className="container">
          {/* Progress Bar */}
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8">
              <BookingProgressBar currentStep={1} />

              {/* Page Title */}
              <div className="text-center mb-4 mt-4">
                <h2 className="mb-2" style={{ fontSize: "1.35rem" }}>
                  Quel espace souhaitez-vous réserver ?
                </h2>
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                  Sélectionnez le type d'espace qui correspond à vos besoins
                </p>
              </div>
            </div>
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
    </>
  );
}
