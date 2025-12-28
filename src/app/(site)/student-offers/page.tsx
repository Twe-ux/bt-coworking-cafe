import PageTitle from "@/components/site/pageTitle";
import SlideUp from "@/utils/animations/slideUp";

const StudentsOffersPage = () => {
  return (
    <>
      <PageTitle title="Offres étudiantes" />

      <section className="students students__2 py__20" id="student-offers">
        <div className="container position-relative">
          <div className="students__wapper students__2_wapper">
            <section className="tools__concept py__110">
              <div className="container">
                <div className="projects__usecase">
                  <div className="row align-items-center">
                    <SlideUp className="col-lg-6">
                      <div className="projects__usecase_content">
                        <h3 className="t__54">
                          Happy Hours , 🎓 spécial étudiants
                        </h3>
                        <p className="pt__50">
                          Du lundi au vendredi, de 17h à 20h.
                        </p>
                        <p className="mt-2">
                          Besoin d’un endroit pour réviser, bosser en groupe,
                          avancer sur tes projets ou simplement te concentrer en
                          fin de journée ?
                        </p>
                        <p className="mt-2">
                          Nos Happy Hours Étudiants sont faites pour toi 💛.
                        </p>
                        <p className="mt-2">
                          Pendant ce créneau, tu profites d’un tarif ultra
                          avantageux : <br />
                          👉 12 € les 3 heures (au lieu de 18 €). <br />✨ sur
                          présentation d’une carte étudiante valide.
                        </p>
                        <p className="mt-2">
                          Tu t’installes où tu veux, tu profites du wifi très
                          haut débit, de l’ambiance calme et studieuse, et de
                          toutes nos boissons chaudes et fraîches préparées à la
                          demande. Tout est inclus — tu n’as qu’à venir avec ton
                          ordi et ta motivation.
                        </p>
                        <p>
                          <ul className="mt-3">
                            C’est le moment parfait pour :
                            <li>réviser sans distraction</li>
                            <li>bosser en équipe</li>
                            <li>finaliser un rendu ou un projet</li>
                            <li>rester productif sans exploser ton budget</li>
                            <li>
                              t’offrir un vrai espace de focus avant la soirée
                              😎
                            </li>
                          </ul>
                        </p>
                      </div>
                    </SlideUp>
                    <div className="students__carousel">
                      <img
                        src={
                          "/images/offersStudents/offres-étudiants-happy-hours-coworking-strasbourg.webp"
                        }
                        alt={`"Happy Hours , 🎓 spécial étudiants" - image ${"happy-hours"}`}
                        className="students__carousel_img"
                      />
                    </div>
                  </div>
                </div>
                <p className=" mt-2">
                  Pas besoin de réserver : tu viens, finaliser un rendu ou un
                  projet rester productif sans exploser ton budget t’offrir un
                  vrai espace de focus avant la soirée 😎 Pas besoin de réserver
                  : tu viens, tu donnes ton prénom, et on lance ton timer.
                  Facile, non ? <br />{" "}
                </p>
                <p className="bold mt-3">
                  Profite de nos Happy Hours Étudiants et transforme tes fins de
                  journée en sessions de travail efficaces et agréables, le tout
                  à petit prix !
                </p>
              </div>
            </section>
            <section className="tools__concept py__110">
              <div className="container">
                <div className="projects__usecase">
                  <div className="row align-items-center">
                    <SlideUp className="col-lg-6">
                      <div className="projects__usecase_content">
                        <h3 className="t__54">
                          Happy Weekend, 🎓 spécial étudiants
                        </h3>
                        <p className="pt__50 mt-2">
                          Tous les samedis, dimanches et jours fériés.
                        </p>
                        <p className="mt-2">
                          Envie de bosser au calme le week-end, loin du bruit de
                          la coloc ou de la BU surchargée ?
                        </p>
                        <p className="mt-2">
                          Nos Happy Weekend Étudiants sont là pour te sauver la
                          productivité… et ton budget 💛.
                        </p>
                        <p className="mt-2">
                          Pendant tout le week-end, tu profites d’un tarif
                          spécial :
                        </p>
                        <p> 👉 24 € la journée (au lieu de 29 €)</p>
                        <p>✨ sur présentation d’une carte étudiante valide.</p>
                        <p className="mt-2">
                          Tu t’installes où tu veux, tu profites du wifi très
                          haut débit, de nos boissons à volonté (chaudes et
                          fraîches, préparées à la demande), et d’un espace cosy
                          parfait pour réviser, avancer sur un projet ou
                          organiser une session de travail en groupe.
                        </p>
                        <p>
                          <ul className="mt-2">
                            C’est le spot idéal pour :
                            <li>préparer tes examens sans stress</li>
                            <li>avancer sur un mémoire ou un dossier</li>
                            <li>travailler avec ta team</li>
                            <li>
                              t’offrir une vraie journée productive hors de chez
                              toi
                            </li>
                            <li>retrouver un peu d’air et de motivation</li>
                          </ul>
                        </p>
                      </div>
                    </SlideUp>
                    <div className="students__carousel">
                      <img
                        src="/images/offersStudents/offres-etudiants-weekend-coworking-strasbourg.webp"
                        alt={`"Happy Weekend, 🎓 spécial étudiants" - image ${"happy-weekend"}`}
                        className="students__carousel_img"
                      />
                    </div>
                  </div>
                </div>
                <p className="mt-2">
                  Pas de réservation nécessaire : tu arrives, tu montres ta
                  carte étudiante, et tu peux profiter de ton espace toute la
                  journée 😎.
                </p>
                <p className="bold mt-3">
                  Profite de nos Happy Weekend Étudiants pour allier
                  productivité et détente, tout en respectant ton budget
                  étudiant !
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </>
  );
};

export default StudentsOffersPage;
