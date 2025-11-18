import PageTitle from "@/components/site/pageTitle";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales | Cow-or-King Café",
  description: "Mentions légales du site Cow-or-King Café by Anticafé. Informations sur ILY SARL, éditeur du site, hébergement et propriété intellectuelle.",
  keywords: "mentions légales, ILY SARL, Strasbourg, coworking, éditeur, hébergement",
  openGraph: {
    title: "Mentions Légales - Cow-or-King Café",
    description: "Mentions légales et informations sur l'éditeur du site Cow-or-King Café à Strasbourg.",
    type: "website",
  },
};

const MentionLegal = () => {
  return (
    <>
      <PageTitle title={"Mentions Légales"} currentPage={"Mentions Légales"} />
      <section className="py__130">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="legal-content">
                <p className="mb-4">
                  <strong>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</strong>
                </p>

                <h2 className="mt-5 mb-3">1. Informations légales</h2>
                <h3 className="mt-4 mb-2">1.1 Éditeur du site</h3>
                <p>Le site coworkingcafe.fr est édité par :</p>
                <ul>
                  <li><strong>Raison sociale :</strong> ILY</li>
                  <li><strong>Forme juridique :</strong> SARL (Société à Responsabilité Limitée)</li>
                  <li><strong>Capital social :</strong> 11 000 € (onze mille euros)</li>
                  <li><strong>Numéro SIRET :</strong> 829 552 264</li>
                  <li><strong>RCS :</strong> Strasbourg B 829 552 264</li>
                  <li><strong>Siège social :</strong> 1 rue de la Division Leclerc, 67000 Strasbourg, France</li>
                  <li><strong>Activité :</strong> Débit de boissons et exploitation d'espaces de coworking</li>
                  <li><strong>Email :</strong> strasbourg@coworkingcafe.fr</li>
                  <li><strong>Téléphone :</strong> 09 87 33 45 19</li>
                </ul>

                <h3 className="mt-4 mb-2">1.2 Directeur de la publication</h3>
                <p>
                  Le directeur de la publication du site est <strong>MILONE Thierry</strong>, en sa qualité de gérant de la société ILY SARL.
                </p>

                <h3 className="mt-4 mb-2">1.3 Contact</h3>
                <p>Pour toute question ou demande d'information concernant le site, vous pouvez nous contacter :</p>
                <ul>
                  <li><strong>Par email :</strong> strasbourg@coworkingcafe.fr</li>
                  <li><strong>Par téléphone :</strong> 09 87 33 45 19</li>
                  <li><strong>Par courrier :</strong> ILY SARL, 1 rue de la Division Leclerc, 67000 Strasbourg</li>
                </ul>

                <h2 className="mt-5 mb-3">2. Hébergement</h2>
                <p>Le site coworkingcafe.fr est hébergé par :</p>
                <ul>
                  <li><strong>Hébergeur :</strong> Northflank</li>
                  <li><strong>Site web :</strong> <a href="https://northflank.com" target="_blank" rel="noopener noreferrer">northflank.com</a></li>
                </ul>

                <h2 className="mt-5 mb-3">3. Propriété intellectuelle</h2>
                <h3 className="mt-4 mb-2">3.1 Contenus du site</h3>
                <p>
                  L'ensemble des contenus présents sur le site coworkingcafe.fr (textes, images, graphismes, logo, icônes, sons, vidéos, logiciels, etc.) est la propriété exclusive d'ILY SARL ou de ses partenaires, sauf mention contraire.
                </p>
                <p>
                  Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable d'ILY SARL.
                </p>
                <p>
                  Toute exploitation non autorisée du site ou de l'un quelconque des éléments qu'il contient sera considérée comme constitutive d'une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle.
                </p>

                <h3 className="mt-4 mb-2">3.2 Marques</h3>
                <p>
                  Les marques, logos et signes distinctifs reproduits sur le site sont la propriété d'ILY SARL ou font l'objet d'une autorisation d'utilisation. Toute reproduction totale ou partielle de ces marques ou de ces logos effectuée à partir des éléments du site sans l'autorisation expresse d'ILY SARL est prohibée.
                </p>

                <h3 className="mt-4 mb-2">3.3 Bases de données</h3>
                <p>
                  Le site coworkingcafe.fr comporte des bases de données protégées par les dispositions de la loi du 1er juillet 1998 portant transposition dans le Code de la Propriété Intellectuelle de la directive du 11 mars 1996 relative à la protection juridique des bases de données.
                </p>

                <h2 className="mt-5 mb-3">4. Protection des données personnelles</h2>
                <p>
                  ILY SARL accorde une grande importance à la protection de vos données personnelles. Les informations recueillies sur ce site sont traitées conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
                </p>
                <p>
                  Pour en savoir plus sur la collecte, l'utilisation et la protection de vos données personnelles, veuillez consulter notre <a href="/confidentiality">Politique de Confidentialité</a>.
                </p>
                <p>
                  Conformément à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée et au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité de vos données personnelles.
                </p>
                <p>
                  Pour exercer ces droits, contactez-nous à : strasbourg@coworkingcafe.fr
                </p>

                <h2 className="mt-5 mb-3">5. Cookies</h2>
                <p>
                  Le site coworkingcafe.fr utilise des cookies pour améliorer l'expérience utilisateur et réaliser des statistiques de visites. Un cookie est un petit fichier texte enregistré sur votre ordinateur lors de la consultation d'un site internet.
                </p>
                <p>
                  Vous pouvez vous opposer à l'enregistrement de cookies en configurant votre navigateur. Pour plus d'informations sur les cookies et leur gestion, consultez notre <a href="/confidentiality">Politique de Confidentialité</a>.
                </p>

                <h2 className="mt-5 mb-3">6. Conditions générales d'utilisation</h2>
                <h3 className="mt-4 mb-2">6.1 Accès au site</h3>
                <p>
                  L'accès au site coworkingcafe.fr est gratuit et ouvert à tous les internautes. ILY SARL met en œuvre tous les moyens raisonnables à sa disposition pour assurer un accès de qualité à ses services, mais n'est tenue à aucune obligation d'y parvenir.
                </p>
                <p>
                  ILY SARL se réserve le droit de suspendre, d'interrompre ou de limiter sans préavis l'accès à tout ou partie du site, notamment pour des raisons de maintenance, de mise à jour ou pour toute autre raison (panne technique, etc.).
                </p>

                <h3 className="mt-4 mb-2">6.2 Utilisation du site</h3>
                <p>L'utilisateur du site s'engage à :</p>
                <ul>
                  <li>Ne pas perturber le bon fonctionnement du site</li>
                  <li>Ne pas utiliser de logiciels ou procédés destinés à copier le contenu sans l'autorisation d'ILY</li>
                  <li>Ne pas détourner la finalité du site pour commettre des délits</li>
                  <li>Respecter les présentes mentions légales et les lois en vigueur</li>
                </ul>

                <h3 className="mt-4 mb-2">6.3 Contenus utilisateurs</h3>
                <p>
                  Si le site permet aux utilisateurs de publier des contenus (commentaires, avis, etc.), ces derniers restent responsables de leurs publications. ILY SARL se réserve le droit de supprimer tout contenu jugé inapproprié, illégal ou contraire aux bonnes mœurs.
                </p>

                <h2 className="mt-5 mb-3">7. Responsabilité</h2>
                <h3 className="mt-4 mb-2">7.1 Contenu du site</h3>
                <p>
                  ILY SARL s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site, mais ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur ce site.
                </p>
                <p>
                  En conséquence, ILY SARL décline toute responsabilité :
                </p>
                <ul>
                  <li>Pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur le site</li>
                  <li>Pour tous dommages résultant d'une intrusion frauduleuse d'un tiers ayant entraîné une modification des informations mises à disposition sur le site</li>
                  <li>Pour tous dommages directs ou indirects, quelles qu'en soient les causes, origines, natures ou conséquences, provoqués en raison de l'accès de quiconque au site ou de l'impossibilité d'y accéder</li>
                </ul>

                <h3 className="mt-4 mb-2">7.2 Liens hypertextes</h3>
                <p>
                  Le site coworkingcafe.fr peut contenir des liens hypertextes vers d'autres sites. ILY SARL n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à l'accès, au contenu ou à l'utilisation de ces sites, ainsi qu'aux dommages pouvant résulter de la consultation des informations présentes sur ces sites.
                </p>
                <p>
                  La mise en place d'un lien hypertexte vers le site coworkingcafe.fr nécessite l'autorisation préalable d'ILY SARL. Pour toute demande, contactez-nous à strasbourg@coworkingcafe.fr.
                </p>

                <h3 className="mt-4 mb-2">7.3 Virus informatiques</h3>
                <p>
                  ILY SARL ne pourra être tenue responsable des dommages causés à votre matériel informatique ou à vos données du fait de votre utilisation du site. Il appartient à l'utilisateur de prendre toutes les mesures appropriées de façon à protéger ses propres données et/ou logiciels de la contamination par d'éventuels virus.
                </p>

                <h2 className="mt-5 mb-3">8. Droit applicable et juridiction compétente</h2>
                <p>
                  Les présentes mentions légales sont régies par le droit français. En cas de litige et à défaut d'accord amiable, le litige sera porté devant les tribunaux français conformément aux règles de compétence en vigueur.
                </p>

                <h2 className="mt-5 mb-3">9. Crédits</h2>
                <h3 className="mt-4 mb-2">9.1 Conception et développement</h3>
                <p>
                  Site développé avec Next.js et hébergé par Northflank.
                </p>

                <h3 className="mt-4 mb-2">9.2 Crédits photographiques</h3>
                <p>
                  Les photographies et visuels présents sur le site sont la propriété d'ILY SARL ou utilisés avec l'autorisation de leurs auteurs.
                </p>

                <h2 className="mt-5 mb-3">10. Modifications</h2>
                <p>
                  ILY SARL se réserve le droit de modifier les présentes mentions légales à tout moment. Il est donc conseillé de les consulter régulièrement. Les mentions légales actualisées s'appliquent dès leur mise en ligne.
                </p>

                <h2 className="mt-5 mb-3">11. Contact et réclamations</h2>
                <p>
                  Pour toute question, réclamation ou demande d'information concernant le site, vous pouvez nous contacter :
                </p>
                <ul>
                  <li><strong>Par email :</strong> strasbourg@coworkingcafe.fr</li>
                  <li><strong>Par téléphone :</strong> 09 87 33 45 19</li>
                  <li><strong>Par courrier :</strong> ILY SARL, 1 rue de la Division Leclerc, 67000 Strasbourg</li>
                </ul>

                <p className="mt-5">
                  <strong>Nous nous engageons à répondre à vos demandes dans les meilleurs délais.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MentionLegal;
