import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                {/* Subscribe Form */}
                <div className="subscribe">
                    <div className="row">
                        <div className="col-lg-8">
                            <h2>Subscribe to our newsletter &amp; get more information</h2>
                        </div>
                        <div className="col-lg-4 mt-5 mt-lg-0">
                            <div>
                                <input type="text" placeholder="Your Email" />
                                <button className="common__btn">
                                    <span>Subscribe Now</span>
                                    <i className="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Subscribe Form */}
                {/* -------Logo and socal icon */}
                <div className="row footer__lo_co">
                    <div className="col-12">
                        <div className="d-flex justify-content-center">
                            <Link href={"#"} className="d-flex align-items-center footer__logo">
                                <img src="/images/logo_white.svg" alt="img" />
                                <h5>Digiv</h5>
                            </Link>
                        </div>
                        <ul className="d-flex justify-content-center gap-3 footer__socal">
                            <li>
                                <Link href={"#"}>
                                    <i className="fa-brands fa-facebook-f" />
                                </Link>
                            </li>
                            <li>
                                <Link href={"#"}>
                                    <i className="fa-brands fa-pinterest-p" />
                                </Link>
                            </li>
                            <li>
                                <Link href={"#"}>
                                    <i className="fa-brands fa-instagram" />
                                </Link>
                            </li>
                            <li>
                                <Link href={"#"}>
                                    <i className="fa-brands fa-twitter" />
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* -------Logo and socal icon */}
                <hr className="footer__border" />
                {/* ---- Info */}
                <div className="row footer__info">
                    <div className="col-lg-4 col-md-6 mb-5 mb-lg-0">
                        <div className="footer__info_address">
                            <h3 className="footer__info_group">Address</h3>
                            <p>2096 New Market, New Road North West Bengal, NY, USA</p>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 mb-5 mb-lg-0">
                        <div>
                            <h3 className="footer__info_group">Our Contact</h3>
                            <ul className="footer__info_contact">
                                <li>
                                    <img src="/icons/Frame5.svg" alt="img" />
                                    <p>hellodigiv@gmail.com</p>
                                </li>
                                <li>
                                    <img src="/icons/Frame6.svg" alt="img" />
                                    <p>+48 93939 0239</p>
                                </li>
                                <li>
                                    <img src="/icons/Frame7.svg" alt="img" />
                                    <p>Mon - Fri 10:00 - 18:00</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 mb-5 mb-lg-0">
                        <div>
                            <h3 className="footer__info_group">Quick Links</h3>
                            <ul>
                                <li>
                                    <Link href={"#"}>Home</Link>
                                </li>
                                <li>
                                    <Link href={"#"}>Our All Services</Link>
                                </li>
                                <li>
                                    <Link href={"#"}>About Digiv</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-6 mb-5 mb-lg-0">
                        <div>
                            <h3 className="footer__info_group">Help</h3>
                            <ul>
                                <li>
                                    <Link href={"#"}>Contact Us</Link>
                                </li>
                                <li>
                                    <Link href={"#"}>FAQ's</Link>
                                </li>
                                <li>
                                    <Link href={"#"}>Privacy Pllicy</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* ---- Info */}
                <div className="row footer__copyright">
                    <div className="col-12">
                        <hr className="footer__border" />
                        <p className="text-center">
                            © Copyright 2025 All Rights Reserved by <Link href={"#"}>digiv</Link>
                        </p>
                    </div>
                </div>
            </div>
        </footer>

    )
}

export default Footer
