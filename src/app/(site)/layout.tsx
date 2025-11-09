import "@/assets/font/bootstrap-font/bootstrap-icons.min.css";
import "@/assets/font/font-awsome/css-js/all.min.css";
import "@/assets/font/font-awsome/css-js/all.min.js";
import "@/assets/scss/main.scss";
import AhrefsAnalytics from "@/components/AhrefsWebAnalytics";
import Bootstrap from "@/components/Bootstrap";
import Footer from "@/components/footer";
import Header from "@/components/header/header";
import PathNameLoad from "@/utils/pathNameLoad";
import { ReactNode } from "react";

export const metadata = {
  title: "Cow-or-King Café by Anticafé",
  description: "Le meilleur café coworking pour travailler à Strasbourg",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <AhrefsAnalytics />
      </head>
      <body suppressHydrationWarning>
        <Bootstrap />
        <PathNameLoad />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
