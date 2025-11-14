"use client";

import { useEffect, useState } from "react";
import { Card, Button, Form, Row, Col, Alert } from "react-bootstrap";

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
  startTime?: string;
  endTime?: string;
  isFullDay?: boolean;
}

interface HoursConfiguration {
  defaultHours: WeeklyHours;
  exceptionalClosures: ExceptionalClosure[];
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

export default function HorairesSettingsPage() {
  const [configuration, setConfiguration] = useState<HoursConfiguration | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchConfiguration();
  }, []);

  const fetchConfiguration = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/space-configurations/open-space");
      const data = await response.json();

      if (data.success) {
        setConfiguration({
          defaultHours: data.data.defaultHours,
          exceptionalClosures: data.data.exceptionalClosures || [],
        });
      } else {
        setMessage({ type: "error", text: "Erreur lors du chargement des horaires" });
      }
    } catch (error) {
      console.error("Error fetching configuration:", error);
      setMessage({ type: "error", text: "Erreur lors du chargement des horaires" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!configuration) return;

    try {
      setSaving(true);
      const response = await fetch("/api/admin/space-configurations/open-space", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          defaultHours: configuration.defaultHours,
          exceptionalClosures: configuration.exceptionalClosures,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Horaires mis à jour avec succès" });
        fetchConfiguration();
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

  const updateDayHours = (day: keyof WeeklyHours, updates: Partial<DayHours>) => {
    if (!configuration) return;

    setConfiguration({
      ...configuration,
      defaultHours: {
        ...configuration.defaultHours,
        [day]: {
          ...configuration.defaultHours[day],
          ...updates,
        },
      },
    });
  };

  const addExceptionalClosure = () => {
    if (!configuration) return;

    setConfiguration({
      ...configuration,
      exceptionalClosures: [
        ...configuration.exceptionalClosures,
        {
          date: new Date().toISOString().split("T")[0],
          reason: "",
          isFullDay: true,
          startTime: "",
          endTime: ""
        },
      ],
    });
  };

  const removeExceptionalClosure = (index: number) => {
    if (!configuration) return;

    setConfiguration({
      ...configuration,
      exceptionalClosures: configuration.exceptionalClosures.filter((_, i) => i !== index),
    });
  };

  const updateExceptionalClosure = (
    index: number,
    field: keyof ExceptionalClosure,
    value: string | boolean
  ) => {
    if (!configuration) return;

    // Convert string booleans to actual booleans for isFullDay
    let processedValue = value;
    if (field === "isFullDay" && typeof value === "string") {
      processedValue = value === "true";
    }

    setConfiguration({
      ...configuration,
      exceptionalClosures: configuration.exceptionalClosures.map((closure, i) =>
        i === index ? { ...closure, [field]: processedValue } : closure
      ),
    });
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

  if (!configuration) {
    return (
      <div className="container-fluid">
        <div className="text-center mt-5">
          <h3>Erreur de chargement</h3>
          <p>Impossible de charger la configuration des horaires.</p>
          <Button onClick={fetchConfiguration}>Réessayer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="page-title-box">
            <h4 className="page-title">Horaires d'Ouverture</h4>
            <p className="text-muted">
              Configurez les horaires par défaut et les fermetures exceptionnelles du coworking.
              Ces horaires sont affichés sur la page publique et dans la bannière de fermetures.
            </p>
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

      <Row>
        <Col lg={8}>
          <Card>
            <Card.Body>
              <h5 className="mb-3">Horaires d'ouverture par défaut</h5>
              <p className="text-muted mb-4">
                Définissez les horaires d'ouverture pour chaque jour de la semaine.
              </p>

              {daysOfWeek.map((day) => {
                const dayKey = day.key as keyof WeeklyHours;
                const dayHours = configuration.defaultHours[dayKey];
                return (
                  <Row key={day.key} className="mb-3 align-items-center">
                    <Col md={3}>
                      <strong>{day.label}</strong>
                    </Col>
                    <Col md={3}>
                      <Form.Check
                        type="switch"
                        label={dayHours.isOpen ? "Ouvert" : "Fermé"}
                        checked={dayHours.isOpen}
                        onChange={(e) =>
                          updateDayHours(dayKey, {
                            isOpen: e.target.checked,
                          })
                        }
                      />
                    </Col>
                    {dayHours.isOpen && (
                      <>
                        <Col md={2}>
                          <Form.Control
                            type="time"
                            value={dayHours.openTime || ""}
                            onChange={(e) =>
                              updateDayHours(dayKey, {
                                openTime: e.target.value,
                              })
                            }
                          />
                        </Col>
                        <Col md={1} className="text-center">
                          à
                        </Col>
                        <Col md={2}>
                          <Form.Control
                            type="time"
                            value={dayHours.closeTime || ""}
                            onChange={(e) =>
                              updateDayHours(dayKey, {
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
            </Card.Body>
          </Card>

          <Card className="mt-3">
            <Card.Body>
              <h5 className="mb-3">Fermetures exceptionnelles</h5>
              <p className="text-muted mb-4">
                Ajoutez les dates de fermeture exceptionnelle (jours fériés, congés, événements spéciaux).
                Une bannière s'affichera automatiquement sur le site pour annoncer les fermetures à venir.
              </p>

              {configuration.exceptionalClosures.length === 0 ? (
                <Alert variant="info">
                  <i className="bi bi-info-circle me-2"></i>
                  Aucune fermeture exceptionnelle programmée.
                </Alert>
              ) : (
                <>
                  {configuration.exceptionalClosures.map((closure, index) => (
                    <div key={index} className="border rounded p-3 mb-3">
                      <Row className="mb-3 align-items-center">
                        <Col md={3}>
                          <Form.Label className="mb-1 small text-muted">Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={closure.date.split("T")[0]}
                            onChange={(e) =>
                              updateExceptionalClosure(index, "date", e.target.value)
                            }
                          />
                        </Col>
                        <Col md={7}>
                          <Form.Label className="mb-1 small text-muted">Raison</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Raison (ex: Jour férié, Congés annuels...)"
                            value={closure.reason || ""}
                            onChange={(e) =>
                              updateExceptionalClosure(index, "reason", e.target.value)
                            }
                          />
                        </Col>
                        <Col md={2} className="d-flex align-items-end">
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => removeExceptionalClosure(index)}
                            className="w-100"
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </Col>
                      </Row>

                      <Row className="align-items-center">
                        <Col md={12}>
                          <Form.Check
                            type="switch"
                            id={`fullday-${index}`}
                            label="Fermeture toute la journée"
                            checked={closure.isFullDay !== false}
                            onChange={(e) =>
                              updateExceptionalClosure(index, "isFullDay", e.target.checked ? "true" : "false")
                            }
                          />
                        </Col>
                      </Row>

                      {closure.isFullDay === false && (
                        <Row className="mt-3">
                          <Col md={5}>
                            <Form.Label className="mb-1 small text-muted">Heure de début</Form.Label>
                            <Form.Control
                              type="time"
                              value={closure.startTime || ""}
                              onChange={(e) =>
                                updateExceptionalClosure(index, "startTime", e.target.value)
                              }
                              placeholder="09:00"
                            />
                          </Col>
                          <Col md={2} className="d-flex align-items-end justify-content-center">
                            <span className="text-muted">à</span>
                          </Col>
                          <Col md={5}>
                            <Form.Label className="mb-1 small text-muted">Heure de fin</Form.Label>
                            <Form.Control
                              type="time"
                              value={closure.endTime || ""}
                              onChange={(e) =>
                                updateExceptionalClosure(index, "endTime", e.target.value)
                              }
                              placeholder="18:00"
                            />
                          </Col>
                        </Row>
                      )}
                    </div>
                  ))}
                </>
              )}

              <Button
                variant="secondary"
                size="sm"
                className="mt-3"
                onClick={addExceptionalClosure}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Ajouter une fermeture
              </Button>
            </Card.Body>
          </Card>

          <div className="mt-3">
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={saving}
              size="lg"
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Enregistrement...
                </>
              ) : (
                <>
                  <i className="bi bi-save me-2"></i>
                  Enregistrer les modifications
                </>
              )}
            </Button>
          </div>
        </Col>

        <Col lg={4}>
          <Card className="bg-light">
            <Card.Body>
              <h5 className="mb-3">
                <i className="bi bi-info-circle text-primary me-2"></i>
                À propos des horaires
              </h5>
              <p>
                <strong>Horaires par défaut</strong><br />
                Ces horaires s'appliquent à tous les espaces du coworking et sont affichés sur la page publique <code>/horaires</code>.
              </p>
              <hr />
              <p>
                <strong>Fermetures exceptionnelles</strong><br />
                Lorsque vous ajoutez une fermeture, une bannière s'affiche automatiquement sur le site pour informer les visiteurs.
              </p>
              <hr />
              <p>
                <strong>Tranches horaires</strong><br />
                Vous pouvez choisir entre une fermeture journée complète ou une fermeture partielle (par exemple: fermé de 14h à 16h). Décochez "Fermeture toute la journée" pour définir des horaires spécifiques.
              </p>
              <hr />
              <p>
                <strong>Bannière automatique</strong><br />
                Les 3 prochaines fermetures sont affichées dans la bannière. La bannière peut être masquée par les visiteurs pour 24h.
              </p>
              <hr />
              <p className="mb-0">
                <strong>Impact sur les réservations</strong><br />
                Les fermetures exceptionnelles empêchent automatiquement les réservations pour ces dates.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
