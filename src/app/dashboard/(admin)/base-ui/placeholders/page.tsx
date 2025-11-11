import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import UIExamplesList from "@/components/dashboard/UIExamplesList";
import type { Metadata } from "next";
import { Col, Row } from "react-bootstrap";
import dynamic from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Component to avoid build-time bundling issues
const AllPlaceholders = dynamic(() => import('./components/AllPlaceholders'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const PLaceholders = () => {
  return (
    <>
      <DashboardPageTitle subName="UI" title="Placeholders" />
      <Row>
        <Col xl={9}>
          <AllPlaceholders />
        </Col>
        <Col xl={3}>
          <UIExamplesList
            examples={[
              { link: "#default", label: "Overview" },
              { link: "#how-works", label: "How it works" },
              { link: "#width", label: "Width" },
              { link: "#color", label: "Color" },
            ]}
          />
        </Col>
      </Row>
    </>
  );
};

export default PLaceholders;
