import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import UIExamplesList from "@/components/dashboard/UIExamplesList";
import type { Metadata } from "next";
import { Col, Row } from "react-bootstrap";
import dynamicImport from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const AllHeatmapCharts = dynamicImport(() => import('./components/AllHeatmapCharts'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const HeatmapCharts = () => {
  return (
    <>
      <DashboardPageTitle title="Heatmap" subName="Charts" />
      <Row>
        <Col xl={9}>
          <AllHeatmapCharts />
        </Col>
        <Col xl={3}>
          <UIExamplesList
            examples={[
              { link: "#basic", label: "Basic Heatmap - Single Series" },
              { link: "#multiple-series", label: "Heatmap - Multiple Series" },
              { link: "#color-range", label: "Heatmap - Color Range" },
              { link: "#rounded", label: "Heatmap - Range without Shades" },
            ]}
          />
        </Col>
      </Row>
    </>
  );
};

export default HeatmapCharts;
