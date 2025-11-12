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

// Comment Types
export interface Comment {
  _id: string;
  content: string;
  article: string;
  user: {
    _id: string;
    username: string;
    name?: string;
    email?: string;
  };
  parent?: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

export interface CreateCommentDto {
  content: string;
  articleId: string;
  parentId?: string;
}

export interface UpdateCommentDto {
  content?: string;
}

export interface CommentsResponse {
  comments: Comment[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface CommentFilters {
  article: string;
  status?: string;
  page?: number;
  limit?: number;
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
  tagTypes: ['Article', 'Articles', 'Categories', 'Tags', 'Comment', 'Comments'],
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

    // ========== COMMENTS ==========

    // Get comments for an article
    getComments: builder.query<CommentsResponse, CommentFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) params.append(key, String(value));
        });
        return `/comments?${params.toString()}`;
      },
      providesTags: (result, error, { article }) =>
        result
          ? [
              ...result.comments.map(({ _id }) => ({
                type: 'Comment' as const,
                id: _id,
              })),
              { type: 'Comments' as const, id: article },
            ]
          : [{ type: 'Comments' as const, id: article }],
    }),

    // Get single comment
    getComment: builder.query<Comment, string>({
      query: (id) => `/comments/${id}`,
      providesTags: (result, error, id) => [{ type: 'Comment', id }],
    }),

    // Create comment
    createComment: builder.mutation<Comment, CreateCommentDto>({
      query: (data) => ({
        url: '/comments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { articleId }) => [
        { type: 'Comments', id: articleId },
      ],
    }),

    // Update comment
    updateComment: builder.mutation<Comment, { id: string; data: UpdateCommentDto }>({
      query: ({ id, data }) => ({
        url: `/comments/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Comment', id },
      ],
    }),

    // Delete comment
    deleteComment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/comments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Comment', id },
      ],
    }),

    // Approve/Reject comment (admin)
    approveComment: builder.mutation<Comment, { id: string; status: 'approved' | 'rejected' | 'spam' }>({
      query: ({ id, status }) => ({
        url: `/comments/${id}/approve`,
        method: 'POST',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Comment', id },
      ],
    }),

    // Like comment
    likeComment: builder.mutation<{ likeCount: number }, string>({
      query: (id) => ({
        url: `/comments/${id}/like`,
        method: 'POST',
      }),
      // Optimistic update
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          blogApi.util.updateQueryData('getComment', id, (draft) => {
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
  // Comment hooks
  useGetCommentsQuery,
  useGetCommentQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useApproveCommentMutation,
  useLikeCommentMutation,
} = blogApi;
