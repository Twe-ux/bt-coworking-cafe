export default function SubscribeForm() {
  return (
    <div className="subscribe">
      <div className="row justify-content-center">
        <div className="d-flex gap-2 flex-column mb-4 align-items-center">
          <h2>Abonne-toi à notre newsletter</h2>
          <p>
            Reçois une fois par mois toutes les actus, événements et promotions
            en cours...
          </p>
        </div>

        <div className="d-flex gap-3 justify-content-center">
          <input className="input__btn" type="text" placeholder="Ton Email" />
          <button className="common__btn">
            <span>Rejoins-nous !</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
