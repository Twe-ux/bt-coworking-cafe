import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import UIExamplesList from "@/components/dashboard/UIExamplesList";
import type { Metadata } from "next";
import { Col, Row } from "react-bootstrap";
import dynamicImport from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Component to avoid build-time bundling issues
const AllCollapse = dynamicImport(() => import('./components/AllCollapse'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const Collapse = () => {
  return (
    <>
      <DashboardPageTitle subName="UI" title="Collapse" />
      <Row>
        <Col xl={9}>
          <AllCollapse />
        </Col>
        <Col xl={3}>
          <UIExamplesList
            examples={[
              { label: "Default Example", link: "#default" },
              { label: "Horizontal Collapse", link: "#horizontal" },
              { label: "Multiple Targets", link: "#multiple-targets" },
            ]}
          />
        </Col>
      </Row>
    </>
  );
};

export default Collapse;
