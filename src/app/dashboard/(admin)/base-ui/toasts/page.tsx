import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import UIExamplesList from "@/components/dashboard/UIExamplesList";
import type { Metadata } from "next";
import { Col, Row } from "react-bootstrap";
import dynamic from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Component to avoid build-time bundling issues
const AllToasts = dynamic(() => import('./components/AllToasts'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const Toasts = () => {
  return (
    <>
      <DashboardPageTitle subName="UI" title="Toasts" />
      <Row>
        <Col xl={9}>
          <AllToasts />
        </Col>
        <Col xl={3}>
          <UIExamplesList
            examples={[
              { link: "#basic_examples", label: "Basic Examples" },
              { link: "#live_example", label: "Live example" },
              { link: "#default_buttons", label: "Staking" },
              { link: "#custom_content", label: "Custom Content" },
              { link: "#transcluent", label: "Transcluent" },
              { link: "#placement", label: "Placement" },
            ]}
          />
        </Col>
      </Row>
    </>
  );
};

export default Toasts;
