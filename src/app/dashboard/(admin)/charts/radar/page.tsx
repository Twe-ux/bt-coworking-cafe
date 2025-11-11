import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import UIExamplesList from "@/components/dashboard/UIExamplesList";
import type { Metadata } from "next";
import { Col, Row } from "react-bootstrap";
import dynamicImport from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const AllRadarCharts = dynamicImport(() => import('./components/AllRadarCharts'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const RadarCharts = () => {
  return (
    <>
      <DashboardPageTitle title="Radar" subName="Charts" />
      <Row>
        <Col xl={9}>
          <AllRadarCharts />
        </Col>
        <Col xl={3}>
          <UIExamplesList
            examples={[
              { label: "Basic Radar Chart", link: "#basic" },
              { label: "Radar with Polygon-fill", link: "#polygon" },
              { label: "Radar – Multiple Series", link: "#multiple-series" },
            ]}
          />
        </Col>
      </Row>
    </>
  );
};

export default RadarCharts;
