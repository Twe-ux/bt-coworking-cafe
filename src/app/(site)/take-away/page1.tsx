/**
 * PROPOSITION 1: Layout Moderne avec Grille
 *
 * Caractéristiques:
 * - Hero section avec image principale boissons
 * - Grille responsive 5 catégories de boissons avec images carrousel
 * - Sections alternées texte/image (gauche-droite)
 * - Design épuré et aéré avec espacement généreux
 * - Cards avec ombres et coins arrondis
 * - Alertes Bootstrap pour infos importantes
 *
 * Pour tester: Renommer ce fichier en page.tsx
 */

import PageTitle from "@/components/site/pageTitle";
import Partner from "@/components/site/partner";
import { partnerTwoLogos } from "@/db/partnerOneLogos";
import SlideUp from "@/utils/animations/slideUp";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Take Away | Cow-or-King Café",
  description: `Coffee shop à Strasbourg : boissons à emporter, cafés glacés et frappés, matcha latte, citronnades, smoothies, encas sucrés, pizzas faites maison et petite épicerie. Tout pour une pause gourmande à savourer où vous voulez.`,
  openGraph: {
    title: "Take Away - Cow-or-King Café",
    description: "Découvrez Cow-or-King Café by Anticafé à Strasbourg.",
    type: "website",
  },
};

const TakeAwayProposition1 = () => {
  return (
    <>
      <PageTitle title={"Take Away"} />

      {/* Hero Section - Boissons */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 order-lg-1 order-2">
              <SlideUp>
                <h2 className="t__54 mb-4">
                  Plus d'une trentaine de choix de boissons à emporter
                </h2>
              </SlideUp>
              <p className="mb-3">
                Que vous soyez en télétravail à la maison, en balade dans le
                centre-ville ou simplement de passage, vous pouvez aussi profiter
                de tout ce qu'on prépare au comptoir. Plus de 30 boissons à
                emporter vous attendent : cafés classiques ou plus gourmands,
                matcha et chai latte, créations glacées, jus frais, thés parfumés,
                citronnades maison… bref, toute la palette du coffee shop à
                glisser dans votre journée.
              </p>
              <p>
                Notre offre "à emporter", c'est la solution parfaite pour celles
                et ceux qui aiment l'énergie d'Anticafé… mais ont besoin d'avancer
                ailleurs. Vous passez, vous commandez, vous repartez avec votre
                boisson préférée — la même qualité qu'ici, mais en version nomade. ✨
              </p>
            </div>
            <div className="col-lg-6 order-lg-2 order-1">
              <img
                src="/images/takeAway/coworking-cafe-strasbourg-take-away-boissons-a-emporter.webp"
                alt="Boissons à emporter Cow-or-King Café"
                className="w-100 rounded-3 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grille Catégories de Boissons */}
      <section className="py-5 bg-light">
        <div className="container">
          <SlideUp>
            <h3 className="t__40 text-center mb-5">Nos catégories de boissons</h3>
          </SlideUp>
          <div className="row g-4 mb-4">
            {/* Hot Drinks */}
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <img
                  src="/images/takeAway/Carrousel/coworking-cafe-strasbourg-hot-drinks-boissons-chaudes.webp"
                  alt="Boissons chaudes"
                  className="card-img-top"
                />
                <div className="card-body">
                  <h4 className="t__28 mb-2">☕ Hot Drinks</h4>
                  <p className="text-muted mb-0">Cafés, thés, chocolats chauds...</p>
                </div>
              </div>
            </div>

            {/* Cold Drinks */}
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <img
                  src="/images/takeAway/Carrousel/coworking-cafe-strasbourg-cold-drinks-boissons-fraîches.webp"
                  alt="Boissons fraîches"
                  className="card-img-top"
                />
                <div className="card-body">
                  <h4 className="t__28 mb-2">🧊 Cold Drinks</h4>
                  <p className="text-muted mb-0">Cafés glacés, frappés, iced tea...</p>
                </div>
              </div>
            </div>

            {/* Matcha & Chai */}
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <img
                  src="/images/takeAway/Carrousel/coworking-cafe-strasbourg-drinks-boissons-alternatives-matcha.webp"
                  alt="Boissons alternatives matcha"
                  className="card-img-top"
                />
                <div className="card-body">
                  <h4 className="t__28 mb-2">🍵 Matcha & Chai</h4>
                  <p className="text-muted mb-0">Lattes végétaux, matcha, chai...</p>
                </div>
              </div>
            </div>

            {/* Jus & Smoothies */}
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <img
                  src="/images/takeAway/Carrousel/coworking-cafe-strasbourg-jus-smoothies.webp"
                  alt="Jus et smoothies"
                  className="card-img-top"
                />
                <div className="card-body">
                  <h4 className="t__28 mb-2">🥤 Jus & Smoothies</h4>
                  <p className="text-muted mb-0">Jus frais, smoothies vitaminés...</p>
                </div>
              </div>
            </div>

            {/* Alternatives */}
            <div className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <img
                  src="/images/takeAway/Carrousel/coworking-cafe-strasbourg-take-away-drinks-boissons-alternatives-cafe.webp"
                  alt="Alternatives au café"
                  className="card-img-top"
                />
                <div className="card-body">
                  <h4 className="t__28 mb-2">🌿 Alternatives</h4>
                  <p className="text-muted mb-0">Citronnades, infusions, kombucha...</p>
                </div>
              </div>
            </div>
          </div>

          <div className="alert alert-info text-center">
            <strong>📌 À noter :</strong> Seules les boissons "COLD DRINKS" et "HOT DRINKS" sont incluses à volonté sur place.
          </div>
        </div>
      </section>

      {/* Section Food - 2 Colonnes */}
      <section className="py-5">
        <div className="container">
          <div className="row g-5">
            {/* Encas */}
            <div className="col-lg-6">
              <SlideUp>
                <h2 className="t__40 mb-4">🍪 Encas sucrés</h2>
              </SlideUp>
              <p className="mb-3">
                Envie d'un petit boost ? On propose une sélection d'encas sucrés :
                cookies, mini-cakes, gaufres moelleuses, barres aux fruits,
                madeleines… Les prix varient entre <strong>1,40 € et 2,90 €</strong>, et la
                sélection change au fil de la semaine selon les arrivages et les
                envies du moment. Simple, gourmand, efficace.
              </p>
              <div className="alert alert-success">
                ✅ Sur place, ils sont inclus pour les forfaits jour, semaine et mois.
              </div>
            </div>

            {/* Pizzas */}
            <div className="col-lg-6">
              <SlideUp>
                <h2 className="t__40 mb-4">🍕 Nos pizzas faites sur place</h2>
              </SlideUp>
              <p className="mb-3">
                Préparées et cuites ici même, nos pizzas individuelles sont
                parfaites pour un déjeuner rapide ou une faim de loup de fin
                d'après-midi. Classiques, généreuses, toujours fraîches : elles
                sont proposées au <strong>tarif unique de 8,90 €</strong>. Pratique, bon, sans
                chichi — comme on aime.
              </p>
              <div className="alert alert-success">
                ✅ Sur place, elles sont à <strong>6,90 €</strong> pour les forfaits jour, semaine et mois.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Billie - Image Gauche */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <img
                src="/images/takeAway/coworking-cafe-strasbourg-billie-cup-ecologie-gobelets-reutilisables.webp"
                alt="Gobelets réutilisables Billie"
                className="w-100 rounded-3 shadow-lg"
              />
            </div>
            <div className="col-lg-6">
              <SlideUp>
                <h2 className="t__40 mb-4">
                  🌱 Notre solution écologique : les gobelets Billie
                </h2>
              </SlideUp>
              <p className="mb-3">
                Pour limiter les déchets, nous proposons les gobelets
                réutilisables Billie. Le principe est simple : vous prenez votre
                boisson dans un gobelet consigné à <strong>1 €</strong>, que vous pouvez ensuite
                ramener ou échanger dans n'importe quelle boutique partenaire
                Billie à Strasbourg.
              </p>
              <p className="mb-3">
                Pratique si vous vous déplacez beaucoup en ville ! Les couvercles,
                eux, sont vendus <strong>1 €</strong> (ils ne sont pas consignés), ce qui vous
                permet d'en garder un propre sous la main et de n'échanger que le
                gobelet.
              </p>
              <div className="alert alert-success mb-0">
                <strong>🌿 Une solution green, flexible et super facile à adopter.</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Épicerie - Image Droite */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 order-lg-1 order-2">
              <SlideUp>
                <h2 className="t__40 mb-4">🛒 Notre petite épicerie</h2>
              </SlideUp>
              <p className="mb-4">
                Juste à côté du comptoir, vous trouverez une mini-épicerie pensée
                pour mettre en avant nos partenaires et coups de cœur du moment :
                cafés de torréfacteurs locaux, thés, sirops, chocolats, granolas,
                biscuits artisanaux…
              </p>
              <p className="mb-4">
                L'idée ? Vous permettre de ramener chez vous les ingrédients qui
                font le goût de nos boissons et petites douceurs. Un prolongement
                naturel de notre comptoir, pour savourer l'expérience à la maison
                ou au bureau.
              </p>
              <div className="row g-3">
                <div className="col-sm-6">
                  <ul className="list-unstyled">
                    <li className="mb-2">✓ Des biscuits artisanaux</li>
                    <li className="mb-2">✓ Notre café en grains</li>
                  </ul>
                </div>
                <div className="col-sm-6">
                  <ul className="list-unstyled">
                    <li className="mb-2">✓ Matcha & préparations</li>
                    <li className="mb-2">✓ Boissons fraîches</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-6 order-lg-2 order-1">
              <img
                src="/images/takeAway/coworking-cafe-strasbourg-epicerie-encas-snacks.webp"
                alt="Épicerie et encas"
                className="w-100 rounded-3 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Partenaires */}
      <Partner data={partnerTwoLogos} className={"bg-white"} />
    </>
  );
};

export default TakeAwayProposition1;
