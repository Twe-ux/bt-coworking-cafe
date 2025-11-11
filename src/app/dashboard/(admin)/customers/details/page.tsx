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
import dynamic from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Dynamically import Client Components to avoid build-time bundling issues
const CustomerCard = dynamic(() => import('./components/CustomerCard'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const CustomersDetails = dynamic(() => import('./components/CustomersDetails'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const OwnProperty = dynamic(() => import('./components/OwnProperty'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const PropertyCard = dynamic(() => import('./components/PropertyCard'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const TransactionHistory = dynamic(() => import('./components/TransactionHistory'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const Transactions = dynamic(() => import('./components/Transactions'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading...</div>
});

const WeeklyInquiry = dynamic(() => import('./components/WeeklyInquiry'), {
  ssr: false,
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
