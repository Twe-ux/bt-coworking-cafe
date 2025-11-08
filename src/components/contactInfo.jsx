'use client'
import SlideUp from '@/utils/animations/slideUp'
import React from 'react'
import CustomDropdown from './customDropdown'

const ContactInfo = () => {
    const handleSelect = (option) => {
        console.log("Selected:", option);
    };
    return (
        <section className="contact">
            <div className="container">
                <div className="row justify-content-between align-items-center">
                    <SlideUp className="col-lg-4">
                        <div className="location">
                            <h3 className="t__54">Contact Us</h3>
                            <p className="location__disc">
                                Get in touch to discuss your employee well-being needs today.
                            </p>
                            <ul>
                                <li>
                                    <img src="/icons/location.svg" alt="img" />
                                    <div>
                                        <b>Location:</b>
                                        <p>Los Angles CA, 300, New York USA</p>
                                    </div>
                                </li>
                                <li>
                                    <img src="/icons/phone.svg" alt="img" />
                                    <div>
                                        <b>Call US:</b>
                                        <p>+589 939 939 99</p>
                                    </div>
                                </li>
                                <li>
                                    <img src="/icons/email1.svg" alt="img" />
                                    <div>
                                        <b>Send Message:</b>
                                        <p>hellodigiv@gmail.com</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </SlideUp>
                    <SlideUp className="col-lg-8 mt-5 mt-lg-0" >
                        <div className="contact__form">
                            <h5 className="t__28">Get In Touch Here</h5>
                            <form>
                                <div className="row">
                                    <div className="col-md-6">
                                        <input type="text" placeholder="Your Name" />
                                    </div>
                                    <div className="col-md-6">
                                        <input type="email" placeholder="Your Email" />
                                    </div>
                                    <div className="col-12">
                                        <CustomDropdown options={["Option 1", "Option 2", "Option 3"]} onSelect={handleSelect} />
                                    </div>
                                    <div className="col-12">
                                        <textarea placeholder="Your Message" />
                                    </div>
                                    <div>
                                        <button className="common__btn">
                                            Send Your Message
                                            <img src="/icons/arrow-up-right.svg" alt="img" />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </SlideUp>
                </div>
            </div>
        </section>

    )
}

export default ContactInfo