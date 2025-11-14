'use client';

import { useState, useEffect } from 'react';
import PageTitle from '@/components/site/pageTitle';
import Link from 'next/link';

interface Space {
  _id: string;
  name: string;
  slug: string;
  description: string;
  type: string;
  capacity: number;
  pricing: {
    hourly?: number;
    daily?: number;
    weekly?: number;
    monthly?: number;
  };
  amenities: string[];
  featuredImage?: string;
  isActive: boolean;
}

const BookingPage = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    minCapacity: '',
    maxCapacity: '',
    search: '',
  });

  useEffect(() => {
    fetchSpaces();
  }, [filters]);

  const fetchSpaces = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.minCapacity) params.append('minCapacity', filters.minCapacity);
      if (filters.maxCapacity) params.append('maxCapacity', filters.maxCapacity);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/spaces?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setSpaces(data.data);
      }
    } catch (error) {
      console.error('Error fetching spaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMinPrice = (pricing: Space['pricing']) => {
    const prices = [pricing.hourly, pricing.daily, pricing.weekly, pricing.monthly].filter(Boolean) as number[];
    return prices.length > 0 ? Math.min(...prices) : 0;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'desk': 'Bureau',
      'meeting-room': 'Salle de réunion',
      'private-office': 'Bureau privé',
      'event-space': 'Espace événement',
    };
    return labels[type] || type;
  };

  return (
    <>
      <PageTitle title="Réservation d'espaces" currentPage="Réservation" />

      <section className="booking-spaces py__130">
        <div className="container">
          {/* Filters */}
          <div className="row mb-5">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-4">Filtres de recherche</h5>
                  <div className="row g-3">
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Rechercher..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      />
                    </div>
                    <div className="col-md-3">
                      <select
                        className="form-select"
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                      >
                        <option value="">Tous les types</option>
                        <option value="desk">Bureau</option>
                        <option value="meeting-room">Salle de réunion</option>
                        <option value="private-office">Bureau privé</option>
                        <option value="event-space">Espace événement</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Capacité min"
                        value={filters.minCapacity}
                        onChange={(e) => setFilters({ ...filters, minCapacity: e.target.value })}
                      />
                    </div>
                    <div className="col-md-3">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Capacité max"
                        value={filters.maxCapacity}
                        onChange={(e) => setFilters({ ...filters, maxCapacity: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Spaces Grid */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : spaces.length === 0 ? (
            <div className="alert alert-info text-center">
              Aucun espace disponible pour les critères sélectionnés.
            </div>
          ) : (
            <div className="row g-4">
              {spaces.map((space) => (
                <div key={space._id} className="col-lg-4 col-md-6">
                  <div className="card h-100 border-0 shadow-sm hover-shadow transition">
                    {space.featuredImage && (
                      <img
                        src={space.featuredImage}
                        className="card-img-top"
                        alt={space.name}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    {!space.featuredImage && (
                      <div
                        className="card-img-top bg-light d-flex align-items-center justify-content-center"
                        style={{ height: '200px' }}
                      >
                        <i className="bi bi-building" style={{ fontSize: '3rem', color: '#dee2e6' }}></i>
                      </div>
                    )}
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title mb-0">{space.name}</h5>
                        <span className="badge bg-primary">{getTypeLabel(space.type)}</span>
                      </div>

                      <p className="card-text text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                        {space.description.length > 100
                          ? `${space.description.substring(0, 100)}...`
                          : space.description}
                      </p>

                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-people me-2"></i>
                          <span>{space.capacity} {space.capacity > 1 ? 'personnes' : 'personne'}</span>
                        </div>
                        {space.amenities.length > 0 && (
                          <div className="d-flex flex-wrap gap-1">
                            {space.amenities.slice(0, 3).map((amenity) => (
                              <span key={amenity} className="badge bg-light text-dark" style={{ fontSize: '0.75rem' }}>
                                {amenity}
                              </span>
                            ))}
                            {space.amenities.length > 3 && (
                              <span className="badge bg-light text-dark" style={{ fontSize: '0.75rem' }}>
                                +{space.amenities.length - 3} plus
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <small className="text-muted">À partir de</small>
                            <div className="h5 mb-0 text-primary">
                              {getMinPrice(space.pricing)}€
                              <small className="text-muted">/h</small>
                            </div>
                          </div>
                        </div>
                        <Link
                          href={`/booking/${space.slug}`}
                          className="btn btn-primary w-100"
                        >
                          Réserver maintenant
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        .hover-shadow {
          transition: box-shadow 0.3s ease;
        }
        .hover-shadow:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
        .transition {
          transition: all 0.3s ease;
        }
      `}</style>
    </>
  );
};

export default BookingPage;
