import AboutOne from '@/components/about/aboutOne'
import HomeBlog from '@/components/blogs/homeBlog'
import PageTitle from '@/components/pageTitle'
import ProjectsOne from '@/components/projects/projectsOne'
import TestimonialTwo from '@/components/testimonial/testimonialTwo'
import React from 'react'

const About = () => {
    return (
        <>
            <PageTitle title={"About Us"} currentPage={"About Us"} />
            <AboutOne />
            <ProjectsOne />
            <TestimonialTwo />
            <HomeBlog />
        </>
    )
}

export default About