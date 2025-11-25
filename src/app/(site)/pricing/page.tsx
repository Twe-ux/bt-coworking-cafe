import PageTitle from "@/components/site/pageTitle";
import PricingMeetingRoom from "@/components/site/pricing/pricingMeetingRoom";
import PricingOpenSpace from "@/components/site/pricing/pricingOpenSpace";

const Pricing = () => {
  return (
    <>
      <PageTitle title={"Nos tarifs"} />
      <section className="pricing py__130" id="pricing">
        <div className="container">
          <PricingOpenSpace />
          <PricingMeetingRoom />
        </div>
      </section>
    </>
  );
};

export default Pricing;
