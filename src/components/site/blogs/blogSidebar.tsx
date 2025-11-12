'use client';

import { useState } from 'react';
import Link from 'next/link';
import React from 'react';
import { useGetArticlesQuery } from '@/store/api/blogApi';

const categories = [
    { name: "General Construction", count: 9 },
    { name: "Unique UI Design", count: 12 },
    { name: "General Graphic", count: 6 },
    { name: "Business Policy", count: 9 }
];
const tags = ["Design", "Marketing", "Creative", "IT", "Business", "Optimization"];

interface BlogSidebarProps {
    onSearch?: (query: string) => void;
    onCategorySelect?: (category: string) => void;
}

const BlogSidebar = ({ onSearch, onCategorySelect }: BlogSidebarProps) => {
    const [searchValue, setSearchValue] = useState("");

    // Fetch latest posts for sidebar
    const { data: latestPosts } = useGetArticlesQuery({
        page: 1,
        limit: 3,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        status: 'published',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchValue);
        }
    };

    return (
        <aside className="sidebar">
            <div className="search__box">
                <label htmlFor="search" className="t__22">Search</label>
                <form onSubmit={handleSearch} className="position-relative">
                    <input
                        id="search"
                        type="text"
                        placeholder="Search Now"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <button type="submit" style={{ background: 'none', border: 'none', position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                        <i className="fa-solid fa-magnifying-glass" />
                    </button>
                </form>
            </div>
            {/* -- Categories */}
            <div className="categories pt__60">
                <h5 className="t__22">Categories</h5>
                <ul>
                    {categories.map((category, index) => (
                        <li key={index}>
                            <Link
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (onCategorySelect) {
                                        onCategorySelect(category.name);
                                    }
                                }}
                            >
                                {category.name}
                            </Link>
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
                    {latestPosts?.articles && latestPosts.articles.length > 0 ? (
                        latestPosts.articles.map((article) => (
                            <li key={article._id}>
                                <Link href={`/blog/${article.slug}`}>
                                    <img
                                        src={article.featuredImage || "/images/blogs/blog-1.png"}
                                        alt={article.title}
                                        className="thumb__img"
                                    />
                                </Link>
                                <div>
                                    <Link href={`/blog/${article.slug}`}>
                                        {article.title.length > 50
                                            ? `${article.title.substring(0, 50)}...`
                                            : article.title}
                                    </Link>
                                    <p>
                                        <img src="/icons/clender.svg" alt="img" />
                                        <span>
                                            {new Date(article.publishedAt || article.createdAt).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </p>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li>
                            <p className="text-muted">Aucun article récent</p>
                        </li>
                    )}
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
    );
};

export default BlogSidebar;
