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
    console.log('✅ Connected to database\n');

    // Check Salle Verriere
    const verriere = await SpaceConfiguration.findOne({ spaceType: 'salle-verriere' });
    console.log('🔍 SALLE VERRIERE CONFIGURATION:');
    console.log('================================');
    if (verriere) {
      console.log('Name:', verriere.name);
      console.log('Max Capacity:', verriere.maxCapacity);
      console.log('Pricing Structure:');
      console.log('  - Hourly base:', verriere.pricing.hourly);
      console.log('  - Daily base:', verriere.pricing.daily);
      console.log('  - Per person:', verriere.pricing.perPerson);
      console.log('Tiers:', JSON.stringify(verriere.pricing.tiers, null, 2));

      // Expected configuration for Verriere:
      // Fixed price up to 4 people, then +6€/h or +30€/day per extra person (max 5)
      console.log('\n✨ EXPECTED CONFIGURATION:');
      console.log('  - Should have 1 tier:');
      console.log('    * minPeople: 1');
      console.log('    * maxPeople: 4');
      console.log('    * extraPersonHourly: 6');
      console.log('    * extraPersonDaily: 30');
    } else {
      console.log('❌ Salle Verriere not found!');
    }

    console.log('\n');

    // Check Salle Etage
    const etage = await SpaceConfiguration.findOne({ spaceType: 'salle-etage' });
    console.log('🔍 SALLE ETAGE CONFIGURATION:');
    console.log('================================');
    if (etage) {
      console.log('Name:', etage.name);
      console.log('Max Capacity:', etage.maxCapacity);
      console.log('Pricing Structure:');
      console.log('  - Hourly base:', etage.pricing.hourly);
      console.log('  - Daily base:', etage.pricing.daily);
      console.log('  - Per person:', etage.pricing.perPerson);
      console.log('Tiers:', JSON.stringify(etage.pricing.tiers, null, 2));

      // Expected configuration for Etage:
      // Fixed price up to 10 people, then +6€/h or +30€/day per extra person (max 15)
      console.log('\n✨ EXPECTED CONFIGURATION:');
      console.log('  - Should have 1 tier:');
      console.log('    * minPeople: 1');
      console.log('    * maxPeople: 10');
      console.log('    * extraPersonHourly: 6');
      console.log('    * extraPersonDaily: 30');
    } else {
      console.log('❌ Salle Etage not found!');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkMeetingRoomPricing();
