import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import AdditionalService from '@/models/additionalService';
import { requireAuth } from '@/lib/api-helpers';
import mongoose from 'mongoose';

// GET /api/additional-services/[id] - Récupérer un service
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    // Vérifier si c'est un ObjectId valide ou un slug
    let service;
    if (mongoose.Types.ObjectId.isValid(id)) {
      service = await AdditionalService.findById(id);
    } else {
      service = await AdditionalService.findOne({ slug: id, isDeleted: false });
    }

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Additional service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error('Error fetching additional service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch additional service' },
      { status: 500 }
    );
  }
}

// PATCH /api/additional-services/[id] - Modifier un service (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();

    // Vérifier que l'utilisateur est admin
    if (!user || !['admin', 'dev'].includes(user.role?.slug || '')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    await connectDB();

    const { id } = params;
    const body = await request.json();

    let service;
    if (mongoose.Types.ObjectId.isValid(id)) {
      service = await AdditionalService.findById(id);
    } else {
      service = await AdditionalService.findOne({ slug: id });
    }

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Additional service not found' },
        { status: 404 }
      );
    }

    // Update fields
    const allowedFields = [
      'name',
      'description',
      'category',
      'price',
      'priceUnit',
      'isActive',
      'availableForSpaceTypes',
      'icon',
      'order',
    ];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        (service as Record<string, unknown>)[field] = body[field];
      }
    });

    // Si le nom change, regénérer le slug
    if (body.name && body.name !== service.name) {
      service.slug = ''; // Sera regénéré par le hook
    }

    await service.save();

    return NextResponse.json({
      success: true,
      data: service,
      message: 'Additional service updated successfully',
    });
  } catch (error) {
    console.error('Error updating additional service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update additional service' },
      { status: 500 }
    );
  }
}

// DELETE /api/additional-services/[id] - Supprimer un service (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();

    // Vérifier que l'utilisateur est admin
    if (!user || !['admin', 'dev'].includes(user.role?.slug || '')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    await connectDB();

    const { id } = params;
    const permanent = request.nextUrl.searchParams.get('permanent') === 'true';

    let service;
    if (mongoose.Types.ObjectId.isValid(id)) {
      service = await AdditionalService.findById(id);
    } else {
      service = await AdditionalService.findOne({ slug: id });
    }

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Additional service not found' },
        { status: 404 }
      );
    }

    if (permanent) {
      // Hard delete
      await AdditionalService.findByIdAndDelete(service._id);
      return NextResponse.json({
        success: true,
        message: 'Additional service permanently deleted',
      });
    } else {
      // Soft delete
      await service.softDelete();
      return NextResponse.json({
        success: true,
        message: 'Additional service deleted',
      });
    }
  } catch (error) {
    console.error('Error deleting additional service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete additional service' },
      { status: 500 }
    );
  }
}
