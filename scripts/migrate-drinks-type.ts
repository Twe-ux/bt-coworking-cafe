// Script de migration pour ajouter le champ type aux drinks et categories existants
// Exécuter avec: npx ts-node scripts/migrate-drinks-type.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI non défini dans .env.local');
  process.exit(1);
}

async function migrate() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log('Connecté à MongoDB');

    const db = mongoose.connection.db;

    if (!db) {
      throw new Error('Database connection not established');
    }

    // Mettre à jour les catégories sans type
    const categoriesResult = await db.collection('drink_categories').updateMany(
      { type: { $exists: false } },
      { $set: { type: 'drink' } }
    );
    console.log(`Catégories mises à jour: ${categoriesResult.modifiedCount}`);

    // Mettre à jour les boissons sans type
    const drinksResult = await db.collection('drinks').updateMany(
      { type: { $exists: false } },
      { $set: { type: 'drink' } }
    );
    console.log(`Boissons mises à jour: ${drinksResult.modifiedCount}`);

    console.log('Migration terminée avec succès!');
  } catch (error) {
    console.error('Erreur lors de la migration:', error);
  } finally {
    await mongoose.disconnect();
  }
}

migrate();
