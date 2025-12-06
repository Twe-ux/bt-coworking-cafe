/**
 * Migration script to add availableReservationTypes to existing space configurations
 * Run with: npx ts-node scripts/migrate-add-reservation-types.ts
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

async function migrate() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db!.collection('spaceconfigurations');

    // Find all documents without availableReservationTypes
    const docsWithoutField = await collection.find({
      availableReservationTypes: { $exists: false }
    }).toArray();

    console.log(`📊 Found ${docsWithoutField.length} documents without availableReservationTypes`);

    if (docsWithoutField.length === 0) {
      console.log('✅ All documents already have availableReservationTypes field');
      return;
    }

    // Update each document
    for (const doc of docsWithoutField) {
      const spaceType = doc.spaceType;
      let availableReservationTypes;

      // Set defaults based on space type
      if (spaceType === 'open-space') {
        // Open-space allows all reservation types
        availableReservationTypes = {
          hourly: true,
          daily: true,
          weekly: true,
          monthly: true,
        };
      } else if (spaceType === 'evenementiel') {
        // Événementiel requires quote, no standard reservations
        availableReservationTypes = {
          hourly: false,
          daily: false,
          weekly: false,
          monthly: false,
        };
      } else {
        // Salle-verriere and salle-etage: hourly and daily only
        availableReservationTypes = {
          hourly: true,
          daily: true,
          weekly: false,
          monthly: false,
        };
      }

      const result = await collection.updateOne(
        { _id: doc._id },
        { $set: { availableReservationTypes } }
      );

      console.log(`  ✓ Updated ${doc.name} (${spaceType})`);
      console.log(`    Added: hourly=${availableReservationTypes.hourly}, daily=${availableReservationTypes.daily}, weekly=${availableReservationTypes.weekly}, monthly=${availableReservationTypes.monthly}`);
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log(`   Updated ${docsWithoutField.length} documents`);

  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run the migration
migrate();
