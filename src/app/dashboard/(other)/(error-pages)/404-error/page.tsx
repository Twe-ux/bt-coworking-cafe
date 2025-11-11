import React from 'react'
import Error404 from './components/Error404'
import { Metadata } from 'next'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const Error404 = dynamic(() => import('./components/Error404'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

