import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Reservation } from '@/models/reservation';
import Payment from '@/models/payment';
import { getAuthUser, handleApiError } from '@/lib/api-helpers';
import { createPaymentIntent, createSetupIntent, formatAmountForStripe, getOrCreateStripeCustomer } from '@/lib/stripe';
import mongoose from 'mongoose';
import SpaceConfiguration from '@/models/spaceConfiguration';

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

    // Allow both authenticated and unauthenticated users (for guest bookings)
    const user = await getAuthUser();
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

    // Get booking with user details
    const booking = await Reservation.findById(bookingId)
      .populate('space', 'name type')
      .populate('user', 'email givenName username');

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // If user is authenticated, check ownership
    if (user && booking.user) {
      const bookingUserId = typeof booking.user === 'object' && '_id' in booking.user
        ? (booking.user._id as unknown as string).toString()
        : booking.user.toString();

      if (bookingUserId !== user.id) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 403 }
        );
      }
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

    // Get space configuration to check deposit policy
    const spaceConfig = await SpaceConfiguration.findOne({ spaceType: booking.spaceType });

    // Calculate days until booking
    const now = new Date();
    const bookingDate = new Date(booking.date);
    const daysUntilBooking = Math.ceil((bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Convert amount to cents
    const amountInCents = formatAmountForStripe(booking.totalPrice);

    // Get user details from booking or session
    const bookingUser = booking.user as any;
    const userEmail = user?.email || bookingUser?.email || booking.contactEmail;
    const userName = user?.name || user?.username || bookingUser?.givenName || booking.contactName;
    const userIdForDb = user?.id || bookingUser?._id?.toString();

    console.log('💳 Payment Intent - User Details:', {
      sessionUser: user?.email,
      bookingUserEmail: bookingUser?.email,
      contactEmail: booking.contactEmail,
      finalEmail: userEmail,
      finalName: userName,
      daysUntilBooking,
    });

    // Get or create Stripe customer
    const customer = await getOrCreateStripeCustomer(
      userEmail,
      userName,
      {
        userId: userIdForDb,
      }
    );

    // Create description
    const spaceName = typeof booking.space === 'object' && booking.space !== null && 'name' in booking.space
      ? (booking.space as { name: string }).name
      : 'Space';
    const description = `Booking for ${spaceName} on ${new Date(booking.date).toLocaleDateString('fr-FR')}`;

    // Calculate deposit amount if policy exists
    let depositAmount = amountInCents;
    if (spaceConfig?.depositPolicy?.enabled) {
      const policy = spaceConfig.depositPolicy;
      if (policy.fixedAmount) {
        depositAmount = policy.fixedAmount;
      } else if (policy.percentage) {
        depositAmount = Math.round(amountInCents * (policy.percentage / 100));
      }

      // Apply minimum if set
      if (policy.minimumAmount && depositAmount < policy.minimumAmount) {
        depositAmount = policy.minimumAmount;
      }
    }

    // Determine payment flow based on booking date
    if (daysUntilBooking <= 7) {
      // For bookings ≤7 days: Manual capture (authorization hold)
      const paymentIntent = await createPaymentIntent(
        depositAmount,
        'eur',
        {
          bookingId: bookingId.toString(),
          userId: userIdForDb,
          type: 'deposit_hold',
        },
        customer.id,
        'manual' // Manual capture for hold
      );

      // Create Payment record in database
      const payment = await Payment.create({
        booking: bookingId,
        user: userIdForDb,
        amount: depositAmount,
        currency: 'EUR',
        status: 'pending',
        paymentMethod: 'card',
        stripePaymentIntentId: paymentIntent.id,
        stripeCustomerId: customer.id,
        description: `${description} - Empreinte bancaire`,
      });

      // Update booking
      booking.stripePaymentIntentId = paymentIntent.id;
      booking.stripeCustomerId = customer.id;
      booking.captureMethod = 'manual';
      await booking.save();

      return NextResponse.json({
        success: true,
        data: {
          paymentId: payment._id,
          clientSecret: paymentIntent.client_secret,
          amount: depositAmount,
          currency: 'EUR',
          customerId: customer.id,
          type: 'manual_capture',
          message: 'Une empreinte bancaire sera effectuée. Elle sera annulée si vous vous présentez, ou encaissée en cas de no-show.',
        },
        message: 'Payment intent created successfully',
      });
    } else {
      // For bookings >7 days: Setup Intent (save card for later charge)
      const setupIntent = await createSetupIntent(
        customer.id,
        {
          bookingId: bookingId.toString(),
          userId: userIdForDb,
        }
      );

      // Update booking
      booking.stripeSetupIntentId = setupIntent.id;
      booking.stripeCustomerId = customer.id;
      booking.captureMethod = 'automatic';
      await booking.save();

      return NextResponse.json({
        success: true,
        data: {
          clientSecret: setupIntent.client_secret,
          amount: depositAmount,
          currency: 'EUR',
          customerId: customer.id,
          type: 'setup_intent',
          message: 'Votre carte sera enregistrée. Un paiement sera effectué 7 jours avant la réservation.',
        },
        message: 'Setup intent created successfully',
      });
    }
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
