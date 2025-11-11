import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import UIExamplesList from "@/components/dashboard/UIExamplesList";
import type { Metadata } from "next";
import { Col, Row } from "react-bootstrap";
import dynamic from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Component to avoid build-time bundling issues
const AllOffcanvas = dynamic(() => import('./components/AllOffcanvas'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const Offcanvas = () => {
  return (
    <>
      <DashboardPageTitle subName="UI" title="Offcanvas" />
      <Row>
        <Col xl={9}>
          <AllOffcanvas />
        </Col>
        <Col xl={3}>
          <UIExamplesList
            examples={[
              { label: "Default Offcanvas", link: "#default" },
              { label: "Static Backdrop", link: "#static-backdrop" },
              { label: "Offcanvas Position", link: "#offcanvas-position" },
            ]}
          />
        </Col>
      </Row>
    </>
  );
};

export default Offcanvas;
