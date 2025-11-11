import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import UIExamplesList from "@/components/dashboard/UIExamplesList";
import type { Metadata } from "next";
import { Col, Row } from "react-bootstrap";
import dynamicImport from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const AllCandlestickCharts = dynamicImport(() => import('./components/AllCandlestickCharts'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const CandlestickCharts = () => {
  return (
    <>
      <DashboardPageTitle title="Candlestick" subName="Charts" />
      <Row>
        <Col xl={9}>
          <AllCandlestickCharts />
        </Col>
        <Col xl={3}>
          <UIExamplesList
            examples={[
              { link: "#simple", label: "Simple Candlestick Chart" },
              { link: "#x-axis", label: "Category X-Axis" },
              { link: "#line", label: "Candlestick with Line" },
            ]}
          />
        </Col>
      </Row>
    </>
  );
};

export default CandlestickCharts;
