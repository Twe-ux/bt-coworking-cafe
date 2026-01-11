/**
 * Script to check and fix meeting room pricing configuration
 *
 * Run with: npx tsx scripts/check-meeting-room-pricing.ts
 */

import connectDB from '../src/lib/db';
import SpaceConfiguration from '../src/models/spaceConfiguration';

async function checkMeetingRoomPricing() {
  try {
    await connectDB();
    // Check Salle Verriere
    const verriere = await SpaceConfiguration.findOne({ spaceType: 'salle-verriere' });
    if (verriere) {
      // Expected configuration for Verriere:
      // Fixed price up to 4 people, then +6€/h or +30€/day per extra person (max 5)
    } else {
      // Verriere not found
    }
    // Check Salle Etage
    const etage = await SpaceConfiguration.findOne({ spaceType: 'salle-etage' });
    if (etage) {
      // Expected configuration for Etage:
      // Fixed price up to 10 people, then +6€/h or +30€/day per extra person (max 15)
    } else {
      // Etage not found
    }

    process.exit(0);
  } catch (error) {
    // Error checking pricing
    process.exit(1);
  }
}

checkMeetingRoomPricing();
