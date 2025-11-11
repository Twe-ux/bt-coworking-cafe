import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import { Metadata } from "next";
import { Col, Row } from "react-bootstrap";
import dynamicImport from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const OwnerDetails = dynamicImport(() => import('./components/OwnerDetails'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const PropertyDetails = dynamicImport(() => import('./components/PropertyDetails'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const PropertyDetailsPage = () => {
  return (
    <>
      <DashboardPageTitle title="Property Overview" subName="Real Estate" />
      <Row>
        <OwnerDetails />
        <PropertyDetails />
      </Row>
      <Row>
        <Col lg={12}>
          <div className="mapouter">
            <div className="gmap_canvas mb-2">
              <iframe
                className="gmap_iframe rounded"
                width="100%"
                style={{ height: 400 }}
                frameBorder={0}
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src="https://maps.google.com/maps?width=1980&height=400&hl=en&q=University of Oxford&t=&z=14&ie=UTF8&iwloc=B&output=embed"
              />
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default PropertyDetailsPage;
