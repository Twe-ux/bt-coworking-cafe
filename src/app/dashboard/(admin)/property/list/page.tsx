import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import { Metadata } from "next";
import PropertyList from "./components/PropertyList";
import PropertyStat from "./components/PropertyStat";

export const metadata: Metadata = { title: "Listing List" };

const PropertyListPage = () => {
  return (
    <>
      <DashboardPageTitle title="Listing List" subName="Real Estate" />
      <PropertyStat />
      <PropertyList />
    </>
  );
};

export default PropertyListPage;
