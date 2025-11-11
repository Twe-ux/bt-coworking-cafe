/**
 * Script to reset a user's password
 * Run with: npx tsx src/lib/reset-password.ts
 */

// Load environment variables from .env.local
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env.local') });

import connectDB from './mongodb';
import { User } from '@/models/user';

async function resetPassword() {
  const email = 'client@coworkingcafe.fr';
  const newPassword = 'client123456';

  try {
    await connectDB();
    console.log('📦 Connected to MongoDB');

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      console.error(`❌ User ${email} not found`);
      process.exit(1);
    }

    console.log(`✅ User found: ${email}`);

    // Set plain password - the pre-save hook will hash it automatically
    console.log('🔒 Setting new password (will be hashed by pre-save hook)');
    user.password = newPassword;
    await user.save();

    console.log(`✅ Password reset successfully for ${email}`);
    console.log(`\nNew credentials:`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${newPassword}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetPassword();
