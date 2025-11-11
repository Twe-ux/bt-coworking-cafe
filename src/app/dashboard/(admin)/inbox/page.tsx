import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import { Metadata } from "next";
import { Card, Row } from "react-bootstrap";
import dynamicImport from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const EmailView = dynamicImport(() => import('./components/EmailView'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const InboxPage = () => {
  return (
    <>
      <DashboardPageTitle title="Inbox" subName="Real Estate" />
      <Card>
        <Row className="g-0">
          <EmailView />
        </Row>
      </Card>
    </>
  );
};

export default InboxPage;
