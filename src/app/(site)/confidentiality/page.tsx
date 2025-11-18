"use client";

import { ContactDPOForm } from "@/components/site/ContactDPOForm";

export default function ConfidentialityPage() {
  const lastUpdate = "15 août 2024";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-vh-100 bg-white">
      {/* Hero Section */}
      <section
        className="pt-5 pb-4 px-3 px-md-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(63, 81, 181, 0.1) 100%)",
          marginTop: "100px",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-12 text-center py-5">
              <div
                className="d-inline-flex align-items-center rounded-pill px-4 py-2 mb-3"
                style={{
                  backgroundColor: "rgba(33, 150, 243, 0.1)",
                  color: "#1565c0",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                🔒 RGPD Compliant
              </div>
              <h1 className="display-4 fw-bold text-dark mb-4">
                Politique de{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(to right, #2196f3, #3f51b5)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Confidentialité
                </span>
              </h1>
              <p
                className="lead text-muted mb-3 mx-auto"
                style={{ maxWidth: "600px" }}
              >
                Transparence totale sur la collecte et le traitement de vos
                données personnelles
              </p>
              <p className="text-muted small">
                Dernière mise à jour : {lastUpdate} • Conforme RGPD
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-5">
        <div className="row g-4">
          {/* Sommaire */}
          <div className="col-lg-3">
            <div
              className="position-sticky rounded-3 p-4"
              style={{
                top: "100px",
                backgroundColor: "#f8f9fa",
              }}
            >
              <h2 className="h5 fw-bold text-dark mb-4">Sommaire</h2>
              <nav className="d-flex flex-column gap-2">
                {[
                  { id: "identite", label: "1. Identité du responsable" },
                  { id: "donnees-collectees", label: "2. Données collectées" },
                  {
                    id: "finalites",
                    label: "3. Finalités du traitement",
                  },
                  { id: "bases-legales", label: "4. Bases légales" },
                  { id: "destinataires", label: "5. Destinataires" },
                  {
                    id: "conservation",
                    label: "6. Conservation des données",
                  },
                  { id: "droits", label: "7. Vos droits" },
                  { id: "securite", label: "8. Sécurité" },
                  { id: "cookies", label: "9. Cookies" },
                  {
                    id: "transferts",
                    label: "10. Transferts internationaux",
                  },
                  { id: "modifications", label: "11. Modifications" },
                  { id: "contact-dpo", label: "12. Contact DPO" },
                ].map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="text-decoration-none text-muted small hover-link"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Contenu */}
          <div className="col-lg-9">
            <div className="legal-content">
              {/* Résumé exécutif */}
              <div
                className="border rounded-3 p-4 mb-5"
                style={{
                  backgroundColor: "#e3f2fd",
                  borderColor: "#90caf9 !important",
                }}
              >
                <h2
                  className="h4 fw-bold mb-4"
                  style={{ color: "#0d47a1" }}
                >
                  📋 Résumé de notre engagement
                </h2>
                <div className="row g-4">
                  {[
                    {
                      title: "Ce que nous collectons :",
                      items: [
                        "Informations de réservation",
                        "Données de facturation",
                        "Statistiques d'utilisation",
                      ],
                    },
                    {
                      title: "Pourquoi :",
                      items: [
                        "Gestion de votre compte",
                        "Amélioration de nos services",
                        "Respect des obligations légales",
                      ],
                    },
                    {
                      title: "Vos droits :",
                      items: [
                        "Accès à vos données",
                        "Rectification et suppression",
                        "Portabilité des données",
                      ],
                    },
                    {
                      title: "Notre engagement :",
                      items: [
                        "Sécurité maximale",
                        "Transparence totale",
                        "Respect du RGPD",
                      ],
                    },
                  ].map((section, idx) => (
                    <div key={idx} className="col-md-6">
                      <h3
                        className="h6 fw-semibold mb-2"
                        style={{ color: "#1565c0" }}
                      >
                        {section.title}
                      </h3>
                      <ul
                        className="list-unstyled mb-0 small"
                        style={{ color: "#1976d2" }}
                      >
                        {section.items.map((item, i) => (
                          <li key={i} className="mb-1">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Article 1 - Identité */}
              <section id="identite" className="mb-5">
                <h2 className="h3 fw-bold text-dark mb-4">
                  1. Identité du responsable de traitement
                </h2>
                <div className="bg-light rounded-3 p-4">
                  <p className="mb-3">
                    <strong>Responsable de traitement :</strong> Cow or King
                    Café (ILY SARL)
                  </p>
                  <p className="mb-3">
                    <strong>Adresse :</strong> 1 rue de la Division Leclerc,
                    67000 Strasbourg, France
                  </p>
                  <p className="mb-3">
                    <strong>Email :</strong>{" "}
                    <a
                      href="mailto:strasbourg@coworkingcafe.fr"
                      style={{ color: "#417972" }}
                    >
                      strasbourg@coworkingcafe.fr
                    </a>
                  </p>
                  <p className="mb-3">
                    <strong>Téléphone :</strong> 09 87 33 45 19
                  </p>
                  <p className="mb-0">
                    <strong>Délégué à la Protection des Données (DPO) :</strong>{" "}
                    <a
                      href="mailto:strasbourg@coworkingcafe.fr"
                      style={{ color: "#417972" }}
                    >
                      strasbourg@coworkingcafe.fr
                    </a>
                  </p>
                </div>
              </section>

              {/* Article 2 - Données collectées */}
              <section id="donnees-collectees" className="mb-5">
                <h2 className="h3 fw-bold text-dark mb-4">
                  2. Données personnelles collectées
                </h2>

                <h3 className="h5 fw-semibold text-dark mb-3">
                  2.1 Données d&apos;identification
                </h3>
                <div
                  className="border rounded-3 p-4 mb-4"
                  style={{
                    backgroundColor: "#fff3e0",
                    borderColor: "#ffb74d !important",
                  }}
                >
                  <ul className="mb-0" style={{ color: "#e65100" }}>
                    <li className="mb-2">
                      <strong>Nom et prénom</strong> - Obligatoire pour la
                      création de compte
                    </li>
                    <li className="mb-2">
                      <strong>Adresse email</strong> - Obligatoire pour la
                      communication et connexion
                    </li>
                    <li className="mb-2">
                      <strong>Numéro de téléphone</strong> - Facultatif, pour
                      les communications urgentes
                    </li>
                    <li className="mb-2">
                      <strong>Adresse postale</strong> - Obligatoire pour la
                      facturation
                    </li>
                    <li className="mb-0">
                      <strong>Date de naissance</strong> - Facultative, pour
                      les offres spéciales
                    </li>
                  </ul>
                </div>

                <h3 className="h5 fw-semibold text-dark mb-3">
                  2.2 Données de réservation et utilisation
                </h3>
                <ul className="text-dark mb-4">
                  <li className="mb-2">
                    Historique des réservations (dates, heures, espaces)
                  </li>
                  <li className="mb-2">
                    Préférences d&apos;utilisation et habitudes
                  </li>
                  <li className="mb-2">
                    Données de présence et d&apos;accès aux espaces
                  </li>
                  <li className="mb-2">
                    Retours et évaluations des services
                  </li>
                </ul>

                <h3 className="h5 fw-semibold text-dark mb-3">
                  2.3 Données de paiement
                </h3>
                <ul className="text-dark mb-4">
                  <li className="mb-2">Informations de facturation</li>
                  <li className="mb-2">
                    Historique des transactions (montants, dates)
                  </li>
                  <li className="mb-2">
                    Modes de paiement utilisés (type de carte, sans numéros)
                  </li>
                </ul>

                <h3 className="h5 fw-semibold text-dark mb-3">
                  2.4 Données techniques
                </h3>
                <ul className="text-dark mb-4">
                  <li className="mb-2">
                    Adresse IP et géolocalisation approximative
                  </li>
                  <li className="mb-2">
                    Type de navigateur et système d&apos;exploitation
                  </li>
                  <li className="mb-2">
                    Pages visitées et temps de navigation
                  </li>
                  <li className="mb-2">
                    Données de connexion WiFi (avec consentement)
                  </li>
                </ul>
              </section>

              {/* Article 3 - Finalités */}
              <section id="finalites" className="mb-5">
                <h2 className="h3 fw-bold text-dark mb-4">
                  3. Finalités du traitement
                </h2>

                <div className="row g-4">
                  <div className="col-md-6">
                    <div
                      className="border rounded-3 p-4 h-100"
                      style={{
                        backgroundColor: "#e8f5e9",
                        borderColor: "#81c784 !important",
                      }}
                    >
                      <h3
                        className="h6 fw-semibold mb-3"
                        style={{ color: "#1b5e20" }}
                      >
                        🎯 Finalités principales
                      </h3>
                      <ul
                        className="list-unstyled mb-0 small"
                        style={{ color: "#2e7d32" }}
                      >
                        {[
                          "Gestion des comptes clients",
                          "Traitement des réservations",
                          "Facturation et paiements",
                          "Support client et assistance",
                          "Sécurité des espaces",
                        ].map((item, i) => (
                          <li key={i} className="mb-2">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div
                      className="border rounded-3 p-4 h-100"
                      style={{
                        backgroundColor: "#e3f2fd",
                        borderColor: "#64b5f6 !important",
                      }}
                    >
                      <h3
                        className="h6 fw-semibold mb-3"
                        style={{ color: "#0d47a1" }}
                      >
                        📊 Finalités secondaires
                      </h3>
                      <ul
                        className="list-unstyled mb-0 small"
                        style={{ color: "#1565c0" }}
                      >
                        {[
                          "Amélioration des services",
                          "Analyses statistiques anonymisées",
                          "Communication commerciale*",
                          "Personnalisation de l'expérience",
                          "Études de satisfaction",
                        ].map((item, i) => (
                          <li key={i} className="mb-2">
                            • {item}
                          </li>
                        ))}
                      </ul>
                      <p className="mb-0 mt-2" style={{ fontSize: "0.75rem", color: "#1976d2" }}>
                        *Avec votre consentement explicite
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Article 4 - Bases légales - Simplifié pour économiser l'espace */}
              <section id="bases-legales" className="mb-5">
                <h2 className="h3 fw-bold text-dark mb-4">
                  4. Bases légales du traitement
                </h2>
                <p className="text-dark mb-3">
                  Nous traitons vos données sur les bases légales suivantes :
                </p>
                <ul className="text-dark">
                  <li className="mb-2">
                    <strong>Exécution du contrat :</strong> Pour la gestion de
                    vos réservations et facturation
                  </li>
                  <li className="mb-2">
                    <strong>Obligation légale :</strong> Conservation des
                    factures, déclarations fiscales
                  </li>
                  <li className="mb-2">
                    <strong>Intérêt légitime :</strong> Sécurité, amélioration
                    des services, analyses statistiques
                  </li>
                  <li className="mb-2">
                    <strong>Consentement :</strong> Communication commerciale,
                    cookies non-essentiels
                  </li>
                </ul>
              </section>

              {/* Article 5 - Destinataires */}
              <section id="destinataires" className="mb-5">
                <h2 className="h3 fw-bold text-dark mb-4">
                  5. Destinataires des données
                </h2>

                <h3 className="h5 fw-semibold text-dark mb-3">
                  5.1 Destinataires internes
                </h3>
                <ul className="text-dark mb-4">
                  <li className="mb-2">
                    Personnel autorisé de Cow or King Café
                  </li>
                  <li className="mb-2">Équipe de gestion et administration</li>
                  <li className="mb-2">Service client et support technique</li>
                </ul>

                <h3 className="h5 fw-semibold text-dark mb-3">
                  5.2 Prestataires et sous-traitants
                </h3>
                <div
                  className="border rounded-3 p-4 mb-4"
                  style={{
                    backgroundColor: "#fff3e0",
                    borderColor: "#ffb74d !important",
                  }}
                >
                  <p className="mb-3" style={{ color: "#e65100" }}>
                    Nous travaillons uniquement avec des prestataires conformes
                    RGPD :
                  </p>
                  <ul className="mb-0" style={{ color: "#f57c00" }}>
                    <li className="mb-2">
                      <strong>Stripe</strong> - Traitement des paiements
                      sécurisés
                    </li>
                    <li className="mb-2">
                      <strong>Resend</strong> - Envoi d&apos;emails transactionnels
                    </li>
                    <li className="mb-2">
                      <strong>MongoDB Atlas</strong> - Hébergement sécurisé des
                      données
                    </li>
                    <li className="mb-2">
                      <strong>Vercel</strong> - Hébergement de la plateforme
                      web
                    </li>
                  </ul>
                </div>
              </section>

              {/* Article 6 - Conservation */}
              <section id="conservation" className="mb-5">
                <h2 className="h3 fw-bold text-dark mb-4">
                  6. Durée de conservation
                </h2>

                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Type de données</th>
                        <th>Durée active</th>
                        <th>Archivage</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Compte client actif</td>
                        <td>Durée de la relation</td>
                        <td>3 ans après clôture</td>
                      </tr>
                      <tr>
                        <td>Données de facturation</td>
                        <td>5 ans</td>
                        <td>10 ans (obligation légale)</td>
                      </tr>
                      <tr>
                        <td>Historique des réservations</td>
                        <td>3 ans</td>
                        <td>1 an supplémentaire</td>
                      </tr>
                      <tr>
                        <td>Données de navigation</td>
                        <td>13 mois maximum</td>
                        <td>Suppression automatique</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Article 7 - Vos droits */}
              <section id="droits" className="mb-5">
                <h2 className="h3 fw-bold text-dark mb-4">
                  7. Vos droits sur vos données
                </h2>

                <div
                  className="border rounded-3 p-4 mb-4"
                  style={{
                    backgroundColor: "#e8f5e9",
                    borderColor: "#81c784 !important",
                  }}
                >
                  <h3
                    className="h5 fw-semibold mb-3"
                    style={{ color: "#1b5e20" }}
                  >
                    🔒 Vos droits fondamentaux RGPD
                  </h3>
                  <p className="mb-4" style={{ color: "#2e7d32" }}>
                    Conformément au RGPD, vous disposez des droits suivants :
                  </p>

                  <div className="row g-3">
                    {[
                      {
                        icon: "📋",
                        title: "Droit d'accès (Art. 15)",
                        desc: "Obtenir une copie de toutes vos données",
                      },
                      {
                        icon: "✏️",
                        title: "Droit de rectification (Art. 16)",
                        desc: "Corriger vos données inexactes",
                      },
                      {
                        icon: "🗑️",
                        title: "Droit à l'effacement (Art. 17)",
                        desc: "Demander la suppression de vos données",
                      },
                      {
                        icon: "⏸️",
                        title: "Droit à la limitation (Art. 18)",
                        desc: "Suspendre le traitement de vos données",
                      },
                      {
                        icon: "📦",
                        title: "Droit à la portabilité (Art. 20)",
                        desc: "Récupérer vos données dans un format structuré",
                      },
                      {
                        icon: "🚫",
                        title: "Droit d'opposition (Art. 21)",
                        desc: "Vous opposer au traitement",
                      },
                    ].map((right, i) => (
                      <div key={i} className="col-md-6">
                        <div className="bg-white rounded-3 p-3">
                          <h4 className="h6 fw-semibold mb-2" style={{ color: "#1b5e20" }}>
                            {right.icon} {right.title}
                          </h4>
                          <p className="mb-0 small" style={{ color: "#2e7d32" }}>
                            {right.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <h3 className="h5 fw-semibold text-dark mb-3">
                  7.1 Comment exercer vos droits
                </h3>
                <div
                  className="border rounded-3 p-4"
                  style={{
                    backgroundColor: "#e3f2fd",
                    borderColor: "#64b5f6 !important",
                  }}
                >
                  <p className="mb-3" style={{ color: "#1565c0" }}>
                    Pour exercer vos droits, contactez-nous par :
                  </p>
                  <ul className="mb-3" style={{ color: "#1976d2" }}>
                    <li className="mb-2">
                      <strong>Email :</strong>{" "}
                      <a href="mailto:strasbourg@coworkingcafe.fr" className="text-decoration-underline">
                        strasbourg@coworkingcafe.fr
                      </a>
                    </li>
                    <li className="mb-2">
                      <strong>Courrier :</strong> DPO - Cow or King Café, 1 rue
                      de la Division Leclerc, 67000 Strasbourg
                    </li>
                  </ul>
                  <p className="mb-0 small" style={{ color: "#1976d2" }}>
                    <strong>Délai de réponse :</strong> 1 mois maximum
                  </p>
                </div>
              </section>

              {/* Article 8 - Sécurité */}
              <section id="securite" className="mb-5">
                <h2 className="h3 fw-bold text-dark mb-4">
                  8. Sécurité des données
                </h2>

                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <div
                      className="border rounded-3 p-4 h-100"
                      style={{
                        backgroundColor: "#ffebee",
                        borderColor: "#ef5350 !important",
                      }}
                    >
                      <h3
                        className="h6 fw-semibold mb-3"
                        style={{ color: "#c62828" }}
                      >
                        🔐 Mesures techniques
                      </h3>
                      <ul
                        className="list-unstyled mb-0 small"
                        style={{ color: "#d32f2f" }}
                      >
                        {[
                          "Chiffrement SSL/TLS (HTTPS)",
                          "Chiffrement des données sensibles",
                          "Sauvegardes automatiques",
                          "Pare-feu et protection DDoS",
                          "Surveillance des accès",
                        ].map((item, i) => (
                          <li key={i} className="mb-2">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div
                      className="border rounded-3 p-4 h-100"
                      style={{
                        backgroundColor: "#f3e5f5",
                        borderColor: "#ba68c8 !important",
                      }}
                    >
                      <h3
                        className="h6 fw-semibold mb-3"
                        style={{ color: "#6a1b9a" }}
                      >
                        👥 Mesures organisationnelles
                      </h3>
                      <ul
                        className="list-unstyled mb-0 small"
                        style={{ color: "#7b1fa2" }}
                      >
                        {[
                          "Formation RGPD du personnel",
                          "Accès limité aux données",
                          "Gestion des incidents",
                          "Audits sécurité réguliers",
                          "Politique de mots de passe",
                        ].map((item, i) => (
                          <li key={i} className="mb-2">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Articles simplifiés pour économiser l'espace */}
              <section id="cookies" className="mb-5">
                <h2 className="h3 fw-bold text-dark mb-4">
                  9. Politique des cookies
                </h2>
                <p className="text-dark mb-3">
                  Nous utilisons des cookies essentiels pour le fonctionnement
                  du site et des cookies analytiques avec votre consentement.
                  Vous pouvez gérer vos préférences à tout moment.
                </p>
              </section>

              <section id="transferts" className="mb-5">
                <h2 className="h3 fw-bold text-dark mb-4">
                  10. Transferts internationaux
                </h2>
                <p className="text-dark mb-3">
                  Certains prestataires peuvent être situés hors UE (Stripe,
                  MongoDB). Tous les transferts sont encadrés par des garanties
                  appropriées (clauses contractuelles types, certifications).
                </p>
              </section>

              <section id="modifications" className="mb-5">
                <h2 className="h3 fw-bold text-dark mb-4">
                  11. Modifications de la politique
                </h2>
                <p className="text-dark mb-3">
                  Cette politique peut être mise à jour. Les modifications
                  importantes vous seront notifiées par email 30 jours avant
                  leur entrée en vigueur.
                </p>
              </section>

              {/* Article 12 - Contact DPO */}
              <section id="contact-dpo" className="mb-5">
                <h2 className="h3 fw-bold text-dark mb-4">
                  12. Contact et exercice de vos droits
                </h2>

                <div
                  className="border rounded-3 p-4 mb-4"
                  style={{
                    backgroundColor: "#e8f5e9",
                    borderColor: "#81c784 !important",
                  }}
                >
                  <h3
                    className="h6 fw-semibold mb-3"
                    style={{ color: "#1b5e20" }}
                  >
                    📞 Délégué à la Protection des Données (DPO)
                  </h3>
                  <p className="mb-3" style={{ color: "#2e7d32" }}>
                    Pour toute question ou exercer vos droits :
                  </p>
                  <div className="row g-3" style={{ color: "#388e3c" }}>
                    <div className="col-md-6">
                      <p className="mb-2">
                        <strong>Email :</strong>{" "}
                        <a
                          href="mailto:strasbourg@coworkingcafe.fr"
                          className="text-decoration-underline"
                        >
                          strasbourg@coworkingcafe.fr
                        </a>
                      </p>
                      <p className="mb-2">
                        <strong>Téléphone :</strong> 09 87 33 45 19
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-2">
                        <strong>Horaires :</strong> Lun-Ven 9h-17h
                      </p>
                      <p className="mb-2">
                        <strong>Délai :</strong> 1 mois maximum
                      </p>
                    </div>
                  </div>
                </div>

                {/* Formulaire contact DPO */}
                <ContactDPOForm />

                <div
                  className="border rounded-3 p-4 mt-4"
                  style={{
                    backgroundColor: "#ffebee",
                    borderColor: "#ef5350 !important",
                  }}
                >
                  <h3
                    className="h6 fw-semibold mb-3"
                    style={{ color: "#c62828" }}
                  >
                    🏛️ Réclamation auprès de la CNIL
                  </h3>
                  <p className="mb-3" style={{ color: "#d32f2f" }}>
                    Si vous n&apos;êtes pas satisfait(e) de notre réponse :
                  </p>
                  <ul className="mb-0" style={{ color: "#e53935" }}>
                    <li className="mb-2">
                      <strong>En ligne :</strong>{" "}
                      <a
                        href="https://www.cnil.fr/fr/plaintes"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-underline"
                      >
                        www.cnil.fr/fr/plaintes
                      </a>
                    </li>
                    <li className="mb-2">
                      <strong>Téléphone :</strong> 01 53 73 22 22
                    </li>
                  </ul>
                </div>
              </section>

              {/* Footer du document */}
              <div className="border-top pt-4 text-center small text-muted">
                <p className="mb-2">Document mis à jour le {lastUpdate}</p>
                <p className="mb-2">
                  Version 1.0 - Politique de Confidentialité RGPD - Cow or King
                  Café
                </p>
                <p className="mb-0">
                  Conforme au Règlement Général sur la Protection des Données
                  (UE) 2016/679
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className="btn btn-primary rounded-circle position-fixed bottom-0 end-0 m-4"
        style={{
          width: "50px",
          height: "50px",
          backgroundColor: "#417972",
          borderColor: "#417972",
        }}
        aria-label="Retour en haut"
      >
        ↑
      </button>

      <style jsx>{`
        .hover-link:hover {
          color: #417972 !important;
          transition: color 0.2s ease;
        }
      `}</style>
    </main>
  );
}
