import Link from "next/link";

const TopHeader = () => {
  return (
    <div className="header__top d-lg-block d-none">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center header__top_left">
            <p className="d-flex align-items-center time">
              <i className="bi bi-clock" />
              <span> &nbsp; Horaires :</span>
            </p>
            <p className="gap-2 d-flex align-items-center">
              <span>Lun-Ven :</span>
              <span>09h-20h</span>
            </p>
            <span className="line" />
            <p className="gap-2 d-flex align-items-center">
              <span>Sam-Dim & Jours fériés :</span>
              <span>10h-20h</span>
            </p>
          </div>
          <div className="d-flex align-items-center header__top_contact">
            <p className="email">strasbourg@coworkingcafe.fr</p>
            <span className="line" />
            <ul className="d-flex align-items-center icons">
              <li>
                <Link href="#">
                  <i className="fa-brands fa-facebook-f" />
                </Link>
              </li>
              <li>
                <Link href="#">
                  <i className="fa-brands fa-instagram" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
