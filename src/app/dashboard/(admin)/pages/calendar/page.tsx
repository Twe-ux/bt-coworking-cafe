import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import type { Metadata } from "next";
import { Card, CardBody, Col, Row } from "react-bootstrap";
import dynamicImport from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Component to avoid build-time bundling issues
const CalendarPage = dynamicImport(() => import('./components/CalendarPage'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading calendar...</div>
});

const Schedule = () => {
  return (
    <>
      <DashboardPageTitle title="Calendar" subName="Pages" />
      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <Row>
                <CalendarPage />
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Schedule;
