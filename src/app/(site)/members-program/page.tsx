import MembersProgram from "@/components/site/membersProgram/membersProgram";
import PageTitle from "@/components/site/pageTitle";
import SlideUp from "@/utils/animations/slideUp";

export default function MembersProgramPage() {
  return (
    <>
      <PageTitle title="Programme membre" />
      <MembersProgram />
      <article className="member__details py__90">
        <div className="container pb__130">
          <div className="second__para ">
            <h1 className=" title text-black mb-4">Vos récompenses</h1>
            <div className="row  align-items-center">
              <div className="col-md-6 ">
                <img
                  src="/images/membersPrograms/programme-membre-fidelite-coworkingcafe-strasbourg.webp"
                  alt="img"
                  className="w-80 rounded-3"
                />
              </div>
              <SlideUp className="col-md-5 mt-4 mt-md-0">
                <div>
                  <h2 className="t__32 mb__15">
                    Transformez vos points en cadeaux
                  </h2>
                  <h4 className="t__28 mb__15">
                    Chaque point compte et chaque récompense se débloque quand
                    vous l’atteignez. Des heures offertes aux gourmandises, il y
                    en a pour tous les goûts… et ça ne fait que commencer !
                  </h4>
                  <ul>
                    <li>⏰ 1 heure offerte → 600 points</li>
                    <li>📆 1 jour offert → 3 900 points</li>
                    <li>🗓 1 semaine offerte → 13 200 points</li>
                    <li>📅 1 mois offert → 39 000 points</li>
                    <li>🍕 1 pizza → 1 000 points</li>
                    <li>🥤 1 boisson ++ → 600 points</li>
                    <li>🍪 1 encas sucré → 300 points</li>
                    <li>🎧 1 paire d’écouteurs → 1 000 points</li>
                  </ul>
                </div>
              </SlideUp>
              <h4 className="t__24 mt__30">
                Et ce n’est pas tout ! Des goodies exclusifs et surprises
                ponctuelles viendront compléter la liste au fil des saisons. 👀
              </h4>
            </div>
            <div className="w-100 d-flex justify-content-center ">
              <button type="submit" className="btn auth-btn mt__50 ">
                "Créer mon compte"
              </button>
            </div>
          </div>
          <div className="thred__para py__90">
            <h5 className="t__28">Les bonnes raisons de cumuler des points</h5>
            <p>
              Rejoindre le programme membre, ce n’est pas juste gagner des
              points… c’est profiter pleinement de chaque moment passé chez
              nous.
            </p>
            <SlideUp>
              <ul className="d-flex flex-column  align-items-start  gap-3 px-3">
                <li>
                  ☕ Vous venez déjà souvent ? Alors autant être récompensé·e 😉
                </li>
                <li>
                  ⏰ Des heures et journées offertes, pour travailler ou chiller
                  encore plus.
                </li>
                <li>
                  🎁 Des surprises et goodies exclusifs, parce qu’on adore vous
                  gâter.
                </li>
                <li>
                  🍕 Des gourmandises qui font sourire, pizzas, encas sucrés,
                  boissons…
                </li>
                <li>
                  ✨ Un programme simple et sans prise de tête, cumulez,
                  choisissez, profitez.
                </li>
              </ul>
            </SlideUp>
            <p>
              Chaque visite devient un petit plaisir en plus. Et avouons-le… qui
              n’aime pas être récompensé·e pour ce qu’il fait déjà ?
            </p>
            <div className="pb__130">
              <div className="counter d-flex flex-column ">
                <div className="counter__box d-flex justify-content-center">
                  <div className="d-flex flex-column text-center">
                    <h4 className="counter__number">
                      On aime quand vous revenez. Alors on aime encore plus vous
                      remercier.
                    </h4>
                    <h4 className="counter__number">
                      Rejoignez le programme membre Anticafé ✨
                    </h4>
                  </div>
                  {/* <p className="counter__text">test</p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
