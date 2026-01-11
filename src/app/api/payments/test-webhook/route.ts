import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Reservation } from '@/models/reservation';
import { sendBookingConfirmation, sendCardSavedConfirmation } from '@/lib/email/emailService';
import { urlToDbSpaceType } from '@/lib/space-types';
import SpaceConfiguration from '@/models/spaceConfiguration';

/**
 * POST /api/payments/test-webhook
 * TEMPORARY: Manually trigger webhook behavior for testing
 *
 * This endpoint manually creates a reservation from a payment intent ID
 * Used for testing until Stripe CLI is set up
 *
 * Body: { paymentIntentId: string }
 */
export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Test routes are disabled in production' },
      { status: 403 }
    );
  }

  try {
    await connectDB();

    const body = await request.json();
    const { paymentIntentId } = body;

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'paymentIntentId is required' },
        { status: 400 }
      );
    }

    // Get the payment intent from Stripe
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    console.log('🔍 Payment Intent retrieved:', {
      id: paymentIntent.id,
      status: paymentIntent.status,
      metadata: paymentIntent.metadata,
    });

    // Check if this payment should create a booking
    if (paymentIntent.metadata?.createBookingOnAuthorization !== 'true') {
      return NextResponse.json(
        { error: 'Payment intent does not have createBookingOnAuthorization flag' },
        { status: 400 }
      );
    }

    // Check if booking already exists
    const existingBooking = await Reservation.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (existingBooking) {
      return NextResponse.json(
        {
          success: true,
          message: 'Booking already exists',
          bookingId: existingBooking._id,
        },
        { status: 200 }
      );
    }

    // Parse reservation data from metadata
    const metadata = paymentIntent.metadata;

    // Generate confirmation number
    const confirmationNumber = `BT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Parse additional services if present
    let additionalServices = [];
    if (metadata.additionalServices) {
      try {
        additionalServices = JSON.parse(metadata.additionalServices);
      } catch (e) {
        console.error('Error parsing additionalServices:', e);
      }
    }

    // Parse invoiceDetails if present
    let invoiceDetails = undefined;
    if (metadata.invoiceDetails) {
      try {
        invoiceDetails = JSON.parse(metadata.invoiceDetails);
      } catch (e) {
        console.error('Error parsing invoiceDetails:', e);
      }
    }

    // Map URL space type to database value
    const dbSpaceType = urlToDbSpaceType(metadata.spaceType);

    // Create reservation
    const reservation = await Reservation.create({
      spaceType: dbSpaceType,
      date: new Date(metadata.date),
      startTime: metadata.startTime,
      endTime: metadata.endTime,
      numberOfPeople: parseInt(metadata.numberOfPeople),
      totalPrice: parseFloat(metadata.totalPrice),
      user: metadata.userId || null,
      contactEmail: metadata.contactEmail,
      contactName: metadata.contactName,
      contactPhone: metadata.contactPhone,
      companyName: metadata.companyName || '',
      status: 'pending', // Will be confirmed by admin
      paymentStatus: 'pending',
      invoiceOption: metadata.invoiceOption !== 'no_invoice', // Convert to boolean
      invoiceDetails: invoiceDetails,
      additionalServices,
      stripePaymentIntentId: paymentIntent.id,
      stripeCustomerId: paymentIntent.customer as string,
      captureMethod: 'manual',
      requiresPayment: true,
      confirmationNumber,
      isPartialPrivatization: metadata.isPartialPrivatization === 'true',
      message: metadata.message || '',
    });

    console.log(`✅ Reservation created from manual webhook trigger:`, reservation._id);

    // Send confirmation email to customer
    try {
      const spaceConfig = await SpaceConfiguration.findOne({ spaceType: dbSpaceType });

      await sendBookingConfirmation(metadata.contactEmail, {
        name: metadata.contactName,
        spaceName: spaceConfig?.name || metadata.spaceType,
        date: new Date(metadata.date).toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        time: metadata.startTime && metadata.endTime
          ? `${metadata.startTime} - ${metadata.endTime}`
          : 'Journée complète',
        price: parseFloat(metadata.totalPrice),
        bookingId: reservation._id.toString(),
        requiresPayment: true,
        depositAmount: parseInt(metadata.depositAmount || metadata.totalPrice) || parseFloat(metadata.totalPrice) * 100, // Use stored deposit amount in cents
        captureMethod: metadata.captureMethod as 'manual' | 'automatic',
        numberOfPeople: parseInt(metadata.numberOfPeople),
      });

      console.log('📧 Confirmation email sent to customer');
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the booking creation if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Reservation created successfully',
      data: {
        bookingId: reservation._id,
        confirmationNumber: reservation.confirmationNumber,
      },
    });
  } catch (error) {
    console.error('Error in test webhook:', error);
    return NextResponse.json(
      {
        error: 'Failed to create reservation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
