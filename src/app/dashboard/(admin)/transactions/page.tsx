import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import { Metadata } from "next";
import dynamic from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const TransactionData = dynamic(() => import('./components/TransactionData'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const TransactionsPage = () => {
  return (
    <>
      <DashboardPageTitle title="Transactions" subName="Real Estate" />
      <TransactionData />
    </>
  );
};

export default TransactionsPage;
