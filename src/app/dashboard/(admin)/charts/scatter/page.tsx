import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import UIExamplesList from "@/components/dashboard/UIExamplesList";
import type { Metadata } from "next";
import { Col, Row } from "react-bootstrap";
import dynamicImport from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const AllScatterCharts = dynamicImport(() => import('./components/AllScatterCharts'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const ScatterCharts = () => {
  return (
    <>
      <DashboardPageTitle title="Scatter" subName="Charts" />
      <Row>
        <Col xl={9}>
          <AllScatterCharts />
        </Col>
        <Col xl={3}>
          <UIExamplesList
            examples={[
              { link: "#basic", label: "Scatter (XY) Chart" },
              { link: "#datetime", label: "Scatter Chart - Datetime" },
              { link: "#images", label: "Scatter - Images" },
            ]}
          />
        </Col>
      </Row>
    </>
  );
};

export default ScatterCharts;
