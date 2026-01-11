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
            <h2 className="text-black title mb-4 t_32">Vos récompenses</h2>
            <div className="row  align-items-center">
              <div className="col-md-5">
                <img
                  src="/images/membersPrograms/programme-membre-fidelite-coworkingcafe-strasbourg.webp"
                  alt="img"
                  className="w-100 rounded-3"
                />
              </div>
              <SlideUp className="col-md-6 mt-4 mt-md-0">
                <div>
                  <h4 className="t__28 mb__15">
                    Transformez vos points en cadeaux
                  </h4>
                  <p className="t__28 mb__10">
                    Chaque point compte et chaque récompense se débloque quand
                    vous l’atteignez. Des heures offertes aux gourmandises, il y
                    en a pour tous les goûts… et ça ne fait que commencer !
                  </p>
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
                  <p className=" t__28 mt__15">
                    Et ce n’est pas tout ! Des goodies exclusifs et surprises
                    ponctuelles viendront compléter la liste au fil des saisons.
                    👀
                  </p>
                  <div className="w-100 d-flex justify-content-center ">
                    <button type="submit" className="btn auth-btn mt__50">
                      "Créer mon compte"
                    </button>
                  </div>
                </div>
              </SlideUp>
            </div>
          </div>
          <div className="thred__para py__90">
            <h5 className=" title text-black ">
              Les bonnes raisons de cumuler des points
            </h5>
            <p className="text-black mt-3 mb-4">
              Rejoindre le programme membre, ce n’est pas juste gagner des
              points… c’est profiter pleinement de chaque moment passé chez
              nous.
            </p>
            <SlideUp>
              <div className="d-flex flex-column align-items-start px-4">
                ☕ Vous venez déjà souvent ? Alors autant être récompensé·e 😉
                <br />
                ⏰ Des heures et journées offertes, pour travailler ou chiller
                encore plus.
                <br />
                🎁 Des surprises et goodies exclusifs, parce qu’on adore vous
                gâter.
                <br />
                🍕 Des gourmandises qui font sourire, pizzas, encas sucrés,
                boissons…
                <br />✨ Un programme simple et sans prise de tête, cumulez,
                choisissez, profitez.
              </div>
            </SlideUp>
            <p>
              Chaque visite devient un petit plaisir en plus. Et avouons-le… qui
              n’aime pas être récompensé·e pour ce qu’il fait déjà ?
            </p>

            <p className="mantra text-center">
              On aime quand vous revenez. Alors on aime encore plus vous
              remercier. <br /> Rejoignez le programme membre Anticafé ✨
            </p>

            {/* <div className="pb__130">
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
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </article>
    </>
  );
}
