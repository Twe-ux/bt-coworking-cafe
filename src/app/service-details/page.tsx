import PageTitle from '@/components/pageTitle'
import SlideUp from '@/utils/animations/slideUp'
import React from 'react'

const ServiceDetails = () => {
    return (
        <>
            <PageTitle title={"Service Details"} currentPage={"Service Details"} />
            <article className="service__details py__130">
                <div className="container">
                    <img src="/images/services/service.png" alt="img" className="w-100 thumb__img" />
                    <div className="first__para pt__60">
                        <SlideUp>
                            <h2 className="t__54">
                                Business Analysis And Solution Program
                            </h2>
                        </SlideUp>
                        <p>
                            A strong online presence begins with a well-designed website.
                            Agencies offer web development and design services to create
                            user-friendly, responsive, and visually appealing websites that
                            convert visitors into customers. Data is the backbone of digital
                            marketing. Agencies use various analytics tools to track campaign
                            performance.
                        </p>
                        <p>
                            Analyze user behavior, and make data-driven decisions to optimize
                            strategies continually. They offer a diverse set of services
                            designed to increase online visibility, attract and engage
                            customers, and ultimately drive business growth in the highly
                            competitive online marketplace. These agencies are continually
                            adapting to evolving digital trends and technologies
                        </p>
                    </div>
                    <div className="second__para pt__60">
                        <div className="row justify-content-between align-items-center">
                            <SlideUp className="col-md-6">
                                <img src="/images/projects/project-2.png" alt="img" className="w-100" />
                            </SlideUp>
                            <SlideUp className="col-md-5 mt-4 mt-md-0">
                                <div>
                                    <h4 className="t__28">
                                        Our premium detail package makes your vehicle look &amp; smell
                                        like new again,
                                    </h4>
                                    <ul>
                                        <li>Online Booking System now</li>
                                        <li>Special Offers and Discounts for you!</li>
                                        <li>Sustainability Initiatives</li>
                                    </ul>
                                </div>
                            </SlideUp>
                        </div>
                    </div>
                    <div className="thred__para pt__50">
                        <h5 className="t__28">Service Benefits</h5>
                        <p>
                            Content is king in the digital world. Agencies produce high-quality
                            content, including blog posts, videos, infographics, and more, to
                            engage and educate the target audience. Content marketing builds
                            trust and authority for the brand. Agencies manage and grow a
                            brand's presence on social media platforms such as Facebook,
                            Twitter, LinkedIn, and Instagram.
                        </p>
                        <SlideUp>
                            <ul className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                                <li>Low Cost Our Fee</li>
                                <li>Available 24 hours</li>
                                <li>Skilled Mechanic</li>
                                <li>Warranty &amp; Maintenance</li>
                            </ul>
                        </SlideUp>
                        <p>
                            EO is the process of optimizing a website to improve its visibility
                            in search engine results pages (SERPs). Digital marketing agencies
                            use SEO techniques to enhance a website's ranking, drive organic
                            traffic, and increase its online presence. Content is king in the
                            digital world. Agencies produce high-quality content, including blog
                            posts, videos, infographics, and more, to engage and educate the
                            target audience
                        </p>
                    </div>
                    <div className="fourt__para">
                        <h5 className="t__28">Tips &amp; tricks</h5>
                        <p>
                            Our premium detail package makes your vehicle look &amp; smell like new
                            again, inside &amp; out. This is a full-day service.Need interior and
                            exterior detailing services? At Eco Car Cafe, we offer signature
                            auto detail packages to refresh your interior and exterior. We
                            created our convenient package bundles so you can get the best of
                            both.
                        </p>
                    </div>
                </div>
            </article>

        </>
    )
}

export default ServiceDetails