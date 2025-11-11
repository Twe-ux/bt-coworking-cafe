import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { options } from '@/app/api/auth/[...nextauth]/options';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await getServerSession(options);

  if (!session || (session.user.role.slug !== 'admin' && session.user.role.slug !== 'dev')) {
    redirect('/auth/login');
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {session.user.name}!</p>
      <p>Role: {session.user.role.name} (Level: {session.user.role.level})</p>

      {/* TODO: Import and display dashboard content with admin permissions */}
    </div>
  );
}
