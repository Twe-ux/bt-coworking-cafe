import { Metadata } from 'next'
import ComingSoon from './components/ComingSoon'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const ComingSoon = dynamic(() => import('./components/ComingSoon'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

