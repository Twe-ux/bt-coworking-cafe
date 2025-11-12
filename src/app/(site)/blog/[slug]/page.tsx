import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

async function getArticle(slug: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/articles/slug/${slug}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const article = await getArticle(params.slug);

  if (!article) {
    return {
      title: 'Article non trouvé',
    };
  }

  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
    keywords: article.metaKeywords?.join(', '),
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt,
      images: article.featuredImage ? [article.featuredImage] : [],
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author?.name || article.author?.username],
      tags: article.tags?.map((tag: any) => tag.name),
    },
    twitter: {
      card: 'summary_large_image',
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt,
      images: article.featuredImage ? [article.featuredImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  const publishedDate = new Date(article.publishedAt || article.createdAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Article Header */}
          <article>
            <header className="mb-5">
              {/* Category and Tags */}
              {(article.category || (article.tags && article.tags.length > 0)) && (
                <div className="mb-3">
                  {article.category && (
                    <span className="badge bg-primary me-2">{article.category.name}</span>
                  )}
                  {article.tags?.map((tag: any) => (
                    <span key={tag._id} className="badge bg-secondary me-2">
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="display-4 fw-bold mb-3">{article.title}</h1>

              {/* Excerpt */}
              {article.excerpt && (
                <p className="lead text-muted mb-4">{article.excerpt}</p>
              )}

              {/* Meta Info */}
              <div className="d-flex align-items-center gap-4 mb-4 text-muted">
                <div className="d-flex align-items-center gap-2">
                  <div className="avatar rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    <span className="fw-semibold">
                      {(article.author?.name || article.author?.username)?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="fw-medium text-dark">
                    {article.author?.name || article.author?.username}
                  </span>
                </div>
                <span>•</span>
                <time dateTime={article.publishedAt || article.createdAt}>
                  {publishedDate}
                </time>
                <span>•</span>
                <span>{article.readingTime} min de lecture</span>
              </div>

              {/* Featured Image */}
              {article.featuredImage && (
                <div className="mb-5">
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="img-fluid rounded w-100"
                    style={{ maxHeight: '500px', objectFit: 'cover' }}
                  />
                </div>
              )}
            </header>

            {/* Article Content */}
            <div className="article-content mb-5">
              <MarkdownRenderer content={article.content} />
            </div>

            {/* Article Footer */}
            <footer className="border-top pt-4">
              <div className="row">
                <div className="col-md-6">
                  <div className="d-flex gap-3 mb-3">
                    <button className="btn btn-outline-primary">
                      <i className="bi bi-heart me-2"></i>
                      {article.likeCount || 0} J'aime
                    </button>
                    <button className="btn btn-outline-secondary">
                      <i className="bi bi-share me-2"></i>
                      Partager
                    </button>
                  </div>
                </div>
                <div className="col-md-6 text-md-end">
                  <small className="text-muted">
                    <i className="bi bi-eye me-2"></i>
                    {article.viewCount || 0} vues
                  </small>
                </div>
              </div>
            </footer>
          </article>
        </div>
      </div>
    </div>
  );
}
