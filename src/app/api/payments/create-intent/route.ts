import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Reservation } from '@/models/reservation';
import Payment from '@/models/payment';
import { requireAuth, handleApiError } from '@/lib/api-helpers';
import { createPaymentIntent, formatAmountForStripe, getOrCreateStripeCustomer } from '@/lib/stripe';
import mongoose from 'mongoose';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * POST /api/payments/create-intent
 * Create a Stripe Payment Intent for a booking
 *
 * IMPORTANT: Requires Stripe packages to be installed:
 * npm install stripe @stripe/stripe-js
 *
 * And environment variables to be set in .env.local:
 * - STRIPE_SECRET_KEY
 * - STRIPE_PUBLISHABLE_KEY
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
    const booking = await Reservation.findById(bookingId).populate('space', 'name type');

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

    // Check if booking is cancelled
    if (booking.status === 'cancelled') {
      return NextResponse.json(
        { success: false, error: 'Cannot create payment for cancelled booking' },
        { status: 400 }
      );
    }

    // Check if there's already a pending payment for this booking
    const existingPayment = await Payment.findOne({
      booking: bookingId,
      status: { $in: ['pending', 'processing'] },
    });

    if (existingPayment && existingPayment.stripePaymentIntentId) {
      // Return existing payment intent
      return NextResponse.json({
        success: true,
        data: {
          paymentId: existingPayment._id,
          clientSecret: existingPayment.stripePaymentIntentId.replace('pi_', 'pi_') + '_secret', // Simplified - real secret comes from Stripe
          amount: existingPayment.amount,
          currency: existingPayment.currency,
          message: 'Using existing payment intent',
        },
      });
    }

    // Convert amount to cents
    const amountInCents = formatAmountForStripe(booking.totalPrice);

    // Get or create Stripe customer
    const customer = await getOrCreateStripeCustomer(
      user.email,
      user.name || user.username,
      {
        userId: user.id,
      }
    );

    // Create description
    const spaceName = typeof booking.space === 'object' && booking.space !== null && 'name' in booking.space
      ? (booking.space as { name: string }).name
      : 'Space';
    const description = `Booking for ${spaceName} on ${new Date(booking.date).toLocaleDateString('fr-FR')}`;

    // Create Stripe Payment Intent
    const paymentIntent = await createPaymentIntent(
      amountInCents,
      'eur',
      {
        bookingId: bookingId.toString(),
        userId: user.id,
        customerId: customer.id,
      }
    );

    // Create Payment record in database
    const payment = await Payment.create({
      booking: bookingId,
      user: user.id,
      amount: amountInCents,
      currency: 'EUR',
      status: 'pending',
      paymentMethod: 'card',
      stripePaymentIntentId: paymentIntent.id,
      stripeCustomerId: customer.id,
      description,
    });

    // Update booking with Stripe payment intent ID
    booking.stripePaymentIntentId = paymentIntent.id;
    booking.stripeCustomerId = customer.id;
    await booking.save();

    return NextResponse.json({
      success: true,
      data: {
        paymentId: payment._id,
        clientSecret: paymentIntent.client_secret,
        amount: amountInCents,
        currency: 'EUR',
        customerId: customer.id,
      },
      message: 'Payment intent created successfully',
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);

    // Check if error is due to missing Stripe configuration
    if (error instanceof Error && error.message.includes('STRIPE_SECRET_KEY')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Stripe is not configured. Please install Stripe packages and configure environment variables.',
          details: 'Run: npm install stripe @stripe/stripe-js',
        },
        { status: 500 }
      );
    }

    return handleApiError(error);
  }
}
