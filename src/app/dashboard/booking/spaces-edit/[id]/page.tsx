"use client";

import { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col, Alert, Spinner } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { useRouter, useParams } from "next/navigation";
import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";

interface SpaceFormData {
  spaceType: string;
  name: string;
  slug: string;
  description: string;
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
  imageUrl: string;
  displayOrder: number;
}

// Force dynamic rendering
export const dynamic = "force-dynamic";

const EditSpacePage = () => {
  const router = useRouter();
  const params = useParams();
  const spaceId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formData, setFormData] = useState<SpaceFormData>({
    spaceType: "open-space",
    name: "",
    slug: "",
    description: "",
    pricing: {
      hourly: 0,
      daily: 0,
      weekly: 0,
      monthly: 0,
      perPerson: false,
    },
    availableReservationTypes: {
      hourly: true,
      daily: true,
      weekly: false,
      monthly: false,
    },
    requiresQuote: false,
    minCapacity: 1,
    maxCapacity: 10,
    isActive: true,
    imageUrl: "",
    displayOrder: 0,
  });

  useEffect(() => {
    fetchSpace();
  }, [spaceId]);

  const fetchSpace = async () => {
    try {
      setLoadingData(true);
      const response = await fetch(`/api/admin/booking/spaces/${spaceId}`);
      const data = await response.json();

      if (data.success) {
        setFormData(data.data);
      } else {
        setMessage({ type: "error", text: data.error || "Erreur lors du chargement" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors du chargement de l'espace" });
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.startsWith("pricing.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        pricing: {
          ...formData.pricing,
          [field]: type === "checkbox" ? checked : parseFloat(value) || 0,
        },
      });
    } else if (name.startsWith("availableReservationTypes.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        availableReservationTypes: {
          ...formData.availableReservationTypes,
          [field]: checked,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) || 0 : value,
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const response = await fetch("/api/admin/booking/spaces/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await response.json();

      if (response.ok) {
        setFormData((prev) => ({ ...prev, imageUrl: data.data.url }));
        setMessage({ type: "success", text: "Image uploadée avec succès" });
      } else {
        setMessage({ type: "error", text: data.error || "Erreur lors de l'upload" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de l'upload de l'image" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.slug) {
      setMessage({ type: "error", text: "Veuillez remplir tous les champs obligatoires" });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/admin/booking/spaces/${spaceId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Espace mis à jour avec succès" });
        setTimeout(() => {
          router.push("/dashboard/booking/spaces");
        }, 1500);
      } else {
        setMessage({ type: "error", text: data.error || "Erreur lors de la mise à jour" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de la mise à jour de l'espace" });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="container-fluid">
        <DashboardPageTitle title="Modifier un Espace" subName="Booking" />
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <DashboardPageTitle title="Modifier un Espace" subName="Booking" />

      {message && (
        <Alert
          variant={message.type === "success" ? "success" : "danger"}
          dismissible
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col lg={8}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h5 className="card-title mb-4">Informations générales</h5>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Type d'espace <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select name="spaceType" value={formData.spaceType} onChange={handleInputChange} required>
                    <option value="open-space">Open-space</option>
                    <option value="salle-verriere">Salle Verrière</option>
                    <option value="salle-etage">Salle Étage</option>
                    <option value="evenementiel">Événementiel</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Nom <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Slug <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                  />
                  <Form.Text className="text-muted">
                    Utilisé dans l'URL (ex: open-space, salle-verriere)
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Capacité minimum</Form.Label>
                      <Form.Control
                        type="number"
                        name="minCapacity"
                        value={formData.minCapacity}
                        onChange={handleInputChange}
                        min={1}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Capacité maximum</Form.Label>
                      <Form.Control
                        type="number"
                        name="maxCapacity"
                        value={formData.maxCapacity}
                        onChange={handleInputChange}
                        min={1}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h5 className="card-title mb-4">Tarification</h5>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Sur devis uniquement"
                    name="requiresQuote"
                    checked={formData.requiresQuote}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                {!formData.requiresQuote && (
                  <>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Prix horaire (€)</Form.Label>
                          <Form.Control
                            type="number"
                            name="pricing.hourly"
                            value={formData.pricing.hourly}
                            onChange={handleInputChange}
                            min={0}
                            step="0.01"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Prix journalier (€)</Form.Label>
                          <Form.Control
                            type="number"
                            name="pricing.daily"
                            value={formData.pricing.daily}
                            onChange={handleInputChange}
                            min={0}
                            step="0.01"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Prix hebdomadaire (€)</Form.Label>
                          <Form.Control
                            type="number"
                            name="pricing.weekly"
                            value={formData.pricing.weekly}
                            onChange={handleInputChange}
                            min={0}
                            step="0.01"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Prix mensuel (€)</Form.Label>
                          <Form.Control
                            type="number"
                            name="pricing.monthly"
                            value={formData.pricing.monthly}
                            onChange={handleInputChange}
                            min={0}
                            step="0.01"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="Prix par personne"
                        name="pricing.perPerson"
                        checked={formData.pricing.perPerson}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </>
                )}
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h5 className="card-title mb-4">Types de réservation disponibles</h5>

                <Form.Group className="mb-2">
                  <Form.Check
                    type="checkbox"
                    label="Réservation horaire"
                    name="availableReservationTypes.hourly"
                    checked={formData.availableReservationTypes.hourly}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Check
                    type="checkbox"
                    label="Réservation journalière"
                    name="availableReservationTypes.daily"
                    checked={formData.availableReservationTypes.daily}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Check
                    type="checkbox"
                    label="Réservation hebdomadaire"
                    name="availableReservationTypes.weekly"
                    checked={formData.availableReservationTypes.weekly}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    label="Réservation mensuelle"
                    name="availableReservationTypes.monthly"
                    checked={formData.availableReservationTypes.monthly}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h5 className="card-title mb-4">Image</h5>

                {formData.imageUrl ? (
                  <div className="mb-3">
                    <img
                      src={formData.imageUrl}
                      alt="Space"
                      className="img-fluid rounded mb-2"
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setFormData({ ...formData, imageUrl: "" })}
                    >
                      <Icon icon="ri:delete-bin-line" className="me-1" />
                      Supprimer
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4 border rounded mb-3">
                    <Icon icon="ri:image-line" width={48} className="text-muted mb-2" />
                    <p className="text-muted mb-0">Aucune image</p>
                  </div>
                )}

                <Form.Group>
                  <Form.Label>Upload image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  {uploading && (
                    <div className="mt-2">
                      <Spinner animation="border" size="sm" className="me-2" />
                      Upload en cours...
                    </div>
                  )}
                </Form.Group>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h5 className="card-title mb-4">Paramètres</h5>

                <Form.Group className="mb-3">
                  <Form.Label>Ordre d'affichage</Form.Label>
                  <Form.Control
                    type="number"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleInputChange}
                  />
                  <Form.Text className="text-muted">
                    Plus le nombre est bas, plus l'espace apparaît en premier
                  </Form.Text>
                </Form.Group>

                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    label="Espace actif"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            <div className="d-grid gap-2">
              <Button type="submit" variant="primary" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Mise à jour en cours...
                  </>
                ) : (
                  <>
                    <Icon icon="ri:save-line" className="me-2" />
                    Mettre à jour
                  </>
                )}
              </Button>
              <Button
                variant="outline-secondary"
                size="lg"
                onClick={() => router.back()}
                disabled={loading}
              >
                Annuler
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default EditSpacePage;
