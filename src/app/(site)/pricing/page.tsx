import PageTitle from "@/components/site/pageTitle";
import PricingMeetingRoom from "@/components/site/pricing/pricingMeetingRoom";
import PricingOpenSpace from "@/components/site/pricing/pricingOpenSpace";

const Pricing = () => {
  return (
    <>
      <PageTitle title={"Tarifs"} currentPage={"Tarifs"} />
      <section className="pricing py__130">
        <div className="container">
          <PricingOpenSpace />
          <PricingMeetingRoom />
        </div>
      </section>
    </>
  );
};

export default Pricing;
