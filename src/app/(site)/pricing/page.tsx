import PageTitle from '@/components/pageTitle'
import Partner from '@/components/partner'
import PricingTable from '@/components/pricing/pricingTable'
import { partnerTwoLogos } from '@/db/partnerOneLogos'
import React from 'react'

const Pricing = () => {
    return (
        <>
            <PageTitle title={"Pricing Plan"} currentPage={"Pricing Plan"} />
            <section className="pricing py__130">
                <div className="container">
                    <PricingTable />
                    <Partner data={partnerTwoLogos} className={'bg-transparent'} />
                </div>
            </section>
        </>
    )
}

export default Pricing