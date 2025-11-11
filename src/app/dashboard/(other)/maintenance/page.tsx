import { Metadata } from 'next'
import Maintenance from './components/Maintenance'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const Maintenance = dynamic(() => import('./components/Maintenance'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

