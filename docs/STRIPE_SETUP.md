# Stripe Integration Setup Guide

This guide will help you set up Stripe payment processing for the booking system.

## 📋 Prerequisites

- A Stripe account (sign up at [https://stripe.com](https://stripe.com))
- Node.js and npm installed
- Access to your project's environment variables

## 🚀 Installation

### 1. Install Stripe Packages

Run the following command in your project root:

```bash
npm install stripe @stripe/stripe-js
```

This installs:
- `stripe`: Server-side Stripe SDK
- `@stripe/stripe-js`: Client-side Stripe SDK for payment forms

### 2. Get Your Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Toggle to **Test mode** (recommended for development)
3. Copy your **Publishable key** (starts with `pk_test_...`)
4. Copy your **Secret key** (starts with `sk_test_...`)

⚠️ **Important**: Never commit your secret key to version control!

### 3. Configure Environment Variables

Create or update your `.env.local` file with the following variables:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_LIVE_MODE=false
```

**Where to find these:**
- `STRIPE_SECRET_KEY`: Dashboard → Developers → API keys → Secret key
- `STRIPE_PUBLISHABLE_KEY`: Dashboard → Developers → API keys → Publishable key
- `STRIPE_WEBHOOK_SECRET`: Dashboard → Developers → Webhooks (see step 4)
- `STRIPE_LIVE_MODE`: Set to `true` only in production with live keys

### 4. Configure Webhooks

Webhooks allow Stripe to notify your app about payment events (success, failure, refunds).

#### For Local Development:

1. Install the Stripe CLI:
   ```bash
   # macOS (Homebrew)
   brew install stripe/stripe-cli/stripe

   # Other platforms: https://stripe.com/docs/stripe-cli
   ```

2. Login to your Stripe account:
   ```bash
   stripe login
   ```

3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/payments/webhook
   ```

4. Copy the webhook signing secret (starts with `whsec_...`) and add it to `.env.local`

#### For Production/Staging:

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click **Add endpoint**
3. Enter your webhook URL: `https://yourdomain.com/api/payments/webhook`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.processing`
   - `payment_intent.canceled`
   - `charge.refunded`
5. Click **Add endpoint**
6. Copy the **Signing secret** and add it to your environment variables

## 🧪 Testing

### Test Card Numbers

Stripe provides test card numbers for different scenarios:

| Card Number         | Result                        |
|---------------------|-------------------------------|
| 4242 4242 4242 4242 | Success                       |
| 4000 0000 0000 9995 | Declined (insufficient funds) |
| 4000 0000 0000 9987 | Declined (lost card)          |
| 4000 0000 0000 0002 | Declined (generic)            |
| 4000 0025 0000 3155 | 3D Secure authentication      |

**For all test cards:**
- Use any future expiry date (e.g., 12/34)
- Use any 3-digit CVC (e.g., 123)
- Use any 5-digit ZIP code (e.g., 12345)

### Test Payment Flow

1. Create a booking through your app
2. On the payment page, use a test card number
3. Complete the payment
4. Check webhook logs to see events being received
5. Verify booking status is updated to "confirmed" and "paid"

## 📝 API Endpoints

The following endpoints are configured for Stripe:

### Create Payment Intent
`POST /api/payments/create-intent`

Creates a Stripe Payment Intent for a booking.

**Body:**
```json
{
  "bookingId": "booking_id_here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentId": "payment_id",
    "clientSecret": "pi_xxx_secret_xxx",
    "amount": 5000,
    "currency": "EUR"
  }
}
```

### Webhook Handler
`POST /api/payments/webhook`

Handles Stripe webhook events automatically. Do not call this endpoint manually.

**Events handled:**
- `payment_intent.succeeded`: Confirms payment and booking
- `payment_intent.payment_failed`: Marks payment as failed
- `charge.refunded`: Processes refunds

### Refund Payment (Admin Only)
`POST /api/payments/[id]/refund`

Creates a refund for a successful payment.

**Body (optional):**
```json
{
  "amount": 2500,
  "reason": "requested_by_customer"
}
```

**Valid reasons:**
- `requested_by_customer`
- `duplicate`
- `fraudulent`

## 🔒 Security Best Practices

1. **Never expose secret keys**: Keep `STRIPE_SECRET_KEY` server-side only
2. **Verify webhook signatures**: Our webhook endpoint does this automatically
3. **Use HTTPS in production**: Stripe requires HTTPS for webhooks
4. **Validate amounts server-side**: Never trust client-side amount calculations
5. **Implement idempotency**: Prevent duplicate charges
6. **Log all transactions**: Monitor for fraud and disputes

## 🌍 Going Live

When you're ready to accept real payments:

1. Complete your Stripe account activation:
   - Provide business information
   - Add banking details
   - Verify your identity

2. Switch to live keys:
   - Get live keys from [Dashboard](https://dashboard.stripe.com/apikeys)
   - Update environment variables with live keys (starting with `pk_live_...` and `sk_live_...`)
   - Set `STRIPE_LIVE_MODE=true`

3. Update webhook endpoint:
   - Create a new webhook endpoint for production URL
   - Use the live webhook secret

4. Test thoroughly:
   - Use small real amounts first
   - Test refunds
   - Verify webhook delivery

## 💰 Pricing

Stripe charges a fee per transaction:
- **Europe**: 1.4% + €0.25 per successful card charge
- **Outside Europe**: Check [Stripe Pricing](https://stripe.com/pricing)

Additional fees may apply for:
- International cards
- Currency conversion
- Disputed payments

## 🆘 Troubleshooting

### "Stripe is not configured" error

**Solution:** Install packages and set environment variables
```bash
npm install stripe @stripe/stripe-js
# Then add STRIPE_SECRET_KEY to .env.local
```

### Webhook events not received

**Possible causes:**
1. Webhook secret is incorrect
2. Webhook URL is not accessible (check firewall)
3. Stripe CLI not running (for local dev)

**Solution:** Check webhook logs in Stripe Dashboard → Webhooks → Select endpoint → Attempts

### Payment succeeds but booking not confirmed

**Possible causes:**
1. Webhook not configured
2. Webhook signature verification failed
3. Database connection issue

**Solution:**
1. Check webhook endpoint logs
2. Verify webhook secret matches
3. Check database connectivity

### Test mode vs Live mode mismatch

**Error:** "No such payment_intent: pi_test..."

**Solution:** Ensure you're using test keys with test mode data, or live keys with live mode data. Don't mix them.

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Payment Intents Guide](https://stripe.com/docs/payments/payment-intents)
- [Webhook Guide](https://stripe.com/docs/webhooks)
- [Testing Guide](https://stripe.com/docs/testing)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)

## 🔐 PCI Compliance

Stripe handles PCI compliance for you by:
- Never storing card details on your server
- Using Stripe Elements for secure card input
- Tokenizing card information

As long as you use Stripe's recommended integration (which we do), you maintain PCI DSS compliance with minimal effort.

## 📞 Support

- **Stripe Support**: [https://support.stripe.com](https://support.stripe.com)
- **Stripe Community**: [https://stripe.com/community](https://stripe.com/community)
- **Status Page**: [https://status.stripe.com](https://status.stripe.com)

---

**Last Updated:** 2025-11-14
