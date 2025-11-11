import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import UIExamplesList from "@/components/dashboard/UIExamplesList";
import type { Metadata } from "next";
import { Col, Row } from "react-bootstrap";
import dynamicImport from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Component to avoid build-time bundling issues
const AllPagination = dynamicImport(() => import('./components/AllPagination'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const Pagination = () => {
  return (
    <>
      <DashboardPageTitle subName="UI" title="Pagination" />
      <Row>
        <Col xl={9}>
          <AllPagination />
        </Col>
        <Col xl={3}>
          <UIExamplesList
            examples={[
              { link: "#default-buttons", label: "Default Pagination" },
              { link: "#rounded-pagination", label: "Rounded Pagination" },
              { link: "#alignment", label: "Alignment" },
              { link: "#sizing", label: "Sizing" },
            ]}
          />
        </Col>
      </Row>
    </>
  );
};

export default Pagination;
