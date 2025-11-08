import AboutOne from "@/components/about/aboutOne";
import HomeBlog from "@/components/blogs/homeBlog";
import HeroOne from "@/components/heros/heroOne";
import PricingTable from "@/components/pricing/pricingTable";
import ProjectsOne from "@/components/projects/projectsOne";
import ServiceOne from "@/components/services/serviceOne";
import TestimonialOne from "@/components/testimonial/testimonialOne";
import SlideUp from "@/utils/animations/slideUp";

const Home = () => {
  return (
    <>
      <HeroOne />
      <AboutOne />
      <ServiceOne />
      <ProjectsOne isProjectUseCaseShow={true} />
      <section className="pricing">
        <div className="container">
          <SlideUp className="testimonial__title">
            <h1 className="title text-center">
              Take a look the perfect pricing plan to get started
            </h1>
          </SlideUp>
          <PricingTable />
        </div>
      </section>
      <TestimonialOne />
      <HomeBlog className={"py__130"} />
    </>
  );
};

export default Home;
