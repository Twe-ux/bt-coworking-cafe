import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import { Metadata } from "next";
import { Row } from "react-bootstrap";
import dynamicImport from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const BalanceCard = dynamicImport(() => import('./components/BalanceCard'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const SalesChart = dynamicImport(() => import('./components/SalesChart'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const SocialSource = dynamicImport(() => import('./components/SocialSource'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const Statistics = dynamicImport(() => import('./components/Statistics'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const Transaction = dynamicImport(() => import('./components/Transaction'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const AnalyticsPage = () => {
  return (
    <>
      <DashboardPageTitle title="Analytics" subName="Dashboard" />
      <Statistics />
      <Row>
        <SalesChart />
        <BalanceCard />
      </Row>
      <SocialSource />
      <Transaction />
    </>
  );
};

export default AnalyticsPage;
