import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import UIExamplesList from "@/components/dashboard/UIExamplesList";
import type { Metadata } from "next";
import { Col, Row } from "react-bootstrap";
import dynamic from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const AllVectorMaps = dynamic(() => import('./components/AllVectorMaps'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const VectorMaps = () => {
  return (
    <>
      <DashboardPageTitle title="Vector Maps" subName="Maps" />
      <Row>
        <Col xl={9}>
          <AllVectorMaps />
        </Col>
        <Col xl={3}>
          <UIExamplesList
            examples={[
              { link: "#world_vector_map", label: "World Vector Map" },
              { link: "#canada_vector_map", label: "Canada Vector Map" },
              { link: "#russia_vector_map", label: "Russia Vector Map" },
              { link: "#iraq_vector_map", label: "Iraq Vector Map" },
              { link: "#spain_vector_map", label: "Spain Vector Map" },
            ]}
          />
        </Col>
      </Row>
    </>
  );
};

export default VectorMaps;
