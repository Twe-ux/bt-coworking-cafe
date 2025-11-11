import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import type { Metadata } from "next";
import { Button, Card, CardBody, CardTitle, Col, Row } from "react-bootstrap";
import dynamicImport from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const AllEditors = dynamicImport(() => import('./components/AllEditors'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const Editors = () => {
  return (
    <>
      <DashboardPageTitle title="Editors" subName="Form" />
      <Row>
        <Col xl={12}>
          <Card>
            <CardBody>
              <CardTitle as={"h5"} className="mb-1 anchor" id="overview">
                Overview
                <Button
                  variant="outline-success"
                  size="sm"
                  className="rounded-2 float-end"
                  href="https://quilljs.com/"
                  target="_blank"
                >
                  Official Website
                </Button>
              </CardTitle>
              <p className="text-muted mb-3">
                Quilljs is a lightweight and powerful datetime picker.
              </p>
            </CardBody>
          </Card>
          <AllEditors />
        </Col>
      </Row>
    </>
  );
};

export default Editors;
