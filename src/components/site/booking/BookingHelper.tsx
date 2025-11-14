export default function BookingHelper() {
  return (
    <div className="subscribe">
      <div className="text-center">
        <div className="d-flex gap-2 flex-column">
          <h3>Besoin d'aide pour choisir ?</h3>
          <p>Notre équipe est à votre disposition pour vous conseiller</p>
        </div>
        <div className="d-flex gap-5 align-justify-center pt-5">
          <a href="tel:+33123456789" className="common__btn">
            <i className="bi bi-telephone me-2"></i>
            Appelez-nous
          </a>
          <a href="mailto:contact@btcafe.com" className="common__btn">
            <i className="bi bi-envelope me-2"></i>
            Écrivez-nous
          </a>
        </div>
      </div>
    </div>
  );
}
