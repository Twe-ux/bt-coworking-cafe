"use client";

import ProtectedEmail from "@/components/common/ProtectedEmail";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BookingHelper from "./booking/BookingHelper";
import SubscribeForm from "./SubscribeForm";

const Footer = () => {
  const pathname = usePathname();

  // Check if we're on a client dashboard page (/{username}/...)
  const isClientDashboard =
    pathname &&
    /^\/[^\/]+(?:\/(?:profile|reservations|settings))?(?:\/.*)?$/.test(
      pathname
    ) &&
    ![
      "/",
      "/blog",
      "/concept",
      "/spaces",
      "/menu",
      "/contact",
      "/professionnels",
      "/booking",
      "/signin",
      "/signup",
      "/tarifs",

      // "/pricing",
      // "/about",
      // "/blog-details",
      // "/faq",
      // "/home-2",
      // "/projects",
      // "/project-details",
      // "/services",
      // "/service-details",
      // "/mag",
      // "/espaces",
    ].includes(pathname);

  // Check if we're on a booking page
  const isBookingPage = pathname && pathname.startsWith("/booking");

  // Determine which component to show
  const showSubscribeForm = !isClientDashboard && !isBookingPage;
  const showBookingHelper = !isClientDashboard && isBookingPage;

  return (
    <footer className="footer">
      <div className="container">
        {/* Show Subscribe Form on site pages (except booking) */}
        {showSubscribeForm && <SubscribeForm />}

        {/* Show Booking Helper on booking pages */}
        {showBookingHelper && <BookingHelper />}
        {/* -------Logo and socal icon */}
        <div className="row footer__lo_co ">
          <div
            className={
              !isClientDashboard || !showBookingHelper ? "col-12" : " mt-5"
            }
          >
            <div className="d-flex justify-content-center">
              <Link
                href={"/"}
                className="d-flex align-items-center footer__logo"
              >
                <img
                  src="/images/logo-circle-white.png"
                  alt="img"
                  className="logo"
                />
              </Link>
            </div>
            <ul className="d-flex justify-content-center gap-3 footer__socal">
              <li>
                <Link href={"#"}>
                  <i className="fa-brands fa-facebook-f" />
                </Link>
              </li>

              <li>
                <Link href={"#"}>
                  <i className="fa-brands fa-instagram" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* -------Logo and socal icon */}
        <hr className="footer__border" />
        {/* ---- Info */}
        <div className="row footer__info">
          <div className="col-lg-4 col-md-6 mb-5 mb-lg-0">
            <div className="footer__info_address">
              <h3 className="footer__info_group">Où nous trouver ?</h3>
              <p>
                1 rue de la Division leclerc <br /> 67000 Strasbourg
              </p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-5 mb-lg-0">
            <div>
              <h3 className="footer__info_group">Nous contacter</h3>
              <ul className="footer__info_contact">
                <li>
                  <img src="/icons/Frame5.svg" alt="img" />
                  <p>
                    <ProtectedEmail
                      user="strasbourg"
                      domain="coworkingcafe.fr"
                    />
                  </p>
                </li>
                <li>
                  <img src="/icons/Frame6.svg" alt="img" />
                  <p>09 87 33 45 19</p>
                </li>
                <li>
                  <img src="/icons/Frame7.svg" alt="img" />
                  <p>L-V: 09h-20h | S-D & JF: 10h-20h</p>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-5 mb-lg-0">
            <div>
              <h3 className="footer__info_group">Liens rapides</h3>
              <ul>
                <li>
                  <Link href={"#"}>Réserver</Link>
                </li>
                <li>
                  <Link href={"/concept#concept"}>Fonctionnement</Link>
                </li>
                <li>
                  <Link href={"/price"}>Tarifs</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-2 col-md-6 mb-5 mb-lg-0">
            <div>
              <h3 className="footer__info_group">???</h3>
              <ul>
                <li>
                  <Link href={"/mentions-legales"}>Mentions légales</Link>
                </li>
                <li>
                  <Link href={"/CGU"}>Conditions générales de vente</Link>
                </li>
                <li>
                  <Link href={"confidentiality"}>
                    Politique de confidentialité
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* ---- Info */}
        <div className="row footer__copyright">
          <div className="col-12">
            <hr className="footer__border" />
            <p className="text-center">
              © Copyright 2025 All Rights Reserved by{" "}
              <Link href={"#"}>digiv</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
