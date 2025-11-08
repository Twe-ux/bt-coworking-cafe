import { blogOneData } from '@/db/blogOneData'
import React from 'react'
import BlogCard from './blogCard'
import SlideDown from '@/utils/animations/slideDown'
import SlideUp from '@/utils/animations/slideUp'

const HomeBlog = ({ className }) => {
    return (
        <section className={`blogs ${className}`}>
            <div className="container">
                {/* title Start */}
                <SlideDown className="blogs__title">
                    <h1 className="title text-center">
                        See our latest daily blog and news from us
                    </h1>
                </SlideDown>
                {/* title End */}
                <div className="blogs__wapper">
                    <div className="row">
                        {blogOneData.slice(0, 3).map(({ author, comments, id, imgSrc, title }) =>
                            <SlideUp
                                key={id}
                                className="col-lg-4 col-md-6 mb-lg-0 mb-5"
                                delay={id}
                            >
                                <BlogCard author={author} comments={comments} id={id} imgSrc={imgSrc} title={title} />
                            </SlideUp>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HomeBlog