import { blogOneData } from '@/db/blogOneData'
import Link from 'next/link';
import React from 'react'

const categories = [
    { name: "General Construction", count: 9 },
    { name: "Unique UI Design", count: 12 },
    { name: "General Graphic", count: 6 },
    { name: "Business Policy", count: 9 }
]
const tags = ["Design", "Marketing", "Creative", "IT", "Business", "Optimization"];

const BlogSidebar = () => {
    return (
        <aside className="sidebar">
            <div className="search__box">
                <label htmlFor="search" className="t__22">Search</label>
                <div className="position-relative">
                    <input id="search" type="text" placeholder="Search Now" />
                    <i className="fa-solid fa-magnifying-glass" />
                </div>
            </div>
            {/* -- Categories */}
            <div className="categories pt__60">
                <h5 className="t__22">Categories</h5>
                <ul>
                    {categories.map((category, index) => (
                        <li key={index}>
                            <Link href="/blog-details">{category.name}</Link>
                            <p>({category.count})</p>
                        </li>
                    ))}
                </ul>
            </div>
            {/* -- Categories */}
            {/* -- latest post */}
            <div className="latest__post pt__60">
                <h5 className="t__22">Latest Posts</h5>
                <ul>
                    {
                        blogOneData.slice(0, 3).map(({ id, title, imgSrc }) => {
                            return (
                                <li key={id}>
                                    <a href="/blog-details">
                                        <img src={imgSrc} alt="img" className="thumb__img" />
                                    </a>
                                    <div>
                                        <Link href="/blog-details">
                                            {title}
                                        </Link>
                                        <p>
                                            <img src="/icons/clender.svg" alt="img" />
                                            <span>18, January 2025</span>
                                        </p>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            {/* -- latest post */}
            {/* -- Tags */}
            <div className="tags pt__60">
                <h5 className="t__22">Tags:</h5>
                <ul>
                    {tags.map((tag, index) => (
                        <li key={index}>
                            <Link href="#" className={tag === "Design" ? "active" : ""}>{tag}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>

    )
}

export default BlogSidebar