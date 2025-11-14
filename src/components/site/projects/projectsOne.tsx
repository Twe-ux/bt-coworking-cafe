import { projectsOneData } from "@/db/projectsOneData";
import SlideDown from "@/utils/animations/slideDown";
import SlideUp from "@/utils/animations/slideUp";
import Link from "next/link";
import React from "react";

interface ProjectsOneProps {
  isProjectUseCaseShow?: boolean;
}

const ProjectsOne: React.FC<ProjectsOneProps> = ({ isProjectUseCaseShow }) => {
  return (
    <section className="projects pt__120 pb__130">
      <div className="container">
        {/* title Start */}
        <SlideDown className="d-lg-flex justify-content-between align-items-center projects__title">
          <h1 className="title">
            Des espaces pour favoriser votre créativité et votre productivité !
          </h1>
          <Link href="/" className="circle mt-5 mt-lg-0">
            <i className="fa-solid fa-arrow-right"></i>
            <span>En savoir plus</span>
          </Link>
        </SlideDown>
        {/* title End */}
        <div className="projects__wapper">
          {projectsOneData.map(
            ({ categories, subCategories, id, imgSrc, title }) => {
              return (
                <SlideUp delay={id} key={id} className="projects__wapper_card">
                  <Link href="/project-details">
                    <img src={imgSrc} alt="img" />
                  </Link>
                  <div>
                    <div className="d-flex align-items-center gap-3">
                      <Link
                        href="/project-details"
                        className="prj__title t__28"
                      >
                        {title}
                      </Link>
                      <Link
                        href="/"
                        className="projects__wapper_card_circle mt-3"
                      >
                        <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>

                    <p className="project__group">{categories}</p>
                    <p className="project__group">{subCategories}</p>
                  </div>
                </SlideUp>
              );
            }
          )}
        </div>
        {/* {isProjectUseCaseShow && <ProjectsUseCase />} */}
      </div>
    </section>
  );
};

export default ProjectsOne;
