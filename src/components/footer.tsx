import Link from "next/link";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        {/* Subscribe Form */}
        <div className="subscribe">
          <div className="row">
            <div className="col-lg-8">
              <h2>
                Abonne-toi à notre newsletter etr reçois seulement une fois par
                mois toutes les actus, événements et promotions en cours...
              </h2>
            </div>
            <div className="col-lg-4 mt-5 mt-lg-0">
              <div>
                <input type="text" placeholder="Your Email" />
                <button className="common__btn">
                  <span>Inscris toi</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Subscribe Form */}
        {/* -------Logo and socal icon */}
        <div className="row footer__lo_co ">
          <div className="col-12">
            <div className="d-flex justify-content-center">
              <Link
                href={"#"}
                className="d-flex align-items-center footer__logo"
              >
                <img src="/images/logo-circle.webp" alt="img" />
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
                  <p>strasbourg@coworkingcafe.fr</p>
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
                  <Link href={"#"}>Fonctionnement</Link>
                </li>
                <li>
                  <Link href={"/tarifs"}>Tarifs</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-2 col-md-6 mb-5 mb-lg-0">
            <div>
              <h3 className="footer__info_group">???</h3>
              <ul>
                <li>
                  <Link href={"#"}>Mentions légales</Link>
                </li>
                <li>
                  <Link href={"#"}>Conditions générales de vente</Link>
                </li>
                <li>
                  <Link href={"#"}>Politique de confidentialité</Link>
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
