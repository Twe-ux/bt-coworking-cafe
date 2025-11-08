import Link from 'next/link'
import React from 'react'

const TopHeader = () => {
    return (
        <div className="header__top d-lg-block d-none">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center header__top_left">
                        <p className="d-flex align-items-center time">
                            <i className="bi bi-clock" />
                            <span> &nbsp; Working Hours :</span>
                        </p>
                        <p>
                            <span>Monday - Friday,</span>
                            <span>10am - 05pm</span>
                        </p>
                    </div>
                    <div className="d-flex align-items-center header__top_contact">
                        <p className="email">digiv@gmail.com</p>
                        <span className="line" />
                        <p className="phone">+3929 299 999</p>
                        <span className="line" />
                        <ul className="d-flex align-items-center icons">
                            <li><Link href="#"><i className="fa-brands fa-facebook-f" /></Link></li>
                            <li><Link href="#"><i className="fa-brands fa-twitter" /></Link></li>
                            <li><Link href="#"><i className="fa-brands fa-instagram" /></Link></li>
                            <li><Link href="#"><i className="fa-brands fa-youtube" /></Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default TopHeader