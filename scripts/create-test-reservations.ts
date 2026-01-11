/**
 * Script to create test reservations with real Stripe payment intents and emails
 * Run with: npx tsx scripts/create-test-reservations.ts
 *
 * Requirements:
 * - Stripe must be in TEST mode
 * - Email service (Resend) must be configured
 * - User account must exist in database with email: milone.thierry@gmail.com
 * - Dev server must be running (npm run dev)
 */

import Stripe from 'stripe';
import { connectDB } from '../src/lib/mongodb';
import { User } from '../src/models/user';
import { Reservation } from '../src/models/reservation';
import { sendBookingConfirmation } from '../src/lib/email/emailService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const TEST_EMAIL = 'milone.thierry@gmail.com';

interface TestReservation {
  spaceType: 'open-space' | 'salle-verriere' | 'salle-etage' | 'evenementiel';
  date: Date;
  startTime: string;
  endTime: string;
  numberOfPeople: number;
  basePrice: number;
  description: string;
  status: 'pending' | 'confirmed';
}

// Generate confirmation number
function generateConfirmationNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `BT-${timestamp}-${random}`.toUpperCase();
}

async function createTestReservations() {
  console.log('🚀 Starting test reservations creation...\n');
  console.log('📧 Email: ' + TEST_EMAIL);
  console.log('💳 Using Stripe TEST mode with test cards\n');

  try {
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Find user by email
    const user = await User.findOne({ email: TEST_EMAIL });
    if (!user) {
      console.error(`❌ User not found with email: ${TEST_EMAIL}`);
      console.log('Please create an account with this email first.');
      console.log('Visit http://localhost:3000/auth/signup to create an account.\n');
      process.exit(1);
    }
    console.log(`✅ Found user: ${user.givenName} ${user.familyName || ''} (${user.email})\n`);

    console.log('💳 Preparing test payment methods...');

    // Get or create Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      console.log('   👤 Creating Stripe customer...');
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.givenName} ${user.familyName || ''}`.trim(),
        metadata: {
          userId: user._id.toString(),
        },
      });
      customerId = customer.id;

      // Update user with customer ID
      await User.updateOne({ _id: user._id }, { stripeCustomerId: customerId });
      console.log(`   ✅ Customer created: ${customerId}`);
    } else {
      console.log(`   ✅ Using existing customer: ${customerId}`);
    }

    console.log(`   ✅ Customer ready\n`);

    // Define test reservations
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const testReservations: TestReservation[] = [
      {
        spaceType: 'open-space',
        date: new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000), // +8 days
        startTime: '10:00',
        endTime: '18:00',
        numberOfPeople: 1,
        basePrice: 35.90,
        description: 'Annulation >7j (0% frais)',
        status: 'confirmed',
      },
      {
        spaceType: 'salle-verriere',
        date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), // +5 days
        startTime: '14:00',
        endTime: '17:00',
        numberOfPeople: 4,
        basePrice: 60.00,
        description: 'Annulation 3-7j (50% frais)',
        status: 'confirmed',
      },
      {
        spaceType: 'salle-etage',
        date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // +2 days
        startTime: '09:00',
        endTime: '12:00',
        numberOfPeople: 6,
        basePrice: 45.00,
        description: 'Annulation <3j (100% frais)',
        status: 'confirmed',
      },
      {
        spaceType: 'evenementiel',
        date: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000), // +10 days
        startTime: '18:00',
        endTime: '22:00',
        numberOfPeople: 30,
        basePrice: 200.00,
        description: 'Réservation PENDING (0% frais)',
        status: 'pending',
      },
    ];

    console.log('📝 Creating reservations with Stripe payment intents...\n');

    const createdReservations = [];

    // Create each reservation
    for (let i = 0; i < testReservations.length; i++) {
      const reservation = testReservations[i];
      const index = i + 1;

      console.log(`[${index}/${testReservations.length}] ${reservation.spaceType}`);
      console.log(`   📅 ${reservation.date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`);
      console.log(`   ⏰ ${reservation.startTime} - ${reservation.endTime}`);
      console.log(`   👥 ${reservation.numberOfPeople} personne(s)`);
      console.log(`   💰 ${reservation.basePrice.toFixed(2)}€`);
      console.log(`   📋 ${reservation.description}`);
      console.log(`   🏷️  Status: ${reservation.status === 'confirmed' ? 'Confirmée' : 'En attente'}`);

      try {
        // Calculate deposit (70% of total)
        const depositAmount = Math.round(reservation.basePrice * 0.70 * 100); // in cents

        // Create a new payment method for each reservation
        const paymentMethod = await stripe.paymentMethods.create({
          type: 'card',
          card: {
            token: 'tok_visa', // Stripe test token
          },
        });

        // Attach to customer
        await stripe.paymentMethods.attach(paymentMethod.id, {
          customer: customerId,
        });

        // Create Stripe payment intent (hold/authorization)
        const paymentIntent = await stripe.paymentIntents.create({
          amount: depositAmount,
          currency: 'eur',
          customer: customerId,
          payment_method: paymentMethod.id,
          capture_method: 'manual', // Authorization hold
          confirm: true,
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never',
          },
          metadata: {
            userId: user._id.toString(),
            userEmail: user.email,
            spaceType: reservation.spaceType,
            reservationDate: reservation.date.toISOString(),
          },
        });

        console.log(`   💳 Payment Intent: ${paymentIntent.id}`);
        console.log(`   💵 Hold amount: ${(depositAmount / 100).toFixed(2)}€ (70%)`);
        console.log(`   ✅ Status: ${paymentIntent.status}`);

        // Generate confirmation number
        const confirmationNumber = generateConfirmationNumber();

        // Create reservation in database
        const newReservation = await Reservation.create({
          user: user._id,
          spaceType: reservation.spaceType,
          date: reservation.date,
          startTime: reservation.startTime,
          endTime: reservation.endTime,
          numberOfPeople: reservation.numberOfPeople,
          basePrice: reservation.basePrice,
          totalPrice: reservation.basePrice,
          servicesPrice: 0,
          status: reservation.status,
          paymentStatus: reservation.status === 'confirmed' ? 'paid' : 'pending',
          requiresPayment: true,
          stripePaymentIntentId: paymentIntent.id,
          contactName: `${user.givenName} ${user.familyName || ''}`.trim(),
          contactEmail: user.email,
          contactPhone: user.phone || '',
          confirmationNumber: confirmationNumber,
          additionalServices: [],
        });

        console.log(`   📄 Reservation ID: ${newReservation._id}`);
        console.log(`   🎫 Confirmation: ${confirmationNumber}`);

        // Send confirmation email
        await sendBookingConfirmation(user.email, {
          name: user.givenName || '',
          spaceName: reservation.spaceType,
          date: reservation.date.toLocaleDateString('fr-FR'),
          startTime: reservation.startTime,
          endTime: reservation.endTime,
          numberOfPeople: reservation.numberOfPeople,
          totalPrice: reservation.basePrice,
          confirmationNumber: confirmationNumber,
          depositAmount: depositAmount / 100,
        });

        console.log(`   📧 Email sent to ${user.email}`);
        console.log(`   ✅ Complete!\n`);

        createdReservations.push({
          id: newReservation._id,
          confirmationNumber,
          spaceType: reservation.spaceType,
          date: reservation.date,
          status: reservation.status,
          paymentIntentId: paymentIntent.id,
        });

      } catch (error) {
        console.error(`   ❌ Error:`, error instanceof Error ? error.message : 'Unknown error');
        console.log('');
      }
    }

    console.log('\n✨ Test reservations creation completed!\n');
    console.log('═'.repeat(60));
    console.log('📊 SUMMARY');
    console.log('═'.repeat(60));
    console.log(`✅ Created ${createdReservations.length}/${testReservations.length} reservations`);
    console.log(`📧 Email: ${TEST_EMAIL}`);
    console.log(`💳 Customer: ${customerId}`);
    console.log('');
    console.log('📝 RESERVATIONS:');
    createdReservations.forEach((res, idx) => {
      console.log(`\n${idx + 1}. ${res.spaceType}`);
      console.log(`   ID: ${res.id}`);
      console.log(`   Confirmation: ${res.confirmationNumber}`);
      console.log(`   Date: ${res.date.toLocaleDateString('fr-FR')}`);
      console.log(`   Status: ${res.status}`);
      console.log(`   Payment Intent: ${res.paymentIntentId}`);
    });
    console.log('\n' + '═'.repeat(60));
    console.log('\n🧪 TEST SCENARIOS:');
    console.log('  1. Pending booking → Cancel (0% fee, release hold)');
    console.log('  2. >7 days before → Cancel (0% fee, release hold)');
    console.log('  3. 3-7 days before → Cancel (50% fee, partial capture)');
    console.log('  4. <3 days before → Cancel (100% fee, full capture)');
    console.log('');
    console.log('📧 Check your inbox for confirmation emails!');
    console.log('💳 Check Stripe dashboard (test mode) for payment intents');
    console.log(`🌐 Visit: http://localhost:3000/${user.username}/reservations\n`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error:', error instanceof Error ? error.message : 'Unknown error');
    console.error(error);
    process.exit(1);
  }
}

// Run the script
createTestReservations();
