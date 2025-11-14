export default function BookingHelper() {
  return (
    <div className="subscribe">
      <div className="row justify-content-center">
        <div className="col-lg-8 text-center">
          <div className="d-flex gap-2 flex-column mb-4">
            <h2>Besoin d'aide pour choisir ?</h2>
            <p>Notre équipe est à votre disposition pour vous conseiller</p>
          </div>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <a href="tel:+33123456789" className="common__btn">
              <i className="bi bi-telephone me-2"></i>
              <span>Appelez-nous</span>
            </a>
            <a href="mailto:contact@btcafe.com" className="common__btn">
              <i className="bi bi-envelope me-2"></i>
              <span>Écrivez-nous</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
