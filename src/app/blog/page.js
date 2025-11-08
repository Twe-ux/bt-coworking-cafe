import BlogCard from '@/components/blogs/blogCard'
import BlogSidebar from '@/components/blogs/blogSidebar'
import PageTitle from '@/components/pageTitle'
import { blogOneData } from '@/db/blogOneData'
import SlideDown from '@/utils/animations/slideDown'
import React from 'react'

const Blog = () => {
    return (
        <>
            <PageTitle title={"Blog"} currentPage={"Blog"} />
            <section className="all__blog py__130">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="row">
                                {blogOneData.map(({ author, comments, id, imgSrc, title }) =>
                                    <SlideDown
                                        key={id}
                                        className="col-md-6"
                                        delay={id}
                                    >
                                        <BlogCard author={author} comments={comments} imgSrc={imgSrc} title={title} />
                                    </SlideDown>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-4 mt-5 mt-lg-0">
                            <BlogSidebar />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Blog