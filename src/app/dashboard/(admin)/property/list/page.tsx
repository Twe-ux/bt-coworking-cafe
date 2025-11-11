import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import { Metadata } from "next";
import dynamic from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const PropertyList = dynamic(() => import('./components/PropertyList'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const PropertyStat = dynamic(() => import('./components/PropertyStat'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const PropertyListPage = () => {
  return (
    <>
      <DashboardPageTitle title="Listing List" subName="Real Estate" />
      <PropertyStat />
      <PropertyList />
    </>
  );
};

export default PropertyListPage;
