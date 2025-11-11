import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import UIExamplesList from "@/components/dashboard/UIExamplesList";
import type { Metadata } from "next";
import { Col, Row } from "react-bootstrap";
import dynamicImport from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const AllBoxPlotCharts = dynamicImport(() => import('./components/AllBoxPlotCharts'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const metadata: Metadata = { title: "Boxplot Alert" };

const BoxPlotCharts = () => {
  return (
    <>
      <DashboardPageTitle title="Boxplot" subName="Charts" />
      <Row>
        <Col xl={9}>
          <AllBoxPlotCharts />
        </Col>
        <Col xl={3}>
          <UIExamplesList
            examples={[
              { link: "#basic", label: "Basic Boxplot" },
              { link: "#scatter", label: "Scatter Boxplot" },
            ]}
          />
        </Col>
      </Row>
    </>
  );
};

export default BoxPlotCharts;
