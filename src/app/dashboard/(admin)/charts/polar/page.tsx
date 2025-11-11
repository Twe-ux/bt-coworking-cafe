import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import UIExamplesList from "@/components/dashboard/UIExamplesList";
import type { Metadata } from "next";
import { Col, Row } from "react-bootstrap";
import dynamicImport from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const AllPolarAreaCharts = dynamicImport(() => import('./components/AllPolarAreaCharts'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const PolarAreaCharts = () => {
  return (
    <>
      <DashboardPageTitle title="Polar" subName="Charts" />
      <Row>
        <Col xl={9}>
          <AllPolarAreaCharts />
        </Col>
        <Col xl={3}>
          <UIExamplesList
            examples={[
              { link: "#basic", label: "Basic Polar Area Chart" },
              { link: "#monochrome", label: "Monochrome Polar Area" },
            ]}
          />
        </Col>
      </Row>
    </>
  );
};

export default PolarAreaCharts;
