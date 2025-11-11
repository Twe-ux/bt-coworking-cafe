import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import { Metadata } from "next";
import { Col, Row } from "react-bootstrap";
import dynamicImport from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const CollectionRent = dynamicImport(() => import('./components/CollectionRent'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const Goals = dynamicImport(() => import('./components/Goals'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const JoinAgent = dynamicImport(() => import('./components/JoinAgent'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const RecentAgent = dynamicImport(() => import('./components/RecentAgent'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const SalesFunnel = dynamicImport(() => import('./components/SalesFunnel'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const SessionsCountry = dynamicImport(() => import('./components/SessionsCountry'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const Statistics = dynamicImport(() => import('./components/Statistics'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const TopAgents = dynamicImport(() => import('./components/TopAgents'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const TotalRevenue = dynamicImport(() => import('./components/TotalRevenue'), {
  ssr: true,
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
