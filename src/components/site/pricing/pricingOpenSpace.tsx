import { pricingDataOpenSpace } from "@/db/pricingData";
import SlideUp from "@/utils/animations/slideUp";
import Link from "next/link";

const PricingOpenSpace = () => {
  return (
    <div className="row pt__50">
      <h2 className="pricing__title">Tarifs de l’open-space</h2>
      {pricingDataOpenSpace.map((plan, index) => (
        <SlideUp
          key={index}
          className="col-xl-3 col-md-6 mb-4 mb-xl-0"
          delay={index}
        >
          <div className="pricing__card">
            <div className="text-center pricing__card_title">
              <h6>{plan.title}</h6>
              <div className="d-flex justify-content-center">
                <h1 className="t__54">{plan.priceTTC}</h1>
                <sup>TTC</sup>
              </div>
              <p>{plan.duration}</p>
            </div>
            <span className="border__full" />
            <ul>
              {plan.features.map((feature, i) => (
                <li key={i}>
                  <span />
                  <p>{feature}</p>
                </li>
              ))}
            </ul>
            <p>{plan.condition}</p>
            <Link
              href={
                "https://coworkingcafe.cosoft.fr/v2/new-reservation/8441947e-ed60-4e45-ac1a-b0ff00eeece1/8dbfad66-4c97-437a-882f-b11b00d46f32/6091955d-706f-47c5-a33f-b11c010b89d7"
              }
              className="common__btn"
            >
              <span>Réserver</span>
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </SlideUp>
      ))}
    </div>
  );
};

export default PricingOpenSpace;
