import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Reservation from '@/models/reservation';
import Payment from '@/models/payment';
import { requireAuth, handleApiError } from '@/lib/api-helpers';
import mongoose from 'mongoose';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * POST /api/payments/create-intent
 * Create a Stripe Payment Intent for a booking
 *
 * NOTE: Full Stripe integration will be implemented in Phase 3
 * This is a placeholder structure for now
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const user = await requireAuth();
    const body = await request.json();

    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    // Get booking
    const booking = await Reservation.findById(bookingId);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if user owns the booking
    if (booking.user.toString() !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Check if booking is already paid
    if (booking.paymentStatus === 'paid') {
      return NextResponse.json(
        { success: false, error: 'Booking is already paid' },
        { status: 400 }
      );
    }

    // TODO: Implement Stripe Payment Intent creation in Phase 3
    // For now, create a payment record with pending status

    const payment = await Payment.create({
      booking: bookingId,
      user: user.id,
      amount: Math.round(booking.totalPrice * 100), // Convert to cents
      currency: 'EUR',
      status: 'pending',
      paymentMethod: 'card',
      description: `Booking payment for ${booking.date}`,
    });

    return NextResponse.json({
      success: true,
      data: {
        paymentId: payment._id,
        amount: payment.amount,
        currency: payment.currency,
        // TODO: Add Stripe clientSecret in Phase 3
        message: 'Payment record created. Stripe integration pending (Phase 3)',
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
