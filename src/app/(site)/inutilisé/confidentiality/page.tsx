import PageTitle from "@/components/site/pageTitle";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité | Cow-or-King Café",
  description: "Découvrez comment le Cow-or-King Café protège vos données personnelles. Politique de confidentialité conforme au RGPD pour nos services de coworking à Strasbourg.",
  keywords: "confidentialité, RGPD, données personnelles, protection des données, coworking Strasbourg",
  openGraph: {
    title: "Politique de Confidentialité - Cow-or-King Café",
    description: "Notre politique de confidentialité et protection des données personnelles conforme au RGPD.",
    type: "website",
  },
};

const Confidentiality = () => {
  return (
    <>
      <PageTitle title={"Politique de Confidentialité"} currentPage={"Confidentialité"} />
      <section className="py__130">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="legal-content">
                <p className="mb-4">
                  <strong>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</strong>
                </p>

                <h2 className="mt-5 mb-3">1. Introduction</h2>
                <p>
                  La présente politique de confidentialité a pour but d'informer les utilisateurs du site coworkingcafe.fr sur la manière dont leurs données personnelles sont collectées, traitées et protégées par :
                </p>
                <ul>
                  <li><strong>ILY SARL</strong></li>
                  <li>SARL au capital social de 11 000 €</li>
                  <li>SIRET : 829 552 264</li>
                  <li>RCS Strasbourg B 829 552 264</li>
                  <li>Siège social : 1 rue de la Division Leclerc, 67000 Strasbourg</li>
                  <li>Email : strasbourg@coworkingcafe.fr</li>
                  <li>Téléphone : 09 87 33 45 19</li>
                  <li>Responsable du traitement : MILONE Thierry</li>
                </ul>

                <h2 className="mt-5 mb-3">2. Données collectées</h2>
                <h3 className="mt-4 mb-2">2.1 Données collectées directement</h3>
                <p>Lors de votre utilisation du site ou de nos services, nous pouvons collecter :</p>
                <ul>
                  <li><strong>Données d'identification :</strong> nom, prénom, adresse email</li>
                  <li><strong>Données de contact :</strong> numéro de téléphone, adresse postale</li>
                  <li><strong>Données de connexion :</strong> identifiant, mot de passe (chiffré)</li>
                  <li><strong>Données de réservation :</strong> dates, horaires, formules choisies</li>
                  <li><strong>Données de paiement :</strong> informations bancaires (traitées de manière sécurisée par notre prestataire de paiement)</li>
                </ul>

                <h3 className="mt-4 mb-2">2.2 Données collectées automatiquement</h3>
                <p>Lors de votre navigation sur notre site, nous collectons automatiquement :</p>
                <ul>
                  <li><strong>Données de navigation :</strong> adresse IP, type de navigateur, pages consultées, durée de visite</li>
                  <li><strong>Cookies :</strong> voir notre section dédiée aux cookies ci-dessous</li>
                </ul>

                <h2 className="mt-5 mb-3">3. Finalités du traitement</h2>
                <p>Vos données personnelles sont collectées et traitées pour les finalités suivantes :</p>
                <ul>
                  <li>Gestion des réservations et des commandes</li>
                  <li>Création et gestion de votre compte client</li>
                  <li>Traitement des paiements</li>
                  <li>Communication avec les clients (confirmation, rappels, support)</li>
                  <li>Amélioration de nos services et de l'expérience utilisateur</li>
                  <li>Envoi de newsletters et communications marketing (avec votre consentement)</li>
                  <li>Respect de nos obligations légales et réglementaires</li>
                  <li>Prévention de la fraude et sécurisation des transactions</li>
                </ul>

                <h2 className="mt-5 mb-3">4. Base légale du traitement</h2>
                <p>Conformément au RGPD, le traitement de vos données repose sur :</p>
                <ul>
                  <li><strong>L'exécution d'un contrat :</strong> gestion des réservations et services</li>
                  <li><strong>Votre consentement :</strong> newsletters, communications marketing</li>
                  <li><strong>L'intérêt légitime :</strong> amélioration de nos services, sécurité</li>
                  <li><strong>Obligations légales :</strong> comptabilité, fiscalité</li>
                </ul>

                <h2 className="mt-5 mb-3">5. Durée de conservation</h2>
                <p>Vos données personnelles sont conservées pendant les durées suivantes :</p>
                <ul>
                  <li><strong>Données de compte client :</strong> durée de la relation commerciale + 3 ans après la dernière activité</li>
                  <li><strong>Données de réservation :</strong> durée légale de conservation comptable (10 ans)</li>
                  <li><strong>Données de paiement :</strong> 13 mois pour la détection de fraude, puis suppression</li>
                  <li><strong>Cookies :</strong> maximum 13 mois</li>
                  <li><strong>Newsletters :</strong> jusqu'à votre désinscription</li>
                </ul>

                <h2 className="mt-5 mb-3">6. Destinataires des données</h2>
                <p>Vos données personnelles peuvent être transmises aux destinataires suivants :</p>
                <ul>
                  <li><strong>Personnel autorisé d'ILY :</strong> dans le cadre de leurs missions</li>
                  <li><strong>Prestataires de services :</strong>
                    <ul>
                      <li>Hébergeur du site : Northflank</li>
                      <li>Prestataire de paiement sécurisé</li>
                      <li>Services d'emailing (si newsletters)</li>
                    </ul>
                  </li>
                  <li><strong>Autorités légales :</strong> en cas de réquisition judiciaire</li>
                </ul>
                <p>
                  Tous nos prestataires sont soumis à des obligations strictes de confidentialité et ne peuvent utiliser vos données qu'aux fins définies par contrat.
                </p>

                <h2 className="mt-5 mb-3">7. Transferts de données hors UE</h2>
                <p>
                  Vos données personnelles sont hébergées au sein de l'Union Européenne. Si un transfert hors UE devait être nécessaire, nous nous assurerions qu'il soit encadré par des garanties appropriées conformément au RGPD.
                </p>

                <h2 className="mt-5 mb-3">8. Sécurité des données</h2>
                <p>
                  ILY met en œuvre toutes les mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre :
                </p>
                <ul>
                  <li>La perte accidentelle</li>
                  <li>L'utilisation non autorisée</li>
                  <li>L'accès non autorisé</li>
                  <li>La divulgation ou l'altération</li>
                </ul>
                <p>Nos mesures de sécurité incluent :</p>
                <ul>
                  <li>Chiffrement des mots de passe</li>
                  <li>Connexions sécurisées (HTTPS)</li>
                  <li>Accès restreint aux données personnelles</li>
                  <li>Sauvegardes régulières</li>
                </ul>

                <h2 className="mt-5 mb-3">9. Vos droits</h2>
                <p>Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :</p>
                <ul>
                  <li><strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
                  <li><strong>Droit de rectification :</strong> corriger vos données inexactes ou incomplètes</li>
                  <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
                  <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
                  <li><strong>Droit à la portabilité :</strong> récupérer vos données dans un format structuré</li>
                  <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
                  <li><strong>Droit de retirer votre consentement :</strong> à tout moment</li>
                  <li><strong>Droit de définir des directives post-mortem :</strong> concernant vos données après votre décès</li>
                </ul>

                <h3 className="mt-4 mb-2">Comment exercer vos droits ?</h3>
                <p>Pour exercer vos droits, vous pouvez nous contacter :</p>
                <ul>
                  <li>Par email : strasbourg@coworkingcafe.fr</li>
                  <li>Par courrier : ILY SARL, 1 rue de la Division Leclerc, 67000 Strasbourg</li>
                </ul>
                <p>
                  Nous nous engageons à répondre à votre demande dans un délai d'un mois suivant sa réception. Une pièce d'identité pourra vous être demandée pour vérifier votre identité.
                </p>

                <h3 className="mt-4 mb-2">Droit de réclamation</h3>
                <p>
                  Vous avez également le droit d'introduire une réclamation auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL) :
                </p>
                <ul>
                  <li>Site web : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a></li>
                  <li>Adresse : 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07</li>
                  <li>Téléphone : 01 53 73 22 22</li>
                </ul>

                <h2 className="mt-5 mb-3">10. Cookies</h2>
                <h3 className="mt-4 mb-2">10.1 Qu'est-ce qu'un cookie ?</h3>
                <p>
                  Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, smartphone, tablette) lors de la visite d'un site web. Il permet de reconnaître votre navigateur et de collecter certaines informations.
                </p>

                <h3 className="mt-4 mb-2">10.2 Types de cookies utilisés</h3>
                <ul>
                  <li><strong>Cookies strictement nécessaires :</strong> essentiels au fonctionnement du site (gestion de session, panier)</li>
                  <li><strong>Cookies de performance :</strong> permettent d'analyser l'utilisation du site et d'améliorer ses performances</li>
                  <li><strong>Cookies fonctionnels :</strong> mémorisent vos préférences (langue, région)</li>
                  <li><strong>Cookies publicitaires :</strong> utilisés pour afficher des publicités pertinentes (si applicable)</li>
                </ul>

                <h3 className="mt-4 mb-2">10.3 Gestion des cookies</h3>
                <p>Vous pouvez à tout moment :</p>
                <ul>
                  <li>Accepter ou refuser les cookies via le bandeau de consentement</li>
                  <li>Paramétrer votre navigateur pour refuser les cookies</li>
                  <li>Supprimer les cookies déjà installés</li>
                </ul>
                <p>
                  Attention : le refus de certains cookies peut affecter le bon fonctionnement du site et limiter l'accès à certaines fonctionnalités.
                </p>

                <h2 className="mt-5 mb-3">11. Mineurs</h2>
                <p>
                  Nos services ne sont pas destinés aux mineurs de moins de 16 ans. Si nous apprenons qu'un mineur de moins de 16 ans nous a fourni des données personnelles sans le consentement de ses parents, nous supprimerons ces données.
                </p>

                <h2 className="mt-5 mb-3">12. Modifications de la politique</h2>
                <p>
                  ILY se réserve le droit de modifier la présente politique de confidentialité à tout moment. Les modifications entrent en vigueur dès leur publication sur cette page. Nous vous encourageons à consulter régulièrement cette page pour prendre connaissance des éventuelles mises à jour.
                </p>

                <h2 className="mt-5 mb-3">13. Contact</h2>
                <p>Pour toute question concernant cette politique de confidentialité ou le traitement de vos données personnelles, vous pouvez nous contacter :</p>
                <ul>
                  <li>Email : strasbourg@coworkingcafe.fr</li>
                  <li>Téléphone : 09 87 33 45 19</li>
                  <li>Adresse : ILY SARL, 1 rue de la Division Leclerc, 67000 Strasbourg</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Confidentiality;
