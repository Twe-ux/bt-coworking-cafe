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
    const db = mongoose.connection.db;
    const collection = db?.collection('bookingsettings');

    if (!collection) {
      throw new Error('Could not access bookingsettings collection');
    }

    // Find all documents with old field names
    const documents = await collection.find({}).toArray();
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
      if (needsUpdate) {        await collection.updateOne(
          { _id: doc._id },
          { $set: updates }
        );      } else {      }
    }    process.exit(0);
  } catch (error) {    process.exit(1);
  }
}

migrateBookingSettings();
