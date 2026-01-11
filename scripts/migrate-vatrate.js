// Script de migration pour ajouter le champ vatRate aux services existants
const mongoose = require('mongoose');

async function migrate() {
  try {
    // Connexion à MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/coworking-cafe';
    await mongoose.connect(mongoUri);
    // Mettre à jour tous les services qui n'ont pas de vatRate
    const result = await mongoose.connection.db.collection('additionalservices').updateMany(
      { vatRate: { $exists: false } },
      { $set: { vatRate: 20 } }
    );
    await mongoose.disconnect();    process.exit(0);
  } catch (error) {    process.exit(1);
  }
}

migrate();
