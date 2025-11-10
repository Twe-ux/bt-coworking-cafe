import AboutOne from "@/components/site/about/aboutOne";
import HomeBlog from "@/components/site/blogs/homeBlog";
import HeroOne from "@/components/site/heros/heroOne";
import ProjectsOne from "@/components/site/projects/projectsOne";
import TestimonialOne from "@/components/site/testimonial/testimonialOne";

const Home = () => {
  return (
    <>
      <HeroOne />
      <AboutOne />
      {/* <ServiceOne /> */}
      <ProjectsOne isProjectUseCaseShow={true} />

      {/* <section className="pricing">
        <div className="container">
          <SlideUp className="testimonial__title">
            <h1 className="title text-center">
              Take a look the perfect pricing plan to get started
            </h1>
          </SlideUp>
          <PricingTable />
        </div>
      </section> */}
      <TestimonialOne />
      <HomeBlog className={"py__130"} />
    </>
  );
};

export default Home;
