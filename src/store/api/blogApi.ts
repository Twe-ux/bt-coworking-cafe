import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Types
export interface Article {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  author: {
    _id: string;
    username: string;
    name?: string;
  };
  category?: {
    _id: string;
    name: string;
    slug: string;
  };
  tags?: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  publishedAt?: string;
  scheduledFor?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  viewCount: number;
  likeCount: number;
  readingTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleDto {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  categoryId?: string;
  tagIds?: string[];
  status?: 'draft' | 'published';
  scheduledFor?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export interface UpdateArticleDto extends Partial<CreateArticleDto> {}

export interface ArticlesResponse {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ArticleFilters {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  tag?: string;
  search?: string;
  sortBy?: 'createdAt' | 'publishedAt' | 'title' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
}

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      // Add auth token if needed
      // const token = getToken();
      // if (token) {
      //   headers.set('authorization', `Bearer ${token}`);
      // }
      return headers;
    },
  }),
  tagTypes: ['Article', 'Articles', 'Categories', 'Tags'],
  endpoints: (builder) => ({
    // Get all articles (with filters)
    getArticles: builder.query<ArticlesResponse, ArticleFilters | void>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, String(value));
          }
        });
        return `/articles?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.articles.map(({ _id }) => ({ type: 'Article' as const, id: _id })),
              { type: 'Articles' as const, id: 'LIST' },
            ]
          : [{ type: 'Articles' as const, id: 'LIST' }],
    }),

    // Get single article by slug
    getArticleBySlug: builder.query<Article, string>({
      query: (slug) => `/articles/${slug}`,
      providesTags: (result) =>
        result ? [{ type: 'Article', id: result._id }] : [],
    }),

    // Get article by ID (for editing)
    getArticleById: builder.query<Article, string>({
      query: (id) => `/articles/id/${id}`,
      providesTags: (result) =>
        result ? [{ type: 'Article', id: result._id }] : [],
    }),

    // Create article
    createArticle: builder.mutation<Article, CreateArticleDto>({
      query: (article) => ({
        url: '/articles',
        method: 'POST',
        body: article,
      }),
      invalidatesTags: [{ type: 'Articles', id: 'LIST' }],
    }),

    // Update article
    updateArticle: builder.mutation<Article, { id: string; data: UpdateArticleDto }>({
      query: ({ id, data }) => ({
        url: `/articles/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Article', id },
        { type: 'Articles', id: 'LIST' },
      ],
    }),

    // Delete article
    deleteArticle: builder.mutation<void, string>({
      query: (id) => ({
        url: `/articles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Articles', id: 'LIST' }],
    }),

    // Publish/Unpublish article
    togglePublish: builder.mutation<Article, string>({
      query: (id) => ({
        url: `/articles/${id}/publish`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Article', id },
        { type: 'Articles', id: 'LIST' },
      ],
    }),

    // Increment view count
    incrementViewCount: builder.mutation<void, string>({
      query: (slug) => ({
        url: `/articles/${slug}/view`,
        method: 'POST',
      }),
      // Don't invalidate to avoid refetching
      invalidatesTags: [],
    }),

    // Like/Unlike article
    toggleLike: builder.mutation<Article, string>({
      query: (id) => ({
        url: `/articles/${id}/like`,
        method: 'POST',
      }),
      // Optimistic update
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          blogApi.util.updateQueryData('getArticleById', id, (draft) => {
            draft.likeCount += 1;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleBySlugQuery,
  useGetArticleByIdQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useTogglePublishMutation,
  useIncrementViewCountMutation,
  useToggleLikeMutation,
} = blogApi;
