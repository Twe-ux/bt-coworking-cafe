import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import { getAllProperty } from "@/helpers/data";
import { Metadata } from "next";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
} from "react-bootstrap";
import { customerData } from "./data";
import dynamicImport from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const CustomerCard = dynamicImport(() => import('./components/CustomerCard'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const CustomersDetails = dynamicImport(() => import('./components/CustomersDetails'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const OwnProperty = dynamicImport(() => import('./components/OwnProperty'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const PropertyCard = dynamicImport(() => import('./components/PropertyCard'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const TransactionHistory = dynamicImport(() => import('./components/TransactionHistory'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const Transactions = dynamicImport(() => import('./components/Transactions'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const WeeklyInquiry = dynamicImport(() => import('./components/WeeklyInquiry'), {
  ssr: true,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const CustomerDetailsPage = async () => {
  const propertyData = await getAllProperty();
  return (
    <>
      <DashboardPageTitle subName="Customers" title="Customer Overview" />
      <Row>
        <Col xl={8} lg={12}>
          <CustomersDetails />
          <Card>
            <CardBody>
              <Row>
                {customerData.map((customer, idx) => (
                  <Col lg={4} key={idx}>
                    <CustomerCard customer={customer} />
                  </Col>
                ))}
              </Row>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle as={"h4"}>Interested Properties (3)</CardTitle>
            </CardHeader>
          </Card>
          <Row className="mt-3">
            {propertyData.slice(0, 3).map((property, idx) => (
              <Col lg={4} key={idx}>
                <PropertyCard property={property} />
              </Col>
            ))}
          </Row>
        </Col>
        <Col xl={4} lg={12}>
          <WeeklyInquiry />
          <Transactions />
          <OwnProperty />
        </Col>
      </Row>
      <TransactionHistory />
    </>
  );
};

export default CustomerDetailsPage;
