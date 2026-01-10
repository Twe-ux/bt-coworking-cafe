/**
 * Migration script to update BookingSettings schema
 * Converts old field names to new ones:
 * - hoursBeforeStart -> daysBeforeBooking
 * - chargePercent -> chargePercentage
 */

import { connectDB } from '../src/lib/mongodb';
import mongoose from 'mongoose';

async function migrateBookingSettings() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db?.collection('bookingsettings');

    if (!collection) {
      throw new Error('Could not access bookingsettings collection');
    }

    // Find all documents with old field names
    const documents = await collection.find({}).toArray();

    console.log(`Found ${documents.length} documents to check`);

    for (const doc of documents) {
      let needsUpdate = false;
      const updates: any = {};

      // Check if cancellationPolicy has old field names
      if (doc.cancellationPolicy && Array.isArray(doc.cancellationPolicy)) {
        const migratedPolicy = doc.cancellationPolicy.map((tier: any) => {
          const newTier: any = {};

          // Migrate hoursBeforeStart to daysBeforeBooking
          if ('hoursBeforeStart' in tier) {
            // Convert hours to days (24 hours = 1 day)
            newTier.daysBeforeBooking = Math.floor(tier.hoursBeforeStart / 24);
            needsUpdate = true;
          } else if ('daysBeforeBooking' in tier) {
            newTier.daysBeforeBooking = tier.daysBeforeBooking;
          }

          // Migrate chargePercent to chargePercentage
          if ('chargePercent' in tier) {
            newTier.chargePercentage = tier.chargePercent;
            needsUpdate = true;
          } else if ('chargePercentage' in tier) {
            newTier.chargePercentage = tier.chargePercentage;
          }

          return newTier;
        });

        if (needsUpdate) {
          updates.cancellationPolicy = migratedPolicy;
        }
      }

      // Update document if needed
      if (needsUpdate) {
        console.log(`Updating document ${doc._id}...`);
        await collection.updateOne(
          { _id: doc._id },
          { $set: updates }
        );
        console.log(`✓ Updated document ${doc._id}`);
      } else {
        console.log(`✓ Document ${doc._id} already up to date`);
      }
    }

    console.log('\n✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateBookingSettings();
