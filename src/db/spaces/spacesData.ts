export interface Spaces {
  id: number;
  title: string;
  description: string;
  imgSrc: string;
  delay: number;
  link: string;
}

export interface SpacesDetailsProps {
  id: string;
  title: string;
  description: string;
  subDescription: string;
  imgSrc: Array<{
    id: number;
    img: string;
  }>;
  counterBox: Array<{
    id: number;
    number: string;
    box: string;
  }>;
}

export const spacesData: Spaces[] = [
  {
    id: 1,
    title: "L’open-space",
    description: `Un espace lumineux et convivial, avec des zones variées pour travailler,réviser ou créer à votre rythme — toujours accessible au tarif au temps`,
    imgSrc: "/images/spaces/openSpace/cowork-cafe-strasbourg.jpg",
    link: "#open-space",
    delay: 100,
  },
  {
    id: 2,
    title: "La verrière",
    description: `Une petite salle lumineuse et apaisante, parfaite pour les petites réunions, ateliers ou sessions d’équipe.`,
    imgSrc: "/images/spaces/verriere/salle-reunion-coworking-strasbourg.jpg",
    link: "#verriere",
    delay: 200,
  },
  {
    id: 3,
    title: "L’étage",
    description: `Un espace plus calme et confidentiel, idéal pour les réunions, conférences, formations ou projets de groupe. Disponible sur réservation.`,
    imgSrc: "/images/spaces/etage/salle-reunion-anticafe-cafecoworking.jpg",
    link: "#etage",
    delay: 300,
  },
];

export const spacesDetailsData: SpacesDetailsProps[] = [
  {
    id: "open-space",
    title: "L’open-space",
    description: `Ici, le placement est libre : pas de bureau attitré, vous vous
    installez où vous voulez. Nous accueillons avec ou sans
    réservation, selon les places disponibles.
    La capacité varie entre 30 et 40 personnes (tout dépend de
    votre niveau de tolérance à la proximité 😉).
    L’ambiance est cosy et plus calme qu’un café classique. Les
    réunions de groupe et les discussions sont les bienvenues. Les
    visios aussi, tant que vous utilisez des écouteurs.`,
    subDescription: `Côté boissons, tout est préparé à la demande comme dans un
    vrai coffee shop. Et pour combler les petites faims, nous avons
    une sélection d’encas variés.`,
    imgSrc: [
      {
        id: 1,
        img: "/images/spaces/openSpace/cafecoworking-strasbourg-1.jpg",
      },
      {
        id: 2,
        img: "/images/spaces/openSpace/cowork-cafe-strasbourg.jpg",
      },
      {
        id: 3,
        img: "/images/spaces/openSpace/coworking-anticafe-cafe-strasbourg.jpg",
      },
      {
        id: 4,
        img: "/images/spaces/openSpace/coworking-cafe-strasbourg.jpg",
      },
      {
        id: 5,
        img: "/images/spaces/openSpace/espace-cafe-coworking-strasbourg.jpg",
      },
      {
        id: 6,
        img: "/images/spaces/openSpace/espace-coworking-strasbourg-anticafe.jpg",
      },
    ],
    counterBox: [
      {
        id: 1,
        number: "6€",
        box: "heure",
      },
      {
        id: 2,
        number: "29€",
        box: "jours",
      },
      { id: 3, number: "30/40", box: "places" },
      { id: 4, number: "130", box: "m²" },
    ],
  },
  {
    id: "verriere",
    title: "La verrière",
    description:
      "La Verrière accueille jusqu’à 4 personnes autour d’une table haute. Il est possible d’ajouter un ou deux tabourets pour un court moment, même si l’espace devient un peu plus étroit. Elle est équipée d’un écran LCD pour vos projections, d’un paperboard et d’une connexion wifi très haut débit, évidemment.",
    subDescription:
      "Les boissons chaudes et fraîches sont préparées à la demande, comme dans un coffee shop, et servies à volonté. Des encas variés sont également disponibles.",
    imgSrc: [
      {
        id: 1,
        img: "/images/spaces/verriere/cafecoworking-reunion-anticafe-strasbourg.jpg",
      },
      {
        id: 2,
        img: "/images/spaces/verriere/petite-salle-de-reunion-strasbourg.jpg",
      },
      {
        id: 3,
        img: "/images/spaces/verriere/salle-reunion-coworking-strasbourg.jpg",
      },
      {
        id: 4,
        img: "/images/spaces/verriere/verriere-petite-salle-reunion-strasbourg.jpg",
      },
      {
        id: 5,
        img: "/images/spaces/verriere/verriere-reunion-anticafe-strasbourg.jpg",
      },
    ],
    counterBox: [
      { id: 1, number: "24€﹡", box: "heure" },
      { id: 2, number: "120€﹡", box: "jours" },
      { id: 3, number: "4/5", box: "places" },
      { id: 4, number: "7", box: "m²" },
    ],
  },
  {
    id: "etage",
    title: "L’étage",
    description:
      "À l’étage, vous disposez d’un espace complet : un petit salon d’accueil, des WC privés et une grande salle d’environ 35 à 40 m². En configuration réunion en U, elle convient parfaitement à des groupes de 8 à 12 personnes. Nous pouvons aller jusqu’à 15 participants, même si l’espace devient plus serré. En format conférence, sans tables, la salle accueille jusqu’à 20 personnes. Elle est équipée d’un écran-vidéoprojecteur, d’un grand whiteboard, d’un paperboard et d’une connexion wifi très haut débit pour travailler confortablement.",
    subDescription:
      "Les boissons chaudes et fraîches sont préparées à la demande et servies à volonté. Un encas sucré par personne est inclus, et nous pouvons également proposer des formules petit-déjeuner ou déjeuner selon vos besoins.",
    imgSrc: [
      {
        id: 1,
        img: "/images/spaces/etage/anticafe-salle-reunion-strasbourg.jpg",
      },
      {
        id: 2,
        img: "/images/spaces/etage/coworking-reunion-strasbourg.jpg",
      },
      {
        id: 3,
        img: "/images/spaces/etage/salle-reunion-anticafe-cafecoworking.jpg",
      },
    ],
    counterBox: [
      { id: 1, number: "60€﹡", box: "heure" },
      { id: 2, number: "300€﹡", box: "jours" },
      { id: 3, number: "10", box: "places" },
      { id: 4, number: "35/40", box: "m²" },
    ],
  },
];
