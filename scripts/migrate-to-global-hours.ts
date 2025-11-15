/**
 * Migration script to move hours from SpaceConfiguration to GlobalHoursConfiguration
 * Run with: npx ts-node scripts/migrate-to-global-hours.ts
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
    const spaceConfigCollection = db!.collection('spaceconfigurations');
    const globalHoursCollection = db!.collection('globalhoursconfigurations');

    // Step 1: Check if GlobalHoursConfiguration already exists
    const existingGlobalHours = await globalHoursCollection.findOne({});

    if (existingGlobalHours) {
      console.log('⚠️  GlobalHoursConfiguration already exists');
      console.log('   Skipping creation...');
    } else {
      // Step 2: Get hours from open-space configuration (as reference)
      const openSpace = await spaceConfigCollection.findOne({ spaceType: 'open-space' });

      if (!openSpace) {
        console.log('⚠️  No open-space configuration found');
        console.log('   Creating default global hours...');

        // Create default global hours
        const defaultHours = {
          monday: { isOpen: true, openTime: "09:00", closeTime: "20:00" },
          tuesday: { isOpen: true, openTime: "09:00", closeTime: "20:00" },
          wednesday: { isOpen: true, openTime: "09:00", closeTime: "20:00" },
          thursday: { isOpen: true, openTime: "09:00", closeTime: "20:00" },
          friday: { isOpen: true, openTime: "09:00", closeTime: "20:00" },
          saturday: { isOpen: true, openTime: "10:00", closeTime: "20:00" },
          sunday: { isOpen: true, openTime: "10:00", closeTime: "20:00" },
        };

        await globalHoursCollection.insertOne({
          defaultHours,
          exceptionalClosures: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        console.log('   ✅ Created default global hours configuration');
      } else {
        // Use hours from open-space
        const { defaultHours, exceptionalClosures } = openSpace;

        await globalHoursCollection.insertOne({
          defaultHours: defaultHours || {
            monday: { isOpen: true, openTime: "09:00", closeTime: "20:00" },
            tuesday: { isOpen: true, openTime: "09:00", closeTime: "20:00" },
            wednesday: { isOpen: true, openTime: "09:00", closeTime: "20:00" },
            thursday: { isOpen: true, openTime: "09:00", closeTime: "20:00" },
            friday: { isOpen: true, openTime: "09:00", closeTime: "20:00" },
            saturday: { isOpen: true, openTime: "10:00", closeTime: "20:00" },
            sunday: { isOpen: true, openTime: "10:00", closeTime: "20:00" },
          },
          exceptionalClosures: exceptionalClosures || [],
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        console.log('   ✅ Created global hours from open-space configuration');
      }
    }

    // Step 3: Remove defaultHours and exceptionalClosures from all space configurations
    console.log('\n📝 Removing hours fields from space configurations...');

    const result = await spaceConfigCollection.updateMany(
      {},
      {
        $unset: {
          defaultHours: '',
          exceptionalClosures: '',
        },
      }
    );

    console.log(`   ✅ Updated ${result.modifiedCount} space configurations`);

    console.log('\n🎉 Migration completed successfully!');
    console.log('   - Global hours configuration created');
    console.log(`   - ${result.modifiedCount} space configurations cleaned`);

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
