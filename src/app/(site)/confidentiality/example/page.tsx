import { Metadata } from "next";

import { ContactDPOForm } from "@/components/legal/ContactDPOForm";

export const metadata: Metadata = {
  title:
    "Politique de Confidentialité | Cow or King Café - Coworking Strasbourg",
  description:
    "Politique de confidentialité et protection des données personnelles conforme RGPD. Découvrez vos droits et comment nous protégeons vos données.",
  keywords:
    "confidentialité, RGPD, données personnelles, protection, coworking, strasbourg",
};

export default function ConfidentialitePage() {
  const lastUpdate = "15 août 2024";

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 mb-6">
            🔒 RGPD Compliant
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Politique de{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Confidentialité
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
            Transparence totale sur la collecte et le traitement de vos données
            personnelles
          </p>
          <p className="text-sm text-gray-500">
            Dernière mise à jour : {lastUpdate} • Conforme RGPD
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sommaire */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-gray-50 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Sommaire</h2>
              <nav className="space-y-2">
                <a
                  href="#identite"
                  className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  1. Identité du responsable
                </a>
                <a
                  href="#donnees-collectees"
                  className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  2. Données collectées
                </a>
                <a
                  href="#finalites"
                  className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  3. Finalités du traitement
                </a>
                <a
                  href="#bases-legales"
                  className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  4. Bases légales
                </a>
                <a
                  href="#destinataires"
                  className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  5. Destinataires
                </a>
                <a
                  href="#conservation"
                  className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  6. Conservation des données
                </a>
                <a
                  href="#droits"
                  className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  7. Vos droits
                </a>
                <a
                  href="#securite"
                  className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  8. Sécurité
                </a>
                <a
                  href="#cookies"
                  className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  9. Cookies
                </a>
                <a
                  href="#transferts"
                  className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  10. Transferts internationaux
                </a>
                <a
                  href="#modifications"
                  className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  11. Modifications
                </a>
                <a
                  href="#contact-dpo"
                  className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  12. Contact DPO
                </a>
              </nav>
            </div>
          </div>

          {/* Contenu */}
          <div className="lg:col-span-3">
            <div className="prose prose-lg max-w-none">
              {/* Résumé exécutif */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-12">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">
                  📋 Résumé de notre engagement
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">
                      Ce que nous collectons :
                    </h3>
                    <ul className="text-blue-700 space-y-1">
                      <li>• Informations de réservation</li>
                      <li>• Données de facturation</li>
                      <li>• Statistiques d'utilisation</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">
                      Pourquoi :
                    </h3>
                    <ul className="text-blue-700 space-y-1">
                      <li>• Gestion de votre compte</li>
                      <li>• Amélioration de nos services</li>
                      <li>• Respect des obligations légales</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">
                      Vos droits :
                    </h3>
                    <ul className="text-blue-700 space-y-1">
                      <li>• Accès à vos données</li>
                      <li>• Rectification et suppression</li>
                      <li>• Portabilité des données</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">
                      Notre engagement :
                    </h3>
                    <ul className="text-blue-700 space-y-1">
                      <li>• Sécurité maximale</li>
                      <li>• Transparence totale</li>
                      <li>• Respect du RGPD</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Article 1 */}
              <section id="identite" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  1. Identité du responsable de traitement
                </h2>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="mb-4">
                    <strong>Responsable de traitement :</strong> Cow or King
                    Café
                  </p>
                  <p className="mb-4">
                    <strong>Adresse :</strong> 1 rue de la Division Leclerc,
                    67000 Strasbourg, France
                  </p>
                  <p className="mb-4">
                    <strong>Email :</strong>{" "}
                    <a
                      href="mailto:dpo@coworkingcafe.fr"
                      className="text-blue-600 hover:underline"
                    >
                      dpo@coworkingcafe.fr
                    </a>
                  </p>
                  <p className="mb-4">
                    <strong>Téléphone :</strong> 03 88 XX XX XX
                  </p>
                  <p>
                    <strong>Délégué à la Protection des Données (DPO) :</strong>{" "}
                    <a
                      href="mailto:dpo@coworkingcafe.fr"
                      className="text-blue-600 hover:underline"
                    >
                      dpo@coworkingcafe.fr
                    </a>
                  </p>
                </div>
              </section>

              {/* Article 2 */}
              <section id="donnees-collectees" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  2. Données personnelles collectées
                </h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  2.1 Données d'identification
                </h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
                  <ul className="space-y-2 text-gray-700">
                    <li>
                      <strong>Nom et prénom</strong> - Obligatoire pour la
                      création de compte
                    </li>
                    <li>
                      <strong>Adresse email</strong> - Obligatoire pour la
                      communication et connexion
                    </li>
                    <li>
                      <strong>Numéro de téléphone</strong> - Facultatif, pour
                      les communications urgentes
                    </li>
                    <li>
                      <strong>Adresse postale</strong> - Obligatoire pour la
                      facturation
                    </li>
                    <li>
                      <strong>Date de naissance</strong> - Facultative, pour les
                      offres spéciales
                    </li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  2.2 Données de réservation et utilisation
                </h3>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  <li>Historique des réservations (dates, heures, espaces)</li>
                  <li>Préférences d'utilisation et habitudes</li>
                  <li>Données de présence et d'accès aux espaces</li>
                  <li>Retours et évaluations des services</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  2.3 Données de paiement
                </h3>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  <li>Informations de facturation</li>
                  <li>Historique des transactions (montants, dates)</li>
                  <li>
                    Modes de paiement utilisés (type de carte, sans numéros)
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  2.4 Données techniques
                </h3>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  <li>Adresse IP et géolocalisation approximative</li>
                  <li>Type de navigateur et système d'exploitation</li>
                  <li>Pages visitées et temps de navigation</li>
                  <li>Données de connexion WiFi (avec consentement)</li>
                </ul>
              </section>

              {/* Article 3 */}
              <section id="finalites" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  3. Finalités du traitement
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-3">
                      🎯 Finalités principales
                    </h3>
                    <ul className="text-green-800 space-y-2 text-sm">
                      <li>• Gestion des comptes clients</li>
                      <li>• Traitement des réservations</li>
                      <li>• Facturation et paiements</li>
                      <li>• Support client et assistance</li>
                      <li>• Sécurité des espaces</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">
                      📊 Finalités secondaires
                    </h3>
                    <ul className="text-blue-800 space-y-2 text-sm">
                      <li>• Amélioration des services</li>
                      <li>• Analyses statistiques anonymisées</li>
                      <li>• Communication commerciale*</li>
                      <li>• Personnalisation de l'expérience</li>
                      <li>• Études de satisfaction</li>
                    </ul>
                    <p className="text-xs text-blue-600 mt-2">
                      *Avec votre consentement explicite
                    </p>
                  </div>
                </div>
              </section>

              {/* Article 4 */}
              <section id="bases-legales" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  4. Bases légales du traitement
                </h2>

                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      📝 Exécution du contrat (Art. 6.1.b RGPD)
                    </h3>
                    <p className="text-gray-700 mb-3">
                      Traitement nécessaire à l'exécution de nos services de
                      coworking :
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Gestion des réservations et accès aux espaces</li>
                      <li>Facturation et encaissement des paiements</li>
                      <li>Support client et service après-vente</li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      ⚖️ Obligation légale (Art. 6.1.c RGPD)
                    </h3>
                    <p className="text-gray-700 mb-3">
                      Traitements imposés par la loi française :
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Conservation des factures (10 ans)</li>
                      <li>Déclarations fiscales et comptables</li>
                      <li>Lutte contre le blanchiment d'argent</li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      🎯 Intérêt légitime (Art. 6.1.f RGPD)
                    </h3>
                    <p className="text-gray-700 mb-3">
                      Traitements justifiés par notre intérêt légitime :
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Sécurité des personnes et des biens</li>
                      <li>Amélioration de nos services</li>
                      <li>Analyses statistiques anonymisées</li>
                      <li>Prévention de la fraude</li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      ✅ Consentement (Art. 6.1.a RGPD)
                    </h3>
                    <p className="text-gray-700 mb-3">
                      Traitements soumis à votre consentement explicite :
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Communication commerciale et newsletter</li>
                      <li>Cookies non-essentiels</li>
                      <li>Géolocalisation précise</li>
                      <li>Données de navigation détaillées</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Article 5 */}
              <section id="destinataires" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  5. Destinataires des données
                </h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  5.1 Destinataires internes
                </h3>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  <li>Personnel autorisé de Cow or King Café</li>
                  <li>Équipe de gestion et administration</li>
                  <li>Service client et support technique</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  5.2 Prestataires et sous-traitants
                </h3>
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                  <p className="text-orange-800 mb-4">
                    Nous travaillons uniquement avec des prestataires conformes
                    RGPD :
                  </p>
                  <ul className="list-disc list-inside text-orange-700 space-y-2">
                    <li>
                      <strong>Stripe</strong> - Traitement des paiements
                      sécurisés
                    </li>
                    <li>
                      <strong>Resend</strong> - Envoi d'emails transactionnels
                    </li>
                    <li>
                      <strong>MongoDB Atlas</strong> - Hébergement sécurisé des
                      données
                    </li>
                    <li>
                      <strong>Vercel</strong> - Hébergement de la plateforme web
                    </li>
                    <li>
                      <strong>Google Maps</strong> - Services de géolocalisation
                    </li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-6">
                  5.3 Autorités compétentes
                </h3>
                <p className="text-gray-700">
                  Vos données peuvent être transmises aux autorités compétentes
                  uniquement dans le cadre d'obligations légales ou de
                  réquisitions judiciaires.
                </p>
              </section>

              {/* Article 6 */}
              <section id="conservation" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  6. Durée de conservation
                </h2>

                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type de données
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durée active
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Archivage
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          Compte client actif
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          Durée de la relation
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          3 ans après clôture
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          Données de facturation
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          5 ans
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          10 ans (obligation légale)
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          Historique des réservations
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          3 ans
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          1 an supplémentaire
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          Données de navigation
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          13 mois maximum
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          Suppression automatique
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          Consentements marketing
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          3 ans
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          Renouvellement requis
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Article 7 */}
              <section id="droits" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  7. Vos droits sur vos données
                </h2>

                <div className="bg-green-50 border border-green-200 rounded-2xl p-8 mb-8">
                  <h3 className="text-xl font-semibold text-green-900 mb-4">
                    🔒 Vos droits fondamentaux RGPD
                  </h3>
                  <p className="text-green-800 mb-6">
                    Conformément au RGPD, vous disposez des droits suivants que
                    vous pouvez exercer à tout moment :
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-green-900 mb-2">
                          📋 Droit d'accès (Art. 15)
                        </h4>
                        <p className="text-green-700 text-sm">
                          Obtenir une copie de toutes vos données et
                          informations sur leur traitement
                        </p>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-green-900 mb-2">
                          ✏️ Droit de rectification (Art. 16)
                        </h4>
                        <p className="text-green-700 text-sm">
                          Corriger ou compléter vos données inexactes ou
                          incomplètes
                        </p>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-green-900 mb-2">
                          🗑️ Droit à l'effacement (Art. 17)
                        </h4>
                        <p className="text-green-700 text-sm">
                          Demander la suppression de vos données dans certaines
                          conditions
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-green-900 mb-2">
                          ⏸️ Droit à la limitation (Art. 18)
                        </h4>
                        <p className="text-green-700 text-sm">
                          Demander la suspension temporaire du traitement de vos
                          données
                        </p>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-green-900 mb-2">
                          📦 Droit à la portabilité (Art. 20)
                        </h4>
                        <p className="text-green-700 text-sm">
                          Récupérer vos données dans un format structuré et les
                          transférer
                        </p>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-green-900 mb-2">
                          🚫 Droit d'opposition (Art. 21)
                        </h4>
                        <p className="text-green-700 text-sm">
                          Vous opposer au traitement pour des raisons légitimes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  7.1 Comment exercer vos droits
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <p className="text-blue-800 mb-4">
                    Pour exercer vos droits, contactez-nous par :
                  </p>
                  <ul className="text-blue-700 space-y-2">
                    <li>
                      <strong>Email :</strong>{" "}
                      <a
                        href="mailto:dpo@coworkingcafe.fr"
                        className="underline"
                      >
                        dpo@coworkingcafe.fr
                      </a>
                    </li>
                    <li>
                      <strong>Courrier :</strong> DPO - Cow or King Café, 1 rue
                      de la Division Leclerc, 67000 Strasbourg
                    </li>
                    <li>
                      <strong>Formulaire en ligne :</strong> Disponible en bas
                      de cette page
                    </li>
                  </ul>
                  <p className="text-blue-700 text-sm mt-4">
                    <strong>Délai de réponse :</strong> 1 mois maximum
                    (prolongeable de 2 mois si nécessaire)
                  </p>
                </div>
              </section>

              {/* Article 8 */}
              <section id="securite" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  8. Sécurité des données
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-red-900 mb-3">
                      🔐 Mesures techniques
                    </h3>
                    <ul className="text-red-800 space-y-2 text-sm">
                      <li>• Chiffrement SSL/TLS (HTTPS)</li>
                      <li>• Chiffrement des données sensibles</li>
                      <li>• Sauvegardes automatiques sécurisées</li>
                      <li>• Pare-feu et protection DDoS</li>
                      <li>• Surveillance continue des accès</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-purple-900 mb-3">
                      👥 Mesures organisationnelles
                    </h3>
                    <ul className="text-purple-800 space-y-2 text-sm">
                      <li>• Formation RGPD du personnel</li>
                      <li>• Accès limité aux données nécessaires</li>
                      <li>• Procédures de gestion des incidents</li>
                      <li>• Audits sécurité réguliers</li>
                      <li>• Politique de mots de passe robustes</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-6">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-3">
                    🚨 En cas de violation de données
                  </h3>
                  <p className="text-yellow-800">
                    Nous nous engageons à notifier toute violation de données à
                    la CNIL dans les 72h et à vous informer si vos droits et
                    libertés sont susceptibles d'être affectés.
                  </p>
                </div>
              </section>

              {/* Article 9 */}
              <section id="cookies" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  9. Politique des cookies
                </h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  9.1 Types de cookies utilisés
                </h3>

                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      🍪 Cookies essentiels (obligatoires)
                    </h4>
                    <p className="text-gray-700 text-sm mb-3">
                      Nécessaires au fonctionnement du site, ils ne peuvent pas
                      être désactivés.
                    </p>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• Authentification et sécurité</li>
                      <li>• Panier de réservation</li>
                      <li>• Préférences de langue</li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      📊 Cookies analytiques (avec consentement)
                    </h4>
                    <p className="text-gray-700 text-sm mb-3">
                      Nous aident à comprendre comment vous utilisez notre site.
                    </p>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• Google Analytics (anonymisé)</li>
                      <li>• Statistiques de fréquentation</li>
                      <li>• Analyse des performances</li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      🎯 Cookies marketing (avec consentement)
                    </h4>
                    <p className="text-gray-700 text-sm mb-3">
                      Utilisés pour personnaliser les publicités et mesurer leur
                      efficacité.
                    </p>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li>• Publicités ciblées</li>
                      <li>• Retargeting</li>
                      <li>• Réseaux sociaux</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mt-6">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-3">
                    ⚙️ Gestion de vos préférences cookies
                  </h3>
                  <p className="text-indigo-800 mb-4">
                    Vous pouvez modifier vos préférences à tout moment :
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                      🍪 Gérer les cookies
                    </button>
                    <button className="bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors text-sm">
                      ❌ Tout refuser
                    </button>
                    <button className="bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors text-sm">
                      ✅ Tout accepter
                    </button>
                  </div>
                </div>
              </section>

              {/* Article 10 */}
              <section id="transferts" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  10. Transferts internationaux
                </h2>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-orange-900 mb-3">
                    🌍 Transfers hors Union Européenne
                  </h3>
                  <p className="text-orange-800 mb-4">
                    Certains de nos prestataires peuvent être situés hors UE.
                    Dans ce cas, nous garantissons un niveau de protection
                    équivalent :
                  </p>
                  <ul className="text-orange-700 space-y-2">
                    <li>
                      <strong>• Stripe (États-Unis)</strong> - Certifié ISO
                      27001, clauses contractuelles types
                    </li>
                    <li>
                      <strong>• MongoDB Atlas</strong> - Centres de données
                      européens privilégiés
                    </li>
                    <li>
                      <strong>• Google Maps</strong> - Privacy Shield et clauses
                      contractuelles types
                    </li>
                  </ul>
                  <p className="text-orange-800 text-sm mt-4">
                    Tous les transferts sont encadrés par des garanties
                    appropriées conformément aux articles 44 à 49 du RGPD.
                  </p>
                </div>
              </section>

              {/* Article 11 */}
              <section id="modifications" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  11. Modifications de la politique
                </h2>

                <p className="text-gray-700 leading-relaxed mb-4">
                  Cette politique de confidentialité peut être mise à jour pour
                  refléter les changements dans nos pratiques ou les évolutions
                  légales.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">
                    📢 Notification des changements
                  </h3>
                  <ul className="text-blue-800 space-y-2">
                    <li>
                      • <strong>Modifications mineures :</strong> Mise à jour de
                      la date en haut de page
                    </li>
                    <li>
                      • <strong>Modifications importantes :</strong>{" "}
                      Notification par email 30 jours avant
                    </li>
                    <li>
                      • <strong>Changements substantiels :</strong> Nouveau
                      consentement requis
                    </li>
                  </ul>
                  <p className="text-blue-800 text-sm mt-4">
                    Nous vous encourageons à consulter cette page régulièrement
                    pour rester informé(e).
                  </p>
                </div>
              </section>

              {/* Article 12 - Contact DPO */}
              <section id="contact-dpo" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  12. Contact et exercice de vos droits
                </h2>

                <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">
                    📞 Délégué à la Protection des Données (DPO)
                  </h3>
                  <p className="text-green-800 mb-4">
                    Pour toute question relative à cette politique ou pour
                    exercer vos droits :
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-700">
                    <div>
                      <p>
                        <strong>Email :</strong>{" "}
                        <a
                          href="mailto:dpo@coworkingcafe.fr"
                          className="underline"
                        >
                          dpo@coworkingcafe.fr
                        </a>
                      </p>
                      <p>
                        <strong>Téléphone :</strong> 03 88 XX XX XX
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Horaires :</strong> Lun-Ven 9h-17h
                      </p>
                      <p>
                        <strong>Délai de réponse :</strong> 1 mois maximum
                      </p>
                    </div>
                  </div>
                </div>

                {/* Formulaire contact DPO */}
                <ContactDPOForm />

                <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-8">
                  <h3 className="text-lg font-semibold text-red-900 mb-3">
                    🏛️ Réclamation auprès de la CNIL
                  </h3>
                  <p className="text-red-800 mb-3">
                    Si vous n'êtes pas satisfait(e) de notre réponse, vous
                    pouvez saisir la CNIL :
                  </p>
                  <ul className="text-red-700 space-y-1">
                    <li>
                      <strong>En ligne :</strong>{" "}
                      <a
                        href="https://www.cnil.fr/fr/plaintes"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        www.cnil.fr/fr/plaintes
                      </a>
                    </li>
                    <li>
                      <strong>Courrier :</strong> CNIL - 3 Place de Fontenoy -
                      TSA 80715 - 75334 PARIS CEDEX 07
                    </li>
                    <li>
                      <strong>Téléphone :</strong> 01 53 73 22 22
                    </li>
                  </ul>
                </div>
              </section>

              {/* Footer du document */}
              <div className="border-t pt-8 text-center text-sm text-gray-500">
                <p>Document mis à jour le {lastUpdate}</p>
                <p className="mt-2">
                  Version 1.0 - Politique de Confidentialité RGPD - Cow or King
                  Café
                </p>
                <p className="mt-2">
                  Conforme au Règlement Général sur la Protection des Données
                  (UE) 2016/679
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScrollToTop />
    </main>
  );
}
