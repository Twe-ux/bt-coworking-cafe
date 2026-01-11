// Script de migration pour ajouter le champ vatRate aux services existants
const mongoose = require('mongoose');

async function migrate() {
  try {
    // Connexion à MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/coworking-cafe';
    await mongoose.connect(mongoUri);
    
    console.log('✅ Connected to MongoDB');

    // Mettre à jour tous les services qui n'ont pas de vatRate
    const result = await mongoose.connection.db.collection('additionalservices').updateMany(
      { vatRate: { $exists: false } },
      { $set: { vatRate: 20 } }
    );

    console.log(`✅ Migration completed: ${result.modifiedCount} services updated with default vatRate of 20%`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
