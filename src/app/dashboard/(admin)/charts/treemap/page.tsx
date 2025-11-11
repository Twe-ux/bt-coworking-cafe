import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import UIExamplesList from "@/components/dashboard/UIExamplesList";
import type { Metadata } from "next";
import { Col, Row } from "react-bootstrap";
import dynamicImport from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const AllTreemapCharts = dynamicImport(() => import('./components/AllTreemapCharts'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const TreemapCharts = () => {
  return (
    <>
      <DashboardPageTitle title="Treemap" subName="Charts" />
      <Row>
        <Col xl={9}>
          <AllTreemapCharts />
        </Col>
        <Col xl={3}>
          <UIExamplesList
            examples={[
              { link: "#basic", label: "Basic" },
              { link: "#multiple", label: "Treemap Multiple Series" },
              { link: "#distributed", label: "Distributed Treemap" },
              { link: "#color-range", label: "Color Range Treemap" },
            ]}
          />
        </Col>
      </Row>
    </>
  );
};

export default TreemapCharts;
