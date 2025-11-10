"use client";
import Link from "next/link";
import { useState } from "react";
import Navbar from "./navbar";
import TopHeader from "./topHeader";

const Header = () => {
  const [activeNavbar, setActiveNavebar] = useState(false);

  return (
    <header className="header header__1">
      <TopHeader />
      <div className="header__bottom">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between">
            <div className="">
              <Link href="/" className="header__bottom_logo">
                <img src="/images/logo-black.svg" alt="img" className="" />
              </Link>
            </div>

            <Navbar activeNavbar={activeNavbar} />

            <div className="d-flex align-items-center gap-3">
              <div className="d-xl-block d-none">
                <Link href={"/contact"} className="common__btn">
                  <span>Contact</span>
                </Link>
              </div>
              <div className="d-xl-block d-none">
                <Link
                  href="https://coworkingcafe.cosoft.fr/v2/new-reservation/8441947e-ed60-4e45-ac1a-b0ff00eeece1"
                  className="common__btn"
                >
                  <span>Réserver</span>
                  <img src="/icons/arrow-up-right.svg" alt="img" />
                </Link>
              </div>
            </div>
            <div
              className="menu__icon d-block d-xl-none"
              onClick={() => setActiveNavebar(!activeNavbar)}
            >
              <i className="bi bi-list" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
