/**
 * Script to test price calculation for meeting rooms
 *
 * Run with: npx tsx scripts/test-price-calculation.ts
 */

async function testPriceCalculation() {
  const testCases = [
    // SALLE VERRIERE TESTS
    {
      spaceType: 'salle-verriere',
      reservationType: 'hourly',
      startTime: '2026-01-15T09:00:00',
      endTime: '2026-01-15T12:00:00', // 3 hours
      numberOfPeople: 2,
      expected: 72, // 3 hours * 24€/h = 72€ (within tier, no extra)
    },
    {
      spaceType: 'salle-verriere',
      reservationType: 'hourly',
      startTime: '2026-01-15T09:00:00',
      endTime: '2026-01-15T12:00:00', // 3 hours
      numberOfPeople: 4,
      expected: 72, // 3 hours * 24€/h = 72€ (within tier, no extra)
    },
    {
      spaceType: 'salle-verriere',
      reservationType: 'hourly',
      startTime: '2026-01-15T09:00:00',
      endTime: '2026-01-15T12:00:00', // 3 hours
      numberOfPeople: 5,
      expected: 90, // (3 * 24€) + (1 extra person * 6€ * 3h) = 72 + 18 = 90€
    },
    {
      spaceType: 'salle-verriere',
      reservationType: 'daily',
      startTime: '2026-01-15T09:00:00',
      endTime: '2026-01-15T18:00:00',
      numberOfPeople: 2,
      expected: 120, // 1 day * 120€ = 120€ (within tier)
    },
    {
      spaceType: 'salle-verriere',
      reservationType: 'daily',
      startTime: '2026-01-15T09:00:00',
      endTime: '2026-01-15T18:00:00',
      numberOfPeople: 5,
      expected: 150, // 120€ + (1 extra person * 30€) = 150€
    },

    // SALLE ETAGE TESTS
    {
      spaceType: 'salle-etage',
      reservationType: 'hourly',
      startTime: '2026-01-15T09:00:00',
      endTime: '2026-01-15T12:00:00', // 3 hours
      numberOfPeople: 5,
      expected: 180, // 3 hours * 60€/h = 180€ (within tier, no extra)
    },
    {
      spaceType: 'salle-etage',
      reservationType: 'hourly',
      startTime: '2026-01-15T09:00:00',
      endTime: '2026-01-15T12:00:00', // 3 hours
      numberOfPeople: 10,
      expected: 180, // 3 hours * 60€/h = 180€ (within tier, no extra)
    },
    {
      spaceType: 'salle-etage',
      reservationType: 'hourly',
      startTime: '2026-01-15T09:00:00',
      endTime: '2026-01-15T12:00:00', // 3 hours
      numberOfPeople: 11,
      expected: 198, // (3 * 60€) + (1 extra person * 6€ * 3h) = 180 + 18 = 198€
    },
    {
      spaceType: 'salle-etage',
      reservationType: 'hourly',
      startTime: '2026-01-15T09:00:00',
      endTime: '2026-01-15T12:00:00', // 3 hours
      numberOfPeople: 15,
      expected: 270, // (3 * 60€) + (5 extra people * 6€ * 3h) = 180 + 90 = 270€
    },
    {
      spaceType: 'salle-etage',
      reservationType: 'daily',
      startTime: '2026-01-15T09:00:00',
      endTime: '2026-01-15T18:00:00',
      numberOfPeople: 10,
      expected: 300, // 1 day * 300€ = 300€ (within tier)
    },
    {
      spaceType: 'salle-etage',
      reservationType: 'daily',
      startTime: '2026-01-15T09:00:00',
      endTime: '2026-01-15T18:00:00',
      numberOfPeople: 15,
      expected: 450, // 300€ + (5 extra people * 30€) = 450€
    },
  ];
  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    const { spaceType, reservationType, startTime, endTime, numberOfPeople, expected } = testCase;

    try {
      const response = await fetch('http://localhost:3000/api/calculate-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spaceType,
          reservationType,
          startTime,
          endTime,
          numberOfPeople,
        }),
      });

      const data = await response.json();

      if (!data.success) {        failed++;
        continue;
      }

      const actual = data.data.totalPrice;
      const match = Math.abs(actual - expected) < 0.01;

      if (match) {        passed++;
      } else {        failed++;
      }
    } catch (error) {      failed++;
    }  }}

testPriceCalculation();
