import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import type { Metadata } from "next";
import { Button, Card, CardBody, CardTitle, Col, Row } from "react-bootstrap";
import UIExamplesList from "@/components/dashboard/UIExamplesList";
import dynamic from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Component to avoid build-time bundling issues
const AllSweetAlerts = dynamic(() => import('./Components/AllSweetAlerts'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});


const SweetAlerts = () => {
  return (
    <>
      <DashboardPageTitle subName="Extended" title="Sweet Alerts" />
      <Row>
        <Col xl={9}>
          <Card>
            <CardBody>
              <CardTitle as={"h5"} className="mb-1 anchor" id="overview">
                Overview
                <Button
                  variant="outline-success"
                  size="sm"
                  className="rounded-2 float-end"
                  href="https://sweetalert2.github.io/"
                  target="_blank"
                >
                  Official Website
                </Button>
              </CardTitle>
              <p className="text-muted mb-3">
                A beautiful, responsive, customizable, accessible (WAI-ARIA)
                replacement for JavaScript&apos;s popup boxes
              </p>
            </CardBody>
          </Card>
          <AllSweetAlerts />
        </Col>
        <Col xl={3}>
          <UIExamplesList
            examples={[
              { link: "#overview", label: "Overview" },
              { link: "#basic", label: "Basic" },
              { link: "#title", label: "A Title with a Text Under" },
              { link: "#message", label: "Message" },
              { link: "#longcontent", label: "long content Images Message" },
              { link: "#parameter", label: "Parameter" },
            ]}
          />
        </Col>
      </Row>
    </>
  );
};

export default SweetAlerts;
