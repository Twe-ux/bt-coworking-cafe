import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales | Cow-or-King Café - Coworking Strasbourg",
  description:
    "Mentions légales du Cow or King Café - Espace de coworking café à Strasbourg. Informations sur l'éditeur, l'hébergeur et les conditions d'utilisation.",
  robots: "index, follow",
};

export default function MentionsLegalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
