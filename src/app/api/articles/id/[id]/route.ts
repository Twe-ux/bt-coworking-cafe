import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Article from '@/models/article';
import { requireAuth, getAuthUser, handleApiError, generateSlug, calculateReadingTime } from '@/lib/api-helpers';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * GET /api/articles/id/[id]
 * Get article by ID (for editing in admin)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const authError = await requireAuth(['admin', 'staff', 'dev']);
    if (authError) return authError;

    await connectDB();

    const { id } = params;

    const article = await Article.findOne({ _id: id, isDeleted: false })
      .populate('author', 'username name email')
      .populate('category', 'name slug')
      .populate('tags', 'name slug')
      .lean();

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/articles/id/[id]
 * Update article (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const authError = await requireAuth(['admin', 'staff', 'dev']);
    if (authError) return authError;

    await connectDB();

    const { id } = params;
    const body = await request.json();

    const {
      title,
      content,
      excerpt,
      featuredImage,
      categoryId,
      tagIds,
      status,
      scheduledFor,
      metaTitle,
      metaDescription,
      metaKeywords,
    } = body;

    // Find article
    const article = await Article.findOne({ _id: id, isDeleted: false });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Update fields
    if (title !== undefined) {
      article.title = title;

      // Regenerate slug if title changed
      if (title !== article.title) {
        let newSlug = generateSlug(title);
        let slugExists = await Article.findOne({
          slug: newSlug,
          isDeleted: false,
          _id: { $ne: id }
        });

        let counter = 1;
        while (slugExists) {
          newSlug = `${generateSlug(title)}-${counter}`;
          slugExists = await Article.findOne({
            slug: newSlug,
            isDeleted: false,
            _id: { $ne: id }
          });
          counter++;
        }

        article.slug = newSlug;
      }
    }

    if (content !== undefined) {
      article.content = content;
      // readingTime is a virtual property, calculated automatically from content
    }

    if (excerpt !== undefined) article.excerpt = excerpt;
    if (featuredImage !== undefined) article.featuredImage = featuredImage;
    if (categoryId !== undefined) article.category = categoryId || undefined;
    if (tagIds !== undefined) article.tags = tagIds;

    // Handle SEO fields as separate properties
    if (metaTitle !== undefined) article.metaTitle = metaTitle;
    if (metaDescription !== undefined) article.metaDescription = metaDescription;
    if (metaKeywords !== undefined) article.metaKeywords = metaKeywords;

    // Handle status change
    if (status !== undefined && status !== article.status) {
      article.status = status;

      if (status === 'published' && !article.publishedAt) {
        article.publishedAt = new Date();
      }
    }

    if (scheduledFor !== undefined) {
      article.scheduledFor = scheduledFor ? new Date(scheduledFor) : undefined;
    }

    await article.save();

    // Populate references
    await article.populate([
      { path: 'author', select: 'username name email' },
      { path: 'category', select: 'name slug' },
      { path: 'tags', select: 'name slug' },
    ]);

    return NextResponse.json(article);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/articles/id/[id]
 * Soft delete article (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const authError = await requireAuth(['admin', 'staff', 'dev']);
    if (authError) return authError;

    await connectDB();

    const { id } = params;

    // Soft delete
    const article = await Article.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Article deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
