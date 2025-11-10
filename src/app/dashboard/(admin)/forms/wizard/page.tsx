import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import type { Metadata } from "next";
import AllWizard from "./components/AllWizard";

export const metadata: Metadata = { title: "Wizard" };

const Wizard = () => {
  return (
    <>
      <DashboardPageTitle title="Wizard" subName="Form" />
      <AllWizard />
    </>
  );
};

export default Wizard;
