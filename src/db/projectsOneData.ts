export interface ProjectOne {
  id: number;
  title: string;
  categories: string;
  subCategories?: string;
  imgSrc: string;
}

export const projectsOneData: ProjectOne[] = [
  {
    id: 1,
    title: "L'open-space",
    categories: "Zones variées et confortables, jusqu'à 60 places.",
    subCategories:
      "Venez directement ou réservez en avance, nous aurons toujours un espace et un sourire pour vous accueillir",
    imgSrc: "/images/projects/11.png",
  },
  {
    id: 2,
    title: "La verrière",
    categories: "Petite salle de réunion équipée jusqu'à 4/5 personnes",
    imgSrc: "/images/projects/8.png",
  },
  {
    id: 3,
    title: "L'étage",
    categories: "Salle de réunion équipée (10 à 15 personnes)",
    imgSrc: "/images/projects/8.png",
  },
];
