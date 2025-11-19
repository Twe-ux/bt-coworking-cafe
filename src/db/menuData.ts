export interface MenuItem {
  title: string;
  link: string;
  submenu?: { title: string; link: string }[];
}

export const menuData: MenuItem[] = [
  {
    title: "Accueil",
    link: "/",
  },
  {
    title: "Concept",
    link: "/concept",
  },
  {
    title: "Espaces",
    link: "/spaces",
  },
  {
    title: "Tarifs",
    link: "/pricing",
  },
  {
    title: "Menu",
    link: "/menu",
  },
  {
    title: "Professionnels",
    link: "/professionnels",
  },
  {
    title: "Le Mag'",
    link: "/blog",
  },
  // {
  //   title: "Services",
  //   link: "#",
  //   submenu: [
  //     { title: "Services", link: "/services" },
  //     { title: "Service Details", link: "/service-details" },
  //   ],
  // },
  // {
  //   title: "Pages",
  //   link: "#",
  //   submenu: [
  //     { title: "Faq's", link: "/faq" },
  //     { title: "Pricing", link: "/pricing" },
  //     { title: "Projects", link: "/projects" },
  //     { title: "Project Details", link: "/project-details" },
  //   ],
  // },
  // {
  //   title: "Blog",
  //   link: "#",
  //   submenu: [
  //     { title: "Blog", link: "/blog" },
  //     { title: "Blog Details", link: "/blog-details" },
  //   ],
  // },
  // {
  //   title: "Contact Us",
  //   link: "/contact",
  // },
];
