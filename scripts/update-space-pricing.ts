/**
 * Script to update space configurations with complex pricing rules
 *
 * Rules:
 * - Open-space: Hourly per person, max 5h then 29€/person/day
 * - Verriere: 1-4 people: 24€/h base, +6€/h per extra person | Daily: 120€ base, +30€ per extra person
 * - Etage: 1-10 people: 60€/h base, +6€/h per extra person | Daily: 300€ base, +30€ per extra person
 * - Evenementiel: Quote-based (requiresQuote = true)
 */

import connectDB from "../src/lib/db.js";
import SpaceConfiguration from "../src/models/spaceConfiguration/index.js";

async function updateSpacePricing() {
  try {
    await connectDB();
    // Open-space: Prix horaire à la personne, si plus de 5h -> 29€ max par personne
    await SpaceConfiguration.findOneAndUpdate(
      { spaceType: "open-space" },
      {
        $set: {
          pricing: {
            hourly: 6, // 6€ per hour per person (example, adjust as needed)
            daily: 0,
            weekly: 0,
            monthly: 0,
            perPerson: true,
            maxHoursBeforeDaily: 5,
            dailyRatePerPerson: 29,
            tiers: [],
          },
          requiresQuote: false,
        },
      },
      { upsert: false }
    );
    // Verriere: 1-4 pers: 24€/h, si pers sup: +6€/h | Journée: 120€ (1-4), +30€ per extra
    await SpaceConfiguration.findOneAndUpdate(
      { spaceType: "salle-verriere" },
      {
        $set: {
          pricing: {
            hourly: 0,
            daily: 0,
            weekly: 0,
            monthly: 0,
            perPerson: false,
            maxHoursBeforeDaily: undefined,
            dailyRatePerPerson: undefined,
            tiers: [
              {
                minPeople: 1,
                maxPeople: 4,
                hourlyRate: 24,
                dailyRate: 120,
                extraPersonHourly: 6,
                extraPersonDaily: 30,
              },
            ],
          },
          requiresQuote: false,
        },
      },
      { upsert: false }
    );
    // Etage: 1-10 pers: 60€/h, +6€/h per extra | Journée: 300€, +30€ per extra
    await SpaceConfiguration.findOneAndUpdate(
      { spaceType: "salle-etage" },
      {
        $set: {
          pricing: {
            hourly: 0,
            daily: 0,
            weekly: 0,
            monthly: 0,
            perPerson: false,
            maxHoursBeforeDaily: undefined,
            dailyRatePerPerson: undefined,
            tiers: [
              {
                minPeople: 1,
                maxPeople: 10,
                hourlyRate: 60,
                dailyRate: 300,
                extraPersonHourly: 6,
                extraPersonDaily: 30,
              },
            ],
          },
          requiresQuote: false,
        },
      },
      { upsert: false }
    );
    // Evenementiel: Sur devis
    await SpaceConfiguration.findOneAndUpdate(
      { spaceType: "evenementiel" },
      {
        $set: {
          pricing: {
            hourly: 0,
            daily: 0,
            weekly: 0,
            monthly: 0,
            perPerson: false,
            maxHoursBeforeDaily: undefined,
            dailyRatePerPerson: undefined,
            tiers: [],
          },
          requiresQuote: true,
        },
      },
      { upsert: false }
    );    process.exit(0);
  } catch (error) {    process.exit(1);
  }
}

updateSpacePricing();
