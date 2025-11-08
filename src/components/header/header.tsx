'use client'
import React, { useState } from 'react'
import TopHeader from './topHeader'
import Navbar from './navbar'
import Link from 'next/link'

const Header = () => {
    const [activeNavbar, setActiveNavebar] = useState(false)

    return (
        <header className="header header__1">
            <TopHeader />
            <div className="header__bottom">
                <div className="container">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <Link href="/" className="d-flex align-items-center header__bottom_logo">
                                <img src="/images/logo.svg" alt="img" />
                                <h5>Digiv</h5>
                            </Link>
                        </div>
                        <Navbar activeNavbar={activeNavbar}/>
                        <div className="d-xl-block d-none">
                            <Link href={"/contact"} className="common__btn">
                                <span> Get Started Now</span>
                                <img src="/icons/arrow-up-right.svg" alt="img" />
                            </Link>
                        </div>
                        <div className="menu__icon d-block d-xl-none" onClick={()=>setActiveNavebar(!activeNavbar)}>
                            <i className="bi bi-list" />
                        </div>
                    </div>
                </div>
            </div>
        </header>

    )
}

export default Header