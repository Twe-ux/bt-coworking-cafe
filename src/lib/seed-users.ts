/**
 * Script to seed test users for each role
 * Run with: npx ts-node --compiler-options '{"module":"CommonJS"}' src/lib/seed-users.ts
 */

import connectDB from './mongodb';
import { createUser, initializeRoles } from './auth-helpers';

async function seedUsers() {
  try {
    await connectDB();
    console.log('📦 Connected to MongoDB');

    // Initialize roles first
    await initializeRoles();
    console.log('✅ Roles initialized');

    // Create test users for each role
    const testUsers = [
      {
        email: 'dev@coworkingcafe.fr',
        password: 'dev123456',
        givenName: 'Dev User',
        username: 'dev_user',
        roleSlug: 'dev' as const,
      },
      {
        email: 'admin@coworkingcafe.fr',
        password: 'admin123456',
        givenName: 'Admin User',
        username: 'admin_user',
        roleSlug: 'admin' as const,
      },
      {
        email: 'staff@coworkingcafe.fr',
        password: 'staff123456',
        givenName: 'Staff User',
        username: 'staff_user',
        roleSlug: 'staff' as const,
      },
      {
        email: 'client@coworkingcafe.fr',
        password: 'client123456',
        givenName: 'Client User',
        username: 'client_user',
        roleSlug: 'client' as const,
      },
    ];

    for (const userData of testUsers) {
      try {
        const user = await createUser(userData);
        console.log(`✅ Created ${userData.roleSlug} user: ${user.email}`);
      } catch (error: any) {
        if (error.code === 11000) {
          console.log(`⚠️  User ${userData.email} already exists`);
        } else {
          console.error(`❌ Error creating ${userData.roleSlug} user:`, error.message);
        }
      }
    }

    console.log('\n🎉 Seed completed!');
    console.log('\nTest Credentials:');
    console.log('─────────────────────────────────────────');
    testUsers.forEach((user) => {
      console.log(`${user.roleSlug.toUpperCase().padEnd(8)} | ${user.email.padEnd(25)} | ${user.password}`);
    });
    console.log('─────────────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seedUsers();
