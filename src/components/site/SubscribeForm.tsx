export default function SubscribeForm() {
  return (
    <div className="subscribe">
      <div className="row">
        <div className="col-lg-8">
          <h2>
            Abonne-toi à notre newsletter et reçois seulement une fois par
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
  );
}
