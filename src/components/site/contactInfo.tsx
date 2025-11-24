"use client";
import SlideUp from "@/utils/animations/slideUp";
import ProtectedEmail from "../common/ProtectedEmail";
import CustomDropdown from "./customDropdown";

const ContactInfo = () => {
  const handleSelect = (option: string) => {
    console.log("Selected:", option);
  };
  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="row justify-content-between align-items-center">
          <SlideUp className="col-lg-5">
            <div className="location">
              <h3 className="t__54">Contactez-nous</h3>
              <p className="location__disc">
                N'hésitez pas à nous contacter dès aujourd'hui pour discuter de
                vos besoins.
              </p>
              <ul>
                <li>
                  <img src="/icons/phone.svg" alt="img" />
                  <div>
                    <b>Applez nous:</b>
                    <p>09 87 33 45 19</p>
                  </div>
                </li>
                <li>
                  <img src="/icons/email1.svg" alt="img" />
                  <div>
                    <b>Envoyer un message:</b>
                    <p>
                      <ProtectedEmail
                        user="strasbourg"
                        domain="coworkingcafe.fr"
                        className="email"
                      />
                    </p>
                  </div>
                </li>
                <li>
                  <img src="/icons/location.svg" alt="img" />
                  <div className="d-flex flex-column gap-4 " id="emplacement">
                    <div>
                      <b>Emplacement:</b>
                      <p>1 rue de la Division Leclerc</p>
                      <p>67000 STRASBOURG</p>
                    </div>
                    <div className="d-flex gap-5">
                      <div>
                        <b>Tram:</b>
                        <p>Arrêt Langstross - Grand'Rue</p>
                        <p>Ligne A - D</p>
                      </div>
                      <div>
                        <b>Parking:</b>
                        <p>Place Gutemberg</p>
                        <p>5 min à pieds</p>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </SlideUp>
          <SlideUp className="col-lg-6 mt-5 mt-lg-0">
            <div className="contact__form">
              <h5 className="t__28">Contactez-nous ici</h5>
              <form>
                <div className="row">
                  <div className="col-md-6">
                    <input type="text" placeholder="Votre nom" />
                  </div>
                  <div className="col-md-6">
                    <input type="email" placeholder="Votre Email" />
                  </div>
                  <div className="col-12">
                    <CustomDropdown
                      options={["Option 1", "Option 2", "Option 3"]}
                      onSelect={handleSelect}
                    />
                  </div>
                  <div className="col-12">
                    <textarea placeholder="Votre message" />
                  </div>
                  <div>
                    <button className="common__btn">
                      Envoyez votre message
                      <img src="/icons/arrow-up-right.svg" alt="img" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </SlideUp>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
