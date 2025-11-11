import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import UIExamplesList from "@/components/dashboard/UIExamplesList";
import type { Metadata } from "next";
import { Card, CardBody, CardTitle, Col, Row } from "react-bootstrap";
import dynamicImport from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const AllSliders = dynamicImport(() => import('./components/AllSliders'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const Slider = () => {
  return (
    <>
      <DashboardPageTitle title="Range Slider" subName="Form" />
      <Row>
        <Col xl={9}>
          <Card>
            <CardBody>
              <CardTitle as={"h5"} className="mb-1 anchor" id="overview">
                Overview
                <a
                  className="btn btn-sm btn-outline-success rounded-2 float-end"
                  href="https://github.com/leongersen/noUiSlider#readme"
                  target="_blank"
                >
                  Official Website
                </a>
              </CardTitle>
              <p className="text-muted mb-3">
                noUiSlider is a lightweight JavaScript range slider.
              </p>
            </CardBody>
          </Card>
          <AllSliders />
        </Col>
        <Col xl={3}>
          <UIExamplesList
            examples={[
              { link: "#overview", label: "Overview" },
              { link: "#basic-range", label: "Basic Range Slider" },
              { link: "#vertical-range", label: "Vertical Range Slider" },
              { link: "#multi-range", label: "Multi Elements Range" },
              { link: "#colorpicker-range", label: "Colorpicker" },
              { link: "#value-range", label: "Value Range Slider" },
              { link: "#tooltip", label: "Tooltip" },
              { link: "#soft-limits", label: "Soft Limits" },
            ]}
          />
        </Col>
      </Row>
    </>
  );
};

export default Slider;
