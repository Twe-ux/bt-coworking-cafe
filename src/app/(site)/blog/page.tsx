import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog - Cow-or-King Café',
  description: 'Découvrez nos derniers articles et actualités',
};

async function getArticles(page: number = 1) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/articles?page=${page}&limit=12&sortBy=createdAt&sortOrder=desc`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return { articles: [], total: 0, pages: 0, page: 1 };
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching articles:', error);
    return { articles: [], total: 0, pages: 0, page: 1 };
  }
}

interface BlogPageProps {
  searchParams: {
    page?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const currentPage = parseInt(searchParams.page || '1');
  const { articles, pages, total } = await getArticles(currentPage);

  return (
    <div className="container py-5">
      {/* Page Header */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">Notre Blog</h1>
        <p className="lead text-muted">
          Découvrez nos derniers articles, actualités et conseils
        </p>
      </div>

      {/* Articles Grid */}
      {articles && articles.length > 0 ? (
        <>
          <div className="row g-4 mb-5">
            {articles.map((article: any) => (
              <div key={article._id} className="col-lg-4 col-md-6">
                <ArticleCard article={article} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <nav aria-label="Blog pagination">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <Link
                    href={`/blog?page=${currentPage - 1}`}
                    className="page-link"
                    aria-label="Précédent"
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </Link>
                </li>

                {Array.from({ length: pages }, (_, i) => i + 1).map((page) => (
                  <li
                    key={page}
                    className={`page-item ${currentPage === page ? 'active' : ''}`}
                  >
                    <Link href={`/blog?page=${page}`} className="page-link">
                      {page}
                    </Link>
                  </li>
                ))}

                <li className={`page-item ${currentPage === pages ? 'disabled' : ''}`}>
                  <Link
                    href={`/blog?page=${currentPage + 1}`}
                    className="page-link"
                    aria-label="Suivant"
                  >
                    <span aria-hidden="true">&raquo;</span>
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-journal-text display-1 text-muted mb-3"></i>
          <h3 className="text-muted">Aucun article disponible</h3>
          <p className="text-muted">Revenez bientôt pour découvrir nos nouveaux contenus !</p>
        </div>
      )}
    </div>
  );
}

function ArticleCard({ article }: { article: any }) {
  const publishedDate = new Date(article.publishedAt || article.createdAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="card h-100 shadow-sm hover-shadow transition">
      {article.featuredImage && (
        <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
          <img
            src={article.featuredImage}
            alt={article.title}
            className="card-img-top w-100 h-100"
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}
      <div className="card-body d-flex flex-column">
        {/* Category and Tags */}
        {(article.category || (article.tags && article.tags.length > 0)) && (
          <div className="mb-2">
            {article.category && (
              <span className="badge bg-primary me-1">{article.category.name}</span>
            )}
            {article.tags?.slice(0, 2).map((tag: any) => (
              <span key={tag._id} className="badge bg-secondary me-1">
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h5 className="card-title mb-2">
          <Link href={`/blog/${article.slug}`} className="text-decoration-none text-dark">
            {article.title}
          </Link>
        </h5>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="card-text text-muted mb-3 flex-grow-1">
            {article.excerpt.substring(0, 120)}...
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto">
          <div className="d-flex align-items-center justify-content-between text-muted small">
            <div className="d-flex align-items-center gap-2">
              <div className="avatar rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px', fontSize: '0.8rem' }}>
                <span className="fw-semibold">
                  {(article.author?.name || article.author?.username)?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span>{article.author?.name || article.author?.username}</span>
            </div>
            <time dateTime={article.publishedAt || article.createdAt}>
              {publishedDate}
            </time>
          </div>
          <div className="d-flex align-items-center gap-3 mt-2 text-muted small">
            <span>
              <i className="bi bi-clock me-1"></i>
              {article.readingTime} min
            </span>
            <span>
              <i className="bi bi-eye me-1"></i>
              {article.viewCount || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
