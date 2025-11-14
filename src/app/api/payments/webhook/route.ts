import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Payment from '@/models/payment';
import Reservation from '@/models/reservation';
import { verifyWebhookSignature } from '@/lib/stripe';
import Stripe from 'stripe';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Disable body parsing for webhook (we need raw body for signature verification)
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * POST /api/payments/webhook
 * Handle Stripe webhook events
 *
 * Events handled:
 * - payment_intent.succeeded: Payment was successful
 * - payment_intent.payment_failed: Payment failed
 * - charge.refunded: Payment was refunded
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('No Stripe signature found');
      return NextResponse.json(
        { error: 'No stripe signature found' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = verifyWebhookSignature(body, signature);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}` },
        { status: 400 }
      );
    }

    await connectDB();

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('✅ PaymentIntent succeeded:', paymentIntent.id);

        await handlePaymentSuccess(paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('❌ PaymentIntent failed:', paymentIntent.id);

        await handlePaymentFailure(paymentIntent);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        console.log('💰 Charge refunded:', charge.id);

        await handleRefund(charge);
        break;
      }

      case 'payment_intent.processing': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('🔄 PaymentIntent processing:', paymentIntent.id);

        await handlePaymentProcessing(paymentIntent);
        break;
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('🚫 PaymentIntent canceled:', paymentIntent.id);

        await handlePaymentCanceled(paymentIntent);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return 200 to acknowledge receipt of the event
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Find payment by Stripe payment intent ID
    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (!payment) {
      console.error('Payment not found for paymentIntent:', paymentIntent.id);
      return;
    }

    // Update payment status
    payment.status = 'succeeded';
    payment.completedAt = new Date();

    // Extract card details from payment method if available
    if (paymentIntent.charges.data.length > 0) {
      const charge = paymentIntent.charges.data[0];
      payment.stripeChargeId = charge.id;

      if (charge.payment_method_details?.card) {
        payment.metadata = {
          ...payment.metadata,
          cardBrand: charge.payment_method_details.card.brand as typeof payment.metadata.cardBrand,
          cardLast4: charge.payment_method_details.card.last4,
          cardExpiryMonth: charge.payment_method_details.card.exp_month,
          cardExpiryYear: charge.payment_method_details.card.exp_year,
          receiptUrl: charge.receipt_url || undefined,
        };
      }
    }

    await payment.save();

    // Update booking status
    const booking = await Reservation.findById(payment.booking);
    if (booking) {
      booking.paymentStatus = 'paid';
      booking.status = 'confirmed';
      await booking.save();

      console.log(`✅ Booking ${booking._id} confirmed and paid`);
    }
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  try {
    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (!payment) {
      console.error('Payment not found for paymentIntent:', paymentIntent.id);
      return;
    }

    // Update payment status
    payment.status = 'failed';
    payment.failedAt = new Date();
    payment.failureReason = paymentIntent.last_payment_error?.message || 'Payment failed';

    await payment.save();

    // Update booking payment status
    const booking = await Reservation.findById(payment.booking);
    if (booking) {
      booking.paymentStatus = 'failed';
      await booking.save();
    }
  } catch (error) {
    console.error('Error handling payment failure:', error);
    throw error;
  }
}

/**
 * Handle payment processing status
 */
async function handlePaymentProcessing(paymentIntent: Stripe.PaymentIntent) {
  try {
    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (!payment) {
      return;
    }

    payment.status = 'processing';
    await payment.save();
  } catch (error) {
    console.error('Error handling payment processing:', error);
    throw error;
  }
}

/**
 * Handle payment canceled
 */
async function handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
  try {
    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (!payment) {
      return;
    }

    payment.status = 'cancelled';
    await payment.save();
  } catch (error) {
    console.error('Error handling payment canceled:', error);
    throw error;
  }
}

/**
 * Handle refund
 */
async function handleRefund(charge: Stripe.Charge) {
  try {
    const payment = await Payment.findOne({
      stripeChargeId: charge.id,
    });

    if (!payment) {
      console.error('Payment not found for charge:', charge.id);
      return;
    }

    // Get refund details
    const refund = charge.refunds?.data[0];

    if (refund) {
      payment.status = 'refunded';
      payment.stripeRefundId = refund.id;
      payment.metadata = {
        ...payment.metadata,
        refundedAmount: refund.amount,
        refundedAt: new Date(),
        refundReason: refund.reason || 'Refund processed',
      };

      await payment.save();

      // Update booking status
      const booking = await Reservation.findById(payment.booking);
      if (booking) {
        booking.paymentStatus = 'refunded';
        await booking.save();

        console.log(`💰 Booking ${booking._id} refunded`);
      }
    }
  } catch (error) {
    console.error('Error handling refund:', error);
    throw error;
  }
}
