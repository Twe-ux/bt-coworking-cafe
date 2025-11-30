"use client";

import ProtectedEmail from "@/components/common/ProtectedEmail";

export default function MentionsLegalesPage() {
  const lastUpdate = "1 décembre 2025";

  return (
    <main className="bg-white pb__180">
      {/* Hero Section */}
      <section
        className="pt-5 pb-4 px-3 px-md-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(65, 121, 114, 0.05) 0%, rgba(242, 211, 129, 0.05) 100%)",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-12 text-center py-5">
              <h1 className="display-4 fw-bold text-dark mb-4">
                Mentions{" "}
                <span
                  style={{
                    background: "linear-gradient(to right, #f2d381, #417972)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Légales
                </span>
              </h1>
              <p
                className="lead text-muted mb-3 mx-auto"
                style={{ maxWidth: "600px" }}
              >
                Informations légales et éditoriales
              </p>
              <p className="text-muted small">
                Dernière mise à jour : {lastUpdate}
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
                top: "150px",
                backgroundColor: "#f8f9fa",
              }}
            >
              <h2 className="h5 fw-bold text-dark mb-4">Sommaire</h2>
              <nav className="d-flex flex-column gap-2">
                {[
                  { id: "editeur", label: "1. Éditeur du site" },
                  { id: "hebergeur", label: "2. Hébergeur du site" },
                  { id: "directeur", label: "3. Directeur de publication" },
                  { id: "propriete", label: "4. Propriété intellectuelle" },
                  { id: "donnees", label: "5. Données personnelles" },
                  { id: "cookies", label: "6. Cookies" },
                  { id: "credits", label: "7. Crédits" },
                  { id: "litiges", label: "8. Litiges" },
                  { id: "responsabilite", label: "9. Responsabilité" },
                  { id: "contact", label: "10. Contact" },
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
              {/* Section 1 - Éditeur */}
              <section
                id="editeur"
                className="mb-5"
                style={{ scrollMarginTop: 150 }}
              >
                <h2 className="h3 fw-bold text-dark mb-4">
                  1. Éditeur du site
                </h2>
                <div className="rounded-3 p-4">
                  <h3 className="h5 fw-semibold mb-3">
                    ILY SARL - Cow or King Café
                  </h3>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <p className="mb-2">
                        <strong>Raison sociale :</strong> ILY SARL
                      </p>
                      <p className="mb-2">
                        <strong>Forme juridique :</strong> SARL (Société à
                        Responsabilité Limitée)
                      </p>
                      <p className="mb-2">
                        <strong>Capital social :</strong> 11 000 €
                      </p>
                      <p className="mb-2">
                        <strong>SIRET :</strong> 829 552 264 00022
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-2">
                        <strong>RCS :</strong> Strasbourg B 829 552 264
                      </p>
                      <p className="mb-2">
                        <strong>N° TVA intracommunautaire :</strong> FR 69 829
                        552 264
                      </p>
                      <p className="mb-2">
                        <strong>Code APE/NAF :</strong> 5610A
                      </p>
                    </div>
                  </div>
                  <hr className="my-3" />
                  <p className="mb-2">
                    <strong>Siège social :</strong> 1 rue de la Division
                    Leclerc, 67000 Strasbourg, France
                  </p>
                  <p className="mb-2">
                    <strong>Téléphone :</strong> 09 87 33 45 19
                  </p>
                  <p className="mb-0">
                    <strong>Email :</strong>{" "}
                    <ProtectedEmail
                      user="contact"
                      domain="coworkingcafe.fr"
                      className="ml-email"
                    />
                  </p>
                </div>
              </section>

              {/* Section 2 - Hébergeur */}
              <section
                id="hebergeur"
                className="mb-5"
                style={{ scrollMarginTop: 150 }}
              >
                <h2 className="h3 fw-bold text-dark mb-4">
                  2. Hébergement du site
                </h2>
                <div className="bg-light rounded-3 p-4">
                  <h3 className="h6 fw-semibold text-dark mb-3">
                    Le site est hébergé par :
                  </h3>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div
                        className="border rounded-3 p-3 h-100"
                        style={{ borderColor: "#dee2e6" }}
                      >
                        <h4 className="h6 fw-semibold mb-2">
                          Northflank (Hébergement web)
                        </h4>
                        <p className="mb-1 small">88 Wood St</p>
                        <p className="mb-1 small">London EC2V 7RS</p>
                        <p className="mb-0 small">
                          <a
                            href="https://northflank.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#417972" }}
                          >
                            www.northflank.com
                          </a>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="border rounded-3 p-3 h-100"
                        style={{ borderColor: "#dee2e6" }}
                      >
                        <h4 className="h6 fw-semibold mb-2">
                          MongoDB, Inc. (Base de données)
                        </h4>
                        <p className="mb-1 small">1633 Broadway, 38th Floor</p>
                        <p className="mb-1 small">
                          New York, NY 10019, États-Unis
                        </p>
                        <p className="mb-0 small">
                          <a
                            href="https://www.mongodb.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#417972" }}
                          >
                            www.mongodb.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3 - Directeur de publication */}
              <section
                id="directeur"
                className="mb-5"
                style={{ scrollMarginTop: 150 }}
              >
                <h2 className="h3 fw-bold text-dark mb-4">
                  3. Directeur de publication
                </h2>
                <div
                  className="border rounded-3 p-4"
                  style={{
                    backgroundColor: "#e3f2fd",
                    borderColor: "#90caf9 !important",
                  }}
                >
                  <p className="mb-2" style={{ color: "#1565c0" }}>
                    <strong>Nom :</strong> MILONE Thierry
                  </p>
                  <p className="mb-2" style={{ color: "#1565c0" }}>
                    <strong>Qualité :</strong> Gérant de la société ILY SARL
                  </p>
                  <p className="mb-0" style={{ color: "#1565c0" }}>
                    <strong>Contact :</strong>{" "}
                    <ProtectedEmail
                      user="contact"
                      domain="coworkingcafe.fr"
                      className="dp-email"
                    />
                  </p>
                </div>
              </section>

              {/* Section 4 - Propriété intellectuelle */}
              <section
                id="propriete"
                className="mb-5"
                style={{ scrollMarginTop: 150 }}
              >
                <h2 className="h3 fw-bold text-dark mb-4">
                  4. Propriété intellectuelle
                </h2>

                <h3 className="h5 fw-semibold text-dark mb-3">
                  4.1 Droits d&apos;auteur
                </h3>
                <p className="text-dark mb-3" style={{ lineHeight: "1.8" }}>
                  L&apos;ensemble du contenu de ce site (textes, images, vidéos,
                  logos, icônes, mise en page, code source, etc.) est la
                  propriété exclusive de ILY SARL ou de ses partenaires et est
                  protégé par les lois françaises et internationales relatives à
                  la propriété intellectuelle.
                </p>

                <h3 className="h5 fw-semibold text-dark mb-3">
                  4.2 Utilisation du contenu
                </h3>
                <div
                  className="border rounded-3 p-4 mb-3"
                  style={{
                    backgroundColor: "#fff3e0",
                    borderColor: "#ffb74d !important",
                  }}
                >
                  <p className="mb-2" style={{ color: "#e65100" }}>
                    <strong>
                      Toute reproduction est interdite sans autorisation :
                    </strong>
                  </p>
                  <ul className="mb-0" style={{ color: "#f57c00" }}>
                    <li className="mb-2">
                      Reproduction, représentation, modification, publication,
                      adaptation
                    </li>
                    <li className="mb-2">
                      Traduction ou exploitation commerciale
                    </li>
                    <li className="mb-2">
                      Extraction totale ou partielle, même à des fins privées
                    </li>
                  </ul>
                </div>

                <h3 className="h5 fw-semibold text-dark mb-3">
                  4.3 Marques et logos
                </h3>
                <p className="text-dark mb-3" style={{ lineHeight: "1.8" }}>
                  Les marques &quot;Cow or King Café&quot; et &quot;Cow or
                  King&quot; ainsi que les logos associés sont des marques
                  déposées. Toute utilisation non autorisée constitue une
                  contrefaçon passible de sanctions pénales.
                </p>
              </section>

              {/* Section 5 - Données personnelles */}
              <section
                id="donnees"
                className="mb-5"
                style={{ scrollMarginTop: 150 }}
              >
                <h2 className="h3 fw-bold text-dark mb-4">
                  5. Protection des données personnelles
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
                    📋 Conformité RGPD
                  </h3>
                  <p className="mb-3" style={{ color: "#2e7d32" }}>
                    Les données personnelles collectées sur ce site font
                    l&apos;objet d&apos;un traitement conforme au RGPD
                    (Règlement UE 2016/679).
                  </p>
                  <ul className="mb-0" style={{ color: "#388e3c" }}>
                    <li className="mb-2">
                      <strong>Responsable du traitement :</strong> ILY SARL
                    </li>
                    <li className="mb-2">
                      <strong>Finalités :</strong> Gestion des réservations,
                      communication
                    </li>
                    <li className="mb-2">
                      <strong>Droits :</strong> Accès, rectification,
                      suppression, portabilité
                    </li>
                  </ul>
                </div>

                <p className="text-dark mb-3">
                  Pour plus d&apos;informations, consultez notre{" "}
                  <a
                    href="/confidentiality"
                    style={{ color: "#417972" }}
                    className="text-decoration-none fw-semibold"
                  >
                    Politique de Confidentialité complète
                  </a>
                  .
                </p>

                <h3 className="h5 fw-semibold text-dark mb-3">
                  5.1 Exercice de vos droits
                </h3>
                <p className="text-dark mb-2">
                  Pour exercer vos droits, contactez :
                </p>
                <ul className="text-dark">
                  <li className="mb-2">
                    <strong>Email :</strong>{" "}
                    <ProtectedEmail
                      user="dpo"
                      domain="coworkingcafe.fr"
                      className="ml-email"
                    />
                  </li>
                  <li className="mb-2">
                    <strong>Courrier :</strong> DPO - Cow or King Café, 1 rue de
                    la Division Leclerc, 67000 Strasbourg
                  </li>
                </ul>
              </section>

              {/* Section 6 - Cookies */}
              <section
                id="cookies"
                className="mb-5"
                style={{ scrollMarginTop: 150 }}
              >
                <h2 className="h3 fw-bold text-dark mb-4">
                  6. Politique des cookies
                </h2>

                <p className="text-dark mb-3" style={{ lineHeight: "1.8" }}>
                  Ce site utilise des cookies pour améliorer votre expérience de
                  navigation et analyser l&apos;utilisation du site.
                </p>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div
                      className="border rounded-3 p-3 h-100"
                      style={{ borderColor: "#dee2e6" }}
                    >
                      <h4 className="h6 fw-semibold mb-2">
                        🍪 Cookies essentiels
                      </h4>
                      <p className="mb-2 small text-muted">
                        Nécessaires au fonctionnement
                      </p>
                      <ul className="mb-0 small text-dark">
                        <li>Session utilisateur</li>
                        <li>Panier de réservation</li>
                        <li>Préférences de langue</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div
                      className="border rounded-3 p-3 h-100"
                      style={{ borderColor: "#dee2e6" }}
                    >
                      <h4 className="h6 fw-semibold mb-2">
                        📊 Cookies analytiques
                      </h4>
                      <p className="mb-2 small text-muted">
                        Avec votre consentement
                      </p>
                      <ul className="mb-0 small text-dark">
                        <li>Google Analytics</li>
                        <li>Statistiques de visite</li>
                        <li>Analyse de performance</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div
                  className="border rounded-3 p-3"
                  style={{
                    backgroundColor: "#e3f2fd",
                    borderColor: "#64b5f6 !important",
                  }}
                >
                  <h4
                    className="h6 fw-semibold mb-2"
                    style={{ color: "#0d47a1" }}
                  >
                    ⚙️ Gestion des cookies
                  </h4>
                  <p className="mb-2 small" style={{ color: "#1565c0" }}>
                    Vous pouvez paramétrer vos cookies :
                  </p>
                  <ul className="mb-0 small" style={{ color: "#1976d2" }}>
                    <li className="mb-1">
                      Via le bandeau de consentement lors de votre première
                      visite
                    </li>
                    <li className="mb-1">
                      En modifiant les paramètres de votre navigateur
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 7 - Crédits */}
              <section
                id="credits"
                className="mb-5"
                style={{ scrollMarginTop: 150 }}
              >
                <h2 className="h3 fw-bold text-dark mb-4">7. Crédits</h2>

                <h3 className="h5 fw-semibold text-dark mb-3">
                  7.1 Conception et développement
                </h3>
                <div className="bg-light rounded-3 p-4 mb-3">
                  <p className="mb-2">
                    <strong>Développement web :</strong> ILY SARL
                  </p>
                  <p className="mb-2">
                    <strong>Framework :</strong> Next.js 14, React, TypeScript
                  </p>
                  <p className="mb-0">
                    <strong>Design :</strong> Bootstrap 5
                  </p>
                </div>

                <h3 className="h5 fw-semibold text-dark mb-3">
                  7.2 Contenus et médias
                </h3>
                <ul className="text-dark">
                  <li className="mb-2">
                    <strong>Photographies :</strong> ILY SARL et banques
                    d&apos;images libres de droits
                  </li>
                  <li className="mb-2">
                    <strong>Icônes :</strong> Bootstrap Icons, Font Awesome
                  </li>
                  <li className="mb-2">
                    <strong>Polices :</strong> Google Fonts (Figtree)
                  </li>
                </ul>
              </section>

              {/* Section 8 - Litiges */}
              <section
                id="litiges"
                className="mb-5"
                style={{ scrollMarginTop: 150 }}
              >
                <h2 className="h3 fw-bold text-dark mb-4">
                  8. Droit applicable et litiges
                </h2>

                <h3 className="h5 fw-semibold text-dark mb-3">
                  8.1 Droit applicable
                </h3>
                <p className="text-dark mb-3" style={{ lineHeight: "1.8" }}>
                  Les présentes mentions légales sont soumises au droit
                  français. L&apos;utilisation de ce site implique
                  l&apos;acceptation pleine et entière des conditions générales
                  d&apos;utilisation.
                </p>

                <h3 className="h5 fw-semibold text-dark mb-3">
                  8.2 Résolution des litiges
                </h3>
                <div
                  className="border rounded-3 p-4 mb-3"
                  style={{
                    backgroundColor: "#fff3e0",
                    borderColor: "#ffb74d !important",
                  }}
                >
                  <p className="mb-2" style={{ color: "#e65100" }}>
                    <strong>En cas de litige :</strong>
                  </p>
                  <ol className="mb-0" style={{ color: "#f57c00" }}>
                    <li className="mb-2">
                      Tentative de résolution amiable dans un délai de 30 jours
                    </li>
                    <li className="mb-2">
                      Possibilité de recourir à une médiation de la consommation
                    </li>
                    <li className="mb-0">
                      À défaut, les tribunaux compétents de Strasbourg seront
                      seuls compétents
                    </li>
                  </ol>
                </div>

                <h3 className="h5 fw-semibold text-dark mb-3">
                  8.3 Médiation de la consommation
                </h3>
                <div
                  className="border rounded-3 p-4"
                  style={{
                    backgroundColor: "#e8f5e9",
                    borderColor: "#81c784 !important",
                  }}
                >
                  <p className="mb-2" style={{ color: "#1b5e20" }}>
                    <strong>
                      Conformément à l&apos;article L612-1 du Code de la
                      consommation :
                    </strong>
                  </p>
                  <p className="mb-2" style={{ color: "#2e7d32" }}>
                    En cas de litige, vous pouvez saisir gratuitement un
                    médiateur de la consommation :
                  </p>
                  <ul className="mb-0" style={{ color: "#388e3c" }}>
                    <li className="mb-2">
                      <strong>Plateforme européenne :</strong>{" "}
                      <a
                        href="https://ec.europa.eu/consumers/odr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-underline"
                        style={{ color: "#388e3c" }}
                      >
                        ec.europa.eu/consumers/odr
                      </a>
                    </li>
                    <li className="mb-0">
                      <strong>Médiation française :</strong>{" "}
                      <a
                        href="https://www.economie.gouv.fr/mediation-conso"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-underline"
                        style={{ color: "#388e3c" }}
                      >
                        economie.gouv.fr/mediation-conso
                      </a>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Limitations de responsabilité */}
              <section
                id="responsabilite"
                className="mb-5"
                style={{ scrollMarginTop: 150 }}
              >
                <h2 className="h3 fw-bold text-dark mb-4">
                  9. Limitations de responsabilité
                </h2>

                <h3 className="h5 fw-semibold text-dark mb-3">
                  9.1 Informations du site
                </h3>
                <p className="text-dark mb-3" style={{ lineHeight: "1.8" }}>
                  Les informations contenues sur ce site sont aussi précises que
                  possible. Toutefois, ILY SARL ne pourra être tenue responsable
                  des omissions, inexactitudes ou carences dans la mise à jour.
                </p>

                <h3 className="h5 fw-semibold text-dark mb-3">
                  9.2 Disponibilité du site
                </h3>
                <p className="text-dark mb-3" style={{ lineHeight: "1.8" }}>
                  ILY SARL s&apos;efforce d&apos;assurer au mieux la
                  disponibilité du site mais ne peut garantir un accès
                  ininterrompu, notamment en cas de maintenance, de défaillance
                  technique ou de force majeure.
                </p>

                <h3 className="h5 fw-semibold text-dark mb-3">
                  9.3 Liens hypertextes
                </h3>
                <p className="text-dark mb-3" style={{ lineHeight: "1.8" }}>
                  Le site peut contenir des liens vers d&apos;autres sites. ILY
                  SARL décline toute responsabilité quant au contenu de ces
                  sites externes.
                </p>
              </section>

              {/* Contact */}
              <section
                id="contact"
                className="mb-5"
                style={{ scrollMarginTop: 150 }}
              >
                <h2 className="h3 fw-bold text-dark mb-4">10. Contact</h2>
                <div
                  className="rounded-3 p-4"
                  style={{ backgroundColor: "rgba(65, 121, 114, 0.05)" }}
                >
                  <h3
                    className="h5 fw-semibold mb-3"
                    style={{ color: "#417972" }}
                  >
                    Pour toute question concernant ces mentions légales
                  </h3>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <p className="mb-2">
                        <strong>Email :</strong>{" "}
                        <ProtectedEmail
                          user="contact"
                          domain="coworkingcafe.fr"
                          className="ml-email"
                        />
                      </p>
                      <p className="mb-0">
                        <strong>Téléphone :</strong> 09 87 33 45 19
                      </p>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-2 d-flex gap-1">
                        <p>
                          <strong>Adresse :</strong>{" "}
                        </p>
                        <p>
                          1 rue de la Division Leclerc,
                          <br />
                          67000 Strasbourg
                        </p>
                      </div>
                      <p className="mb-0">
                        <strong>Horaires :</strong> Lun-Ven 9h00-18h00
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Footer du document */}
              <div className="border-top pt-4 text-center small text-muted">
                <p className="mb-2">Document mis à jour le {lastUpdate}</p>
                <p className="mb-0">
                  Version 1.0 - Mentions Légales - Cow or King Café
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-link:hover {
          color: #417972 !important;
          transition: color 0.2s ease;
        }
      `}</style>
    </main>
  );
}
