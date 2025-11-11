import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import FileUpload from "@/components/dashboard/FileUpload";
import { Metadata } from "next";
import { Col, Row } from "react-bootstrap";
import dynamic from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const AgentAdd = dynamic(() => import('./components/AgentAdd'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const AgentAddCard = dynamic(() => import('./components/AgentAddCard'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const AgentAddPage = () => {
  return (
    <>
      <DashboardPageTitle subName="Real Estate" title="Add Agent" />
      <Row>
        <AgentAddCard />
        <Col xl={9} lg={8}>
          <FileUpload title="Add Agent Photo" />
          <AgentAdd />
        </Col>
      </Row>
    </>
  );
};

export default AgentAddPage;
