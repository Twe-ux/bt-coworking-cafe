import Link from 'next/link'
import React from 'react'

const ProjectCard = ({className, imgSrc, title, categories}) => {
    return (
        <div className={`projects__2_card ${className}`}>
            <Link href="/project-details">
                <img src={imgSrc} alt={title} className="w-100" />
            </Link>
            <div>
                <Link href="/project-details" className="t__28">{title}</Link>
                <p className="d-flex align-items-center gap-2">
                    {categories.map((category, index) => (
                        <React.Fragment key={index}>
                            <span>{category}</span>
                            {index < categories.length - 1 && <span>/</span>}
                        </React.Fragment>
                    ))}
                </p>
            </div>
        </div>
    )
}

export default ProjectCard