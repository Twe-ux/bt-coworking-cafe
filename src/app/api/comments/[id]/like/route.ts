import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Comment } from '@/models/comment';

// POST /api/comments/[id]/like - Like a comment (no auth required, increment only)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const comment = await Comment.findOne({
      _id: params.id,
      deletedAt: null,
    });

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Increment like count
    comment.likeCount += 1;
    await comment.save();

    return NextResponse.json({
      likeCount: comment.likeCount,
    });
  } catch (error: any) {
    console.error('Error liking comment:', error);
    return NextResponse.json(
      { error: 'Failed to like comment', details: error.message },
      { status: 500 }
    );
  }
}
