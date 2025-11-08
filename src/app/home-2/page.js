import React from 'react'
import AboutTwo from '@/components/about/aboutTwo'
import HomeBlog from '@/components/blogs/homeBlog'
import HeroTwo from '@/components/heros/heroTwo'
import ProjectsTwo from '@/components/projects/projectsTwo'
import ServicesTwo from '@/components/services/servicesTwo'
import SiteOverview from '@/components/siteOverview'
import TestimonialTwo from '@/components/testimonial/testimonialTwo'

const HomeTwo = () => {
    return (
        <>
            <HeroTwo />
            <AboutTwo />
            <ServicesTwo />
            <ProjectsTwo />
            <SiteOverview />
            <TestimonialTwo />
            <HomeBlog />
        </>
    )
}

export default HomeTwo