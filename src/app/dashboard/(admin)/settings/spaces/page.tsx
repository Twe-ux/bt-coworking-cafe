"use client";

import { useEffect, useState } from "react";
import { Card, Button, Form, Row, Col, Nav, Tab, Alert } from "react-bootstrap";

interface DayHours {
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
}

interface WeeklyHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

interface ExceptionalClosure {
  date: string;
  reason?: string;
}

interface PricingStructure {
  hourly: number;
  daily: number;
  weekly: number;
  monthly: number;
  perPerson: boolean;
}

interface SpaceConfiguration {
  _id: string;
  spaceType: string;
  name: string;
  slug: string;
  description?: string;
  pricing: PricingStructure;
  minCapacity: number;
  maxCapacity: number;
  defaultHours: WeeklyHours;
  exceptionalClosures: ExceptionalClosure[];
  isActive: boolean;
  imageUrl?: string;
  displayOrder: number;
}

const daysOfWeek = [
  { key: "monday", label: "Lundi" },
  { key: "tuesday", label: "Mardi" },
  { key: "wednesday", label: "Mercredi" },
  { key: "thursday", label: "Jeudi" },
  { key: "friday", label: "Vendredi" },
  { key: "saturday", label: "Samedi" },
  { key: "sunday", label: "Dimanche" },
];

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

  const updateDayHours = (
    spaceType: string,
    day: keyof WeeklyHours,
    updates: Partial<DayHours>
  ) => {
    setConfigurations((prev) =>
      prev.map((config) =>
        config.spaceType === spaceType
          ? {
              ...config,
              defaultHours: {
                ...config.defaultHours,
                [day]: {
                  ...config.defaultHours[day],
                  ...updates,
                },
              },
            }
          : config
      )
    );
  };

  const addExceptionalClosure = (spaceType: string) => {
    setConfigurations((prev) =>
      prev.map((config) =>
        config.spaceType === spaceType
          ? {
              ...config,
              exceptionalClosures: [
                ...config.exceptionalClosures,
                { date: new Date().toISOString().split("T")[0], reason: "" },
              ],
            }
          : config
      )
    );
  };

  const removeExceptionalClosure = (spaceType: string, index: number) => {
    setConfigurations((prev) =>
      prev.map((config) =>
        config.spaceType === spaceType
          ? {
              ...config,
              exceptionalClosures: config.exceptionalClosures.filter((_, i) => i !== index),
            }
          : config
      )
    );
  };

  const updateExceptionalClosure = (
    spaceType: string,
    index: number,
    field: keyof ExceptionalClosure,
    value: string
  ) => {
    setConfigurations((prev) =>
      prev.map((config) =>
        config.spaceType === spaceType
          ? {
              ...config,
              exceptionalClosures: config.exceptionalClosures.map((closure, i) =>
                i === index ? { ...closure, [field]: value } : closure
              ),
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
                        <Row className="mb-3">
                          <Col md={3}>
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
                          <Col md={3}>
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

                        {/* Opening Hours */}
                        <h5 className="mb-3 mt-4">Horaires d'ouverture</h5>
                        {daysOfWeek.map((day) => {
                          const dayKey = day.key as keyof WeeklyHours;
                          const dayHours = config.defaultHours[dayKey];
                          return (
                            <Row key={day.key} className="mb-2 align-items-center">
                              <Col md={2}>
                                <strong>{day.label}</strong>
                              </Col>
                              <Col md={2}>
                                <Form.Check
                                  type="switch"
                                  label={dayHours.isOpen ? "Ouvert" : "Fermé"}
                                  checked={dayHours.isOpen}
                                  onChange={(e) =>
                                    updateDayHours(config.spaceType, dayKey, {
                                      isOpen: e.target.checked,
                                    })
                                  }
                                />
                              </Col>
                              {dayHours.isOpen && (
                                <>
                                  <Col md={3}>
                                    <Form.Control
                                      type="time"
                                      value={dayHours.openTime || ""}
                                      onChange={(e) =>
                                        updateDayHours(config.spaceType, dayKey, {
                                          openTime: e.target.value,
                                        })
                                      }
                                    />
                                  </Col>
                                  <Col md={1} className="text-center">
                                    à
                                  </Col>
                                  <Col md={3}>
                                    <Form.Control
                                      type="time"
                                      value={dayHours.closeTime || ""}
                                      onChange={(e) =>
                                        updateDayHours(config.spaceType, dayKey, {
                                          closeTime: e.target.value,
                                        })
                                      }
                                    />
                                  </Col>
                                </>
                              )}
                            </Row>
                          );
                        })}

                        {/* Exceptional Closures */}
                        <h5 className="mb-3 mt-4">Fermetures exceptionnelles</h5>
                        {config.exceptionalClosures.map((closure, index) => (
                          <Row key={index} className="mb-2 align-items-center">
                            <Col md={3}>
                              <Form.Control
                                type="date"
                                value={closure.date.split("T")[0]}
                                onChange={(e) =>
                                  updateExceptionalClosure(
                                    config.spaceType,
                                    index,
                                    "date",
                                    e.target.value
                                  )
                                }
                              />
                            </Col>
                            <Col md={7}>
                              <Form.Control
                                type="text"
                                placeholder="Raison (optionnel)"
                                value={closure.reason || ""}
                                onChange={(e) =>
                                  updateExceptionalClosure(
                                    config.spaceType,
                                    index,
                                    "reason",
                                    e.target.value
                                  )
                                }
                              />
                            </Col>
                            <Col md={2}>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() =>
                                  removeExceptionalClosure(config.spaceType, index)
                                }
                              >
                                <i className="bi bi-trash"></i> Supprimer
                              </Button>
                            </Col>
                          </Row>
                        ))}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => addExceptionalClosure(config.spaceType)}
                        >
                          <i className="bi bi-plus-circle"></i> Ajouter une fermeture
                        </Button>

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
