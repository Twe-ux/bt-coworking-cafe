import Menu from "@/components/site/menu/menu";
import PageTitle from "@/components/site/pageTitle";

const BoissonsPage = () => {
  return (
    <>
      <PageTitle title={"Nos Boissons"} currentPage={"Boissons"} />
      <Menu
        type="drink"
        title="Nos Boissons"
        subtitle="Découvrez notre sélection de boissons, toutes incluses dans votre forfait temps."
      />
    </>
  );
};

export default BoissonsPage;
