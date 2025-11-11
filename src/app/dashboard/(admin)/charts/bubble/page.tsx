import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import UIExamplesList from "@/components/dashboard/UIExamplesList";
import type { Metadata } from "next";
import { Col, Row } from "react-bootstrap";
import dynamicImport from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const AllBubbleCharts = dynamicImport(() => import('./components/AllBubbleCharts'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const BubbleCharts = () => {
  return (
    <>
      <DashboardPageTitle title="Bubble" subName="Charts" />
      <Row>
        <Col xl={9}>
          <AllBubbleCharts />
        </Col>
        <Col xl={3}>
          <UIExamplesList
            examples={[
              { link: "#simple", label: "Simple Bubble Chart" },
              { link: "#3d-bubble", label: "3D Bubble Chart" },
            ]}
          />
        </Col>
      </Row>
    </>
  );
};

export default BubbleCharts;
