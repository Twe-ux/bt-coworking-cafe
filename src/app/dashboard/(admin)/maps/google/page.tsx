import type { Metadata } from "next";
import dynamicImport from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const AllGoogleMaps = dynamicImport(() => import('./components/AllGoogleMaps'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const GoogleMaps = () => {
  return <AllGoogleMaps />;
};

export default GoogleMaps;
