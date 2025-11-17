import PageTitle from "@/components/site/pageTitle";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CGV - Conditions Générales de Vente | Cow-or-King Café",
  description: "Consultez les conditions générales de vente du Cow-or-King Café by Anticafé à Strasbourg. Informations sur nos services de coworking, tarifs, réservations et modalités.",
  keywords: "CGV, conditions générales de vente, coworking Strasbourg, Anticafé, réservation, tarifs",
  openGraph: {
    title: "Conditions Générales de Vente - Cow-or-King Café",
    description: "Conditions générales de vente et d'utilisation des services de coworking du Cow-or-King Café à Strasbourg.",
    type: "website",
  },
};

const CGU = () => {
  return (
    <>
      <PageTitle title={"Conditions Générales de Vente"} currentPage={"CGU"} />
      <section className="py__130">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="legal-content">
                <p className="mb-4">
                  <strong>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</strong>
                </p>

                <h2 className="mt-5 mb-3">1. Informations légales</h2>
                <p>
                  Les présentes conditions générales de vente (CGV) sont conclues entre :
                </p>
                <ul>
                  <li><strong>ILY SARL</strong></li>
                  <li>SARL au capital social de 11 000 €</li>
                  <li>SIRET : 829 552 264</li>
                  <li>RCS Strasbourg B 829 552 264</li>
                  <li>Siège social : 1 rue de la Division Leclerc, 67000 Strasbourg</li>
                  <li>Email : strasbourg@coworkingcafe.fr</li>
                  <li>Téléphone : 09 87 33 45 19</li>
                  <li>Directeur de la publication : MILONE Thierry</li>
                </ul>
                <p>Ci-après dénommée "le Vendeur" ou "ILY",</p>
                <p>Et toute personne physique ou morale souhaitant procéder à un achat, ci-après dénommée "le Client" ou "l'Acheteur".</p>

                <h2 className="mt-5 mb-3">2. Objet</h2>
                <p>
                  Les présentes CGV régissent les relations contractuelles entre ILY et le Client et s'appliquent à tout achat de services ou produits effectués via le site coworkingcafe.fr ou directement dans nos locaux.
                </p>
                <p>
                  ILY exploite un espace de coworking et un débit de boissons proposant :
                </p>
                <ul>
                  <li>Des prestations d'espaces de travail partagés</li>
                  <li>Des ventes de boissons et produits alimentaires à emporter</li>
                </ul>

                <h2 className="mt-5 mb-3">3. Services proposés</h2>
                <h3 className="mt-4 mb-2">3.1 Espaces de coworking</h3>
                <p>Les tarifs des espaces de coworking sont les suivants :</p>
                <ul>
                  <li>Formule horaire : 6 € / heure</li>
                  <li>Formule journée : 29 € / jour</li>
                  <li>Formule semaine : 99 € / semaine</li>
                  <li>Formule mensuelle : 290 € / mois</li>
                </ul>

                <h3 className="mt-4 mb-2">3.2 Vente à emporter</h3>
                <p>
                  Les prix des boissons et produits alimentaires à emporter sont affichés en magasin et varient selon les produits. Les prix indiqués sont en euros TTC.
                </p>

                <h2 className="mt-5 mb-3">4. Commandes et réservations</h2>
                <h3 className="mt-4 mb-2">4.1 Réservations en ligne</h3>
                <p>
                  Le Client peut effectuer des réservations d'espaces de coworking en ligne via le site coworkingcafe.fr. La réservation devient définitive après :
                </p>
                <ul>
                  <li>La validation du formulaire de réservation</li>
                  <li>Le paiement intégral du montant de la réservation</li>
                  <li>La réception d'un email de confirmation</li>
                </ul>

                <h3 className="mt-4 mb-2">4.2 Achats sur place</h3>
                <p>
                  Les achats de boissons et produits alimentaires s'effectuent directement sur place, au comptoir.
                </p>

                <h2 className="mt-5 mb-3">5. Prix et paiement</h2>
                <h3 className="mt-4 mb-2">5.1 Prix</h3>
                <p>
                  Tous les prix sont indiqués en euros, toutes taxes comprises (TTC). ILY se réserve le droit de modifier ses prix à tout moment, mais les services et produits seront facturés sur la base des tarifs en vigueur au moment de la validation de la commande ou de l'achat.
                </p>

                <h3 className="mt-4 mb-2">5.2 Moyens de paiement</h3>
                <p>Les paiements peuvent être effectués par :</p>
                <ul>
                  <li>Carte bancaire (en ligne et sur place)</li>
                  <li>Espèces (sur place uniquement)</li>
                  <li>Paiement en ligne sécurisé (réservations)</li>
                </ul>

                <h3 className="mt-4 mb-2">5.3 Factures</h3>
                <p>
                  Une facture est délivrée sur demande pour toute prestation ou achat. Elle peut être demandée par email à strasbourg@coworkingcafe.fr.
                </p>

                <h2 className="mt-5 mb-3">6. Droit de rétractation</h2>
                <p>
                  Conformément à l'article L221-28 du Code de la consommation, le Client dispose d'un délai de 14 jours calendaires à compter de la réservation en ligne pour exercer son droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités.
                </p>
                <p>
                  <strong>Exceptions :</strong> Le droit de rétractation ne peut être exercé pour :
                </p>
                <ul>
                  <li>Les services pleinement exécutés avant la fin du délai de rétractation</li>
                  <li>Les produits alimentaires et boissons déjà consommés</li>
                </ul>
                <p>
                  Pour exercer ce droit, le Client doit notifier sa décision par email à strasbourg@coworkingcafe.fr. Le remboursement sera effectué dans un délai de 14 jours suivant la notification.
                </p>

                <h2 className="mt-5 mb-3">7. Annulation et modification</h2>
                <p>
                  Les annulations ou modifications de réservations doivent être effectuées au moins 24 heures avant la date et l'heure prévues. Passé ce délai, aucun remboursement ne sera effectué.
                </p>

                <h2 className="mt-5 mb-3">8. Responsabilité</h2>
                <p>
                  ILY ne saurait être tenue responsable :
                </p>
                <ul>
                  <li>Des vols ou dégradations d'effets personnels dans les espaces de coworking</li>
                  <li>Des interruptions de service dues à des problèmes techniques indépendants de sa volonté</li>
                  <li>De l'utilisation abusive des services par le Client</li>
                </ul>
                <p>
                  Le Client s'engage à utiliser les espaces de coworking dans le respect des autres usagers et du règlement intérieur affiché sur place.
                </p>

                <h2 className="mt-5 mb-3">9. Données personnelles</h2>
                <p>
                  Les données personnelles collectées lors des réservations ou achats sont traitées conformément à notre Politique de Confidentialité, consultable à l'adresse : <a href="/confidentiality">coworkingcafe.fr/confidentiality</a>
                </p>

                <h2 className="mt-5 mb-3">10. Propriété intellectuelle</h2>
                <p>
                  Tous les contenus présents sur le site coworkingcafe.fr (textes, images, logos, vidéos) sont la propriété exclusive d'ILY et sont protégés par le droit d'auteur. Toute reproduction, même partielle, est strictement interdite sans autorisation préalable.
                </p>

                <h2 className="mt-5 mb-3">11. Réclamations</h2>
                <p>
                  Pour toute réclamation, le Client peut contacter ILY :
                </p>
                <ul>
                  <li>Par email : strasbourg@coworkingcafe.fr</li>
                  <li>Par téléphone : 09 87 33 45 19</li>
                  <li>Par courrier : ILY SARL, 1 rue de la Division Leclerc, 67000 Strasbourg</li>
                </ul>

                <h2 className="mt-5 mb-3">12. Médiation</h2>
                <p>
                  Conformément à l'article L612-1 du Code de la consommation, en cas de litige, le Client a la possibilité de recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable du litige.
                </p>

                <h2 className="mt-5 mb-3">13. Droit applicable et juridiction</h2>
                <p>
                  Les présentes CGV sont soumises au droit français. En cas de litige, et après échec de toute tentative de résolution amiable, les tribunaux français seront seuls compétents.
                </p>

                <h2 className="mt-5 mb-3">14. Acceptation des CGV</h2>
                <p>
                  L'achat de tout service ou produit implique l'acceptation pleine et entière des présentes CGV. Le Client reconnaît en avoir pris connaissance et les accepter sans réserve.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CGU;
