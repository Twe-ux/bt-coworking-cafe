"use client";

import { useEffect, useState } from "react";
import { Card, Table, Badge, Button, Alert } from "react-bootstrap";
import { Icon } from "@iconify/react";
import Link from "next/link";
import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";

interface SpaceConfiguration {
  _id: string;
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
  isActive: boolean;
  imageUrl?: string;
  displayOrder: number;
}

const spaceTypeLabels: Record<string, string> = {
  "open-space": "Open-space",
  "salle-verriere": "Salle Verrière",
  "salle-etage": "Salle Étage",
  "evenementiel": "Événementiel",
};

// Force dynamic rendering
export const dynamic = "force-dynamic";

const SpacesManagementPage = () => {
  const [spaces, setSpaces] = useState<SpaceConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/booking/spaces");
      const data = await response.json();

      if (data.success) {
        setSpaces(data.data);
      } else {
        setMessage({ type: "error", text: data.error || "Erreur lors du chargement des espaces" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors du chargement des espaces" });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/booking/spaces/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: `Espace ${!currentStatus ? "activé" : "désactivé"} avec succès`,
        });
        fetchSpaces();
      } else {
        setMessage({ type: "error", text: data.error || "Erreur lors de la mise à jour" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de la mise à jour" });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'espace "${name}" ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/booking/spaces/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Espace supprimé avec succès" });
        fetchSpaces();
      } else {
        setMessage({ type: "error", text: data.error || "Erreur lors de la suppression" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de la suppression" });
    }
  };

  const getAvailableTypes = (space: SpaceConfiguration) => {
    const types = [];
    if (space.availableReservationTypes.hourly) types.push("Horaire");
    if (space.availableReservationTypes.daily) types.push("Journée");
    if (space.availableReservationTypes.weekly) types.push("Semaine");
    if (space.availableReservationTypes.monthly) types.push("Mois");
    return types.join(", ") || "Aucun";
  };

  const getMinPrice = (space: SpaceConfiguration) => {
    const prices = [
      space.pricing.hourly,
      space.pricing.daily,
      space.pricing.weekly,
      space.pricing.monthly,
    ].filter((p) => p > 0);

    if (prices.length === 0) return "Sur devis";
    return `À partir de ${Math.min(...prices)}€`;
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <DashboardPageTitle title="Gestion des Espaces" subName="Booking" />
        <div className="text-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <DashboardPageTitle title="Gestion des Espaces" subName="Booking" />

      {message && (
        <Alert
          variant={message.type === "success" ? "success" : "danger"}
          dismissible
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="card-title mb-0">Liste des espaces</h5>
            <Link href="/dashboard/booking/spaces-new" className="btn btn-primary">
              <Icon icon="ri:add-line" className="me-1" />
              Ajouter un espace
            </Link>
          </div>

          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "80px" }}>Image</th>
                  <th>Nom</th>
                  <th>Type</th>
                  <th>Capacité</th>
                  <th>Prix</th>
                  <th>Types dispo.</th>
                  <th>Statut</th>
                  <th style={{ width: "150px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {spaces.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      <Icon icon="ri:building-line" width={48} className="text-muted mb-2" />
                      <p className="text-muted mb-0">Aucun espace configuré</p>
                    </td>
                  </tr>
                ) : (
                  spaces.map((space) => (
                    <tr key={space._id}>
                      <td>
                        {space.imageUrl ? (
                          <img
                            src={space.imageUrl}
                            alt={space.name}
                            className="rounded"
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            className="bg-light rounded d-flex align-items-center justify-content-center"
                            style={{ width: "60px", height: "60px" }}
                          >
                            <Icon icon="ri:image-line" width={24} className="text-muted" />
                          </div>
                        )}
                      </td>
                      <td>
                        <div>
                          <div className="fw-medium">{space.name}</div>
                          <small className="text-muted">{space.slug}</small>
                        </div>
                      </td>
                      <td>
                        <Badge bg="light" text="dark">
                          {spaceTypeLabels[space.spaceType] || space.spaceType}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Icon icon="ri:user-line" className="me-1 text-muted" width={16} />
                          {space.minCapacity} - {space.maxCapacity}
                        </div>
                      </td>
                      <td>
                        {space.requiresQuote ? (
                          <span className="text-muted">Sur devis</span>
                        ) : (
                          <span>{getMinPrice(space)}</span>
                        )}
                      </td>
                      <td>
                        <small className="text-muted">{getAvailableTypes(space)}</small>
                      </td>
                      <td>
                        <Badge bg={space.isActive ? "success" : "secondary"}>
                          {space.isActive ? "Actif" : "Inactif"}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Link
                            href={`/dashboard/booking/spaces-edit/${space._id}`}
                            className="btn btn-sm btn-primary"
                            title="Modifier"
                          >
                            <Icon icon="ri:edit-line" />
                          </Link>
                          <Button
                            size="sm"
                            variant={space.isActive ? "warning" : "success"}
                            onClick={() => handleToggleActive(space._id, space.isActive)}
                            title={space.isActive ? "Désactiver" : "Activer"}
                          >
                            <Icon
                              icon={space.isActive ? "ri:pause-circle-line" : "ri:play-circle-line"}
                            />
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(space._id, space.name)}
                            title="Supprimer"
                          >
                            <Icon icon="ri:delete-bin-line" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SpacesManagementPage;
