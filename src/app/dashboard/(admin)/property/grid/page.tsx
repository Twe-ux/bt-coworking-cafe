import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import { Metadata } from "next";
import { Row } from "react-bootstrap";
import PropertiesData from "./components/PropertiesData";
import PropertiesFilter from "./components/PropertiesFilter";

export const metadata: Metadata = { title: "Listing Grid" };

const PropertyGridPage = () => {
  return (
    <>
      <DashboardPageTitle title="Listing Grid" subName="Real Estate" />
      <Row>
        <PropertiesFilter />
        <PropertiesData />
      </Row>
    </>
  );
};

export default PropertyGridPage;
