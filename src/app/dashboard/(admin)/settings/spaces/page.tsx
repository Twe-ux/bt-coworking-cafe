"use client";

import { useEffect, useState } from "react";
import { Card, Button, Form, Row, Col, Nav, Tab, Alert } from "react-bootstrap";

interface PricingStructure {
  hourly: number;
  daily: number;
  weekly: number;
  monthly: number;
  perPerson: boolean;
}

interface AvailableReservationTypes {
  hourly: boolean;
  daily: boolean;
  weekly: boolean;
  monthly: boolean;
}

interface SpaceConfiguration {
  _id: string;
  spaceType: string;
  name: string;
  slug: string;
  description?: string;
  pricing: PricingStructure;
  availableReservationTypes?: AvailableReservationTypes;
  requiresQuote: boolean;
  minCapacity: number;
  maxCapacity: number;
  isActive: boolean;
  imageUrl?: string;
  displayOrder: number;
}

export default function SpacesSettingsPage() {
  const [configurations, setConfigurations] = useState<SpaceConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<string>("open-space");

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/space-configurations");
      const data = await response.json();

      if (data.success) {
        setConfigurations(data.data);
        if (data.data.length > 0) {
          setActiveTab(data.data[0].spaceType);
        }
      } else {
        setMessage({ type: "error", text: "Erreur lors du chargement des configurations" });
      }
    } catch (error) {
      console.error("Error fetching configurations:", error);
      setMessage({ type: "error", text: "Erreur lors du chargement des configurations" });
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/admin/space-configurations/seed", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Configurations initiales créées avec succès" });
        fetchConfigurations();
      } else {
        setMessage({ type: "error", text: data.error || "Erreur lors de la création" });
      }
    } catch (error) {
      console.error("Error seeding data:", error);
      setMessage({ type: "error", text: "Erreur lors de la création" });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateConfiguration = async (config: SpaceConfiguration) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/admin/space-configurations/${config.spaceType}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Configuration mise à jour avec succès" });
        fetchConfigurations();
      } else {
        setMessage({ type: "error", text: data.error || "Erreur lors de la mise à jour" });
      }
    } catch (error) {
      console.error("Error updating configuration:", error);
      setMessage({ type: "error", text: "Erreur lors de la mise à jour" });
    } finally {
      setSaving(false);
    }
  };

  const updateConfiguration = (spaceType: string, updates: Partial<SpaceConfiguration>) => {
    setConfigurations((prev) =>
      prev.map((config) =>
        config.spaceType === spaceType ? { ...config, ...updates } : config
      )
    );
  };

  const updatePricing = (spaceType: string, field: keyof PricingStructure, value: number | boolean) => {
    setConfigurations((prev) =>
      prev.map((config) =>
        config.spaceType === spaceType
          ? {
              ...config,
              pricing: {
                ...config.pricing,
                [field]: value,
              },
            }
          : config
      )
    );
  };


  if (loading) {
    return (
      <div className="container-fluid">
        <div className="text-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  if (configurations.length === 0) {
    return (
      <div className="container-fluid">
        <div className="text-center mt-5">
          <h3>Aucune configuration trouvée</h3>
          <p>Initialisez les configurations par défaut pour commencer.</p>
          <Button onClick={handleSeedData} disabled={saving}>
            {saving ? "Création en cours..." : "Initialiser les configurations"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="page-title-box">
            <h4 className="page-title">Configuration des Espaces</h4>
          </div>
        </div>
      </div>

      {message && (
        <Alert
          variant={message.type === "success" ? "success" : "danger"}
          dismissible
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}

      <Tab.Container activeKey={activeTab} onSelect={(k) => k && setActiveTab(k)}>
        <Row>
          <Col lg={12}>
            <Card>
              <Card.Body>
                <Nav variant="tabs" className="mb-3">
                  {configurations.map((config) => (
                    <Nav.Item key={config.spaceType}>
                      <Nav.Link eventKey={config.spaceType}>{config.name}</Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>

                <Tab.Content>
                  {configurations.map((config) => (
                    <Tab.Pane key={config.spaceType} eventKey={config.spaceType}>
                      <Form>
                        {/* Basic Information */}
                        <h5 className="mb-3">Informations générales</h5>
                        <Row className="mb-3">
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Nom</Form.Label>
                              <Form.Control
                                type="text"
                                value={config.name}
                                onChange={(e) =>
                                  updateConfiguration(config.spaceType, { name: e.target.value })
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Statut</Form.Label>
                              <Form.Check
                                type="switch"
                                label={config.isActive ? "Actif" : "Inactif"}
                                checked={config.isActive}
                                onChange={(e) =>
                                  updateConfiguration(config.spaceType, {
                                    isActive: e.target.checked,
                                  })
                                }
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Group className="mb-3">
                          <Form.Label>Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            value={config.description || ""}
                            onChange={(e) =>
                              updateConfiguration(config.spaceType, {
                                description: e.target.value,
                              })
                            }
                          />
                        </Form.Group>

                        {/* Pricing */}
                        <h5 className="mb-3 mt-4">Tarification</h5>

                        <Form.Group className="mb-3">
                          <Form.Check
                            type="switch"
                            label="Tarifs sur devis (désactive la réservation en ligne)"
                            checked={config.requiresQuote}
                            onChange={(e) =>
                              updateConfiguration(config.spaceType, {
                                requiresQuote: e.target.checked,
                              })
                            }
                          />
                        </Form.Group>

                        {!config.requiresQuote && (
                          <>
                            {/* Reservation Types Selection */}
                            <div className="mb-4">
                              <h6 className="mb-3">Types de réservation disponibles</h6>
                              <Row>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Check
                                      type="switch"
                                      id={`hourly-${config.spaceType}`}
                                      label="Réservation à l'heure"
                                      checked={config.availableReservationTypes?.hourly || false}
                                      onChange={(e) =>
                                        updateConfiguration(config.spaceType, {
                                          availableReservationTypes: {
                                            hourly: e.target.checked,
                                            daily: config.availableReservationTypes?.daily || false,
                                            weekly: config.availableReservationTypes?.weekly || false,
                                            monthly: config.availableReservationTypes?.monthly || false,
                                          },
                                        })
                                      }
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Check
                                      type="switch"
                                      id={`daily-${config.spaceType}`}
                                      label="Réservation à la journée"
                                      checked={config.availableReservationTypes?.daily || false}
                                      onChange={(e) =>
                                        updateConfiguration(config.spaceType, {
                                          availableReservationTypes: {
                                            hourly: config.availableReservationTypes?.hourly || false,
                                            daily: e.target.checked,
                                            weekly: config.availableReservationTypes?.weekly || false,
                                            monthly: config.availableReservationTypes?.monthly || false,
                                          },
                                        })
                                      }
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Check
                                      type="switch"
                                      id={`weekly-${config.spaceType}`}
                                      label="Réservation à la semaine"
                                      checked={config.availableReservationTypes?.weekly || false}
                                      onChange={(e) =>
                                        updateConfiguration(config.spaceType, {
                                          availableReservationTypes: {
                                            hourly: config.availableReservationTypes?.hourly || false,
                                            daily: config.availableReservationTypes?.daily || false,
                                            weekly: e.target.checked,
                                            monthly: config.availableReservationTypes?.monthly || false,
                                          },
                                        })
                                      }
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={6}>
                                  <Form.Group className="mb-3">
                                    <Form.Check
                                      type="switch"
                                      id={`monthly-${config.spaceType}`}
                                      label="Réservation au mois"
                                      checked={config.availableReservationTypes?.monthly || false}
                                      onChange={(e) =>
                                        updateConfiguration(config.spaceType, {
                                          availableReservationTypes: {
                                            hourly: config.availableReservationTypes?.hourly || false,
                                            daily: config.availableReservationTypes?.daily || false,
                                            weekly: config.availableReservationTypes?.weekly || false,
                                            monthly: e.target.checked,
                                          },
                                        })
                                      }
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                            </div>

                            {/* Pricing Fields */}
                            <h6 className="mb-3">Tarifs</h6>
                            <Row className="mb-3">
                              {config.availableReservationTypes?.hourly && (
                                <Col md={config.availableReservationTypes?.weekly || config.availableReservationTypes?.monthly ? 3 : 6}>
                                  <Form.Group>
                                    <Form.Label>Prix Horaire (€)</Form.Label>
                                    <Form.Control
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={config.pricing.hourly}
                                      onChange={(e) =>
                                        updatePricing(
                                          config.spaceType,
                                          "hourly",
                                          parseFloat(e.target.value)
                                        )
                                      }
                                    />
                                  </Form.Group>
                                </Col>
                              )}
                              {config.availableReservationTypes?.daily && (
                                <Col md={config.availableReservationTypes?.weekly || config.availableReservationTypes?.monthly ? 3 : 6}>
                                  <Form.Group>
                                    <Form.Label>Prix Journée (€)</Form.Label>
                                    <Form.Control
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={config.pricing.daily}
                                      onChange={(e) =>
                                        updatePricing(
                                          config.spaceType,
                                          "daily",
                                          parseFloat(e.target.value)
                                        )
                                      }
                                    />
                                  </Form.Group>
                                </Col>
                              )}
                              {config.availableReservationTypes?.weekly && (
                                <Col md={3}>
                                  <Form.Group>
                                    <Form.Label>Prix Semaine (€)</Form.Label>
                                    <Form.Control
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={config.pricing.weekly}
                                      onChange={(e) =>
                                        updatePricing(
                                          config.spaceType,
                                          "weekly",
                                          parseFloat(e.target.value)
                                        )
                                      }
                                    />
                                  </Form.Group>
                                </Col>
                              )}
                              {config.availableReservationTypes?.monthly && (
                                <Col md={3}>
                                  <Form.Group>
                                    <Form.Label>Prix Mois (€)</Form.Label>
                                    <Form.Control
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={config.pricing.monthly}
                                      onChange={(e) =>
                                        updatePricing(
                                          config.spaceType,
                                          "monthly",
                                          parseFloat(e.target.value)
                                        )
                                      }
                                    />
                                  </Form.Group>
                                </Col>
                              )}
                            </Row>

                            <Form.Group className="mb-3">
                              <Form.Check
                                type="checkbox"
                                label="Prix par personne (multiplier par le nombre de personnes)"
                                checked={config.pricing.perPerson}
                                onChange={(e) =>
                                  updatePricing(config.spaceType, "perPerson", e.target.checked)
                                }
                              />
                            </Form.Group>
                          </>
                        )}

                        {config.requiresQuote && (
                          <Alert variant="info">
                            <i className="bi bi-info-circle me-2"></i>
                            Mode "sur devis" activé. Les visiteurs verront un message les invitant à vous contacter pour un devis personnalisé.
                          </Alert>
                        )}

                        {/* Capacity */}
                        <h5 className="mb-3 mt-4">Capacité</h5>
                        <Row className="mb-3">
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Capacité Minimale</Form.Label>
                              <Form.Control
                                type="number"
                                min="1"
                                value={config.minCapacity}
                                onChange={(e) =>
                                  updateConfiguration(config.spaceType, {
                                    minCapacity: parseInt(e.target.value),
                                  })
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Capacité Maximale</Form.Label>
                              <Form.Control
                                type="number"
                                min="1"
                                value={config.maxCapacity}
                                onChange={(e) =>
                                  updateConfiguration(config.spaceType, {
                                    maxCapacity: parseInt(e.target.value),
                                  })
                                }
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        {/* Opening Hours - Info */}
                        <h5 className="mb-3 mt-4">Horaires d'ouverture</h5>
                        <Alert variant="info">
                          <div className="d-flex align-items-center justify-content-between">
                            <div>
                              <i className="bi bi-clock me-2"></i>
                              Les horaires d'ouverture et fermetures exceptionnelles sont gérés de manière centralisée pour tout le coworking.
                            </div>
                            <Button
                              variant="primary"
                              size="sm"
                              href="/dashboard/settings/horaires"
                            >
                              Gérer les horaires <i className="bi bi-arrow-right ms-1"></i>
                            </Button>
                          </div>
                        </Alert>

                        {/* Save Button */}
                        <div className="mt-4">
                          <Button
                            variant="primary"
                            onClick={() => handleUpdateConfiguration(config)}
                            disabled={saving}
                          >
                            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
                          </Button>
                        </div>
                      </Form>
                    </Tab.Pane>
                  ))}
                </Tab.Content>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}
