import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { options } from '@/app/api/auth/[...nextauth]/options';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';

export default async function StaffDashboard() {
  const session = await getServerSession(options);

  if (!session || !['staff', 'admin', 'dev'].includes(session.user.role.slug)) {
    redirect('/auth/login');
  }

  return (
    <div>
      <h1>Staff Dashboard</h1>
      <p>Welcome, {session.user.name}!</p>
      <p>Role: {session.user.role.name} (Level: {session.user.role.level})</p>

      {/* TODO: Import and display dashboard content with staff permissions */}
    </div>
  );
}
