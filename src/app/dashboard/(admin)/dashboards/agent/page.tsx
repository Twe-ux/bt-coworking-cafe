import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import { Metadata } from "next";
import { Col, Row } from "react-bootstrap";
import dynamic from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const CollectionRent = dynamic(() => import('./components/CollectionRent'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const Goals = dynamic(() => import('./components/Goals'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const JoinAgent = dynamic(() => import('./components/JoinAgent'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const RecentAgent = dynamic(() => import('./components/RecentAgent'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const SalesFunnel = dynamic(() => import('./components/SalesFunnel'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const SessionsCountry = dynamic(() => import('./components/SessionsCountry'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const Statistics = dynamic(() => import('./components/Statistics'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const TopAgents = dynamic(() => import('./components/TopAgents'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const TotalRevenue = dynamic(() => import('./components/TotalRevenue'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const AgentPage = () => {
  return (
    <>
      <DashboardPageTitle title="Agent" subName="Dashboards" />
      <Row>
        <Statistics />
      </Row>
      <Row>
        <Col xl={9}>
          <Row>
            <SalesFunnel />
            <TotalRevenue />
          </Row>
          <Row>
            <RecentAgent />
          </Row>
          <Row>
            <CollectionRent />
            <SessionsCountry />
          </Row>
        </Col>
        <Col xl={3}>
          <TopAgents />
          <Goals />
          <JoinAgent />
        </Col>
      </Row>
    </>
  );
};

export default AgentPage;
