import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import { Metadata } from "next";
import { Row } from "react-bootstrap";
import dynamic from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const PropertiesData = dynamic(() => import('./components/PropertiesData'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const PropertiesFilter = dynamic(() => import('./components/PropertiesFilter'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const PropertyGridPage = () => {
  return (
    <>
      <DashboardPageTitle title="Listing Grid" subName="Real Estate" />
      <Row>
        <PropertiesFilter />
        <PropertiesData />
      </Row>
    </>
  );
};

export default PropertyGridPage;
