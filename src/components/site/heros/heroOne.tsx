import SlideUp from "@/utils/animations/slideUp";
import Link from "next/link";

const HeroOne = () => {
  return (
    <section className="banner overflow-hidden">
      <div className="container position-relative">
        <div className="row">
          <div className="col-lg-8">
            <div className="banner__content">
              <div className="banner__content_title ">
                <SlideUp>
                  <h1 className="title">
                    Le refuge des nomades et coworkers sans bureau fixe
                  </h1>
                </SlideUp>
                <SlideUp delay={2}>
                  <p>
                    Le meilleur café pour travailler ! Boissons, wifi,
                    imprimante ...
                    <br /> Tout est inclus; seul le temps est facturé.
                  </p>
                </SlideUp>
              </div>
              <SlideUp
                delay={3}
                className="buttons d-sm-flex align-items-center"
              >
                <Link href={"/espaces"} className="common__btn buttons_file">
                  <span>Voir les espaces</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>
                <Link
                  href={"/actualites"}
                  className="common__btn buttons_outline mt-4 mt-sm-0"
                >
                  <span>Nos actualités</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </SlideUp>
              <SlideUp
                delay={4}
                className="banner__content_number d-flex justify-content-between"
              >
                <div>
                  <h4>60</h4>
                  <p>places</p>
                </div>
                <div>
                  <h4>+ 40</h4>
                  <p>choix de boissons</p>
                </div>
                <div>
                  <h4>+ 700</h4>
                  <p>clients membres</p>
                </div>
              </SlideUp>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="banner__right">
              <img
                src="/images/banner/Shape.svg"
                alt="img"
                className="bg__shap"
              />
              <img
                src="/images/logo-circle.webp"
                alt="img"
                className="bg__video"
              />
              <div>
                <img
                  src="/images/banner/Rectangle96.png"
                  alt="img"
                  className="bg__img"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="position-absolute top-0 h-100 w-100">
          {/* <div class="position-relative w-100 h-100"> */}
          <div className="banner__shap_1 banner__shap" />
          <div className="banner__shap_2 banner__shap" />
          <div className="banner__shap_3 banner__shap" />
          <div className="banner__shap_4 banner__shap" />
        </div>
        {/* </div> */}
      </div>
    </section>
  );
};

export default HeroOne;
