import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Article from '@/models/article';
import { getAuthUser, handleApiError } from '@/lib/api-helpers';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * POST /api/articles/id/[id]/like
 * Toggle like on article
 * TODO: Track which users liked (requires User-Article relationship)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    // For now, just increment like count
    // In the future, track user likes to prevent duplicate likes
    const article = await Article.findOneAndUpdate(
      { _id: id, status: 'published', isDeleted: false },
      { $inc: { likeCount: 1 } },
      { new: true }
    )
      .select('likeCount')
      .lean();

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ likeCount: article.likeCount });
  } catch (error) {
    return handleApiError(error);
  }
}
