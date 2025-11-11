import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import type { Metadata } from "next";
import dynamicImport from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const AllWizard = dynamicImport(() => import('./components/AllWizard'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const Wizard = () => {
  return (
    <>
      <DashboardPageTitle title="Wizard" subName="Form" />
      <AllWizard />
    </>
  );
};

export default Wizard;
