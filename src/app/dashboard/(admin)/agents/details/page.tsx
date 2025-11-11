import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import { Metadata } from "next";
import dynamicImport from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const AgentDetails = dynamicImport(() => import('./components/AgentDetails'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const AgentsDetailsBanner = dynamicImport(() => import('./components/AgentsDetailsBannner'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const AgentsDetailsPage = () => {
  return (
    <>
      <DashboardPageTitle subName="Real Estate" title="Agent Overview" />
      <AgentsDetailsBanner />
      <AgentDetails />
    </>
  );
};

export default AgentsDetailsPage;
