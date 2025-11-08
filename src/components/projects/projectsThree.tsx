import { projectsTwoData } from '@/db/projectsTwoData'
import React from 'react'
import ProjectCard from './projectCard'
import SlideUp from '@/utils/animations/slideUp'

const ProjectsThree = () => {
    return (
        <section className="all__project py__130">
            <div className="container">
                <div className="row">
                    <div className="row">
                        {projectsTwoData.map(({ categories, id, imgSrc, title }) => (
                            <SlideUp
                                key={id}
                                className={`col-xl-4 col-md-6 mb-5 mb-xl-0`}
                                delay={id}
                            >
                                <ProjectCard categories={categories} imgSrc={imgSrc} title={title} />
                            </SlideUp>
                        ))}
                    </div>
                </div>
                <SlideUp className="custom__pagination">
                    <div className="row">
                        <div className="col-12">
                            <ul className="d-flex justify-content-center">
                                <li>
                                    <i className="fa-solid fa-arrow-left" />
                                </li>
                                <li>01</li>
                                <li>02</li>
                                <li>03</li>
                                <li>
                                    <i className="fa-solid fa-arrow-right" />
                                </li>
                            </ul>
                        </div>
                    </div>
                </SlideUp>
            </div>
        </section>

    )
}

export default ProjectsThree