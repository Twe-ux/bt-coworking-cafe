import { Metadata } from "next";
import { Col, Row } from "react-bootstrap";
import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import dynamicImport from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const CustomerByCountry = dynamicImport(() => import('./components/CustomerByCountry'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const CustomerCountry = dynamicImport(() => import('./components/CustomerCountry'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const CustomersInvest = dynamicImport(() => import('./components/CustomersInvest'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const CustomerVisit = dynamicImport(() => import('./components/CustomerVisit'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const PropertyInvestor = dynamicImport(() => import('./components/PropertyInvestor'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const PurchaseProperty = dynamicImport(() => import('./components/PurchaseProperty'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const TopCustomer = dynamicImport(() => import('./components/TopCustomer'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const CustomerPage = () => {
  return (
    <>
      <DashboardPageTitle title="Customers" subName="Dashboards" />
      <Row>
        <Col xl={8} lg={12}>
          <CustomerCountry />
          <Row>
            <Col lg={6}></Col>
          </Row>
        </Col>
        <PropertyInvestor />
      </Row>
      <Row>
        <CustomersInvest />
        <CustomerByCountry />
      </Row>
      <Row>
        <TopCustomer />
        <CustomerVisit />
        <PurchaseProperty />
      </Row>
    </>
  );
};

export default CustomerPage;
