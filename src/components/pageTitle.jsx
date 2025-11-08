import SlideUp from '@/utils/animations/slideUp'
import Link from 'next/link'
import React from 'react'

const PageTitle = ({ title, currentPage }) => {
    return (
        <section className="page__header position-relative">
            <div className="container">
                <div className="row">
                    <div className="col-12 d-flex justify-content-xl-between justify-content-center align-items-center">
                        <img src="/images/pageHeader/Group_78_3.svg" alt="img" className="img-fluid left__pei" />
                        <img src="/images/pageHeader/Group727.svg" alt="img" className="left__arrow img-fluid" />
                        <SlideUp className="text-center">
                            <h2>{title}</h2>
                            <div className="d-flex justify-content-center gap-2">
                                <Link href="/">Home</Link>
                                <span>/</span>
                                <p>{currentPage}</p>
                            </div>
                        </SlideUp>
                        <img src="/images/pageHeader/Group726.png" alt="img" className="img-fluid right__arrow" />
                    </div>
                </div>
            </div>
        </section>

    )
}

export default PageTitle