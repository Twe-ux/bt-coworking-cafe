import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-helpers';
import cloudinary from '@/lib/cloudinary';

// POST /api/upload - Upload image to Cloudinary (admin only)
export async function POST(request: NextRequest) {
  try {
    const authError = await requireAuth(['admin', 'staff', 'dev']);
    if (authError) return authError;

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'blog';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP and GIF are allowed' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    const uploadResult = result as any;

    return NextResponse.json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/upload - Delete image from Cloudinary (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const authError = await requireAuth(['admin', 'staff', 'dev']);
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID is required' },
        { status: 400 }
      );
    }

    await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({
      message: 'Image deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image', details: error.message },
      { status: 500 }
    );
  }
}
