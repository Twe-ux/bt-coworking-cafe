export default function BookingHelper() {
  return (
    <div className="booking-helper">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <h3>Besoin d'aide pour choisir ?</h3>
            <p>Notre équipe est à votre disposition pour vous conseiller</p>
          </div>
          <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-lg-end">
              <a href="tel:+33123456789" className="helper-btn">
                <i className="bi bi-telephone me-2"></i>
                Appelez-nous
              </a>
              <a href="mailto:contact@btcafe.com" className="helper-btn">
                <i className="bi bi-envelope me-2"></i>
                Écrivez-nous
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .booking-helper {
          background: var(--main-clr, #417972);
          padding: 2rem 0;
          margin-top: 3rem;
        }

        h3 {
          color: white;
          font-size: 1.25rem;
          margin-bottom: 0.25rem;
          font-weight: 600;
        }

        p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.9rem;
          margin: 0;
        }

        .helper-btn {
          display: inline-block;
          background: var(--btn-clr, #f2d381);
          color: var(--body-clr, #142220);
          padding: 0.6rem 1.25rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .helper-btn:hover {
          background: #e5c670;
          transform: translateY(-2px);
          color: var(--body-clr, #142220);
        }

        @media (max-width: 992px) {
          .booking-helper {
            padding: 1.5rem 0;
            text-align: center;
          }

          h3 {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
}
