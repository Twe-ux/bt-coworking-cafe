import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { options } from '@/app/api/auth/[...nextauth]/options';

export default async function DevDashboard() {
  const session = await getServerSession(options);

  if (!session || session.user.role.slug !== 'dev') {
    redirect('/auth/login');
  }

  return (
    <div>
      <h1>Developer Dashboard</h1>
      <p>Welcome, {session.user.name}!</p>
      <p>Role: {session.user.role.name} (Level: {session.user.role.level})</p>

      {/* TODO: Import and display dashboard content with full permissions */}
    </div>
  );
}
