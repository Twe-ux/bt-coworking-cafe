import DashboardPageTitle from "@/components/dashboard/DashboardPageTitle";
import FileUpload from "@/components/dashboard/FileUpload";
import { Metadata } from "next";
import { Col, Row } from "react-bootstrap";
import AgentAdd from "./components/AgentAdd";
import AgentAddCard from "./components/AgentAddCard";

export const metadata: Metadata = { title: "Add Agent" };

const AgentAddPage = () => {
  return (
    <>
      <DashboardPageTitle subName="Real Estate" title="Add Agent" />
      <Row>
        <AgentAddCard />
        <Col xl={9} lg={8}>
          <FileUpload title="Add Agent Photo" />
          <AgentAdd />
        </Col>
      </Row>
    </>
  );
};

export default AgentAddPage;
