/**
 * Seed script to initialize space configurations
 * Run with: npx ts-node scripts/seed-spaces.ts
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

const defaultHours = {
  monday: { isOpen: true, openTime: "09:00", closeTime: "20:00" },
  tuesday: { isOpen: true, openTime: "09:00", closeTime: "20:00" },
  wednesday: { isOpen: true, openTime: "09:00", closeTime: "20:00" },
  thursday: { isOpen: true, openTime: "09:00", closeTime: "20:00" },
  friday: { isOpen: true, openTime: "09:00", closeTime: "20:00" },
  saturday: { isOpen: true, openTime: "10:00", closeTime: "20:00" },
  sunday: { isOpen: true, openTime: "10:00", closeTime: "20:00" },
};

const seedData = [
  {
    spaceType: "open-space",
    name: "Place Open-space",
    slug: "open-space",
    description: "Un espace ouvert et collaboratif",
    pricing: {
      hourly: 15,
      daily: 80,
      weekly: 350,
      monthly: 1200,
      perPerson: true,
    },
    availableReservationTypes: {
      hourly: true,
      daily: true,
      weekly: true,
      monthly: true,
    },
    requiresQuote: false,
    minCapacity: 1,
    maxCapacity: 50,
    defaultHours,
    exceptionalClosures: [],
    isActive: true,
    imageUrl: "/images/open-space.jpg",
    displayOrder: 1,
  },
  {
    spaceType: "salle-verriere",
    name: "Salle Verrière",
    slug: "salle-verriere",
    description: "Une salle lumineuse avec vue",
    pricing: {
      hourly: 25,
      daily: 150,
      weekly: 0,
      monthly: 0,
      perPerson: false,
    },
    availableReservationTypes: {
      hourly: true,
      daily: true,
      weekly: false,
      monthly: false,
    },
    requiresQuote: false,
    minCapacity: 2,
    maxCapacity: 12,
    defaultHours,
    exceptionalClosures: [],
    isActive: true,
    imageUrl: "/images/salle-verriere.jpg",
    displayOrder: 2,
  },
  {
    spaceType: "salle-etage",
    name: "Salle Étage",
    slug: "salle-etage",
    description: "Une salle privée à l'étage",
    pricing: {
      hourly: 30,
      daily: 180,
      weekly: 0,
      monthly: 0,
      perPerson: false,
    },
    availableReservationTypes: {
      hourly: true,
      daily: true,
      weekly: false,
      monthly: false,
    },
    requiresQuote: false,
    minCapacity: 2,
    maxCapacity: 8,
    defaultHours,
    exceptionalClosures: [],
    isActive: true,
    imageUrl: "/images/salle-etage.jpg",
    displayOrder: 3,
  },
  {
    spaceType: "evenementiel",
    name: "Espace Événementiel",
    slug: "evenementiel",
    description: "Un grand espace pour vos événements - Tarifs sur devis",
    pricing: {
      hourly: 0,
      daily: 0,
      weekly: 0,
      monthly: 0,
      perPerson: false,
    },
    availableReservationTypes: {
      hourly: false,
      daily: false,
      weekly: false,
      monthly: false,
    },
    requiresQuote: true,
    minCapacity: 10,
    maxCapacity: 80,
    defaultHours,
    exceptionalClosures: [],
    isActive: true,
    imageUrl: "/images/evenementiel.jpg",
    displayOrder: 4,
  },
];

// Define the schema inline to avoid import issues
const SpaceConfigurationSchema = new mongoose.Schema(
  {
    spaceType: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    pricing: {
      hourly: { type: Number, default: 0 },
      daily: { type: Number, default: 0 },
      weekly: { type: Number, default: 0 },
      monthly: { type: Number, default: 0 },
      perPerson: { type: Boolean, default: false },
    },
    availableReservationTypes: {
      hourly: { type: Boolean, default: true },
      daily: { type: Boolean, default: true },
      weekly: { type: Boolean, default: false },
      monthly: { type: Boolean, default: false },
    },
    requiresQuote: { type: Boolean, default: false },
    minCapacity: { type: Number, default: 1 },
    maxCapacity: { type: Number, default: 12 },
    defaultHours: {
      monday: {
        isOpen: { type: Boolean, default: true },
        openTime: String,
        closeTime: String,
      },
      tuesday: {
        isOpen: { type: Boolean, default: true },
        openTime: String,
        closeTime: String,
      },
      wednesday: {
        isOpen: { type: Boolean, default: true },
        openTime: String,
        closeTime: String,
      },
      thursday: {
        isOpen: { type: Boolean, default: true },
        openTime: String,
        closeTime: String,
      },
      friday: {
        isOpen: { type: Boolean, default: true },
        openTime: String,
        closeTime: String,
      },
      saturday: {
        isOpen: { type: Boolean, default: true },
        openTime: String,
        closeTime: String,
      },
      sunday: {
        isOpen: { type: Boolean, default: true },
        openTime: String,
        closeTime: String,
      },
    },
    exceptionalClosures: [
      {
        startDate: Date,
        endDate: Date,
        startTime: String,
        endTime: String,
        reason: String,
      },
    ],
    isActive: { type: Boolean, default: true },
    imageUrl: String,
    displayOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const SpaceConfiguration = mongoose.models.SpaceConfiguration ||
  mongoose.model('SpaceConfiguration', SpaceConfigurationSchema);

async function seedSpaces() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // Check if configurations already exist
    const existingCount = await SpaceConfiguration.countDocuments();

    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing space configurations`);
      console.log('   Deleting existing configurations...');
      await SpaceConfiguration.deleteMany({});
      console.log('   ✅ Deleted existing configurations');
    }

    // Insert seed data
    console.log('📝 Inserting space configurations...');
    const configurations = await SpaceConfiguration.insertMany(seedData);
    console.log(`✅ Successfully created ${configurations.length} space configurations:`);

    configurations.forEach((config) => {
      console.log(`   - ${config.name} (${config.spaceType})`);
    });

    console.log('\n🎉 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run the seed function
seedSpaces();
