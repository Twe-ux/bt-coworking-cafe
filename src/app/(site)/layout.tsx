import "@/assets/site/font/bootstrap-font/bootstrap-icons.min.css";
import "@/assets/site/font/font-awsome/css-js/all.min.css";
import "@/assets/site/font/font-awsome/css-js/all.min.js";
import "@/assets/site/scss/main.scss";
import { SiteProvidersWrapper } from "@/components/providers/SiteProvidersWrapper";
import AhrefsAnalytics from "@/components/site/AhrefsWebAnalytics";
import Bootstrap from "@/components/site/Bootstrap";
import Footer from "@/components/site/footer";
import Header from "@/components/site/header/header";
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
        <SiteProvidersWrapper>
          <Bootstrap />
          <PathNameLoad />
          <Header />
          {children}
          <Footer />
        </SiteProvidersWrapper>
      </body>
    </html>
  );
}
