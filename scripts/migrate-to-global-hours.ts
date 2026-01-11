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
  // MongoDB URI not found
  process.exit(1);
}

async function migrate() {
  try {
    await mongoose.connect(MONGODB_URI!);
    const db = mongoose.connection.db;
    const spaceConfigCollection = db!.collection('spaceconfigurations');
    const globalHoursCollection = db!.collection('globalhoursconfigurations');

    // Step 1: Check if GlobalHoursConfiguration already exists
    const existingGlobalHours = await globalHoursCollection.findOne({});

    if (existingGlobalHours) {
      // Global hours already exist
    } else {
      // Step 2: Get hours from open-space configuration (as reference)
      const openSpace = await spaceConfigCollection.findOne({ spaceType: 'open-space' });

      if (!openSpace) {
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
      }
    }

    // Step 3: Remove defaultHours and exceptionalClosures from all space configurations
    const result = await spaceConfigCollection.updateMany(
      {},
      {
        $unset: {
          defaultHours: '',
          exceptionalClosures: '',
        },
      }
    );
  } catch (error) {
    // Migration error
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

// Run the migration
migrate();
