import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import FileUpload from "@/components/dashboard/FileUpload";
import { Metadata } from "next";
import { Col, Row } from "react-bootstrap";
import dynamicImport from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const AddCustomer = dynamicImport(() => import('./components/AddCustomer'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const CustomerAddCard = dynamicImport(() => import('./components/CustomerAddCard'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const CustomerAddPage = () => {
  return (
    <>
      <DashboardPageTitle title="Customers Add" subName="Real Estate" />
      <Row>
        <CustomerAddCard />
        <Col xl={9} lg={12}>
          <FileUpload title="Add Customer Photo" />
          <AddCustomer />
        </Col>
      </Row>
    </>
  );
};

export default CustomerAddPage;
