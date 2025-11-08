import ContactInfo from '@/components/contactInfo'
import GoogleMap from '@/components/googleMap'
import PageTitle from '@/components/pageTitle'
import React from 'react'

const Contact = () => {
    return (
        <>
            <PageTitle title={"Contact Us"} currentPage={"Contact Us"}/>
            <ContactInfo />
            <GoogleMap/>
        </>
    )
}

export default Contact