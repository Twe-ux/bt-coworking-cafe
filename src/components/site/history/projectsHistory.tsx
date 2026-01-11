import { historyData } from "@/db/history/historyData";
import SlideUp from "@/utils/animations/slideUp";
import ProjectCard from "../projects/projectCard";

const ProjectsHistory = () => {
  return (
    <section className="all__project py__90">
      <div className="container">
        <h2 className="t__54">
          L’équipe : des personnalités, un même lieu à faire vivre
        </h2>
        <p className="text-black mt__20">
          Derrière Coworking Café by Anticafé, il n’y a pas qu’un concept : il y
          a une équipe. Une petite tribu qui font battre le cœur du lieu au
          quotidien ☕✨
        </p>
        <p className="text-black mt__20">
          Nous sommes baristas, hôtes, conseillers improvisés, techniciens du
          quotidien, ambiance managers, préparateurs de cappuccinos parfaitement
          mousseux, réparateurs de prises capricieuses… et surtout, gardiens
          d’un espace où chacun doit se sentir bien.
        </p>
        <div className="row mt__20">
          <div className="row">
            {historyData.map(({ categories, id, imgSrc, title }) => (
              <SlideUp
                key={id}
                className={`col-xl-3 col-md-6 mb-5 mb-xl-0`}
                delay={id}
              >
                <ProjectCard
                  categories={categories}
                  imgSrc={imgSrc}
                  title={title}
                />
              </SlideUp>
            ))}
          </div>
        </div>
        <p className="text-black">
          Il y a les sourires du matin, les cafés qui démarrent une bonne
          journée, les coups de main spontanés, les “tu préfères un spot plus
          calme ?”, les “pas de souci, on te trouve une prise”, les “tu veux
          tester notre nouveau matcha ?”. Il y a les allers-retours au comptoir,
          les rencontres entre clients, les petites attentions… et cette vraie
          joie de contribuer à vos projets, qu’ils soient minuscules ou
          gigantesques.
        </p>
        <p className="text-black mt__20">
          Nous avons des personnalités différentes, des parcours variés, mais
          une énergie commune : 🎯 accueillir, accompagner, faciliter, et créer
          un lieu où travailler devient un plaisir.
        </p>
        <p className="text-black mt__20">
          Christèle et Thierry sont aux commandes, mais le lieu vit grâce à
          toute l’équipe : ceux qui vous servent votre latte du jour, ceux qui
          ajustent la musique, ceux qui préparent la salle du haut, ceux qui
          répondent à vos questions, ceux qui connaissent vos habitudes par
          cœur.
        </p>
        <p className="text-black mt__20">
          Un vrai travail d’équipe, discret mais essentiel, pour que votre
          journée ici soit fluide, sereine et inspirante.
        </p>
      </div>
    </section>
  );
};

export default ProjectsHistory;
