import FaqSection from '@/components/faqSection'
import PageTitle from '@/components/pageTitle'
import React from 'react'

const Faq = () => {
    return (
        <>
            <PageTitle title={"FAQ’s"} currentPage={"FAQ’s"}/>
            <FaqSection />
        </>
    )
}

export default Faq