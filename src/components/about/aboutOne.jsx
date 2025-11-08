import React from 'react'
import Partner from '../partner'
import { partnerOneLogos } from '@/db/partnerOneLogos'
import SlideUp from '@/utils/animations/slideUp'
import SlideDown from '@/utils/animations/slideDown'
import Link from 'next/link'

const AboutOne = () => {
    return (
        <section className="about py__130" id="about">
            <div className="container">
                <div className="row justify-content-between about__title">
                    <SlideDown>
                        <div className="col-lg-10">
                            <div>
                                <h1 className="title">
                                    Agencies use various analytics tools to track and measure
                                    performance of online marketing efforts.
                                </h1>
                            </div>
                        </div>
                        <div className="col-lg-2">
                            <div className="about__title_shap position-relative">
                                <img src="/images/banner/Shape.svg" alt="img" className="w-100" />
                            </div>
                        </div>
                    </SlideDown>
                </div>
                <div className="row justify-content-between align-items-center about__wapper">
                    <div className="col-xl-5 col-lg-6">
                        <SlideUp>
                            <div className="about__wapper_left">
                                <p>
                                    High-quality, relevant content is essential for engaging and
                                    retaining online audiences. Digital marketing agencies often
                                    create content strategies, produce blog posts, articles, videos
                                </p>
                                <Link href="/about" className="circle">
                                    <i className="fa-solid fa-arrow-right"></i>
                                    <span>More About Us</span>
                                </Link>
                            </div>
                        </SlideUp>
                    </div>
                    <div className="col-xl-4 col-lg-6">
                        <SlideUp delay={2}>
                            <div className="about__wapper_center">
                                <img src="/images/about/Rectangle105.png" alt="img" />
                            </div>
                        </SlideUp>
                    </div>
                    <div className="col-xl-3 col-lg-6 mt-5 mt-xl-0">
                        <SlideUp delay={3}>
                            <ul className="about__wapper_right">
                                <li>
                                    <i className="fa-solid fa-check"></i>
                                    <span>We Grow Businesses</span>
                                </li>
                                <li>
                                    <i className="fa-solid fa-check"></i>
                                    <span>We’re skilled developers</span>
                                </li>
                                <li>
                                    <i className="fa-solid fa-check"></i>
                                    <span>Perfect &amp; modern solution</span>
                                </li>
                                <li>
                                    <i className="fa-solid fa-check"></i>
                                    <span>Quality marketing</span>
                                </li>
                            </ul>
                        </SlideUp>
                    </div>
                </div>
                <Partner data={partnerOneLogos} />
            </div>
        </section>

    )
}

export default AboutOne