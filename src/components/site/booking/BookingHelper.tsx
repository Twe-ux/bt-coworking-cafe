import ProtectedEmail from "@/components/common/ProtectedEmail";

export default function BookingHelper() {
  return (
    <div className="subscribe">
      <div className="row justify-content-center">
        <div className="d-flex gap-2 flex-column mb-4 align-items-center">
          <h2>Besoin d'aide pour choisir ?</h2>
          <p>Notre équipe est à votre disposition pour vous conseiller</p>
        </div>
        <div className="d-flex gap-3 justify-content-center ">
          <a href="tel:+33987334519" className="common__btn">
            <i className="bi bi-telephone me-2"></i>
            <span>Appelez-nous</span>
          </a>
          <ProtectedEmail
            user="contact"
            domain="btcafe.com"
            className="common__btn"
            showIcon={true}
            displayText="Écrivez-nous"
          />
        </div>
      </div>
    </div>
  );
}
