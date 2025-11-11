import { Metadata } from 'next'
import ComingSoon from './components/ComingSoon'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const ComingSoon = dynamic(() => import('./components/ComingSoon'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

