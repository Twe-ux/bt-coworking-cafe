import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Article from '@/models/article';
import { Category } from '@/models/category';
import { Tag } from '@/models/tag';
import { handleApiError } from '@/lib/api-helpers';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Force model registration
const _ensureModelsRegistered = [Category, Tag];

/**
 * GET /api/articles/slug/[slug]
 * Get article by slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    const article = await Article.findOne({
      slug: params.slug,
      isDeleted: false,
      status: 'published',
      publishedAt: { $lte: new Date() },
    })
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

    // Increment view count
    await Article.updateOne(
      { _id: article._id },
      { $inc: { viewCount: 1 } }
    );

    return NextResponse.json(article);
  } catch (error) {
    return handleApiError(error);
  }
}
